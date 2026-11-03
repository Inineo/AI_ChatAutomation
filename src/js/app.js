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

// Fungsi 2: Ambil balasan dari AI (dengan pencarian konteks FAQ)
async function fetchAIReply(userText) {
  // 1. Searching FAQ lokal jika ada informasi relevan
  const relevantFaq = typeof searchFAQ === 'function' ? searchFAQ(userText) : null;
  const systemPrompt = relevantFaq 
    ? `${HARNESS_SYSTEM_INSTRUCTION}\n\nINFORMASI FAQ REFERENSI:\n${relevantFaq}\n(Gunakan informasi di atas untuk menjawab jika sesuai).`
    : HARNESS_SYSTEM_INSTRUCTION;

  const res = await fetch(CONFIG.AI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.AI_API_KEY}`
    },
    body: JSON.stringify({
      model: CONFIG.MODEL,
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

  // 1. INPUT GUARD (harness.js): Deteksi spasi, reverse, base64, SQL, dsb.
  const check = validateInput(text);
  if (!check.allowed) {
    appendMessage(`[Ditolak]: ${check.reason}`, 'bot');
    return;
  }

  appendMessage('Sedang mengetik...', 'bot');
  const botBubble = messagesEl.lastElementChild;

  try {
    const rawReply = await fetchAIReply(text);

    // 2. OUTPUT GUARD (harness.js): Periksa balasan bot sebelum dicetak
    const outputCheck = validateOutput(rawReply);
    botBubble.textContent = outputCheck.sanitizedText;
  } catch (err) {
    botBubble.textContent = `Error: ${err.message}`;
  }
});
