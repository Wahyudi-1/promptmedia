// File: main.js

// Pastikan config.js dimuat sebelum file ini
document.addEventListener('DOMContentLoaded', async () => {
    // === 1. KEAMANAN & PENGAMBILAN DATA AWAL ===
    const { data: { session }, error: sessionError } = await supaClient.auth.getSession();

    if (sessionError || !session) {
        // Jika tidak ada sesi (belum login), tendang ke halaman login
        window.location.href = 'login.html';
        return;
    }

    // Ambil profil pengguna untuk mendapatkan peran (role)
    const { data: profile, error: profileError } = await supaClient
        .from('profiles')
        .select('role, username')
        .eq('id', session.user.id)
        .single();

    if (profileError) {
        alert('Gagal memuat profil pengguna.');
        return;
    }

    // Tampilkan info pengguna & tombol admin jika perlu
    const userInfoEl = document.getElementById('user-info');
    const adminLinkEl = document.getElementById('admin-link');
    userInfoEl.textContent = profile.username || session.user.email;
    if (profile.role === 'admin') {
        adminLinkEl.style.display = 'block';
    }

    // Ambil dan tampilkan template di dropdown
    const templateSelect = document.getElementById('template-select');
    let allTemplates = []; // Simpan data template untuk diakses nanti

    const { data: templates, error: templatesError } = await supaClient.from('templates').select('*');
    if (templatesError) {
        alert('Gagal memuat template.');
    } else {
        allTemplates = templates;
        templates.forEach(template => {
            const option = document.createElement('option');
            option.value = template.id;
            option.textContent = template.nama;
            templateSelect.appendChild(option);
        });
    }

    // === 2. LOGIKA PEMBUATAN FORMULIR DINAMIS ===
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const formContainer = document.getElementById('dynamic-form-container');

    templateSelect.addEventListener('change', () => {
        const selectedId = parseInt(templateSelect.value);
        const selectedTemplate = allTemplates.find(t => t.id === selectedId);
        if (selectedTemplate) {
            parseAndCreateForm(selectedTemplate.struktur_prompt);
            step2.style.display = 'block';
            step3.style.display = 'block';
        }
    });
    
    // Fungsi untuk mengurai string template dan membuat form
    function parseAndCreateForm(templateString) {
        formContainer.innerHTML = ''; // Kosongkan form sebelumnya
        let cardCounter = 0; // Counter untuk item dinamis

        const sections = templateString.split('## ').slice(1); // Potong berdasarkan '## '

        sections.forEach(section => {
            const lines = section.trim().split('\n');
            const title = lines[0];
            const content = lines.slice(1).join('\n');

            // Regex untuk menemukan placeholder [Contoh: ...]
            const placeholderRegex = /\[([^\]]+)\]/g;
            
            let formHtml = `<div class="mb-4"><h5 class="mb-3">${title}</h5>`;

            // Ubah placeholder menjadi input
            const replacedContent = content.replace(placeholderRegex, (match, p1) => {
                const id = `input-${p1.replace(/\s+/g, '-').toLowerCase()}`;
                return `<div class="mb-2">
                            <label for="${id}" class="form-label small">${p1}</label>
                            <input type="text" id="${id}" class="form-control" placeholder="${p1}">
                        </div>`;
            });

            formHtml += replacedContent;

            // Logika khusus untuk tombol "Tambah..."
            if (content.includes('(Tambahkan kartu lain') || content.includes('(Tambahkan pertanyaan lain')) {
                const itemType = content.includes('kartu') ? 'Kartu' : 'Pertanyaan';
                formHtml += `<div id="dynamic-items-container"></div>`;
                formHtml += `<button type="button" class="btn btn-sm btn-outline-success mt-2" id="add-item-btn">Tambah ${itemType}</button>`;
            }

            formHtml += '</div>';
            formContainer.innerHTML += formHtml;
        });
        
        // Tambahkan event listener untuk tombol dinamis (jika ada)
        const addItemBtn = document.getElementById('add-item-btn');
        if (addItemBtn) {
            addItemBtn.addEventListener('click', () => {
                cardCounter++;
                const dynamicItemsContainer = document.getElementById('dynamic-items-container');
                const newItemHtml = `
                    <div class="card p-3 mb-2">
                        <strong>Item Dinamis ${cardCounter}</strong>
                        <!-- Ganti dengan field yang sesuai kebutuhan template -->
                        <input type="text" class="form-control form-control-sm mt-2" placeholder="Field 1">
                        <input type="text" class="form-control form-control-sm mt-2" placeholder="Field 2">
                    </div>
                `;
                dynamicItemsContainer.insertAdjacentHTML('beforeend', newItemHtml);
            });
        }
    }

    // === 3. LOGIKA UNTUK MENGHASILKAN PROMPT ===
    const generateBtn = document.getElementById('generate-btn');
    const outputSection = document.getElementById('output-section');
    const hasilPromptEl = document.getElementById('hasil-prompt');

    generateBtn.addEventListener('click', async () => {
        // Kumpulkan data dari form dinamis (ini adalah bagian yang disederhanakan)
        // Dalam implementasi nyata, Anda perlu mengumpulkan data lebih cerdas
        const formData = {
            templateId: templateSelect.value,
            inputs: Array.from(formContainer.querySelectorAll('input, select, textarea')).map(el => ({ id: el.id, value: el.value }))
        };

        hasilPromptEl.innerHTML = '<div class="spinner"></div>'; // Tampilkan loading
        outputSection.style.display = 'block';
        
        // Panggil Edge Function
        const { data, error } = await supaClient.functions.invoke('generate-prompt', {
            body: formData,
        });

        if (error) {
            alert('Error: ' + error.message);
            hasilPromptEl.textContent = 'Gagal menghasilkan prompt. Coba lagi.';
        } else {
            hasilPromptEl.textContent = data.prompt; // Tampilkan hasil
        }
    });

    // === 4. FUNGSI TAMBAHAN (COPY) ===
    const copyBtn = document.getElementById('copy-btn');
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(hasilPromptEl.textContent).then(() => {
            copyBtn.textContent = 'Disalin!';
            setTimeout(() => { copyBtn.textContent = 'Salin'; }, 2000);
        });
    });
});
