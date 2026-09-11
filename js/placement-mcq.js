/**
 * PlacementMCQ - Holographic Placement Quiz Engine
 * Features: 6 skills, 20 Qs each, 30s timer, live score, rich results
 */

import { PLACEMENT_MCQ_DATA } from './placement-mcq-data.js';

export class PlacementMCQ {
  constructor(app) {
    this.app = app;
    this.currentSkill  = null;
    this.questions     = [];
    this.currentQIdx   = 0;
    this.userAnswers   = {};
    this.score         = 0;
    this.timerInterval = null;
    this.timeLeft      = 30;
    this.quizStarted   = false;
    this.quizFinished  = false;
    this.modal         = null;
    this.bindNavBtn();
  }

  bindNavBtn() {
    const btn = document.getElementById('openPlacementMCQBtn');
    if (btn) btn.addEventListener('click', () => this.openSkillSelector());
  }

  openSkillSelector() {
    const modal = document.getElementById('placementMCQModal');
    if (!modal) return;
    this.modal = modal;
    this.resetState();
    this.renderSkillSelector();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (this.modal) this.modal.classList.remove('active');
    document.body.style.overflow = '';
    this.clearTimer();
  }

  resetState() {
    this.currentSkill = null;
    this.questions    = [];
    this.currentQIdx  = 0;
    this.userAnswers  = {};
    this.score        = 0;
    this.quizStarted  = false;
    this.quizFinished = false;
    this.clearTimer();
  }

  renderSkillSelector() {
    const body = document.getElementById('mcqModalBody');
    if (!body) return;
    const skills = Object.entries(PLACEMENT_MCQ_DATA);
    body.innerHTML = `
      <div class="mcq-skill-selector-screen">
        <div class="mcq-selector-header">
          <div class="mcq-selector-icon-wrap"><span class="mcq-selector-icon">🎓</span></div>
          <h2 class="mcq-selector-title">Placement Preparation Quiz</h2>
          <p class="mcq-selector-subtitle">
            Choose a skill domain to begin your 20-question timed assessment.<br>
            <span style="color:var(--neon-cyan)">30 seconds</span> per question &middot; Live score &middot; Instant results
          </p>
        </div>
        <div class="mcq-skill-grid">
          ${skills.map(([key, data]) => `
            <button class="mcq-skill-card" data-skill="${key}">
              <div class="mcq-skill-icon">${data.icon}</div>
              <div class="mcq-skill-name">${data.name}</div>
              <div class="mcq-skill-desc">${data.description}</div>
              <div class="mcq-skill-meta">
                <span class="mcq-meta-tag">20 Questions</span>
                <span class="mcq-meta-tag">30s / Q</span>
              </div>
              <div class="mcq-skill-arrow">→</div>
            </button>
          `).join('')}
        </div>
        <div class="mcq-selector-footer">
          <span>📊 120 Total Questions</span>
          <span>⏱ Timed Assessment</span>
          <span>🏆 Instant Results</span>
          <span>📱 Placement Ready</span>
        </div>
      </div>`;
    body.querySelectorAll('.mcq-skill-card').forEach(card => {
      card.addEventListener('click', () => this.startQuiz(card.dataset.skill));
    });
  }

  startQuiz(skillKey) {
    const skillData = PLACEMENT_MCQ_DATA[skillKey];
    if (!skillData) return;
    this.currentSkill = skillKey;
    this.questions    = skillData.questions;
    this.currentQIdx  = 0;
    this.userAnswers  = {};
    this.score        = 0;
    this.quizStarted  = true;
    this.quizFinished = false;
    this.renderQuizScreen();
    this.renderQuestion();
  }

  renderQuizScreen() {
    const body = document.getElementById('mcqModalBody');
    const sd   = PLACEMENT_MCQ_DATA[this.currentSkill];
    if (!body || !sd) return;
    body.innerHTML = `
      <div class="mcq-quiz-screen" id="mcqQuizScreen">
        <div class="mcq-hud">
          <button class="mcq-back-btn" id="mcqBackToSkillsBtn">← Skills</button>
          <div class="mcq-hud-center">
            <span class="mcq-skill-badge" style="background:linear-gradient(135deg,${sd.color}22,${sd.color}44);border-color:${sd.color};">
              ${sd.icon} ${sd.name}
            </span>
          </div>
          <div class="mcq-hud-right">
            <div class="mcq-score-hud">
              <span class="mcq-score-label">SCORE</span>
              <span class="mcq-score-val" id="mcqLiveScore">0</span>
            </div>
            <div class="mcq-timer-hud" id="mcqTimerHud">
              <span class="mcq-timer-icon">⏱</span>
              <span class="mcq-timer-val" id="mcqTimerVal">30</span>
            </div>
          </div>
        </div>
        <div class="mcq-progress-wrap">
          <div class="mcq-progress-bar">
            <div class="mcq-progress-fill" id="mcqProgressFill" style="width:0%"></div>
          </div>
          <span class="mcq-progress-label" id="mcqProgressLabel">Q 1 / 20</span>
        </div>
        <div class="mcq-question-area" id="mcqQuestionArea"></div>
        <div class="mcq-nav-bar">
          <button class="mcq-nav-btn" id="mcqPrevBtn" disabled>◀ Prev</button>
          <div class="mcq-q-dots" id="mcqQDots">
            ${this.questions.map((_,i) => `<span class="mcq-dot" id="mcqDot_${i}" data-qi="${i}"></span>`).join('')}
          </div>
          <button class="mcq-nav-btn mcq-next-btn" id="mcqNextBtn">Next ▶</button>
        </div>
        <div style="text-align:center;margin-top:0.75rem;">
          <button class="mcq-submit-btn" id="mcqSubmitBtn">🏁 Submit Quiz &amp; See Results</button>
        </div>
      </div>`;

    document.getElementById('mcqBackToSkillsBtn').addEventListener('click', () => { this.clearTimer(); this.renderSkillSelector(); });
    document.getElementById('mcqPrevBtn').addEventListener('click', () => this.goTo(this.currentQIdx - 1));
    document.getElementById('mcqNextBtn').addEventListener('click', () => this.goTo(this.currentQIdx + 1));
    document.getElementById('mcqSubmitBtn').addEventListener('click', () => this.confirmSubmit());
    document.querySelectorAll('.mcq-dot').forEach(dot => dot.addEventListener('click', () => this.goTo(parseInt(dot.dataset.qi))));
  }

  renderQuestion() {
    const q    = this.questions[this.currentQIdx];
    const area = document.getElementById('mcqQuestionArea');
    if (!q || !area) return;
    const chosen = this.userAnswers[q.id] || null;
    area.innerHTML = `
      <div class="mcq-question-card">
        <div class="mcq-q-number-badge">Q${this.currentQIdx + 1}</div>
        <div class="mcq-q-text">${q.question}</div>
        <div class="mcq-options-grid" id="mcqOptionsGrid">
          ${Object.entries(q.options).map(([opt, text]) => `
            <button class="mcq-option-btn${chosen === opt ? ' mcq-option-selected' : ''}" data-opt="${opt}">
              <span class="mcq-opt-letter">${opt}</span>
              <span class="mcq-opt-text">${text}</span>
            </button>`).join('')}
        </div>
      </div>`;
    area.querySelectorAll('.mcq-option-btn').forEach(btn => btn.addEventListener('click', () => this.selectOption(q.id, btn.dataset.opt)));
    this.updateHUD();
    this.resetTimer();
  }

  selectOption(qid, opt) {
    this.userAnswers[qid] = opt;
    const grid = document.getElementById('mcqOptionsGrid');
    if (grid) grid.querySelectorAll('.mcq-option-btn').forEach(b => b.classList.toggle('mcq-option-selected', b.dataset.opt === opt));
    const dot = document.getElementById(`mcqDot_${this.currentQIdx}`);
    if (dot) dot.classList.add('mcq-dot-answered');
    const scoreEl = document.getElementById('mcqLiveScore');
    if (scoreEl) scoreEl.textContent = this.calculateCurrentScore();
    setTimeout(() => { if (this.currentQIdx < this.questions.length - 1) this.goTo(this.currentQIdx + 1); }, 600);
  }

  goTo(idx) {
    if (idx < 0 || idx >= this.questions.length) return;
    this.currentQIdx = idx;
    this.renderQuestion();
  }

  updateHUD() {
    const idx   = this.currentQIdx;
    const total = this.questions.length;
    const fill  = document.getElementById('mcqProgressFill');
    const label = document.getElementById('mcqProgressLabel');
    const prev  = document.getElementById('mcqPrevBtn');
    const next  = document.getElementById('mcqNextBtn');
    if (fill)  fill.style.width = `${((idx + 1) / total) * 100}%`;
    if (label) label.textContent = `Q ${idx + 1} / ${total}`;
    if (prev)  prev.disabled    = idx === 0;
    if (next)  { next.disabled = idx === total - 1; next.textContent = idx === total - 1 ? 'Last Q' : 'Next ▶'; }
    document.querySelectorAll('.mcq-dot').forEach((d, i) => d.classList.toggle('mcq-dot-active', i === idx));
  }

  calculateCurrentScore() {
    return this.questions.filter(q => this.userAnswers[q.id] === q.answer).length;
  }

  resetTimer() {
    this.clearTimer();
    this.timeLeft = 30;
    const el  = document.getElementById('mcqTimerVal');
    const hud = document.getElementById('mcqTimerHud');
    if (el)  el.textContent  = 30;
    if (hud) hud.classList.remove('mcq-timer-danger');
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      const t = document.getElementById('mcqTimerVal');
      if (t) t.textContent = this.timeLeft;
      const h = document.getElementById('mcqTimerHud');
      if (h) h.classList.toggle('mcq-timer-danger', this.timeLeft <= 10);
      if (this.timeLeft <= 0) {
        this.clearTimer();
        if (this.currentQIdx < this.questions.length - 1) setTimeout(() => this.goTo(this.currentQIdx + 1), 400);
      }
    }, 1000);
  }

  clearTimer() {
    if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
  }

  confirmSubmit() {
    const answered   = Object.keys(this.userAnswers).length;
    const unanswered = this.questions.length - answered;
    if (unanswered > 0) {
      const btn = document.getElementById('mcqSubmitBtn');
      if (btn) {
        btn.textContent = `⚠️ ${unanswered} unanswered — Submit anyway?`;
        btn.style.background    = 'rgba(255,180,0,0.2)';
        btn.style.borderColor   = 'var(--neon-gold)';
        btn.onclick = () => this.submitQuiz();
        return;
      }
    }
    this.submitQuiz();
  }

  submitQuiz() {
    this.clearTimer();
    this.quizFinished = true;
    this.score = this.calculateCurrentScore();
    this.renderResults();
  }

  renderResults() {
    const body = document.getElementById('mcqModalBody');
    const sd   = PLACEMENT_MCQ_DATA[this.currentSkill];
    if (!body || !sd) return;
    const total   = this.questions.length;
    const score   = this.score;
    const pct     = Math.round((score / total) * 100);
    const grade   = this.getGrade(pct);
    const wrong   = total - score - (total - Object.keys(this.userAnswers).length);
    const skipped = total - Object.keys(this.userAnswers).length;
    const circ    = 2 * Math.PI * 52;

    const reviewRows = this.questions.map((q, i) => {
      const chosen    = this.userAnswers[q.id];
      const isCorrect = chosen === q.answer;
      const isSkipped = !chosen;
      return `
        <div class="mcq-review-row ${isCorrect ? 'mcq-review-correct' : isSkipped ? 'mcq-review-skipped' : 'mcq-review-wrong'}">
          <div class="mcq-review-num">${i + 1}</div>
          <div class="mcq-review-info">
            <div class="mcq-review-q">${q.question}</div>
            <div class="mcq-review-ans">
              ${isSkipped
                ? `<span class="mcq-ans-tag mcq-ans-skipped">&#x23ED; Skipped</span>`
                : `<span class="mcq-ans-tag ${isCorrect ? 'mcq-ans-correct' : 'mcq-ans-wrong'}">Your: <strong>${chosen}</strong>. ${q.options[chosen]}</span>`}
              ${!isCorrect ? `<span class="mcq-ans-tag mcq-ans-key">&#10003; Correct: <strong>${q.answer}</strong>. ${q.options[q.answer]}</span>` : ''}
            </div>
          </div>
          <div class="mcq-review-icon">${isCorrect ? '&#9989;' : isSkipped ? '&#9197;' : '&#10060;'}</div>
        </div>`;
    }).join('');

    body.innerHTML = `
      <div class="mcq-results-screen">
        <div class="mcq-result-hero">
          <div class="mcq-result-grade-ring">
            <svg class="mcq-grade-svg" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" stroke="rgba(255,255,255,0.07)" stroke-width="10" fill="none"/>
              <circle cx="60" cy="60" r="52" stroke="${grade.color}" stroke-width="10" fill="none"
                stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - pct / 100)}"
                stroke-linecap="round" transform="rotate(-90 60 60)" style="transition:stroke-dashoffset 1.2s ease;"/>
            </svg>
            <div class="mcq-grade-center">
              <span class="mcq-grade-letter" style="color:${grade.color}">${grade.letter}</span>
              <span class="mcq-grade-pct">${pct}%</span>
            </div>
          </div>
          <div class="mcq-result-details">
            <div class="mcq-result-title">${grade.title}</div>
            <div class="mcq-result-skill-tag" style="color:${sd.color}">${sd.icon} ${sd.name} Assessment</div>
            <p class="mcq-result-msg">${grade.message}</p>
            <div class="mcq-stat-row">
              <div class="mcq-stat-chip mcq-stat-correct">&#9989; Correct: <strong>${score}</strong></div>
              <div class="mcq-stat-chip mcq-stat-wrong">&#10060; Wrong: <strong>${wrong}</strong></div>
              <div class="mcq-stat-chip mcq-stat-skip">&#9197; Skipped: <strong>${skipped}</strong></div>
              <div class="mcq-stat-chip mcq-stat-total">&#128203; Total: <strong>${total}</strong></div>
            </div>
          </div>
        </div>
        <div class="mcq-result-actions">
          <button class="mcq-action-btn mcq-retry-btn" id="mcqRetryBtn">&#128260; Retry ${sd.name}</button>
          <button class="mcq-action-btn mcq-change-skill-btn" id="mcqChangeSkillBtn">&#128218; Change Skill</button>
        </div>
        <div class="mcq-review-section">
          <h3 class="mcq-review-heading">&#128221; Detailed Question Review</h3>
          <div class="mcq-review-list">${reviewRows}</div>
        </div>
      </div>`;

    document.getElementById('mcqRetryBtn').addEventListener('click', () => this.startQuiz(this.currentSkill));
    document.getElementById('mcqChangeSkillBtn').addEventListener('click', () => { this.resetState(); this.renderSkillSelector(); });
    if (pct >= 70) this.launchConfetti();
  }

  getGrade(pct) {
    if (pct >= 90) return { letter: 'A+', color: '#00ff9d', title: '&#127942; Outstanding!',  message: 'Exceptional performance! You are placement-ready in this domain.' };
    if (pct >= 80) return { letter: 'A',  color: '#00f5ff', title: '&#11088; Excellent!',     message: 'Great work! Strong grasp of concepts. Keep the momentum.' };
    if (pct >= 70) return { letter: 'B',  color: '#8b5cf6', title: '&#128077; Good Job!',      message: 'Solid understanding. A little more revision will make you placement-ready.' };
    if (pct >= 60) return { letter: 'C',  color: '#fbbf24', title: '&#128214; Average',        message: 'Fair performance. Focus on weak areas and practise more.' };
    if (pct >= 40) return { letter: 'D',  color: '#f97316', title: '&#9888; Needs Work',       message: 'Below average. Revisit the core concepts and try again.' };
    return               { letter: 'F',  color: '#ef4444', title: '&#10071; Low Score',       message: "Don't give up! Study the topic thoroughly and retake the quiz." };
  }

  launchConfetti() {
    const colors = ['#00f5ff','#8b5cf6','#ec4899','#00ff9d','#ffd15c','#ffffff'];
    const container = document.getElementById('mcqModalBody');
    if (!container) return;
    for (let i = 0; i < 60; i++) {
      const p = document.createElement('div');
      p.className = 'mcq-confetti-piece';
      p.style.cssText = `left:${Math.random()*100}%;background:${colors[Math.floor(Math.random()*colors.length)]};width:${4+Math.random()*6}px;height:${4+Math.random()*6}px;animation-delay:${Math.random()*0.8}s;animation-duration:${1.5+Math.random()*1.5}s;`;
      container.appendChild(p);
      setTimeout(() => p.remove(), 3500);
    }
  }
}
