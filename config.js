// File: config.js (VERSI BARU YANG PASTI BENAR)

const SUPABASE_URL = 'https://rdpkbvbluvrvvoiuxxai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcGtidmJsdXZydnZvaXV4eGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NzgyOTQsImV4cCI6MjA3MDM1NDI5NH0.78BNbh4M7bSavpFmdZR9KBPzflvCm912xa_12v2-wFY'; // (Kunci Anda yang lengkap)

// Inisialisasi Supabase Client.
// Objek "supabase" yang dipanggil di sini adalah library global dari CDN.
// Kita menyimpan client baru ke dalam konstanta dengan nama yang berbeda: "supaClient".
const supaClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
