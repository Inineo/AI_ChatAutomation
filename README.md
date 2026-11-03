# AI Chat Automation Prototype

Prototipe web chat AI sederhana, modular, dan dilengkapi sistem perlindungan keamanan (AI Harness / Guardrails).

## Fitur Utama
1. **Antarmuka Chat Minimalis**: Tampilan chat box bersih tanpa dependensi framework (Vanilla HTML, CSS, JS murni).
2. **Sistem Harness Terpisah (`src/js/harness.js`)**:
   - **Input Guard**: Validasi input sebelum dikirim ke API (menghemat token).
   - **Normalisasi Teks**: Deteksi bypass berbasis spasi (`c.s.s`), teks terbalik (*reverse prompt*), dan decoding Base64.
   - **Perlindungan Injeksi**: Menangkal SQL Injection, Prompt Injection (Jailbreak/DAN), System Prompt Leak, dan serangan XSS.
   - **Pembatasan Karakter**: Mencegah Token Exhaustion (Denial of Wallet) dengan batas maksimal 500 karakter/pesan.
   - **Output Guard**: Menyaring balasan model AI sebelum ditampilkan ke layar untuk memastikan tidak ada kode terlarang yang bocor.
3. **Konfigurasi Fleksibel**: Parameter model, endpoint, dan API key terisolasi di file konfigurasi.

---

## Alur Kerja Sistem (Flowchart)

```mermaid
flowchart TD
    A([User Input Pesan]) --> B[Form Submit]
    B --> C{Input Guard: harness.js}
    
    C -- Melebihi 500 Karakter --> D[Tolak: Token Exhaustion]
    C -- Terdeteksi Injeksi / Bahasa Dilarang --> E[Tolak: Tampilkan Alasan]
    
    D --> Z([Tampilkan Pesan Error di Chat])
    E --> Z
    
    C -- Lolos Validasi --> F[fetchAIReply: app.js]
    F --> G[(AI Cloud Endpoint / API)]
    
    G --> H[Terima Respon Mentah AI]
    H --> I{Output Guard: harness.js}
    
    I -- Mengandung Bocoran Kode --> J[Sterilkan Respon Balasan]
    I -- Aman --> K[Ekstrak Balasan Teks Bersih]
    
    J --> L([Tampilkan Balasan di Chat])
    K --> L
```

---

## Struktur File & Folder
```text
├── index.html            # Halaman utama tampilan chat
├── about.html            # Halaman About Us
├── faq.html              # Halaman FAQ
├── server.js             # Server backend mandiri & API proxy (Node.js murni)
├── .env.example          # Contoh format variabel environment
├── .env                  # Kredensial AI aktif (diabaikan git)
├── README.md             # Dokumentasi & panduan proyek
└── src/
    ├── css/
    │   └── style.css     # Styling antarmuka chat & halaman konten
    └── js/
        ├── harness.js    # Guardrails, normalisasi teks & proteksi keamanan
        └── app.js        # Logika interaksi chat & komunikasi ke /api/chat
```

---

## Cara Menjalankan
1. Salin `.env.example` menjadi `.env` lalu masukkan API Key Anda.
2. Jalankan server (tanpa perlu install library tambahan):
   ```bash
   node server.js
   ```
3. Buka browser di:
   ```text
   http://localhost:3000
   ```
