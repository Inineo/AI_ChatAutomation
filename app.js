const messagesEl = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

// System Instruction (Guardrail): Larang konten CSS, PHP, dan JavaScript
const SYSTEM_INSTRUCTION = "Kamu adalah asisten chat customer service. ATURAN KETAT: Kamu dilarang keras membahas, menulis, atau menjelaskan kode CSS, PHP, dan JavaScript. Jika pengguna bertanya tentang CSS, PHP, atau JavaScript, tolak dengan sopan dan jelaskan bahwa topik tersebut di luar batasan tugasmu.";

// Fungsi 1: Pasang balon chat ke layar
function appendMessage(text, sender) {
  const el = document.createElement('div');
  el.className = `msg ${sender}`;
  el.textContent = text;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Filter Guardrail Sisi Klien (Mencegah sebelum request dikirim)
function isDisallowed(text) {
  const blockedTerms = ['css', 'php', 'javascript', 'js'];
  return blockedTerms.some(term => new RegExp(`\\b${term}\\b`, 'i').test(text));
}

// Fungsi 2: Ambil balasan dari AI
async function fetchAIReply(userText) {
  const res = await fetch(CONFIG.AI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.AI_API_KEY}`
    },
    body: JSON.stringify({
      model: CONFIG.MODEL,
      instructions: SYSTEM_INSTRUCTION,
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

// Fungsi 3: Jalankan saat tombol kirim ditekan
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage(text, 'user');
  userInput.value = '';

  // Harness Lapisan 1: Filter lokal langsung tanpa buang token API
  if (isDisallowed(text)) {
    appendMessage('Maaf, topik terkait CSS, PHP, atau JavaScript tidak diizinkan di sistem ini.', 'bot');
    return;
  }

  appendMessage('Sedang mengetik...', 'bot');
  const botBubble = messagesEl.lastElementChild;

  try {
    botBubble.textContent = await fetchAIReply(text);
  } catch (err) {
    botBubble.textContent = `Error: ${err.message}`;
  }
});
