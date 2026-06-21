const SF_CHAT_STR = {
  pt: {
    launch: "Falar connosco",
    title: "Apoio Smart Flow",
    status: "Normalmente responde em minutos",
    greeting:
      "Olá! 👋 Sou o assistente da Smart Flow. Como posso ajudar? Pode escolher um tópico abaixo ou escrever a sua pergunta.",
    placeholder: "Escreva uma mensagem…",
    chips: [
      { id: "what", label: "O que é a Smart Flow?" },
      { id: "how", label: "Como funciona?" },
      { id: "price", label: "Quanto custa?" },
      { id: "demo", label: "Quero uma demonstração" },
      { id: "sim", label: "Ver simulador" },
    ],
    answers: {
      what: "A Smart Flow é um sistema inteligente de prioridade para emergências. Câmaras com IA nos cruzamentos detectam ambulâncias, bombeiros e polícia — pela sirene, luzes e silhueta — e abrem o semáforo no eixo certo antes de o veículo chegar. Sem GPS, sem app, sem integração com a frota.",
      how: "Funciona em três passos:\n\n1. Deteção visual por IA — a câmara reconhece o veículo de emergência.\n2. Comunicação local com o semáforo — o nó abre o eixo da ambulância antes da chegada.\n3. Restauração suave — o ciclo normal regressa em segundos, sem efeito-onda.",
      price:
        "A estimativa é de €11.000 por cruzamento, incluindo painel solar + bateria (€3.000), software (€3.000), câmara com IA (€2.000), controlador (€1.500) e instalação (€1.500). A reposição do investimento mede-se em meses, não em décadas.",
      demo: "Com todo o gosto! Marcamos uma demonstração no terreno em duas semanas. Pode escrever-nos para smartflow@gmail.com e a nossa equipa trata do resto.",
      sim: "Pode experimentar o nosso simulador interativo de despacho de emergência em Albufeira — veja a diferença com a Smart Flow ativa vs. inativa.",
      pilot:
        "O nosso piloto arranca em 2026 em Albufeira: instalação em 3 cruzamentos e validação operacional com a proteção civil. A partir daí seguimos para expansão nacional (2028) e europeia (2030).",
      team: "Somos uma equipa pequena e focada: Tomás Miguel (Negócio & Marca) e Lucas Cleminson (Engenharia & Software).",
      contact:
        "Pode falar connosco em smartflow@gmail.com — respondemos em minutos e marcamos uma demonstração em duas semanas.",
      fallback:
        "Boa pergunta! Não tenho a certeza sobre isso, mas a nossa equipa responde rapidamente em smartflow@gmail.com. Entretanto, posso ajudar com: o que é a Smart Flow, como funciona, custos, ou marcar uma demonstração.",
    },
    simCta: "Abrir simulador →",
    emailCta: "Enviar email →",
  },
  en: {
    launch: "Chat with us",
    title: "Smart Flow Support",
    status: "Typically replies in minutes",
    greeting:
      "Hi there! 👋 I'm the Smart Flow assistant. How can I help? Pick a topic below or type your question.",
    placeholder: "Type a message…",
    chips: [
      { id: "what", label: "What is Smart Flow?" },
      { id: "how", label: "How does it work?" },
      { id: "price", label: "How much does it cost?" },
      { id: "demo", label: "I'd like a demo" },
      { id: "sim", label: "Open the simulator" },
    ],
    answers: {
      what: "Smart Flow is an intelligent emergency-priority system. AI cameras at intersections detect ambulances, fire trucks and police — by siren, lights and silhouette — and open the traffic light on the right axis before the vehicle arrives. No GPS, no app, no fleet integration.",
      how: "It works in three steps:\n\n1. AI visual detection — the camera recognises the emergency vehicle.\n2. Local link to the traffic light — the node opens the ambulance's axis before it arrives.\n3. Smooth restoration — the normal cycle returns in seconds, with no shockwave.",
      price:
        "The estimate is €11,000 per intersection, including solar panel + battery (€3,000), software (€3,000), AI camera (€2,000), controller (€1,500) and installation (€1,500). Payback is measured in months, not decades.",
      demo: "Love to! We arrange a field demo within two weeks. Just email us at smartflow@gmail.com and our team takes care of the rest.",
      sim: "You can try our interactive emergency-dispatch simulator in Albufeira — see the difference with Smart Flow active vs. inactive.",
      pilot:
        "Our pilot launches in 2026 in Albufeira: install at 3 intersections and operational validation with civil protection. From there we move to national (2028) and European (2030) expansion.",
      team: "We're a small, focused team: Tomás Miguel (Business & Brand) and Lucas Cleminson (Engineering & Software).",
      contact:
        "You can reach us at smartflow@gmail.com — we reply in minutes and arrange a demo within two weeks.",
      fallback:
        "Great question! I'm not sure about that one, but our team replies fast at smartflow@gmail.com. Meanwhile, I can help with: what Smart Flow is, how it works, costs, or booking a demo.",
    },
    simCta: "Open simulator →",
    emailCta: "Send email →",
  },
};

const SF_CHAT_KEYWORDS = [
  {
    id: "price",
    re: /(pre[çc]o|custo|custa|quanto|valor|or[çc]amento|price|cost|how much|expensive|cheap|budget|€|euro)/i,
  },
  {
    id: "how",
    re: /(como funciona|funciona|como é que|how does|how it works|how do|work|deteta|deteção|detect)/i,
  },
  {
    id: "demo",
    re: /(demonstr|demo|reuni|meeting|agendar|marcar|book|trial|pilot.*munic|no meu munic|in my munic|install|instala)/i,
  },
  {
    id: "sim",
    re: /(simulador|simula|simulation|simulator|ver ao vivo|live)/i,
  },
  { id: "pilot", re: /(albufeira|piloto|pilot|2026|roteiro|roadmap|expans)/i },
  {
    id: "team",
    re: /(equipa|equipe|team|quem são|who are|founder|fundador|tom[aá]s|lucas)/i,
  },
  {
    id: "contact",
    re: /(contacto|contato|contact|email|e-mail|falar|telefone|phone|reach)/i,
  },
  {
    id: "what",
    re: /(o que é|que é|what is|what's|quem é|about|sobre|explica|explain)/i,
  },
  {
    id: "greet",
    re: /^(ol[áa]|oi|bom dia|boa tarde|boa noite|hi|hello|hey|yo)\b/i,
  },
];

function SupportChat() {
  const [, lang] = useT();
  const S = SF_CHAT_STR[lang] || SF_CHAT_STR.pt;

  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(false);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem("sf_chat_msgs");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [
      {
        from: "bot",
        kind: "text",
        text: SF_CHAT_STR[localStorage.getItem("sf_lang") || "pt"].greeting,
      },
    ];
  });

  const listRef = useRef(null);
  const inputRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => {
    try {
      localStorage.setItem("sf_chat_msgs", JSON.stringify(messages.slice(-40)));
    } catch (e) {}
  }, [messages]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) {
      setUnread(false);
      const tmr = setTimeout(
        () => inputRef.current && inputRef.current.focus(),
        280,
      );
      return () => clearTimeout(tmr);
    }
  }, [open]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const pushBot = useCallback(
    (topicId) => {
      const ans = S.answers[topicId] || S.answers.fallback;
      setTyping(true);
      const t1 = setTimeout(
        () => {
          setTyping(false);
          const msg = { from: "bot", kind: "text", text: ans };
          if (topicId === "sim") msg.action = { type: "sim" };
          if (topicId === "demo" || topicId === "contact")
            msg.action = { type: "email" };
          setMessages((m) => [...m, msg]);
          if (!open) setUnread(true);
        },
        650 + Math.min(1400, ans.length * 9),
      );
      timers.current.push(t1);
    },
    [S, open],
  );

  const resolveTopic = (text) => {
    const hit = SF_CHAT_KEYWORDS.find((k) => k.re.test(text));
    if (!hit) return "fallback";
    if (hit.id === "greet") return "what";
    return hit.id;
  };

  const send = (text) => {
    const clean = (text || "").trim();
    if (!clean) return;
    setMessages((m) => [...m, { from: "user", kind: "text", text: clean }]);
    setDraft("");
    pushBot(resolveTopic(clean));
  };

  const sendChip = (chip) => {
    setMessages((m) => [
      ...m,
      { from: "user", kind: "text", text: chip.label },
    ]);
    pushBot(chip.id);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    send(draft);
  };

  return (
    <div className="sfchat">
      <div
        className={`sfchat-panel ${open ? "is-open" : ""}`}
        role="dialog"
        aria-label={S.title}
        aria-hidden={!open}
      >
        <header className="sfchat-head">
          <div className="sfchat-id">
            <span className="sfchat-avatar" aria-hidden="true">
              <span className="sfchat-pulse"></span>
            </span>
            <div className="sfchat-id-txt">
              <strong>{S.title}</strong>
              <span>
                <i className="sfchat-online"></i>
                {S.status}
              </span>
            </div>
          </div>
          <button
            className="sfchat-x"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3.5 3.5l9 9M12.5 3.5l-9 9"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="sfchat-body" ref={listRef}>
          {messages.map((m, i) => (
            <div key={i} className={`sfchat-row ${m.from}`}>
              {m.from === "bot" && (
                <span className="sfchat-bot-dot" aria-hidden="true"></span>
              )}
              <div className="sfchat-bubble">
                {m.text.split("\n").map((line, j) => (
                  <p
                    key={j}
                    style={{ margin: line.trim() === "" ? "6px 0 0" : "0" }}
                  >
                    {line}
                  </p>
                ))}
                {m.action && m.action.type === "sim" && (
                  <a className="sfchat-action" href="simulator.html">
                    {S.simCta}
                  </a>
                )}
                {m.action && m.action.type === "email" && (
                  <a
                    className="sfchat-action"
                    href="mailto:smartflow@gmail.com"
                  >
                    {S.emailCta}
                  </a>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="sfchat-row bot">
              <span className="sfchat-bot-dot" aria-hidden="true"></span>
              <div className="sfchat-bubble sfchat-typing">
                <i></i>
                <i></i>
                <i></i>
              </div>
            </div>
          )}
        </div>

        <div className="sfchat-chips">
          {S.chips.map((c) => (
            <button
              key={c.id}
              className="sfchat-chip"
              onClick={() => sendChip(c)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <form className="sfchat-input" onSubmit={onSubmit}>
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={S.placeholder}
            aria-label={S.placeholder}
          />
          <button
            type="submit"
            className="sfchat-send"
            aria-label="Send"
            disabled={!draft.trim()}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M2 9l13-6-4 13-3.2-4.2L2 9z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </form>
      </div>

      <button
        className={`sfchat-fab ${open ? "is-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={S.launch}
        aria-expanded={open}
      >
        {unread && !open && (
          <span className="sfchat-badge" aria-hidden="true"></span>
        )}
        <span className="sfchat-fab-ic sfchat-fab-chat" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path
              d="M5 6.5h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H11l-4.5 3.5V17.5H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="12" r="1.1" fill="currentColor" />
            <circle cx="13" cy="12" r="1.1" fill="currentColor" />
            <circle cx="17" cy="12" r="1.1" fill="currentColor" />
          </svg>
        </span>
        <span className="sfchat-fab-ic sfchat-fab-close" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M5 5l12 12M17 5L5 17"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}

window.SupportChat = SupportChat;
