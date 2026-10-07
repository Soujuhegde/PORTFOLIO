/**
 * =========================================================================
 * Soujanya S P Portfolio - Conversational AI (Sarvam AI Integration)
 * Speaks directly in 1st person as Soujanya
 * =========================================================================
 */

(function () {
  // --- CONFIGURATION & STATE ---
  const DEFAULT_CONFIG = {
    apiKey: 'sk_695idq2h_xziRUycS0jN39q2FAyNnOIPe', // Saved in localStorage or configured in UI settings
    apiEndpoint: 'https://api.sarvam.ai/v1/chat/completions',
    model: 'sarvam-105b-conversations', // 'sarvam-105b-conversations' or 'sarvam-105b'
    temperature: 0.7,
    maxTokens: 600
  };

  const SYSTEM_PROMPT = `You are Soujanya S P — speaking directly in the FIRST PERSON ("I", "me", "my") to visitors, recruiters, and fellow engineers on your portfolio website.

WHO I AM:
- I'm Soujanya S P, an AI Engineer and Data Scientist based in Bangalore, India.
- My passion: I got into AI not because it was trending, but because I love building systems that think — designing autonomous agents, wiring up LLM pipelines, and building reliable production backends with Python and FastAPI, not just Jupyter notebooks.
- Education: MCA at MS Ramaiah College (2024-2026, CGPA: 9.5/10) and BCA from PES IAMS (CGPA: 9.38/10).
- Contact: spsoujanya02@gmail.com | +91 8088091773 | LinkedIn: https://www.linkedin.com/in/soujanyasp02 | GitHub: https://github.com/Soujuhegde

MY TECH STACK:
- Core Languages: Python, SQL
- AI Stack: LLMs, RAG, LangChain, LangGraph, Multi-Agent Systems, Generative AI, Machine Learning, Prompt Engineering
- Frameworks: FastAPI, Streamlit, Pandas, NumPy, Scikit-Learn
- DevOps & Tools: Docker, Git, GitHub Actions (CI/CD), PostgreSQL, SQLite, RESTful APIs

MY FAVORITE PROJECTS:
1. AI Research & Report Generation System: An autonomous multi-agent platform I built that orchestrates web research, fact-checking, citation generation, and trust scoring. (GitHub: https://github.com/Soujuhegde/AI-Research-and-Report-Generation-Agent.git)
2. Self-Validating Quant Problem Generator: A multi-agent system where one agent writes math problems, another solves them, and a third cross-verifies to eliminate hallucinations autonomously. (GitHub: https://github.com/Soujuhegde/Self-validating-ai-quiz-generator.git)
3. AI Voice Assistant: A voice-based agentic system converting spoken medical conversation into structured records, automating hospital appointments without human intervention (VAPI, FastAPI, SQLite). (GitHub: https://github.com/Soujuhegde/AI_VOICE_ASSITANT.git)
4. CareerPilot: An AI platform helping candidates optimize resumes, prep for interviews, and find matching roles. (GitHub: https://github.com/Soujuhegde/CareerPilot.git)
5. Travel Assistant Booking System: A natural-language travel agent for multi-city trip planning, flight/hotel search, and booking workflows. (GitHub: https://github.com/Soujuhegde/Travel-Assistant.git)
6. Movie Recommendation System: KNN-based recommendation engine with Streamlit UI. (GitHub: https://github.com/Soujuhegde/movie-recommendation-system.git)

MY EXPERIENCE:
- AI Developer Intern at Workfall (May 2026 – Aug 2026, Bangalore): Designed LLM agent workflows in Python for automated task execution, dynamic backend API orchestration, and built an end-to-end travel chatbot assistant.
- Backend Engineer Intern at Sanskriti Labs (Oct 2025 – Dec 2025, Bangalore): Built NestJS REST APIs, optimized database operations and data flows across services.
- Machine Learning Intern at Cranes Varsity (Mar 2024, Bangalore): Implemented core ML algorithms with Python.

CONVERSATIONAL RULES:
1. ALWAYS talk as ME (Soujanya), in 1st person ("I", "my", "me"). Never say "Soujanya is..." or "As an AI representing...".
2. Match the conversational tone:
   - For simple/casual questions (e.g. "Where are you based?", "What's your email?", "Do you know LangGraph?"): Answer directly and casually in a sentence or two.
   - For deeper project/tech questions: Give a punchy, clear explanation highlighting what problem I solved and the tools I used.
3. Keep answers crisp, sharp, and natural — avoid long unnecessary filler.
4. If someone wants to hire me or collaborate, invite them warmly to drop me an email at spsoujanya02@gmail.com or message me on LinkedIn!`;

  // State
  let config = { ...DEFAULT_CONFIG };
  let conversationHistory = [];
  let isGenerating = false;

  // Load saved configuration from localStorage
  function loadConfig() {
    const savedKey = localStorage.getItem('sarvam_api_key');
    if (savedKey) config.apiKey = savedKey;

    const savedModel = localStorage.getItem('sarvam_model');
    if (savedModel) config.model = savedModel;
  }

  function saveConfig(apiKey, model) {
    config.apiKey = apiKey.trim();
    config.model = model;
    localStorage.setItem('sarvam_api_key', config.apiKey);
    localStorage.setItem('sarvam_model', config.model);
  }

  // --- INITIALIZE UI ---
  function createChatbotUI() {
    // 1. Create Floating Launcher Button
    const launcher = document.createElement('button');
    launcher.id = 'chat-launcher-btn';
    launcher.className = 'chat-launcher-btn';
    launcher.setAttribute('aria-label', 'Open AI Chatbot');
    launcher.setAttribute('title', 'Chat with Soujanya (Powered by Sarvam AI)');
    launcher.innerHTML = `
      <div class="chat-launcher-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <div class="chat-launcher-close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
      <span class="chat-badge" id="chat-badge">AI</span>
    `;

    // 2. Create Chat Window Container
    const container = document.createElement('div');
    container.id = 'chat-widget-container';
    container.className = 'chat-widget-container';
    container.innerHTML = `
      <!-- Header -->
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-avatar-wrapper">
            <img src="img.jpeg" alt="Soujanya S P" class="chat-avatar" onerror="this.src='icon.jpg'">
            <span class="chat-status-dot" title="Online"></span>
          </div>
          <div class="chat-title-group">
            <div class="chat-title">
              Soujanya S P
              <span class="sarvam-badge-tag">⚡ Sarvam AI</span>
            </div>
            <div class="chat-subtitle">
              <span>Online • Ask me anything!</span>
            </div>
          </div>
        </div>
        <div class="chat-header-actions">
          <button class="chat-action-btn" id="chat-settings-toggle" title="Sarvam API Settings" aria-label="Settings">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
          <button class="chat-action-btn" id="chat-clear-btn" title="Clear Conversation" aria-label="Clear Chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
          <button class="chat-action-btn" id="chat-close-btn" title="Close Chat" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Messages Body -->
      <div class="chat-messages" id="chat-messages">
        <!-- Welcome Message -->
        <div class="chat-msg bot">
          <div class="chat-msg-avatar">
            <img src="img.jpeg" alt="Soujanya" onerror="this.src='icon.jpg'">
          </div>
          <div class="chat-msg-bubble">
            <p>Hey there! 👋 I'm <strong>Soujanya</strong>. Welcome to my portfolio!</p>
            <p>Ask me anything about the AI systems I've built, my tech stack, work experience, or how we can collaborate.</p>
            <div class="chat-suggestions" id="chat-suggestions">
              <button class="suggestion-chip" data-query="What are your top AI projects?">🚀 My Projects</button>
              <button class="suggestion-chip" data-query="What tools and tech stack do you work with?">🛠️ Tech Stack</button>
              <button class="suggestion-chip" data-query="Tell me about your internship experience">💼 Work Experience</button>
              <button class="suggestion-chip" data-query="How can I get in touch with you?">📫 Let's Connect</button>
            </div>
            <span class="chat-msg-time">${getCurrentTime()}</span>
          </div>
        </div>
      </div>

      <!-- Settings Drawer (Inside Container) -->
      <div class="chat-settings-drawer" id="chat-settings-drawer">
        <div class="settings-header">
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Sarvam AI Settings
          </h3>
          <button class="chat-action-btn" id="close-settings-btn" title="Close Settings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form class="settings-form" id="settings-form">
          <div class="settings-group">
            <label class="settings-label" for="sarvam-api-key">Sarvam API Key (Subscription Key)</label>
            <input type="password" id="sarvam-api-key" class="settings-input" placeholder="Enter your Sarvam API Key..." autocomplete="off">
            <p class="settings-hint">
              Get your key from <a href="https://dashboard.sarvam.ai" target="_blank" rel="noopener">Sarvam AI Dashboard</a>.
              Your key is saved locally in your browser only.
            </p>
          </div>

          <div class="settings-group">
            <label class="settings-label" for="sarvam-model-select">Model Selection</label>
            <select id="sarvam-model-select" class="settings-select">
              <option value="sarvam-105b-conversations">sarvam-105b-conversations (Recommended for Natural Chat)</option>
              <option value="sarvam-105b">sarvam-105b (Deep Reasoning & Complex Q&A)</option>
              <option value="sarvam-2b">sarvam-2b (Lightweight / Fast)</option>
            </select>
          </div>

          <button type="submit" class="settings-save-btn">Save Settings</button>
        </form>
      </div>

      <!-- Footer / Input -->
      <div class="chat-footer">
        <div class="chat-input-row">
          <input 
            type="text" 
            id="chat-input" 
            class="chat-input" 
            placeholder="Ask me anything..." 
            autocomplete="off"
            aria-label="Message"
          />
          <button id="chat-send-btn" class="chat-send-btn" aria-label="Send message" title="Send message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <div class="chat-footer-brand">
          <span>Connected to <a href="https://www.sarvam.ai" target="_blank" rel="noopener">Sarvam AI</a></span>
          <span id="chat-engine-status">Active</span>
        </div>
      </div>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(container);

    attachEventListeners();
    initHistory();
  }

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // --- ATTACH EVENT LISTENERS ---
  function attachEventListeners() {
    const launcher = document.getElementById('chat-launcher-btn');
    const container = document.getElementById('chat-widget-container');
    const closeBtn = document.getElementById('chat-close-btn');
    const clearBtn = document.getElementById('chat-clear-btn');
    const settingsToggle = document.getElementById('chat-settings-toggle');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const settingsDrawer = document.getElementById('chat-settings-drawer');
    const settingsForm = document.getElementById('settings-form');
    const apiKeyInput = document.getElementById('sarvam-api-key');
    const modelSelect = document.getElementById('sarvam-model-select');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');

    // Toggle Chat Window
    function toggleChat() {
      const isOpen = container.classList.toggle('active');
      document.body.classList.toggle('chat-widget-open', isOpen);
      if (isOpen) {
        document.getElementById('chat-badge').style.display = 'none';
        chatInput.focus();
      }
    }

    launcher.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Settings Drawer
    settingsToggle.addEventListener('click', () => {
      apiKeyInput.value = config.apiKey || '';
      modelSelect.value = config.model || 'sarvam-105b-conversations';
      settingsDrawer.classList.add('active');
    });

    closeSettingsBtn.addEventListener('click', () => {
      settingsDrawer.classList.remove('active');
    });

    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveConfig(apiKeyInput.value, modelSelect.value);
      settingsDrawer.classList.remove('active');
      appendBotMessage("✅ Saved! Connected to Sarvam AI (`" + config.model + "`). Ask me anything!");
    });

    // Clear Chat
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear our conversation?')) {
        initHistory();
        const messagesDiv = document.getElementById('chat-messages');
        messagesDiv.innerHTML = `
          <div class="chat-msg bot">
            <div class="chat-msg-avatar">
              <img src="img.jpeg" alt="Soujanya" onerror="this.src='icon.jpg'">
            </div>
            <div class="chat-msg-bubble">
              <p>Chat cleared! What would you like to know about my work?</p>
              <div class="chat-suggestions">
                <button class="suggestion-chip" data-query="What are your top AI projects?">🚀 My Projects</button>
                <button class="suggestion-chip" data-query="What tools and tech stack do you work with?">🛠️ Tech Stack</button>
                <button class="suggestion-chip" data-query="Tell me about your internship experience">💼 Work Experience</button>
                <button class="suggestion-chip" data-query="How can I get in touch with you?">📫 Let's Connect</button>
              </div>
              <span class="chat-msg-time">${getCurrentTime()}</span>
            </div>
          </div>
        `;
      }
    });

    // Send Message
    function handleSend() {
      const text = chatInput.value.trim();
      if (!text || isGenerating) return;

      appendUserMessage(text);
      chatInput.value = '';
      chatInput.focus();

      generateResponse(text);
    }

    sendBtn.addEventListener('click', handleSend);

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });

    // Delegate Suggestion Chip Clicks
    document.addEventListener('click', (e) => {
      const chip = e.target.closest('.suggestion-chip');
      if (chip) {
        const query = chip.getAttribute('data-query') || chip.textContent;
        chatInput.value = query;
        handleSend();
      }
    });
  }

  function initHistory() {
    conversationHistory = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];
  }

  // --- UI RENDER HELPERS ---
  function appendUserMessage(text) {
    const messagesDiv = document.getElementById('chat-messages');
    const msg = document.createElement('div');
    msg.className = 'chat-msg user';
    msg.innerHTML = `
      <div class="chat-msg-bubble">
        <p>${escapeHtml(text)}</p>
        <span class="chat-msg-time">${getCurrentTime()}</span>
      </div>
    `;
    messagesDiv.appendChild(msg);
    scrollToBottom();

    conversationHistory.push({ role: 'user', content: text });
  }

  function showTypingIndicator() {
    const messagesDiv = document.getElementById('chat-messages');
    const indicator = document.createElement('div');
    indicator.id = 'chat-typing-indicator';
    indicator.className = 'chat-msg bot';
    indicator.innerHTML = `
      <div class="chat-msg-avatar">
        <img src="img.jpeg" alt="Soujanya" onerror="this.src='icon.jpg'">
      </div>
      <div class="chat-msg-bubble">
        <div class="typing-indicator">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    `;
    messagesDiv.appendChild(indicator);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('chat-typing-indicator');
    if (indicator) indicator.remove();
  }

  function appendBotMessage(markdownText) {
    removeTypingIndicator();
    const messagesDiv = document.getElementById('chat-messages');
    const msg = document.createElement('div');
    msg.className = 'chat-msg bot';
    msg.innerHTML = `
      <div class="chat-msg-avatar">
        <img src="img.jpeg" alt="Soujanya" onerror="this.src='icon.jpg'">
      </div>
      <div class="chat-msg-bubble">
        ${formatMarkdown(markdownText)}
        <span class="chat-msg-time">${getCurrentTime()}</span>
      </div>
    `;
    messagesDiv.appendChild(msg);
    scrollToBottom();

    conversationHistory.push({ role: 'assistant', content: markdownText });
  }

  function scrollToBottom() {
    const messagesDiv = document.getElementById('chat-messages');
    if (messagesDiv) {
      setTimeout(() => {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }, 50);
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Simple Markdown Formatter
  function formatMarkdown(text) {
    if (!text) return '';

    let formatted = text
      // Bold **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Inline `code`
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Links [text](url)
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Split paragraphs and lists
    const lines = formatted.split('\n');
    let html = '';
    let inList = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          html += '<ul>';
          inList = true;
        }
        html += `<li>${trimmed.substring(2)}</li>`;
      } else if (/^\d+\.\s/.test(trimmed)) {
        if (!inList) {
          html += '<ol>';
          inList = true;
        }
        html += `<li>${trimmed.replace(/^\d+\.\s/, '')}</li>`;
      } else {
        if (inList) {
          html += inList === true ? '</ul>' : '</ol>';
          inList = false;
        }
        if (trimmed.length > 0) {
          html += `<p>${trimmed}</p>`;
        }
      }
    });

    if (inList) {
      html += '</ul>';
    }

    return html;
  }

  // --- SARVAM AI API CALLER & LOCAL KNOWLEDGE ENGINE ---
  async function generateResponse(userQuery) {
    isGenerating = true;
    showTypingIndicator();
    const sendBtn = document.getElementById('chat-send-btn');
    if (sendBtn) sendBtn.disabled = true;

    // 1. If Sarvam API Key is provided
    if (config.apiKey && config.apiKey.trim() !== '') {
      try {
        const response = await fetch(config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-subscription-key': config.apiKey.trim(),
            'Authorization': `Bearer ${config.apiKey.trim()}`
          },
          body: JSON.stringify({
            model: config.model || 'sarvam-105b-conversations',
            messages: conversationHistory,
            temperature: config.temperature,
            max_tokens: config.maxTokens
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || errData.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const botReply = data.choices?.[0]?.message?.content;

        if (botReply) {
          appendBotMessage(botReply);
          isGenerating = false;
          if (sendBtn) sendBtn.disabled = false;
          return;
        } else {
          throw new Error("Empty response from Sarvam AI.");
        }
      } catch (err) {
        console.warn("Sarvam API request failed, utilizing local knowledge engine fallback:", err);
        const fallbackReply = generateFallbackResponse(userQuery);
        appendBotMessage(`${fallbackReply}\n\n*(Note: Sarvam API request failed: ${err.message}. Check your API Key in ⚙️ Settings)*`);
        isGenerating = false;
        if (sendBtn) sendBtn.disabled = false;
        return;
      }
    }

    // 2. Local Fallback Engine (Speaks as Soujanya in 1st person)
    setTimeout(() => {
      const fallbackReply = generateFallbackResponse(userQuery);
      appendBotMessage(fallbackReply);
      isGenerating = false;
      if (sendBtn) sendBtn.disabled = false;
    }, 450);
  }

  // Direct, natural, 1st-person responses as Soujanya
  function generateFallbackResponse(query) {
    const q = query.toLowerCase().trim();

    // Casual / Short greetings & questions
    if (q === 'hi' || q === 'hello' || q === 'hey' || q === 'hi there' || q === 'hey soujanya') {
      return `Hey! Good to see you here. How can I help you today?`;
    }

    if (q.includes('who are you') || q.includes('introduce yourself') || q.includes('about you') || q.includes('tell me about yourself')) {
      return `I'm **Soujanya S P**, an AI Engineer and Data Scientist based in Bangalore. I focus on building intelligent, autonomous AI systems — especially LLM agent pipelines, RAG systems, and production backend integrations with Python and FastAPI.`;
    }

    if (q.includes('where') && (q.includes('based') || q.includes('live') || q.includes('from') || q.includes('location'))) {
      return `I'm based in **Bangalore, Karnataka, India**.`;
    }

    if (q.includes('open to work') || q.includes('available') || q.includes('looking for job') || q.includes('hiring')) {
      return `Yes! I'm actively exploring AI / LLM Engineering, Data Science, and Agentic AI roles. Feel free to reach out to me at [spsoujanya02@gmail.com](mailto:spsoujanya02@gmail.com) or on [LinkedIn](https://www.linkedin.com/in/soujanyasp02).`;
    }

    // Projects
    if (q.includes('project') || q.includes('built') || q.includes('portfolio') || q.includes('repo')) {
      if (q.includes('research') || q.includes('report')) {
        return `I built the **AI Research & Report Generation System** — an autonomous multi-agent setup where agents gather live web research, fact-check content, generate structured citations, and produce verified reports with AI trust scoring.\n\nCheck out the code on [GitHub](https://github.com/Soujuhegde/AI-Research-and-Report-Generation-Agent.git)!`;
      }
      if (q.includes('voice') || q.includes('hospital') || q.includes('appointment')) {
        return `I created an **AI Voice Assistant** that listens to raw, unstructured spoken input from patients and turns it into clean medical records, handling hospital appointments end-to-end without needing human intervention.\n\nBuilt with VAPI, FastAPI, Pandas, and SQLite. Here's the [GitHub repo](https://github.com/Soujuhegde/AI_VOICE_ASSITANT.git).`;
      }
      if (q.includes('math') || q.includes('quiz') || q.includes('quant') || q.includes('word-problem')) {
        return `I developed the **Self-Validating Quant Problem Generator** — a multi-agent system where one agent writes quantitative math problems, a second agent solves them step-by-step, and a third checks the reasoning to catch any hallucinations autonomously.\n\nSee it on [GitHub](https://github.com/Soujuhegde/Self-validating-ai-quiz-generator.git).`;
      }
      if (q.includes('career') || q.includes('pilot')) {
        return `**CareerPilot** is an AI career platform I designed to give students and professionals actionable resume enhancements, technical interview prep, and intelligent job matching.\n\nTake a look at [GitHub](https://github.com/Soujuhegde/CareerPilot.git).`;
      }
      if (q.includes('travel') || q.includes('booking')) {
        return `I built a **Travel Assistant Booking System** that parses natural language travel inquiries to plan multi-city itineraries, look up flights and hotels, and orchestrate booking workflows.\n\n[GitHub Repo](https://github.com/Soujuhegde/Travel-Assistant.git)`;
      }
      if (q.includes('movie')) {
        return `I built a fast **Movie Recommendation System** using the KNN algorithm with an interactive Streamlit UI.\n\n[GitHub Repo](https://github.com/Soujuhegde/movie-recommendation-system.git)`;
      }

      return `Here are some of my favorite AI projects I've built:\n\n` +
        `1. **AI Research & Report Generator**: Autonomous multi-agent research with automated fact-checking ([GitHub](https://github.com/Soujuhegde/AI-Research-and-Report-Generation-Agent.git))\n` +
        `2. **AI Voice Assistant**: End-to-end voice-to-record hospital booking system ([GitHub](https://github.com/Soujuhegde/AI_VOICE_ASSITANT.git))\n` +
        `3. **Self-Validating Math Problem Generator**: Multi-agent math generator with self-correction ([GitHub](https://github.com/Soujuhegde/Self-validating-ai-quiz-generator.git))\n` +
        `4. **CareerPilot**: AI-powered resume enhancer and interview assistant ([GitHub](https://github.com/Soujuhegde/CareerPilot.git))\n` +
        `5. **Travel Assistant Booking System**: Autonomous travel planning & booking pipeline ([GitHub](https://github.com/Soujuhegde/Travel-Assistant.git))\n\n` +
        `Which one would you like me to tell you more about?`;
    }

    // Skills & Tech Stack
    if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('python') || q.includes('tools') || q.includes('framework')) {
      return `My primary tools and stack:\n\n` +
        `- **AI & LLMs:** LangChain, LangGraph, Multi-Agent Systems, RAG, Prompt Engineering, Generative AI\n` +
        `- **Languages:** Python (primary), SQL\n` +
        `- **Frameworks:** FastAPI, Streamlit, Pandas, NumPy, Scikit-Learn\n` +
        `- **DevOps & DBs:** Docker, Git/GitHub Actions (CI/CD), PostgreSQL, SQLite`;
    }

    // Experience & Internships
    if (q.includes('experience') || q.includes('intern') || q.includes('workfall') || q.includes('sanskriti') || q.includes('work')) {
      return `Here is a quick snapshot of my work experience:\n\n` +
        `1. **AI Developer Intern** @ **Workfall** (May 2026 – Aug 2026)\n` +
        `   - Built LLM-powered agent workflows in Python to automate task creation and dynamic backend API execution.\n` +
        `   - Developed an AI travel assistant chatbot.\n\n` +
        `2. **Backend Engineer Intern** @ **Sanskriti Labs** (Oct 2025 – Dec 2025)\n` +
        `   - Developed RESTful APIs in NestJS and managed database operations.\n\n` +
        `3. **Machine Learning Intern** @ **Cranes Varsity** (Mar 2024)\n` +
        `   - Implemented hands-on ML predictive models with Python.`;
    }

    // Education
    if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('mca') || q.includes('bca') || q.includes('gpa') || q.includes('cgpa')) {
      return `My educational background:\n\n` +
        `- **MCA**: MS Ramaiah College of Arts, Science, and Commerce (Autonomous), Bangalore (2024 – 2026) — **CGPA: 9.5/10**\n` +
        `- **BCA**: PES Institute of Advanced Management Studies, Shivamogga (2021 – 2024) — **CGPA: 9.38/10**\n` +
        `- **PUC**: Mahesh PU College, Shivamogga — **98%**`;
    }

    // Contact & Hiring
    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('reach') || q.includes('linkedin') || q.includes('github') || q.includes('connect')) {
      return `I'd love to connect! You can reach me at:\n\n` +
        `- 📧 **Email:** [spsoujanya02@gmail.com](mailto:spsoujanya02@gmail.com)\n` +
        `- 📱 **Phone:** [+91 8088091773](tel:+918088091773)\n` +
        `- 💼 **LinkedIn:** [linkedin.com/in/soujanyasp02](https://www.linkedin.com/in/soujanyasp02)\n` +
        `- 🐙 **GitHub:** [github.com/Soujuhegde](https://github.com/Soujuhegde)`;
    }

    // Default Fallback
    return `I specialize in building intelligent AI systems with Python, LLMs, LangGraph, and FastAPI.\n\n` +
      `Feel free to ask me about:\n` +
      `- 🚀 Any of my **AI projects**\n` +
      `- 🛠️ My **tech stack & skills**\n` +
      `- 💼 My **internship experience**\n` +
      `- 📫 How to **get in touch or hire me**`;
  }

  // --- INITIALIZE ON DOM READY ---
  document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    createChatbotUI();
  });
})();
