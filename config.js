// File: config.js

// PENTING: Ganti dengan URL dan Kunci Anon Proyek Supabase Anda
const SUPABASE_URL = 'https://YXZABC.supabase.co'; // <- Ganti ini
const SUPABASE_ANON_KEY = 'ey....'; // <- Ganti ini

// Inisialisasi Supabase Client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
