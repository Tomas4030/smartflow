const express = require("express");

const router = express.Router();

const SYSTEM_PROMPT = {
  pt: `És o assistente de apoio da SmartFlow num website de apresentação. Responde sempre em português europeu, de forma concisa (2-4 frases no máximo).

Sobre a SmartFlow:
- Sistema inteligente de prioridade para veículos de emergência (ambulâncias, bombeiros, polícia)
- Câmaras com IA nos cruzamentos detetam o veículo pela sirene, luzes e silhueta — sem GPS, sem app, sem integração com a frota
- O semáforo abre o eixo correto antes do veículo chegar; o ciclo normal regressa em segundos sem efeito-onda
- Preço estimado: €11.000 por cruzamento (painel solar + bateria €3k, software €3k, câmara IA €2k, controlador €1.5k, instalação €1.5k)
- Piloto em 2026 em Albufeira (3 cruzamentos), expansão nacional 2028, europeia 2030
- Equipa: Tomás Miguel (Negócio & Marca) e Lucas Cleminson (Engenharia & Software)
- Contacto e demonstrações: smartflow@gmail.com, demo em duas semanas

Se não souberes responder a algo, sugere sempre o email smartflow@gmail.com. Não inventes factos.`,

  en: `You are the SmartFlow support assistant on a pitch website. Always reply in English, concisely (2-4 sentences max).

About SmartFlow:
- Intelligent priority system for emergency vehicles (ambulances, fire trucks, police)
- AI cameras at intersections detect vehicles by siren, lights and silhouette — no GPS, no app, no fleet integration needed
- The traffic light opens the correct axis before the vehicle arrives; normal cycle resumes in seconds with no shockwave
- Estimated price: €11,000 per intersection (solar panel + battery €3k, software €3k, AI camera €2k, controller €1.5k, installation €1.5k)
- Pilot in 2026 in Albufeira (3 intersections), national expansion 2028, European 2030
- Team: Tomás Miguel (Business & Brand) and Lucas Cleminson (Engineering & Software)
- Contact and demos: smartflow@gmail.com, demo within two weeks

If you don't know something, always suggest smartflow@gmail.com. Do not invent facts.`,
};

const ratemap = new Map();
function rateLimit(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const entry = ratemap.get(ip) || { count: 0, reset: now + 60_000 };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + 60_000; }
  entry.count += 1;
  ratemap.set(ip, entry);
  if (entry.count > 20) {
    return res.status(429).json({ error: "Too many requests" });
  }
  return next();
}

router.post("/", rateLimit, async (req, res, next) => {
  const { message, lang = "pt", history = [] } = req.body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "message is required" });
  }
  if (message.length > 600) {
    return res.status(400).json({ error: "message too long" });
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "AI not configured" });
  }

  const systemContent = SYSTEM_PROMPT[lang] || SYSTEM_PROMPT.pt;

  const historyMessages = history
    .slice(-8)
    .filter((m) => m.from && m.text)
    .map((m) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text,
    }));

  try {
    const nimRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        messages: [
          { role: "system", content: systemContent },
          ...historyMessages,
          { role: "user", content: message.trim() },
        ],
        temperature: 0.4,
        max_tokens: 350,
        stream: false,
      }),
    });

    if (!nimRes.ok) {
      const errText = await nimRes.text();
      console.error("NIM API error:", nimRes.status, errText);
      return res.status(502).json({ error: "AI unavailable" });
    }

    const data = await nimRes.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "";

    if (!reply) {
      return res.status(502).json({ error: "Empty response from AI" });
    }

    return res.json({ reply });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
