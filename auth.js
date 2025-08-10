// File: auth.js

// Pastikan config.js sudah dimuat sebelum file ini
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-btn');
const logoutButtonAdmin = document.getElementById('logout-btn-admin');

// --- EVENT LISTENER UNTUK PENDAFTARAN ---
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        // Mendaftar pengguna baru ke Supabase Auth
        const { data, error } = await supaClient.auth.signUp({
            email: email,
            password: password,
            options: {
                // Menyertakan data tambahan yang akan digunakan oleh trigger di database
                // untuk membuat baris di tabel 'profiles'
                data: {
                    username: username,
                }
            }
        });

        if (error) {
            alert('Error Pendaftaran: ' + error.message);
        } else {
            alert('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.');
            // Arahkan ke halaman login setelah pendaftaran berhasil
            window.location.href = 'login.html';
        }
    });
}

// --- EVENT LISTENER UNTUK LOGIN ---
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const { data, error } = await supaClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert('Error Login: ' + error.message);
        } else {
            // Jika berhasil, arahkan ke halaman generator utama
            window.location.href = 'index.html';
        }
    });
}

// --- FUNGSI LOGOUT ---
const handleLogout = async () => {
    const { error } = await supaClient.auth.signOut();
    if (error) {
        alert('Error Logout: ' + error.message);
    } else {
        // Arahkan kembali ke halaman login setelah logout
        window.location.href = 'login.html';
    }
};

if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
}
if (logoutButtonAdmin) {
    logoutButtonAdmin.addEventListener('click', handleLogout);
}
