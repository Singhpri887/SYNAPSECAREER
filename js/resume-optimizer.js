/**
 * Evolving Resume Optimizer & Automated 1-Click AI Application Module
 * Features:
 * - Real-time role-adapted ATS resume tailoring
 * - Before & After match score comparison (e.g. 66% -> 97%)
 * - Glowing keyword diff highlighting & bullet generator
 * - Automated 1-Click AI Application submission pipeline with portal handshake simulation
 * - Application history tracking
 */

import { JOB_DATABASE } from './job-data.js';

export class ResumeOptimizer {
  constructor(app) {
    this.app = app;
    this.currentJobId = JOB_DATABASE[0].id;
    this.appliedJobs = new Set();
    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.optimizerModal = document.getElementById('resumeOptimizerModal');
    this.openOptimizerBtn = document.getElementById('openResumeOptimizerBtn');
    this.closeOptimizerBtn = document.getElementById('closeOptimizerModalBtn');
    this.targetRoleSelect = document.getElementById('optimizerRoleSelect');
    this.copyResumeBtn = document.getElementById('copyOptimizedResumeBtn');

    // Auto-apply elements
    this.autoApplyModal = document.getElementById('autoApplyModal');
    this.closeAutoApplyBtn = document.getElementById('closeAutoApplyBtn');
  }

  bindEvents() {
    if (this.openOptimizerBtn) {
      this.openOptimizerBtn.addEventListener('click', () => this.openOptimizer());
    }
    if (this.closeOptimizerBtn) {
      this.closeOptimizerBtn.addEventListener('click', () => this.closeOptimizer());
    }
    if (this.targetRoleSelect) {
      this.targetRoleSelect.addEventListener('change', (e) => {
        this.currentJobId = e.target.value;
        this.renderOptimizerContent();
        if (this.app.playCyberTone) this.app.playCyberTone('ping');
      });
    }
    if (this.copyResumeBtn) {
      this.copyResumeBtn.addEventListener('click', () => this.copyToClipboard());
    }
    if (this.closeAutoApplyBtn) {
      this.closeAutoApplyBtn.addEventListener('click', () => this.closeAutoApply());
    }
  }

  openOptimizer(jobId = null) {
    if (jobId) this.currentJobId = jobId;
    if (this.targetRoleSelect) {
      this.targetRoleSelect.innerHTML = JOB_DATABASE.map(job => `
        <option value="${job.id}" ${job.id === this.currentJobId ? 'selected' : ''}>
          ${job.title} (${job.company})
        </option>
      `).join('');
    }
    this.renderOptimizerContent();
    if (this.optimizerModal) this.optimizerModal.classList.add('active');
    if (this.app.playCyberTone) this.app.playCyberTone('match');
  }

  closeOptimizer() {
    if (this.optimizerModal) this.optimizerModal.classList.remove('active');
  }

  renderOptimizerContent() {
    const job = JOB_DATABASE.find(j => j.id === this.currentJobId) || JOB_DATABASE[0];
    const student = this.app.currentArchetype;
    const skills = this.app.currentSkills;

    // Calculate baseline and optimized scores
    const baseEval = this.app.matchingEngine.evaluateSingleJob(job, skills);
    const beforeScore = baseEval.overallScore;
    const afterScore = Math.min(99, Math.max(92, beforeScore + 18));

    const beforeScoreEl = document.getElementById('optBeforeScore');
    const afterScoreEl = document.getElementById('optAfterScore');
    if (beforeScoreEl) beforeScoreEl.textContent = `${beforeScore}%`;
    if (afterScoreEl) afterScoreEl.textContent = `${afterScore}%`;

    // Generate Tailored Keywords & Bullets
    const keywordsContainer = document.getElementById('optKeywordsList');
    if (keywordsContainer) {
      keywordsContainer.innerHTML = job.requiredSkills.map(req => {
        const hasSkill = (skills[req.id] || 0) >= req.minLevel;
        return `
          <span class="tag-mini ${hasSkill ? 'tag-met' : 'tag-optimized'}">
            ⚡ ${req.id.replace('_', ' ').toUpperCase()} (Target: ${req.minLevel}%)
          </span>
        `;
      }).join('');
    }

    // Tailored Resume Body
    const tailoredBody = document.getElementById('optTailoredResumeBody');
    if (tailoredBody) {
      tailoredBody.innerHTML = `
        <div class="resume-preview-sheet">
          <div class="resume-header">
            <h3>${student.name}</h3>
            <p style="color: var(--neon-cyan); font-family: 'JetBrains Mono', monospace; font-size: 0.85rem;">
              ${job.title} Candidate • ${student.title}
            </p>
          </div>

          <div class="resume-section">
            <h5 class="section-title">TARGETED PROFESSIONAL SUMMARY</h5>
            <p>
              High-impact technologist specializing in 
              <span class="kw-highlight">${job.requiredSkills.slice(0, 3).map(s => s.id.replace('_', ' ')).join(', ')}</span>.
              Demonstrated success analyzing complex data streams, architecting production pipelines, and accelerating delivery cycles.
            </p>
          </div>

          <div class="resume-section">
            <h5 class="section-title">AI-OPTIMIZED PROJECT & IMPACT BULLETS</h5>
            <ul class="bullet-list">
              <li>
                Engineered end-to-end <span class="kw-highlight">${job.title}</span> pipeline utilizing <span class="kw-highlight">Python & modern cloud frameworks</span>, improving model inference throughput by <strong>38%</strong>.
              </li>
              <li>
                Formulated automated evaluation benchmarks for <span class="kw-highlight">${job.requiredSkills[0].id.replace('_', ' ')}</span>, minimizing data latency and reducing computational overhead by <strong>25%</strong>.
              </li>
              <li>
                Collaborated in cross-functional agile sprints to deploy scalable REST services serving <strong>10,000+</strong> daily API requests with 99.9% uptime.
              </li>
            </ul>
          </div>

          <div class="resume-section">
            <h5 class="section-title">MATCHED CORE COMPETENCIES</h5>
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.4rem;">
              ${job.requiredSkills.map(s => `
                <span class="kw-pill">✓ ${s.id.replace('_', ' ')}</span>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }
  }

  copyToClipboard() {
    const job = JOB_DATABASE.find(j => j.id === this.currentJobId) || JOB_DATABASE[0];
    const student = this.app.currentArchetype;
    const text = `
${student.name}
Target: ${job.title} (${job.company})
Summary: High-impact technologist specializing in ${job.requiredSkills.map(s => s.id).join(', ')}.
Core Competencies: ${job.requiredSkills.map(s => s.id).join(', ')}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      if (this.copyResumeBtn) {
        this.copyResumeBtn.textContent = '✓ Copied to Clipboard!';
        setTimeout(() => {
          this.copyResumeBtn.textContent = '📋 Copy Tailored Text';
        }, 2000);
      }
    });
  }

  /* ==========================================================================
     Automated 1-Click AI Application Pipeline
     ========================================================================== */
  triggerAutoApply(jobId) {
    const job = JOB_DATABASE.find(j => j.id === jobId);
    if (!job) return;

    if (this.app.playCyberTone) this.app.playCyberTone('scan');

    const modal = this.autoApplyModal;
    const content = document.getElementById('autoApplyContent');
    if (!modal || !content) return;

    modal.classList.add('active');

    // Run telemetry stages simulation
    content.innerHTML = `
      <div class="modal-header">
        <div>
          <span class="tier-pill tier-high">AUTOMATED AI APPLICATION PIPELINE</span>
          <h2 style="font-size: 1.4rem; margin-top: 0.35rem; color: #ffffff;">Applying to ${job.title}</h2>
          <p style="font-size: 0.82rem; color: var(--neon-cyan); font-family: 'JetBrains Mono', monospace;">Target Gateway: ${job.company} Talent Portal</p>
        </div>
        <button class="modal-close-btn" id="closeAutoApplyBtnTop">✕</button>
      </div>

      <div class="modal-body" style="padding: 2rem;">
        <!-- Visualizer Handshake Stream -->
        <div class="handshake-stream-box" id="handshakeStream">
          <div class="stream-line active">▶ [1/4] Synthesizing student vector embedding & generating targeted cover letter...</div>
          <div class="stream-line" id="line2">▶ [2/4] Encrypting candidate portfolio & verifying cryptographic token...</div>
          <div class="stream-line" id="line3">▶ [3/4] Handshake with ${job.company} talent gateway protocol...</div>
          <div class="stream-line" id="line4">▶ [4/4] Application successfully delivered & logged into talent pipeline!</div>
        </div>

        <div class="auto-apply-progress-bar">
          <div class="progress-fill" id="applyProgressFill"></div>
        </div>

        <div id="applyOutcomeBox" style="display: none; margin-top: 1.5rem;">
          <div style="background: rgba(0, 255, 157, 0.08); border: 1px solid var(--neon-emerald); padding: 1.25rem; border-radius: 12px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h4 style="color: var(--neon-emerald); font-size: 1.05rem;">✓ Application Successfully Filed!</h4>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.25rem;">
                Tracking ID: <strong>#SYN-${Math.floor(1000 + Math.random() * 9000)}</strong> • Status: <span style="color: var(--neon-cyan);">In Review</span>
              </p>
            </div>
            <button class="parse-submit-btn" id="doneAutoApplyBtn" style="padding: 0.6rem 1.2rem;">
              Done
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('closeAutoApplyBtnTop').addEventListener('click', () => this.closeAutoApply());

    const fill = document.getElementById('applyProgressFill');
    const line2 = document.getElementById('line2');
    const line3 = document.getElementById('line3');
    const line4 = document.getElementById('line4');
    const outcomeBox = document.getElementById('applyOutcomeBox');

    setTimeout(() => {
      fill.style.width = '35%';
      line2.classList.add('active');
      if (this.app.playCyberTone) this.app.playCyberTone('ping');
    }, 700);

    setTimeout(() => {
      fill.style.width = '70%';
      line3.classList.add('active');
      if (this.app.playCyberTone) this.app.playCyberTone('ping');
    }, 1500);

    setTimeout(() => {
      fill.style.width = '100%';
      line4.classList.add('active');
      line4.classList.add('success');
      outcomeBox.style.display = 'block';
      this.appliedJobs.add(jobId);
      this.app.renderJobCards(this.app.latestRanked);
      if (this.app.playCyberTone) this.app.playCyberTone('match');

      const doneBtn = document.getElementById('doneAutoApplyBtn');
      if (doneBtn) doneBtn.addEventListener('click', () => this.closeAutoApply());
    }, 2300);
  }

  closeAutoApply() {
    if (this.autoApplyModal) this.autoApplyModal.classList.remove('active');
  }
}
