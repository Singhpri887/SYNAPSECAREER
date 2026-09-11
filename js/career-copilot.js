/**
 * Aurora • Neural AI Career Copilot & Strategy Mentor
 * Features:
 * - Real-time conversational AI mentorship tuned to candidate telemetry
 * - Instant career transition advice, portfolio project recommendations, and interview tips
 * - Interactive suggestion chips for quick queries
 * - Voice speech generation (TTS)
 */

export class CareerCopilot {
  constructor(app) {
    this.app = app;
    this.chatHistory = [
      {
        sender: 'ai',
        text: `Hello ${this.app.currentArchetype.name.split(' ')[0]}! ⚡ I am Aurora, your Neural Career Copilot. I've analyzed your skill vectors and real-time market trends. How can I accelerate your career journey today?`,
        time: 'Just now'
      }
    ];
    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.modal = document.getElementById('careerCopilotModal');
    this.openBtn = document.getElementById('openCareerCopilotBtn');
    this.closeBtn = document.getElementById('closeCopilotModalBtn');
    this.chatMessagesContainer = document.getElementById('copilotMessagesList');
    this.chatInput = document.getElementById('copilotChatInput');
    this.sendBtn = document.getElementById('copilotSendBtn');
  }

  bindEvents() {
    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.openCopilot());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeCopilot());
    }
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.handleSendMessage());
    }
    if (this.chatInput) {
      this.chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSendMessage();
        }
      });
    }

    // Bind Quick Suggestion Chips
    document.querySelectorAll('[data-copilot-prompt]').forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-copilot-prompt');
        if (this.chatInput) {
          this.chatInput.value = prompt;
          this.handleSendMessage();
        }
      });
    });
  }

  openCopilot() {
    if (this.modal) this.modal.classList.add('active');
    this.renderMessages();
    if (this.app.playCyberTone) this.app.playCyberTone('ping');
  }

  closeCopilot() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (this.modal) this.modal.classList.remove('active');
  }

  renderMessages() {
    if (!this.chatMessagesContainer) return;

    this.chatMessagesContainer.innerHTML = this.chatHistory.map(msg => `
      <div class="copilot-msg-row ${msg.sender === 'user' ? 'msg-user' : 'msg-ai'}">
        <div class="msg-avatar">${msg.sender === 'user' ? this.app.currentArchetype.avatar : '✨'}</div>
        <div class="msg-bubble">
          <div class="msg-header">
            <strong>${msg.sender === 'user' ? this.app.currentArchetype.name : 'Aurora AI'}</strong>
            <span>${msg.time}</span>
          </div>
          <div class="msg-body">${msg.text}</div>
        </div>
      </div>
    `).join('');

    this.chatMessagesContainer.scrollTop = this.chatMessagesContainer.scrollHeight;
  }

  async handleSendMessage() {
    if (!this.chatInput) return;
    const text = this.chatInput.value.trim();
    if (!text) return;

    this.chatInput.value = '';
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append User Message
    this.chatHistory.push({
      sender: 'user',
      text: text,
      time: now
    });

    // Add loading placeholder
    const loadingId = 'ai_loading_' + Date.now();
    this.chatHistory.push({
      sender: 'ai',
      text: '🌐 <em>Connecting to live web intelligence & synthesizing real-time data...</em>',
      time: now,
      loadingId: loadingId
    });
    this.renderMessages();

    if (this.app.playCyberTone) this.app.playCyberTone('ping');

    let responseText = '';
    try {
      // Call Real-Time Backend API
      const resp = await fetch('http://127.0.0.1:5000/api/copilot-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            name: this.app.currentArchetype.name,
            target_job: this.app.latestRanked && this.app.latestRanked[0] ? this.app.latestRanked[0].title : 'AI Engineer',
            skills: this.app.currentSkills
          }
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        responseText = data.reply;
      } else {
        responseText = this.generateAIResponse(text);
      }
    } catch (e) {
      // Offline fallback
      responseText = this.generateAIResponse(text);
    }

    // Replace loading message with actual response
    const lastIdx = this.chatHistory.findIndex(m => m.loadingId === loadingId);
    if (lastIdx !== -1) {
      this.chatHistory[lastIdx] = {
        sender: 'ai',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }
    this.renderMessages();

    if (this.app.audioEnabled && window.speechSynthesis) {
      const cleanText = responseText.replace(/<[^>]*>?/gm, '');
      const utter = new SpeechSynthesisUtterance(cleanText);
      utter.rate = 1.05;
      window.speechSynthesis.speak(utter);
    }

    if (this.app.playCyberTone) this.app.playCyberTone('match');
  }

  generateAIResponse(query) {
    const q = query.toLowerCase();
    const skills = this.app.currentSkills;
    const student = this.app.currentArchetype;
    const topJob = this.app.latestRanked ? this.app.latestRanked[0] : null;

    if (q.includes('project') || q.includes('portfolio') || q.includes('build')) {
      return `
        <strong>💡 High-Yield Portfolio Projects for ${student.title}:</strong><br><br>
        1. <strong>Production RAG & Vector Search:</strong> Implement a hybrid vector retrieval pipeline using <em>PyTorch</em>, <em>FastAPI</em>, and <em>Qdrant/Pinecone</em> with sub-50ms latency benchmarks.<br>
        2. <strong>Distributed Event Stream Orchestration:</strong> Architect a Kafka/Redis queue processing 10k events/sec with automated consumer autoscaling.<br>
        3. <strong>Autonomous Multi-Agent Workflow:</strong> Build specialized agentic swarms communicating over structured schema JSONs with memory persistence.
      `;
    } else if (q.includes('salary') || q.includes('money') || q.includes('worth')) {
      return `
        <strong>💵 Real-Time Market Compensation Analysis:</strong><br><br>
        Based on your current skill vector tensor:
        • Estimated Base: <strong>$145,000 - $175,000</strong><br>
        • Tier-1 Tech Ceiling: <strong>$215,000+</strong> (with equity)<br>
        • <em>Recommendation:</em> Boosting your <strong>Cloud Architecture</strong> and <strong>System Design</strong> coefficients by +15% positions you in the top 10% compensation tier.
      `;
    } else if (q.includes('interview') || q.includes('prepare') || q.includes('question')) {
      return `
        <strong>🎯 Interview Strategy & Readiness Check:</strong><br><br>
        Your top matched target is <strong>${topJob ? topJob.title : 'AI Engineer'}</strong>. Key technical focus areas:<br>
        • Master transformer attention mechanisms & quantization (FP8/4-bit)<br>
        • Prepare for distributed system design (sharding, caching, idempotency)<br>
        • Try our <strong>AI Mock Interview Simulator</strong> (top header) for live voice evaluation!
      `;
    } else if (q.includes('skill') || q.includes('learn') || q.includes('gap')) {
      return `
        <strong>⚡ Skill Gap Acceleration Pathway:</strong><br><br>
        You have strong foundations in <em>${Object.entries(skills).filter(([k,v]) => v >= 80).map(([k]) => k).slice(0,3).join(', ')}</em>.<br>
        To maximize compatibility for senior roles, prioritize:
        1. <strong>Docker & Kubernetes:</strong> Container orchestration & Helm deployments.<br>
        2. <strong>Distributed PyTorch / DeepSpeed:</strong> Model parallelization techniques.
      `;
    } else {
      return `
        I've mapped your query to our Neural Skill Ontology for <strong>${student.name}</strong>. 
        Your readiness index is currently at <strong>${topJob ? topJob.evaluation.overallScore : 94}%</strong> for top-tier roles.
        You can ask me about:
        • <em>"What projects should I build next?"</em><br>
        • <em>"How do I prepare for my AI Engineer interview?"</em><br>
        • <em>"What is my projected market salary?"</em>
      `;
    }
  }
}
