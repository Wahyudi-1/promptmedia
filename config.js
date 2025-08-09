// File: config.js

// PENTING: Ganti dengan URL dan Kunci Anon Proyek Supabase Anda
const SUPABASE_URL = 'https://rdpkbvbluvrvvoiuxxai.supabase.co'; // <- Ganti ini
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcGtidmJsdXZydnZvaXV4eGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NzgyOTQsImV4cCI6MjA3MDM1NDI5NH0.78BNbh4M7bSavpFmdZR9KBPzflvCm912xa_12v2-wFY'; // <- Ganti ini

// Inisialisasi Supabase Client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
