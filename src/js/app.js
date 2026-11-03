const messagesEl = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

// Fungsi 1: Pasang balon chat ke layar
function appendMessage(text, sender) {
  const el = document.createElement('div');
  el.className = `msg ${sender}`;
  el.textContent = text;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Fungsi pembaca dokumen HTML untuk referensi AI
async function fetchPageText(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return '';
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent.replace(/\s+/g, ' ').trim();
  } catch (e) {
    return '';
  }
}

// Fungsi pencari informasi dari faq.html dan about.html
async function getRelevantContext(query) {
  const q = query.toLowerCase();
  let context = '';

  // 1. Cek kebutuhan halaman About Us
  if (q.includes('tentang') || q.includes('about') || q.includes('perusahaan') || q.includes('kantor') || q.includes('alamat') || q.includes('kontak') || q.includes('visi')) {
    const aboutText = await fetchPageText('about.html');
    if (aboutText) context += `\n[DATA ABOUT US]:\n${aboutText}\n`;
  }

  // 2. Cek kebutuhan halaman FAQ
  const faqText = await fetchPageText('faq.html');
  if (faqText) context += `\n[DATA FAQ]:\n${faqText}\n`;

  return context.trim();
}

// Fungsi 2: Ambil balasan dari AI lewat backend PHP (api.php)
async function fetchAIReply(userText) {
  const context = await getRelevantContext(userText);

  let systemPrompt = HARNESS_SYSTEM_INSTRUCTION;
  if (context) {
    systemPrompt += `\n\nREFERENSI WEBSITE RESMI (Gunakan hanya data ini untuk menjawab jika relevan):\n${context}\n\nATURAN: Dilarang mengarang informasi yang tidak tertulis pada referensi di atas.`;
  }

  // Request ke api.php (API Key aman di server, tidak terbuka ke browser)
  const res = await fetch('api.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      instructions: systemPrompt,
      input: userText
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HTTP ${res.status}: ${err}`);
  }

  const data = await res.json();
  const messageItem = data.output?.find(item => item.type === 'message');
  const textContent = messageItem?.content?.find(c => c.type === 'output_text')?.text;
  
  return textContent || data.output_text || 'Tidak ada balasan.';
}

// Fungsi 3: Jalankan saat form submit
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage(text, 'user');
  userInput.value = '';

  // 1. INPUT GUARD (harness.js)
  const check = validateInput(text);
  if (!check.allowed) {
    appendMessage(`[Ditolak]: ${check.reason}`, 'bot');
    return;
  }

  appendMessage('Sedang mengetik...', 'bot');
  const botBubble = messagesEl.lastElementChild;

  try {
    const rawReply = await fetchAIReply(text);

    // 2. OUTPUT GUARD (harness.js)
    const outputCheck = validateOutput(rawReply);
    botBubble.textContent = outputCheck.sanitizedText;
  } catch (err) {
    botBubble.textContent = `Error: ${err.message}`;
  }
});
