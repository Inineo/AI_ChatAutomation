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
      instructions: HARNESS_SYSTEM_INSTRUCTION, // Dari harness.js
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

  // Validasi lewat harness
  const check = validateInput(text);
  if (!check.allowed) {
    appendMessage(`[Ditolak]: ${check.reason}`, 'bot');
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
