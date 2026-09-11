/**
 * Holographic AI Technical Mock Interviewer Simulator (Elara-AI)
 * Features:
 * - Real-time role-adapted technical & behavioral question rounds
 * - Voice speech generation (TTS) with animated vocal waveforms
 * - Speech-to-Text input or code/text submission
 * - Multi-dimensional rubric evaluation (Technical Depth, Problem Solving, Communication)
 * - Detailed feedback coaching and score boosting
 */

import { JOB_DATABASE } from './job-data.js';

const INTERVIEW_QUESTIONS = {
  'job_ai_engineer': [
    {
      id: 'q1',
      topic: 'Neural Network Optimization & Overfitting',
      question: 'How do you diagnose and mitigate overfitting in a deep transformer model when working with limited domain-specific training data?',
      sampleAnswerKeywords: ['dropout', 'regularization', 'data augmentation', 'weight decay', 'early stopping', 'lora', 'fine-tuning', 'cross-validation'],
      idealResponseSummary: 'Discuss techniques like LoRA/PEFT, Dropout, Data Augmentation, Early Stopping, and Weight Decay.'
    },
    {
      id: 'q2',
      topic: 'Vector Embeddings & Retrieval Latency',
      question: 'In a production RAG (Retrieval-Augmented Generation) pipeline, how would you optimize vector search latency for 10M+ documents while maintaining high recall?',
      sampleAnswerKeywords: ['hnsw', 'approximate nearest neighbor', 'ann', 'quantization', 'ivf', 'caching', 'reranking', 'embedding', 'cosine'],
      idealResponseSummary: 'Mention HNSW or IVF indexes, vector quantization (PQ), caching top queries, and two-stage retrieval with cross-encoders.'
    },
    {
      id: 'q3',
      topic: 'Distributed Training & GPU Memory',
      question: 'When a model exceeds the VRAM of a single GPU, what parallelization strategies do you implement to train effectively?',
      sampleAnswerKeywords: ['fsdp', 'deepspeed', 'pipeline parallelism', 'tensor parallelism', 'zero', 'gradient checkpointing', 'mixed precision'],
      idealResponseSummary: 'Cover ZeRO/FSDP, Tensor Parallelism, Pipeline Parallelism, Gradient Checkpointing, and FP16/BF16 mixed precision.'
    }
  ],
  'job_ml_lead': [
    {
      id: 'q1',
      topic: 'MLOps Pipeline Architecture',
      question: 'How do you design a continuous training (CT) and automated drift-detection pipeline for a high-throughput recommendation service?',
      sampleAnswerKeywords: ['feature store', 'drift detection', 'ks-test', 'evidently', 'mlflow', 'canary', 'shadow deployment', 'monitoring'],
      idealResponseSummary: 'Explain feature stores, statistical drift metrics (KS-test/PSI), automated retraining triggers, and canary deployments.'
    },
    {
      id: 'q2',
      topic: 'Model Governance & Safety Alignment',
      question: 'What framework do you apply to evaluate LLM hallucinations and toxicity before rolling out to 100,000+ enterprise users?',
      sampleAnswerKeywords: ['guardrails', 'rlhf', 'red teaming', 'eval benchmarks', 'constitutional ai', 'moderation api', 'rag'],
      idealResponseSummary: 'Discuss automated guardrails (NeMo), RLHF alignment, red-teaming protocols, and custom domain-specific eval benchmarks.'
    }
  ],
  'job_backend_engineer': [
    {
      id: 'q1',
      topic: 'High-Concurrency & Distributed Locking',
      question: 'How do you prevent race conditions in a distributed payment system when multiple concurrent requests attempt to debit the same wallet?',
      sampleAnswerKeywords: ['idempotency', 'optimistic locking', 'pessimistic locking', 'redis redlock', 'acid', 'isolation level', 'distributed transaction'],
      idealResponseSummary: 'Detail idempotency keys, database row-level locking or optimistic versioning, and Redis Redlock with transaction isolation.'
    },
    {
      id: 'q2',
      topic: 'Database Sharding & Query Optimization',
      question: 'Explain how you would shard a PostgreSQL database table containing 500 million transaction records without creating hot spots.',
      sampleAnswerKeywords: ['consistent hashing', 'shard key', 'partitioning', 'read replicas', 'connection pooling', 'pgbouncer'],
      idealResponseSummary: 'Explain choosing a high-cardinality shard key, consistent hashing, range vs hash partitioning, and using connection poolers like PgBouncer.'
    }
  ],
  'default': [
    {
      id: 'q1',
      topic: 'Core Technical Problem Solving',
      question: 'Walk me through an engineering trade-off you made between development velocity and long-term architectural scalability.',
      sampleAnswerKeywords: ['trade-off', 'modularity', 'tech debt', 'refactoring', 'latency', 'caching', 'microservices', 'mvp', 'scalability'],
      idealResponseSummary: 'Highlight clear prioritization, tech debt management, modular code structure, and measurable benchmarks.'
    },
    {
      id: 'q2',
      topic: 'Incident Post-Mortem & Resilience',
      question: 'Describe how you troubleshoot a sudden 5xx server spike during peak traffic and how you build systemic safeguards against recurrence.',
      sampleAnswerKeywords: ['circuit breaker', 'load balancing', 'rate limiting', 'distributed tracing', 'datadog', 'apm', 'logs', 'graceful degradation'],
      idealResponseSummary: 'Mention APM metrics, distributed tracing, circuit breakers, rate limiting, and automated health check rollbacks.'
    }
  ]
};

export class MockInterviewer {
  constructor(app) {
    this.app = app;
    this.currentJobId = 'job_ai_engineer';
    this.currentQuestionIndex = 0;
    this.questions = [];
    this.userAnswers = {};
    this.isRecording = false;
    this.recognition = null;
    this.initSpeechRecognition();
    this.initElements();
    this.bindEvents();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        const answerInput = document.getElementById('interviewAnswerInput');
        if (answerInput) {
          answerInput.value = (answerInput.dataset.preVoice || '') + ' ' + transcript;
        }
      };

      this.recognition.onerror = (e) => {
        console.warn('Speech recognition notice:', e);
        this.stopVoiceRecording();
      };
    }
  }

  initElements() {
    this.modal = document.getElementById('mockInterviewModal');
    this.closeBtn = document.getElementById('closeInterviewModalBtn');
    this.openBtn = document.getElementById('openMockInterviewBtn');
    this.submitBtn = document.getElementById('submitInterviewAnswerBtn');
    this.voiceRecordBtn = document.getElementById('recordAnswerVoiceBtn');
    this.speakQuestionBtn = document.getElementById('speakQuestionBtn');
    this.nextQBtn = document.getElementById('nextQuestionBtn');
    this.prevQBtn = document.getElementById('prevQuestionBtn');
  }

  bindEvents() {
    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.openInterview());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeInterview());
    }
    if (this.voiceRecordBtn) {
      this.voiceRecordBtn.addEventListener('click', () => this.toggleVoiceRecording());
    }
    if (this.speakQuestionBtn) {
      this.speakQuestionBtn.addEventListener('click', () => this.speakCurrentQuestion());
    }
    if (this.submitBtn) {
      this.submitBtn.addEventListener('click', () => this.evaluateCurrentAnswer());
    }
    if (this.nextQBtn) {
      this.nextQBtn.addEventListener('click', () => {
        if (this.currentQuestionIndex < this.questions.length - 1) {
          this.currentQuestionIndex++;
          this.renderQuestion();
        }
      });
    }
    if (this.prevQBtn) {
      this.prevQBtn.addEventListener('click', () => {
        if (this.currentQuestionIndex > 0) {
          this.currentQuestionIndex--;
          this.renderQuestion();
        }
      });
    }
  }

  openInterview(jobId = null) {
    if (jobId) this.currentJobId = jobId;
    const pool = INTERVIEW_QUESTIONS[this.currentJobId] || INTERVIEW_QUESTIONS['default'];
    this.questions = pool;
    this.currentQuestionIndex = 0;
    this.userAnswers = {};

    if (this.modal) this.modal.classList.add('active');
    this.renderQuestion();
    if (this.app.playCyberTone) this.app.playCyberTone('match');
  }

  closeInterview() {
    this.stopVoiceRecording();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (this.modal) this.modal.classList.remove('active');
  }

  renderQuestion() {
    const q = this.questions[this.currentQuestionIndex];
    if (!q) return;

    const job = JOB_DATABASE.find(j => j.id === this.currentJobId) || JOB_DATABASE[0];
    
    const roleTitleEl = document.getElementById('interviewRoleTitle');
    const qNumberEl = document.getElementById('interviewQuestionNumber');
    const qTopicEl = document.getElementById('interviewTopicBadge');
    const qTextEl = document.getElementById('interviewQuestionText');
    const answerInput = document.getElementById('interviewAnswerInput');
    const feedbackBox = document.getElementById('interviewFeedbackBox');
    
    if (roleTitleEl) roleTitleEl.textContent = `${job.title} (${job.company})`;
    if (qNumberEl) qNumberEl.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
    if (qTopicEl) qTopicEl.textContent = `⚡ TOPIC: ${q.topic.toUpperCase()}`;
    if (qTextEl) qTextEl.textContent = q.question;

    // Reset or restore existing answer
    if (answerInput) {
      answerInput.value = this.userAnswers[q.id]?.text || '';
    }

    if (feedbackBox) {
      if (this.userAnswers[q.id]?.evaluated) {
        this.renderFeedbackView(this.userAnswers[q.id]);
      } else {
        feedbackBox.style.display = 'none';
      }
    }

    // Auto-read question if audio is enabled
    if (this.app.audioEnabled) {
      this.speakCurrentQuestion();
    }
  }

  speakCurrentQuestion() {
    const q = this.questions[this.currentQuestionIndex];
    if (!q || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(q.question);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const wave = document.getElementById('interviewWaveform');
    if (wave) wave.classList.add('speaking');

    utterance.onend = () => {
      if (wave) wave.classList.remove('speaking');
    };

    window.speechSynthesis.speak(utterance);
  }

  toggleVoiceRecording() {
    if (this.isRecording) {
      this.stopVoiceRecording();
    } else {
      this.startVoiceRecording();
    }
  }

  startVoiceRecording() {
    if (!this.recognition) {
      alert('Speech recognition is not supported in this browser. You can type your answer directly into the console.');
      return;
    }
    const answerInput = document.getElementById('interviewAnswerInput');
    if (answerInput) {
      answerInput.dataset.preVoice = answerInput.value;
    }
    try {
      this.recognition.start();
      this.isRecording = true;
      if (this.voiceRecordBtn) {
        this.voiceRecordBtn.innerHTML = '🔴 Recording... Click to Stop';
        this.voiceRecordBtn.classList.add('recording');
      }
      if (this.app.playCyberTone) this.app.playCyberTone('ping');
    } catch (e) {
      console.warn('Recognition start exception:', e);
    }
  }

  stopVoiceRecording() {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
    }
    this.isRecording = false;
    if (this.voiceRecordBtn) {
      this.voiceRecordBtn.innerHTML = '🎙️ Speak Answer (Mic)';
      this.voiceRecordBtn.classList.remove('recording');
    }
  }

  evaluateCurrentAnswer() {
    const q = this.questions[this.currentQuestionIndex];
    const answerInput = document.getElementById('interviewAnswerInput');
    const text = answerInput ? answerInput.value.trim() : '';

    if (!text || text.length < 10) {
      alert('Please provide a substantive answer (at least 2-3 sentences) so the AI evaluator can accurately grade technical depth.');
      return;
    }

    this.stopVoiceRecording();
    if (this.submitBtn) {
      this.submitBtn.textContent = '🧠 AI Evaluating Rubric...';
      this.submitBtn.disabled = true;
    }

    if (this.app.playCyberTone) this.app.playCyberTone('scan');

    setTimeout(() => {
      // Analyze keyword density
      const lower = text.toLowerCase();
      let matchedCount = 0;
      q.sampleAnswerKeywords.forEach(kw => {
        if (lower.includes(kw.toLowerCase())) matchedCount++;
      });

      const keywordRatio = matchedCount / q.sampleAnswerKeywords.length;
      const lengthBonus = Math.min(25, text.split(' ').length / 3);

      const problemSolving = Math.min(98, Math.floor(65 + keywordRatio * 25 + lengthBonus * 0.4));
      const techQuality = Math.min(99, Math.floor(60 + keywordRatio * 32 + lengthBonus * 0.3));
      const communication = Math.min(96, Math.floor(70 + lengthBonus * 0.8));
      const overall = Math.floor((problemSolving * 0.4) + (techQuality * 0.4) + (communication * 0.2));

      const evaluationData = {
        text,
        evaluated: true,
        scores: {
          problemSolving,
          techQuality,
          communication,
          overall
        },
        matchedKeywords: q.sampleAnswerKeywords.filter(kw => lower.includes(kw.toLowerCase())),
        missingKeywords: q.sampleAnswerKeywords.filter(kw => !lower.includes(kw.toLowerCase())),
        feedback: this.generateFeedbackComment(overall, matchedCount, q)
      };

      this.userAnswers[q.id] = evaluationData;
      this.renderFeedbackView(evaluationData);

      if (this.submitBtn) {
        this.submitBtn.textContent = '✓ AI Evaluation Complete';
        this.submitBtn.disabled = false;
        setTimeout(() => {
          this.submitBtn.textContent = '⚡ Evaluate Response';
        }, 2500);
      }

      if (this.app.playCyberTone) this.app.playCyberTone('match');
    }, 800);
  }

  generateFeedbackComment(overall, matchedCount, q) {
    if (overall >= 88) {
      return `Outstanding response! You demonstrated deep familiarity with core architecture and specific domain nuances. Your explanation aligns with senior engineering interview standards.`;
    } else if (overall >= 75) {
      return `Solid answer. You touched on primary concepts, but consider elaborating more on edge cases and concrete performance benchmarks (${q.idealResponseSummary}).`;
    } else {
      return `Good foundation, but your answer lacked specific architectural keywords. To reach top tier, address: ${q.idealResponseSummary}`;
    }
  }

  renderFeedbackView(evalData) {
    const feedbackBox = document.getElementById('interviewFeedbackBox');
    if (!feedbackBox) return;

    feedbackBox.style.display = 'block';
    feedbackBox.innerHTML = `
      <div class="feedback-card glass-panel" style="padding: 1.25rem; border-color: var(--neon-emerald); background: rgba(6, 15, 27, 0.9);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h4 style="color: var(--neon-emerald); font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>📊</span> Real-Time AI Interview Scorecard
          </h4>
          <span style="font-family: 'JetBrains Mono', monospace; font-size: 1.3rem; font-weight: 800; color: var(--neon-emerald);">
            ${evalData.scores.overall}%
          </span>
        </div>

        <!-- Rubric Progress Bars -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.25rem;">
          <div class="score-rubric-card">
            <span style="font-size: 0.72rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;">PROBLEM SOLVING</span>
            <strong style="color: var(--neon-cyan); font-size: 1.1rem; display: block; margin-top: 2px;">${evalData.scores.problemSolving}%</strong>
          </div>
          <div class="score-rubric-card">
            <span style="font-size: 0.72rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;">TECH ACCURACY</span>
            <strong style="color: var(--neon-emerald); font-size: 1.1rem; display: block; margin-top: 2px;">${evalData.scores.techQuality}%</strong>
          </div>
          <div class="score-rubric-card">
            <span style="font-size: 0.72rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;">COMMUNICATION</span>
            <strong style="color: var(--neon-gold); font-size: 1.1rem; display: block; margin-top: 2px;">${evalData.scores.communication}%</strong>
          </div>
        </div>

        <p style="font-size: 0.85rem; line-height: 1.5; color: #ffffff; margin-bottom: 1rem;">
          ${evalData.feedback}
        </p>

        <!-- Matched & Suggested Keywords -->
        <div style="font-size: 0.78rem;">
          <div style="margin-bottom: 0.4rem; color: var(--neon-emerald);">
            ✓ Matched Key Terminology: <strong>${evalData.matchedKeywords.length > 0 ? evalData.matchedKeywords.join(', ') : 'None'}</strong>
          </div>
          ${evalData.missingKeywords.length > 0 ? `
            <div style="color: var(--neon-gold);">
              ▲ Suggested Topics to Expand On: <strong>${evalData.missingKeywords.slice(0, 3).join(', ')}</strong>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}
