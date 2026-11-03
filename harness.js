// ==========================================
// HARNESS & GUARDRAILS SYSTEM
// ==========================================

// Aturan sistem yang disuntikkan ke AI
const HARNESS_SYSTEM_INSTRUCTION = "Kamu adalah asisten chat customer service. ATURAN KETAT: Kamu dilarang keras membahas, menulis, atau menjelaskan kode CSS, PHP, dan JavaScript. Jika pengguna bertanya tentang CSS, PHP, atau JavaScript, tolak dengan sopan dan jelaskan bahwa topik tersebut di luar batasan tugasmu.";

// Filter kata kunci terlarang sebelum request dikirim
const BLOCKED_KEYWORDS = ['css', 'php', 'javascript', 'js'];

function validateInput(text) {
  const isBlocked = BLOCKED_KEYWORDS.some(term => new RegExp(`\\b${term}\\b`, 'i').test(text));
  if (isBlocked) {
    return {
      allowed: false,
      reason: 'Topik terkait CSS, PHP, atau JavaScript tidak diizinkan di sistem ini.'
    };
  }
  return { allowed: true };
}
