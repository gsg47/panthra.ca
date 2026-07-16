/* ============================================
   PANTHRA - AI Chatbot
   ============================================ */

class PanthraChatbot {
  constructor() {
    this.isOpen = false;
    this.isExpanded = false;
    this.conversationHistory = [];
    this.init();
  }

  init() {
    this.createChatbotHTML();
    this.attachEventListeners();
    this.attachSheetGestures();
  }

  createChatbotHTML() {
    const chatbotHTML = `
      <div class="chatbot-container" id="chatbotContainer">
        <div class="chatbot-window" id="chatbotWindow">
          <div class="chatbot-sheet-handle" id="chatbotSheetHandle" aria-hidden="true">
            <span class="chatbot-sheet-grab"></span>
          </div>
          <div class="chatbot-header">
            <div class="chatbot-header-content">
              <div class="chatbot-icon-small">
                <img src="panthra_logo.png" alt="PANTHRA" class="header-logo" />
              </div>
              <div class="chatbot-header-text">
                <h3>PANTHRA Assistant</h3>
                <p class="chatbot-status">
                  <span class="status-dot"></span>
                  Online
                </p>
              </div>
            </div>
            <button class="chatbot-close" id="chatbotClose" aria-label="Close chatbot">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <div class="chatbot-messages" id="chatbotMessages">
            <div class="chatbot-message chatbot-message-bot">
              <div class="message-avatar">
                <img src="panthra_logo.png" alt="PANTHRA" class="avatar-logo" />
              </div>
              <div class="message-content">
                <p>Hello! I'm your PANTHRA security assistant. I can help answer questions about our Secure, Monitor, Respond, and Advise services, plus The Predator Method™. How can I assist you today?</p>
              </div>
            </div>
          </div>
          
          <div class="chatbot-input-container">
            <form class="chatbot-form" id="chatbotForm">
              <input 
                type="text" 
                class="chatbot-input" 
                id="chatbotInput" 
                placeholder="Ask about our services..."
                autocomplete="off"
              />
              <button type="submit" class="chatbot-send" aria-label="Send message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
        
        <button class="chatbot-toggle" id="chatbotToggle" aria-label="Open chatbot">
          <img src="panthra_logo.png" alt="PANTHRA" class="chatbot-logo" />
          <span class="chatbot-badge"></span>
        </button>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }

  attachEventListeners() {
    const toggle = document.getElementById('chatbotToggle');
    const close = document.getElementById('chatbotClose');
    const form = document.getElementById('chatbotForm');
    const input = document.getElementById('chatbotInput');

    toggle?.addEventListener('click', () => this.toggle());
    close?.addEventListener('click', () => this.close());
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleUserMessage();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  isMobileSheet() {
    return window.matchMedia('(max-width: 480px)').matches;
  }

  setSheetExpanded(expanded) {
    const chatWindow = document.getElementById('chatbotWindow');
    if (!chatWindow) return;

    this.isExpanded = expanded;
    chatWindow.classList.toggle('chatbot-window-expanded', expanded);
  }

  attachSheetGestures() {
    const chatWindow = document.getElementById('chatbotWindow');
    const handle = document.getElementById('chatbotSheetHandle');
    if (!chatWindow || !handle) return;

    let startY = 0;
    let dragging = false;
    let didDrag = false;

    const onStart = (event) => {
      if (!this.isMobileSheet() || !this.isOpen) return;
      dragging = true;
      didDrag = false;
      startY = event.touches[0].clientY;
    };

    const onMove = (event) => {
      if (!dragging) return;
      if (Math.abs(event.touches[0].clientY - startY) > 10) {
        didDrag = true;
      }
      event.preventDefault();
    };

    const onEnd = (event) => {
      if (!dragging) return;
      dragging = false;

      const delta = startY - event.changedTouches[0].clientY;

      if (delta > 50) {
        this.setSheetExpanded(true);
      } else if (delta < -50) {
        if (this.isExpanded) {
          this.setSheetExpanded(false);
        } else {
          this.close();
        }
      }
    };

    handle.addEventListener('touchstart', onStart, { passive: true });
    handle.addEventListener('touchmove', onMove, { passive: false });
    handle.addEventListener('touchend', onEnd);

    handle.addEventListener('click', (event) => {
      if (didDrag) {
        event.preventDefault();
        return;
      }
      if (!this.isMobileSheet() || !this.isOpen) return;
      this.setSheetExpanded(!this.isExpanded);
    });
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    const container = document.getElementById('chatbotContainer');
    const window = document.getElementById('chatbotWindow');
    const input = document.getElementById('chatbotInput');
    
    container?.classList.add('chatbot-open');
    this.isOpen = true;
    this.setSheetExpanded(false);
    
    setTimeout(() => {
      window?.classList.add('chatbot-window-visible');
      input?.focus();
    }, 10);
  }

  close() {
    const container = document.getElementById('chatbotContainer');
    const window = document.getElementById('chatbotWindow');
    
    window?.classList.remove('chatbot-window-visible');
    this.setSheetExpanded(false);
    setTimeout(() => {
      container?.classList.remove('chatbot-open');
      this.isOpen = false;
    }, 300);
  }

  async handleUserMessage() {
    const input = document.getElementById('chatbotInput');
    const userMessage = input?.value.trim();
    
    if (!userMessage) return;

    this.addMessage(userMessage, 'user');
    input.value = '';

    const typingId = this.showTypingIndicator();

    const pricingKeywords = ['price', 'pricing', 'cost', 'how much', 'fee', 'quote', 'pricing information'];
    const isPricingQuery = pricingKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    );

    if (isPricingQuery) {
      this.removeTypingIndicator(typingId);
      setTimeout(() => {
        this.addMessage(
          `Our security solutions are customized to your organization's specific needs and scale. To get accurate pricing, I'd recommend speaking directly with our team. You can reach us at:\n\n📧 Email: contact@panthra.ca\n📞 Phone: +1 587-816-0621\n🌐 Or visit our <a href="contact.html" style="color: var(--purple-400); text-decoration: underline;">contact page</a> to request a quote.\n\nWe'll provide a detailed proposal tailored to your security requirements.`,
          'bot'
        );
      }, 500);
      return;
    }

    try {
      const response = await this.getAIResponse(userMessage);
      this.removeTypingIndicator(typingId);
      setTimeout(() => {
        this.addMessage(response, 'bot');
      }, 500);
    } catch (error) {
      this.removeTypingIndicator(typingId);
      setTimeout(() => {
        this.addMessage(
          "I apologize, but I'm having trouble processing your request right now. Please feel free to contact us directly at contact@panthra.ca or visit our contact page for immediate assistance.",
          'bot'
        );
      }, 500);
    }
  }

  async getAIResponse(userMessage) {
    this.conversationHistory.push({ role: 'user', content: userMessage });

    const systemPrompt = `You are a helpful and professional cybersecurity assistant for PANTHRA, a Canadian cybersecurity company.

Company Overview:
- PANTHRA provides comprehensive cybersecurity solutions for Canadian businesses
- Tagline: "Silent protection. Absolute security."
- Canadian-owned and focused on Canadian regulations (PIPEDA, PHIPA, provincial privacy laws)
- PANTHRA's team provides practical, client-focused cybersecurity guidance

Service Areas (four core services):
1. Secure (secure.html): Identity & Access Security, Infrastructure Security, Data & Endpoint Protection, Microsoft 365 Security
2. Monitor (monitor.html): Security Monitoring (SIEM/SOC), Threat Detection, Vulnerability Management, Security Reporting
3. Respond (respond.html): Incident Response, Backup & Disaster Recovery, Business Continuity, Emergency Response Planning
4. Advise (advise.html): Security Assessments, Compliance Services, Security Strategy / vCISO, Security Awareness & Training

Overview page: services.html

The Predator Method™ (solutions.html#approach):
1. Stalk: Security assessments, vulnerability identification, compliance review
2. Strike: 24/7 monitoring, threat detection, incident response
3. Guard: Recovery, forensics, business continuity, continuous improvement

Security Tiers (solutions.html#tiers): Essential Defense, Advanced Protection, Enterprise Security

Key Points:
- 99.9% threat detection rate
- Under 5 minutes average incident response time
- 24/7/365 active monitoring
- Canadian compliance focus (PIPEDA, PHIPA, provincial laws)

Contact Information:
- Email: contact@panthra.ca
- Phone: +1 587-816-0621
- Contact page: contact.html

Instructions:
- Be concise, professional, and helpful (2-3 sentences typically)
- If asked about pricing, always direct to contact page/email/phone (never provide specific prices)
- Emphasize proactive, Canadian-focused approach
- Reference the relevant service area page when helpful (secure.html, monitor.html, respond.html, advise.html, services.html)
- Never call the services "pillars"; refer to them as service areas or simply services
- Keep responses conversational but professional
- Use Canadian spelling and terminology`;

    // AI mode is served through a server-side proxy that holds the OpenAI key.
    // Never ship API keys to the browser, configure a backend endpoint and set
    // window.PANTHRA_CHAT_ENDPOINT to its URL. The proxy should accept
    // { messages: [...] } and return { message | reply | content: "..." }.
    const endpoint = window.PANTHRA_CHAT_ENDPOINT;

    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: systemPrompt },
              ...this.conversationHistory.slice(-8)
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const aiMessage = (data.message || data.reply || data.content || '').trim();
          if (aiMessage) {
            this.conversationHistory.push({ role: 'assistant', content: aiMessage });
            return this.formatAIResponse(aiMessage);
          }
          console.error('Chat proxy returned no message');
        } else {
          console.error('Chat proxy error:', response.status);
        }
      } catch (error) {
        console.error('Chat proxy error:', error);
      }
    }

    return this.getFallbackResponse(userMessage);
  }

  formatAIResponse(message) {
    return message
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: var(--purple-400); text-decoration: underline;">$1</a>')
      .replace(/\n/g, '<br>');
  }

  getFallbackResponse(userMessage) {
    const message = userMessage.toLowerCase();

    if (message.includes('secure') || message.includes('identity') || message.includes('infrastructure') || message.includes('endpoint') || message.includes('microsoft 365') || message.includes('m365')) {
      return `Our <strong>Secure</strong> service covers identity and access, infrastructure, data and endpoint protection, and Microsoft 365 security: the controls that reduce your risk before threats escalate. Explore details on our <a href="secure.html" style="color: var(--purple-400); text-decoration: underline;">Secure</a> page.`;
    }

    if (message.includes('monitor') || message.includes('siem') || message.includes('soc') || message.includes('threat detection') || message.includes('vulnerability')) {
      return `Our <strong>Monitor</strong> service provides 24/7 SIEM/SOC monitoring, threat detection, vulnerability management, and security reporting, so problems are caught early. Learn more on our <a href="monitor.html" style="color: var(--purple-400); text-decoration: underline;">Monitor</a> page.`;
    }

    if (message.includes('incident response') || message.includes('respond') || message.includes('disaster recovery') || message.includes('backup') || message.includes('business continuity')) {
      return `Our <strong>Respond</strong> service covers incident response, backup and disaster recovery, business continuity, and emergency response planning, so you recover quickly when something goes wrong. See our <a href="respond.html" style="color: var(--purple-400); text-decoration: underline;">Respond</a> page.`;
    }

    if (message.includes('compliance') || message.includes('assessment') || message.includes('vciso') || message.includes('advise') || message.includes('training') || message.includes('pen test') || message.includes('pentest')) {
      return `Our <strong>Advise</strong> service includes security assessments, compliance services, vCISO strategy, and security awareness training: the governance and guidance that strengthens your program over time. Visit <a href="advise.html" style="color: var(--purple-400); text-decoration: underline;">Advise</a> for details.`;
    }

    if (message.includes('predator method') || message.includes('approach') || message.includes('methodology')) {
      return `The Predator Method™ is our three-phase framework on <a href="solutions.html#approach" style="color: var(--purple-400); text-decoration: underline;">solutions.html</a>: (1) <strong>Stalk</strong>, assess and identify gaps, (2) <strong>Strike</strong>, monitor and respond to threats, (3) <strong>Guard</strong>, recover, improve, and strengthen defenses.`;
    }

    if (message.includes('services') || message.includes('what do you offer')) {
      return `PANTHRA organizes cybersecurity into four core services: <a href="secure.html" style="color: var(--purple-400); text-decoration: underline;">Secure</a>, <a href="monitor.html" style="color: var(--purple-400); text-decoration: underline;">Monitor</a>, <a href="respond.html" style="color: var(--purple-400); text-decoration: underline;">Respond</a>, and <a href="advise.html" style="color: var(--purple-400); text-decoration: underline;">Advise</a>. View the full overview on <a href="services.html" style="color: var(--purple-400); text-decoration: underline;">services.html</a>.`;
    }

    if (message.includes('canadian') || message.includes('canada') || message.includes('pipeda')) {
      return `Yes, PANTHRA is a Canadian-owned cybersecurity company. We help organizations comply with PIPEDA, PHIPA, and provincial privacy laws through our <a href="advise.html#compliance" style="color: var(--purple-400); text-decoration: underline;">Compliance Services</a> and broader security program.`;
    }

    return `Thank you for your question! Explore our four core services on <a href="services.html" style="color: var(--purple-400); text-decoration: underline;">services.html</a>, learn about <a href="solutions.html" style="color: var(--purple-400); text-decoration: underline;">our solutions</a> and The Predator Method™, or <a href="contact.html" style="color: var(--purple-400); text-decoration: underline;">contact us</a> at contact@panthra.ca for personalized help.`;
  }

  addMessage(content, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message chatbot-message-${sender}`;
    
    if (sender === 'bot') {
      // Bot content is generated by us (fallback copy or our proxy) and may
      // contain intentional links, so it is rendered as HTML.
      messageDiv.innerHTML = `
        <div class="message-avatar">
          <img src="panthra_logo.png" alt="PANTHRA" class="avatar-logo" />
        </div>
        <div class="message-content">
          <p>${content}</p>
        </div>
      `;
    } else {
      // User content is untrusted, insert it as text to prevent XSS.
      const contentWrap = document.createElement('div');
      contentWrap.className = 'message-content';
      const paragraph = document.createElement('p');
      paragraph.textContent = content;
      contentWrap.appendChild(paragraph);
      messageDiv.appendChild(contentWrap);
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return null;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message chatbot-message-bot chatbot-typing';
    typingDiv.id = 'chatbotTyping';
    typingDiv.innerHTML = `
      <div class="message-avatar">
        <img src="panthra_logo.png" alt="PANTHRA" class="avatar-logo" />
      </div>
      <div class="message-content">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return 'chatbotTyping';
  }

  removeTypingIndicator(id) {
    if (!id) return;
    const typing = document.getElementById(id);
    typing?.remove();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const chatbot = new PanthraChatbot();
  window.panthraChatbot = chatbot;

  if (window.PANTHRA_CHAT_ENDPOINT) {
    console.log('🤖 PANTHRA Chatbot: AI mode enabled (server proxy)');
  } else {
    console.log('💬 PANTHRA Chatbot: Fallback mode active. Set window.PANTHRA_CHAT_ENDPOINT to a server-side proxy to enable AI.');
  }
});
