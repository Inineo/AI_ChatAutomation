// Database Pengetahuan FAQ Sederhana (Knowledge Base)
const FAQ_DATA = [
  {
    kategori: "Pemesanan",
    tanya: "Bagaimana cara memesan layanan?",
    jawab: "Anda cukup mengisi formulir pemesanan di menu Order dan melakukan pembayaran via transfer bank atau e-wallet."
  },
  {
    kategori: "Pembayaran",
    tanya: "Apa saja metode pembayaran yang didukung?",
    jawab: "Kami mendukung transfer Bank BCA, Mandiri, BNI, serta e-wallet GoPay, OVO, dan QRIS."
  },
  {
    kategori: "Pengembalian Dana",
    tanya: "Apakah bisa mengajukan refund?",
    jawab: "Bisa, pengajuan refund dapat dilakukan maksimal 24 jam setelah transaksi jika layanan belum diproses."
  },
  {
    kategori: "Jam Operasional",
    tanya: "Kapan jam kerja customer service?",
    jawab: "Customer service kami beroperasi setiap hari Senin - Jumat pukul 08:00 - 17:00 WIB."
  }
];

// Fungsi pencarian FAQ relevan berdasarkan teks pertanyaan user
function searchFAQ(query) {
  const clean = query.toLowerCase();
  const results = FAQ_DATA.filter(item => 
    item.tanya.toLowerCase().includes(clean) ||
    item.jawab.toLowerCase().includes(clean) ||
    clean.split(/\s+/).some(word => word.length > 2 && (item.tanya.toLowerCase().includes(word) || item.jawab.toLowerCase().includes(word)))
  );

  if (results.length === 0) return null;

  // Format menjadi konteks teks ringkas untuk AI
  return results.map(r => `Q: ${r.tanya}\nA: ${r.jawab}`).join("\n\n");
}
