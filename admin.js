// File: admin.js

// Pastikan config.js dimuat sebelum file ini
document.addEventListener('DOMContentLoaded', async () => {
    // === 1. KEAMANAN HALAMAN ADMIN (SANGAT PENTING) ===
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = '/login.html';
        return;
    }

    const { data: profile, error } = await supaClient
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

    if (error || !profile || profile.role !== 'admin') {
        alert('Akses Ditolak! Halaman ini hanya untuk Admin.');
        window.location.href = '/index.html';
        return;
    }

    // Jika lolos, jalankan fungsi utama halaman admin
    loadUsers();
});

// === 2. FUNGSI-FUNGSI MANAJEMEN ===

// Fungsi untuk memuat daftar pengguna
async function loadUsers() {
    const userListBody = document.getElementById('user-list');
    userListBody.innerHTML = '<tr><td colspan="3" class="text-center">Memuat data pengguna...</td></tr>';
    
    // PENTING: Untuk mengambil email dari auth.users, Anda perlu membuat
    // sebuah RPC (Remote Procedure Call) / Database Function di Supabase SQL Editor.
    // Contoh RPC:
    /*
        create or replace function get_all_users()
        returns table (
            id uuid,
            email text,
            username text,
            role text
        ) as $$
        begin
        return query
            select u.id, u.email, p.username, p.role
            from auth.users as u
            left join public.profiles as p on u.id = p.id;
        end;
        $$ language plpgsql security definer;
    */
    
    const { data: users, error } = await supabase.rpc('get_all_users');

    if (error) {
        userListBody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Gagal memuat data.</td></tr>';
        console.error('Error fetching users:', error);
        return;
    }

    userListBody.innerHTML = ''; // Kosongkan tabel
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><small>${user.id}</small></td>
            <td>${user.username || user.email}</td>
            <td>
                <select class="form-select form-select-sm" data-user-id="${user.id}">
                    <option value="pengguna gratis" ${user.role === 'pengguna gratis' ? 'selected' : ''}>Gratis</option>
                    <option value="pengguna berlangganan" ${user.role === 'pengguna berlangganan' ? 'selected' : ''}>Berlangganan</option>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                </select>
            </td>
        `;
        userListBody.appendChild(row);
    });
}

// Tambahkan event listener untuk mengubah peran
document.getElementById('user-list').addEventListener('change', async (e) => {
    if (e.target.tagName === 'SELECT') {
        const userId = e.target.dataset.userId;
        const newRole = e.target.value;

        if (confirm(`Anda yakin ingin mengubah peran pengguna ini menjadi "${newRole}"?`)) {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);
            
            if (error) {
                alert('Gagal mengubah peran: ' + error.message);
                loadUsers(); // Muat ulang daftar untuk mengembalikan ke state semula
            } else {
                alert('Peran berhasil diubah!');
            }
        } else {
            loadUsers(); // Jika batal, muat ulang daftar
        }
    }
});
