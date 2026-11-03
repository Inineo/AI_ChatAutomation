# AI Chat Automation Prototype

Prototipe web chat AI sederhana dan minimalis menggunakan Groq Cloud API.

## Struktur File & Folder
```text
├── index.html          # Halaman utama tampilan chat
├── config.example.js   # Contoh konfigurasi API
├── config.js           # Konfigurasi aktif (diabaikan git)
├── README.md           # Dokumentasi proyek
└── src/
    ├── css/
    │   └── style.css   # Styling antarmuka chat
    └── js/
        ├── harness.js  # Guardrails, normalisasi teks & proteksi keamanan
        └── app.js      # Logika interaksi chat & komunikasi AI
```

## Cara Menjalankan
1. Salin `config.example.js` menjadi `config.js`:
   - Masukkan API Key dari [Groq Console](https://console.groq.com/keys).
2. Buka `index.html` langsung di browser Anda.
