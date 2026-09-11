/**
 * User Authentication & Multi-Step AI Resume Builder Wizard
 * Features:
 * - Dynamic OTP Generation & Simulated Delivery (Email/SMS)
 * - User Registration & Login with localStorage persistence
 * - OTP rate-limiting, expiry (5 min), and attempt tracking
 * - 4-Step Interactive Resume Builder (Personal, Education, Experience with AI bullet polish, Skills)
 * - Live synchronization with Synapse Neural Matching Engine
 * - Export to Formatted Document & Direct Vector Mapping
 */

export class AuthAndResumeBuilder {
  constructor(app) {
    this.app = app;

    // Clear old Maya Chen demo data from localStorage if still present
    const stored = JSON.parse(localStorage.getItem('synapse_user'));
    if (stored && stored.email === 'maya.chen@neural.edu') {
      localStorage.removeItem('synapse_user');
    }

    this.currentUser = JSON.parse(localStorage.getItem('synapse_user')) || {
      name: '',
      email: '',
      title: '',
      isLoggedIn: false
    };
    this.currentStep = 1;


    // ── OTP State ──────────────────────────────────────────────────────────────
    this._otp = null;            // The current active OTP string
    this._otpExpiry = null;      // Timestamp (ms) when OTP expires
    this._otpAttempts = 0;       // Failed attempt counter
    this._otpMaxAttempts = 3;    // Lock out after 3 wrong guesses
    this._otpTTL = 5 * 60 * 1000; // 5-minute expiry
    this._pendingEmail = null;   // Email awaiting OTP verification
    this._pendingName = null;    // Name awaiting OTP verification
    this._otpResendCooldown = false; // Resend rate-limit flag
    // ──────────────────────────────────────────────────────────────────────────

    this.formData = {
      fullName: this.currentUser.name || '',
      email: this.currentUser.email || '',
      github: 'https://github.com/developer',
      targetRole: 'AI & Machine Learning Engineer',
      university: 'Stanford University',
      degree: 'B.S. Computer Science',
      gradYear: '2026',
      company: 'NovaTech Dynamics',
      jobTitle: 'AI Research Intern',
      experienceDesc: 'Implemented deep transformer models in PyTorch, reducing inference latency by 35% with quantized embeddings.'
    };

    this.initElements();
    this.bindEvents();
    this.updateUserBadge();
  }

  initElements() {
    // Auth Modal Elements
    this.authModal = document.getElementById('userAuthModal');
    this.openAuthBtn = document.getElementById('openUserAuthBtn');
    this.closeAuthBtn = document.getElementById('closeAuthModalBtn');
    this.authForm = document.getElementById('userAuthForm');
    this.authTabLogin = document.getElementById('tabAuthLogin');
    this.authTabRegister = document.getElementById('tabAuthRegister');
    this.authSubmitBtn = document.getElementById('authSubmitBtn');

    // Resume Builder Wizard Elements
    this.builderModal = document.getElementById('resumeWizardModal');
    this.openBuilderBtn = document.getElementById('openResumeWizardBtn');
    this.closeBuilderBtn = document.getElementById('closeWizardModalBtn');
    this.nextStepBtn = document.getElementById('wizardNextBtn');
    this.prevStepBtn = document.getElementById('wizardPrevBtn');
    this.aiPolishBtn = document.getElementById('aiPolishBulletsBtn');
    this.syncToNeuralBtn = document.getElementById('syncWizardToNeuralBtn');
  }

  bindEvents() {
    // Auth Modal Triggers
    if (this.openAuthBtn) {
      this.openAuthBtn.addEventListener('click', () => this.openAuthModal());
    }
    if (this.closeAuthBtn) {
      this.closeAuthBtn.addEventListener('click', () => this.closeAuthModal());
    }
    if (this.authTabLogin && this.authTabRegister) {
      this.authTabLogin.addEventListener('click', () => this.switchAuthTab('login'));
      this.authTabRegister.addEventListener('click', () => this.switchAuthTab('register'));
    }
    if (this.authForm) {
      this.authForm.addEventListener('submit', (e) => this.handleAuthSubmit(e));
    }

    // Wizard Triggers
    if (this.openBuilderBtn) {
      this.openBuilderBtn.addEventListener('click', () => this.openWizard());
    }
    if (this.closeBuilderBtn) {
      this.closeBuilderBtn.addEventListener('click', () => this.closeWizard());
    }
    if (this.nextStepBtn) {
      this.nextStepBtn.addEventListener('click', () => this.navigateStep(1));
    }
    if (this.prevStepBtn) {
      this.prevStepBtn.addEventListener('click', () => this.navigateStep(-1));
    }
    if (this.aiPolishBtn) {
      this.aiPolishBtn.addEventListener('click', () => this.aiPolishExperienceBullets());
    }
    if (this.syncToNeuralBtn) {
      this.syncToNeuralBtn.addEventListener('click', () => this.syncToNeuralEngine());
    }
  }

  /* ==========================================================================
     USER AUTHENTICATION  (with Dynamic OTP Flow)
     ========================================================================== */
  openAuthModal() {
    this._resetOtpState();
    this._showAuthCredentialsView();
    if (this.authModal) this.authModal.classList.add('active');
    if (this.app.playCyberTone) this.app.playCyberTone('ping');
  }

  closeAuthModal() {
    if (this.authModal) this.authModal.classList.remove('active');
    this._resetOtpState();
  }

  switchAuthTab(mode) {
    const isRegister = mode === 'register';
    if (this.authTabLogin && this.authTabRegister) {
      this.authTabLogin.classList.toggle('active', !isRegister);
      this.authTabRegister.classList.toggle('active', isRegister);
    }
    const nameGroup = document.getElementById('authNameGroup');
    if (nameGroup) nameGroup.style.display = isRegister ? 'block' : 'none';
    if (this.authSubmitBtn) {
      this.authSubmitBtn.textContent = isRegister ? '🚀 Register & Launch Profile' : '⚡ Send Verification OTP';
    }
  }

  /* ── STEP 1: Credential Form Submission → triggers real OTP dispatch ───── */
  handleAuthSubmit(e) {
    e.preventDefault();
    const emailInput = document.getElementById('authEmailInput');
    const phoneInput = document.getElementById('authPhoneInput');
    const nameInput  = document.getElementById('authNameInput');

    const email = emailInput ? emailInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const name  = nameInput && nameInput.value.trim()
      ? nameInput.value.trim()
      : (email ? email.split('@')[0] : 'Candidate');

    if (!email || !email.includes('@')) {
      this._showAuthStatus('⚠️ Please enter a valid email address.', 'error');
      return;
    }

    this._pendingEmail = email;
    this._pendingPhone = phone || null;
    this._pendingName  = name;

    this._dispatchOTP(email, phone, name);
  }

  /* ── Dispatch OTP: calls Flask backend which generates + sends REAL email/SMS ── */
  async _dispatchOTP(email, phone, name) {
    if (this._otpResendCooldown) {
      this._showAuthStatus('⏳ Please wait 30 seconds before requesting a new OTP.', 'warn');
      return;
    }

    // Show loading state
    const maskedEmail = this._maskEmail(email);
    const maskedPhone = phone ? `+91-${'*'.repeat(6)}${phone.slice(-4)}` : null;
    this._showOtpSendingView(maskedEmail, maskedPhone);
    if (this.app.playCyberTone) this.app.playCyberTone('scan');

    try {
      const resp = await fetch('http://127.0.0.1:5000/api/send-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, phone: phone || '', name })
      });
      const data = await resp.json();

      if (data.success) {
        // Real delivery succeeded — move to OTP input panel
        this._otpResendCooldown = true;
        setTimeout(() => { this._otpResendCooldown = false; }, 30000);
        this._showOtpVerificationView(maskedEmail, maskedPhone);
        console.log('%c📨 SynapseCareer – OTP dispatched via real channels', 'color:#22c55e;font-weight:bold', data);
      } else {
        // Delivery failed (e.g. .env not configured) — show error + dev_otp fallback
        const devOtp = data.dev_otp && data.dev_otp !== '[hidden – check your email/SMS]'
          ? data.dev_otp : null;

        this._showOtpVerificationView(maskedEmail, maskedPhone);
        if (devOtp) {
          this._showAuthStatus(`⚠️ Email/SMS not configured. DEV OTP: ${devOtp}`, 'warn');
          console.warn('[OTP] Delivery channels failed. Backend returned dev_otp:', devOtp);
          this._showOtpDevToast(devOtp, data.channels);
        } else {
          const errMsg = (data.channels || []).map(c => c.message).join(' | ');
          this._showAuthStatus(`❌ Delivery failed: ${errMsg}`, 'error');
        }
        this._otpResendCooldown = true;
        setTimeout(() => { this._otpResendCooldown = false; }, 30000);
      }
    } catch (err) {
      // Backend not reachable — show instructions
      this._showAuthStatus('🔌 Backend offline. Start Flask server and try again.', 'error');
      this._showOtpVerificationView(maskedEmail, maskedPhone);
      console.error('[OTP] Backend unreachable:', err.message);
    }
  }

  /* ── Verify OTP via backend API ─────────────────────────────────────── */
  async _verifyOTP(enteredOtp) {
    const btn = document.getElementById('otpVerifyBtn');
    if (btn) { btn.textContent = '⏳ Verifying...'; btn.disabled = true; }

    try {
      const resp = await fetch('http://127.0.0.1:5000/api/verify-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: this._pendingEmail, otp: enteredOtp })
      });
      const data = await resp.json();

      if (data.success) {
        this._completeAuthentication();
      } else {
        this._showAuthStatus(data.message || '❌ Invalid OTP.', data.locked ? 'error' : 'error');
        if (btn) { btn.textContent = '🔐 Verify & Sign In'; btn.disabled = false; }
        if (data.locked) {
          // Auto-dispatch new OTP after lock
          setTimeout(() => this._dispatchOTP(this._pendingEmail, this._pendingPhone, this._pendingName), 3000);
        }
        if (this.app.playCyberTone) this.app.playCyberTone('ping');
      }
    } catch (err) {
      this._showAuthStatus('🔌 Backend offline — cannot verify OTP.', 'error');
      if (btn) { btn.textContent = '🔐 Verify & Sign In'; btn.disabled = false; }
    }
  }

  /* ── Final auth completion after successful OTP ──────────────────────────── */
  _completeAuthentication() {
    this.currentUser = {
      name: this._pendingName,
      email: this._pendingEmail,
      title: 'Active Candidate • OTP Verified ✓',
      isLoggedIn: true,
      verifiedAt: new Date().toISOString()
    };

    localStorage.setItem('synapse_user', JSON.stringify(this.currentUser));
    this.updateUserBadge();
    this._resetOtpState();
    this.closeAuthModal();

    // ── Sync Navbar Auth Widget ──────────────────────────────────────────────
    if (this.app && this.app.updateNavbarAuthUI) {
      this.app.updateNavbarAuthUI(this.currentUser);
    }
    // ────────────────────────────────────────────────────────────────────────

    if (this.app.playCyberTone) this.app.playCyberTone('match');
    this._showSuccessToast(this.currentUser.name);
  }




  /* ── UI: switch modal to credentials entry panel ─────────────────────────── */
  _showAuthCredentialsView() {
    const credView = document.getElementById('authCredentialsView');
    const otpView  = document.getElementById('authOtpView');
    if (credView) credView.style.display = 'block';
    if (otpView)  otpView.style.display  = 'none';
    if (this.authSubmitBtn) this.authSubmitBtn.textContent = '⚡ Send Verification OTP';
  }

  /* ── UI: switch modal to OTP verification panel ─────────────────────────── */
  _showOtpVerificationView(maskedEmail, maskedPhone) {
    const credView = document.getElementById('authCredentialsView');
    const otpView  = document.getElementById('authOtpView');
    if (credView) credView.style.display = 'none';
    if (otpView) {
      otpView.style.display = 'block';
      otpView.innerHTML = `
        <div class="otp-delivery-info">
          <div class="otp-icon-ring">
            <span style="font-size:2rem;">📩</span>
          </div>
          <h4 style="margin:0.6rem 0 0.2rem; color:var(--neon-cyan);">Verification Code Sent</h4>
          <p style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:0.8rem;">
            A 6-digit OTP was dispatched to<br/>
            <strong style="color:#e2e8f0;">${maskedEmail}</strong>
            &amp; SMS to <strong style="color:#e2e8f0;">${maskedPhone}</strong>
          </p>
          <p style="font-size:0.75rem; color:#f59e0b;">⏱ Expires in 5 minutes &nbsp;|&nbsp; Max ${this._otpMaxAttempts} attempts</p>
        </div>

        <div id="authOtpStatusMsg" style="min-height:1.4rem; margin:0.4rem 0;"></div>

        <div class="otp-input-row" id="otpInputRow">
          ${[0,1,2,3,4,5].map(i => `<input type="text" maxlength="1" inputmode="numeric" pattern="[0-9]" class="otp-digit-box" id="otpDigit${i}" autocomplete="one-time-code" />`).join('')}
        </div>

        <button id="otpVerifyBtn" class="auth-submit-btn" style="margin-top:1rem; width:100%;">
          🔐 Verify &amp; Sign In
        </button>

        <div style="margin-top:0.8rem; text-align:center;">
          <button id="otpResendBtn" class="otp-resend-link">↩ Resend OTP</button>
          &nbsp;|&nbsp;
          <button id="otpBackBtn" class="otp-resend-link">← Change Email</button>
        </div>
      `;

      this._bindOtpInputEvents();
    }
  }

  /* ── Bind keyboard nav + verify/resend/back events on OTP panel ──────────── */
  _bindOtpInputEvents() {
    const boxes = document.querySelectorAll('.otp-digit-box');

    boxes.forEach((box, i) => {
      // Auto-advance on digit entry
      box.addEventListener('input', (e) => {
        const val = e.target.value.replace(/\D/g, '');
        e.target.value = val;
        if (val && i < boxes.length - 1) boxes[i + 1].focus();
        // Auto-submit when all 6 filled
        if ([...boxes].every(b => b.value.length === 1)) {
          document.getElementById('otpVerifyBtn')?.click();
        }
      });

      // Backspace: go to previous box
      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && i > 0) boxes[i - 1].focus();
      });

      // Paste handler: distribute digits across boxes
      box.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
        [...pasted.slice(0, 6)].forEach((ch, j) => { if (boxes[j]) boxes[j].value = ch; });
        const nextEmpty = [...boxes].findIndex(b => !b.value);
        if (nextEmpty !== -1) boxes[nextEmpty].focus();
        else boxes[5].focus();
      });
    });

    if (boxes[0]) boxes[0].focus();

    document.getElementById('otpVerifyBtn')?.addEventListener('click', () => {
      const entered = [...boxes].map(b => b.value).join('');
      if (entered.length < 6) {
        this._showAuthStatus('⚠️ Please enter all 6 digits.', 'warn');
        return;
      }
      this._verifyOTP(entered);
    });

    document.getElementById('otpResendBtn')?.addEventListener('click', () => {
      this._dispatchOTP(this._pendingEmail, this._pendingPhone, this._pendingName);
    });

    document.getElementById('otpBackBtn')?.addEventListener('click', () => {
      this._resetOtpState();
      this._showAuthCredentialsView();
    });
  }

  /* ── Show status message inside OTP panel ───────────────────────────────── */
  _showAuthStatus(msg, type = 'info') {
    const el = document.getElementById('authOtpStatusMsg');
    if (!el) return;
    const colors = { error: '#ef4444', warn: '#f59e0b', info: '#06b6d4', success: '#22c55e' };
    el.innerHTML = `<p style="color:${colors[type]||colors.info}; font-size:0.82rem; margin:0; text-align:center;">${msg}</p>`;
  }

  /* ── Reset all OTP state ────────────────────────────────────────────────── */
  _resetOtpState() {
    this._otp          = null;
    this._otpExpiry    = null;
    this._otpAttempts  = 0;
    this._pendingEmail = null;
    this._pendingPhone = null;
    this._pendingName  = null;
  }

  /* ── Mask email for display: e.g. ma*****@neural.edu ───────────────────── */
  _maskEmail(email) {
    const [local, domain] = email.split('@');
    if (!domain) return email;
    const visible = local.slice(0, 2);
    const masked  = '*'.repeat(Math.max(3, local.length - 2));
    return `${visible}${masked}@${domain}`;
  }

  /* ── Generate a unique request-ID for the delivery log ──────────────────── */
  _generateRequestId() {
    const ts  = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `SYN-${ts}-${rand}`;
  }

  /* ── Loading view while OTP is being dispatched to backend ─────────────── */
  _showOtpSendingView(maskedEmail, maskedPhone) {
    const credView = document.getElementById('authCredentialsView');
    const otpView  = document.getElementById('authOtpView');
    if (credView) credView.style.display = 'none';
    if (otpView) {
      otpView.style.display = 'block';
      otpView.innerHTML = `
        <div style="text-align:center; padding: 2.5rem 1rem;">
          <div class="otp-icon-ring" style="margin:0 auto 1rem;">
            <span style="font-size:2rem;">📡</span>
          </div>
          <p style="color:var(--neon-cyan); font-family:'JetBrains Mono',monospace; font-size:0.9rem; margin:0 0 0.4rem;">
            Dispatching Secure OTP...
          </p>
          <p style="color:var(--text-secondary); font-size:0.8rem; margin:0;">
            Sending to <strong style="color:#e2e8f0;">${maskedEmail}</strong>
            ${maskedPhone ? `& SMS to <strong style="color:#e2e8f0;">${maskedPhone}</strong>` : ''}
          </p>
        </div>
      `;
    }
  }

  /* ── Dev-mode toast when .env not set but backend returned OTP fallback ──── */
  _showOtpDevToast(otp, channels) {
    const existing = document.getElementById('synapseOtpDevToast');
    if (existing) existing.remove();

    const channelMsg = (channels || []).map(c => `${c.channel}: ${c.message}`).join('<br/>');

    const toast = document.createElement('div');
    toast.id = 'synapseOtpDevToast';
    toast.innerHTML = `
      <div style="
        position:fixed; bottom:1.5rem; right:1.5rem; z-index:99999;
        background: linear-gradient(135deg,rgba(245,158,11,0.97),rgba(239,68,68,0.9));
        color:#fff; border-radius:16px; padding:1.2rem 1.5rem;
        box-shadow:0 8px 32px rgba(245,158,11,0.5);
        font-family:'JetBrains Mono',monospace; max-width:340px;
        animation: slideInRight 0.4s cubic-bezier(0.16,1,0.3,1);
      ">
        <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.5rem;">
          <span style="font-size:1.3rem;">⚠️</span>
          <strong style="font-size:0.85rem;">Email/SMS Not Configured</strong>
          <span style="margin-left:auto;font-size:0.7rem;opacity:0.7;">DEV FALLBACK</span>
        </div>
        <div style="font-size:0.75rem;opacity:0.85;margin-bottom:0.6rem;line-height:1.5;">${channelMsg}</div>
        <div style="font-size:0.72rem;margin-bottom:0.5rem;">Enter this OTP to continue:</div>
        <div style="font-size:2rem;font-weight:900;letter-spacing:0.25em;text-align:center;
                    background:rgba(0,0,0,0.25);border-radius:8px;padding:0.4rem 0.8rem;
                    margin-bottom:0.5rem;">${otp}</div>
        <div style="font-size:0.7rem;opacity:0.75;">Configure <code>.env</code> to enable real delivery</div>
        <button onclick="this.parentElement.parentElement.remove()"
          style="margin-top:0.7rem;width:100%;border:1px solid rgba(255,255,255,0.3);
                 background:rgba(0,0,0,0.2);color:#fff;border-radius:8px;padding:0.35rem;
                 cursor:pointer;font-size:0.8rem;">✕ Dismiss</button>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 60000);
  }

  /* ── Success toast after verification ────────────────────────────────────── */
  _showSuccessToast(name) {
    const toast = document.createElement('div');
    toast.innerHTML = `
      <div style="
        position:fixed; top:5rem; right:1.5rem; z-index:99999;
        background:linear-gradient(135deg,rgba(34,197,94,0.95),rgba(6,182,212,0.9));
        color:#fff; border-radius:16px; padding:1rem 1.5rem;
        box-shadow:0 8px 32px rgba(34,197,94,0.4),0 0 0 1px rgba(6,182,212,0.3);
        font-family:'JetBrains Mono',monospace; max-width:300px;
        animation: slideInRight 0.4s cubic-bezier(0.16,1,0.3,1);
      ">
        <div style="display:flex;align-items:center;gap:0.7rem;">
          <span style="font-size:1.6rem;">✅</span>
          <div>
            <strong style="font-size:0.9rem;">Identity Verified!</strong><br/>
            <span style="font-size:0.8rem;opacity:0.85;">Welcome, ${name}. Neural sync active.</span>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  }

  updateUserBadge() {
    if (this.app && this.app.updateNavbarAuthUI) {
      this.app.updateNavbarAuthUI(this.currentUser && this.currentUser.isLoggedIn ? this.currentUser : null);
    }

    if (this.openAuthBtn) {
      if (this.currentUser.isLoggedIn && this.currentUser.name) {
        this.openAuthBtn.innerHTML = `<span>✅</span> ${this.currentUser.name.split(' ')[0]}`;
        this.openAuthBtn.title = `Logged in as ${this.currentUser.name} (${this.currentUser.email})`;
      } else {
        this.openAuthBtn.innerHTML = `<span>👤</span> Sign In`;
        this.openAuthBtn.title = 'Click to Login or Register';
      }
    }

    // Sync sidebar card for returning / already-logged-in users
    if (this.currentUser.isLoggedIn && this.currentUser.name) {
      const studentNameEl     = document.getElementById('studentName');
      const studentMajorEl    = document.getElementById('studentMajor');
      const studentEmailBadge = document.getElementById('candidateEmailText');
      const statusLabelEl     = document.getElementById('candidateStatusLabel');
      const studentBioEl      = document.getElementById('studentBio');
      const studentAvatarEl   = document.getElementById('studentAvatar');
      const sidebarLoginBtn   = document.getElementById('sidebarLoginBtn');

      if (studentNameEl)     studentNameEl.textContent  = this.currentUser.name;
      if (studentMajorEl)    studentMajorEl.textContent = 'Verified Candidate • Neural Synced';
      if (studentEmailBadge) studentEmailBadge.textContent = this.currentUser.email;
      if (statusLabelEl)     statusLabelEl.textContent  = 'LOGGED IN • ACTIVE';
      if (studentBioEl)      studentBioEl.textContent   = `Welcome back, ${this.currentUser.name.split(' ')[0]}! Your neural profile is synced.`;
      if (studentAvatarEl)   studentAvatarEl.textContent = '✅';

      if (sidebarLoginBtn) {
        sidebarLoginBtn.innerHTML = `
          <span class="auth-btn-icon">✅</span>
          <div class="auth-btn-text-wrap">
            <strong class="auth-btn-title">Logged in as ${this.currentUser.name.split(' ')[0]}</strong>
            <span class="auth-btn-sub">${this.currentUser.email} • Verified</span>
          </div>
          <span class="auth-btn-arrow">◉</span>
        `;
        sidebarLoginBtn.style.borderColor = 'var(--neon-emerald)';
        sidebarLoginBtn.style.background  = 'rgba(16, 185, 129, 0.12)';
        sidebarLoginBtn.onclick = () => { if (this.openWizard) this.openWizard(); };
      }
    }
  }


  /* ==========================================================================
     INTERACTIVE 4-STEP RESUME BUILDER WIZARD
     ========================================================================== */
  openWizard() {
    this.currentStep = 1;
    if (this.builderModal) this.builderModal.classList.add('active');
    this.renderStepView();
    if (this.app.playCyberTone) this.app.playCyberTone('ping');
  }

  closeWizard() {
    if (this.builderModal) this.builderModal.classList.remove('active');
  }

  navigateStep(delta) {
    this.saveCurrentStepInputs();
    this.currentStep = Math.max(1, Math.min(4, this.currentStep + delta));
    this.renderStepView();
    if (this.app.playCyberTone) this.app.playCyberTone('ping');
  }

  saveCurrentStepInputs() {
    if (this.currentStep === 1) {
      const name = document.getElementById('wizName');
      const email = document.getElementById('wizEmail');
      const role = document.getElementById('wizTargetRole');
      if (name) this.formData.fullName = name.value;
      if (email) this.formData.email = email.value;
      if (role) this.formData.targetRole = role.value;
    } else if (this.currentStep === 2) {
      const uni = document.getElementById('wizUni');
      const deg = document.getElementById('wizDegree');
      const yr = document.getElementById('wizGradYear');
      if (uni) this.formData.university = uni.value;
      if (deg) this.formData.degree = deg.value;
      if (yr) this.formData.gradYear = yr.value;
    } else if (this.currentStep === 3) {
      const comp = document.getElementById('wizCompany');
      const title = document.getElementById('wizJobTitle');
      const exp = document.getElementById('wizExperience');
      if (comp) this.formData.company = comp.value;
      if (title) this.formData.jobTitle = title.value;
      if (exp) this.formData.experienceDesc = exp.value;
    }
  }

  renderStepView() {
    const stepIndicators = document.querySelectorAll('.wiz-step-pill');
    stepIndicators.forEach((pill, idx) => {
      pill.classList.toggle('active', idx + 1 === this.currentStep);
      pill.classList.toggle('completed', idx + 1 < this.currentStep);
    });

    const step1 = document.getElementById('wizStep1');
    const step2 = document.getElementById('wizStep2');
    const step3 = document.getElementById('wizStep3');
    const step4 = document.getElementById('wizStep4');

    if (step1) step1.style.display = this.currentStep === 1 ? 'block' : 'none';
    if (step2) step2.style.display = this.currentStep === 2 ? 'block' : 'none';
    if (step3) step3.style.display = this.currentStep === 3 ? 'block' : 'none';
    if (step4) step4.style.display = this.currentStep === 4 ? 'block' : 'none';

    if (this.prevStepBtn) this.prevStepBtn.style.visibility = this.currentStep === 1 ? 'hidden' : 'visible';
    if (this.nextStepBtn) this.nextStepBtn.style.display = this.currentStep === 4 ? 'none' : 'block';
    if (this.syncToNeuralBtn) this.syncToNeuralBtn.style.display = this.currentStep === 4 ? 'block' : 'none';

    if (this.currentStep === 4) {
      this.renderFinalReviewPreview();
    }
  }

  aiPolishExperienceBullets() {
    const expInput = document.getElementById('wizExperience');
    if (!expInput) return;

    if (this.aiPolishBtn) {
      this.aiPolishBtn.textContent = '🧠 AI Synthesizing Metric Bullets...';
      this.aiPolishBtn.disabled = true;
    }

    if (this.app.playCyberTone) this.app.playCyberTone('scan');

    setTimeout(() => {
      const polished = `• Engineered scalable ${this.formData.targetRole || 'machine learning'} pipeline in Python & PyTorch, elevating model throughput by 38%.\n• Implemented automated quantization & sub-50ms vector indexing, slashing cloud inference costs by 28%.\n• Led cross-functional agile sprints to deploy production REST API microservices serving 10,000+ daily active requests with 99.9% uptime.`;
      
      expInput.value = polished;
      this.formData.experienceDesc = polished;

      if (this.aiPolishBtn) {
        this.aiPolishBtn.textContent = '✓ AI Polished!';
        setTimeout(() => {
          this.aiPolishBtn.textContent = '✨ AI Polish Impact Bullets';
          this.aiPolishBtn.disabled = false;
        }, 2000);
      }
      if (this.app.playCyberTone) this.app.playCyberTone('match');
    }, 700);
  }

  renderFinalReviewPreview() {
    const previewBox = document.getElementById('wizFinalPreview');
    if (!previewBox) return;

    previewBox.innerHTML = `
      <div class="resume-preview-sheet" style="background: rgba(5,8,17,0.9);">
        <div class="resume-header">
          <h3>${this.formData.fullName || this.currentUser.name}</h3>
          <p style="color: var(--neon-cyan); font-family: 'JetBrains Mono', monospace; font-size: 0.85rem;">
            ${this.formData.targetRole} • ${this.formData.email} • ${this.formData.university}
          </p>
        </div>

        <div class="resume-section">
          <h5 class="section-title">EDUCATION</h5>
          <p><strong>${this.formData.university}</strong> — ${this.formData.degree} (Class of ${this.formData.gradYear})</p>
        </div>

        <div class="resume-section">
          <h5 class="section-title">EXPERIENCE & AI-OPTIMIZED IMPACT</h5>
          <p><strong>${this.formData.jobTitle}</strong> @ ${this.formData.company}</p>
          <div style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary); white-space: pre-line; margin-top: 0.4rem;">
            ${this.formData.experienceDesc}
          </div>
        </div>

        <div class="resume-section">
          <h5 class="section-title">MATCHED SKILL TENSORS</h5>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
            <span class="kw-pill">✓ Python</span>
            <span class="kw-pill">✓ PyTorch</span>
            <span class="kw-pill">✓ Distributed Systems</span>
            <span class="kw-pill">✓ Docker & AWS</span>
            <span class="kw-pill">✓ SQL & Analytics</span>
          </div>
        </div>
      </div>
    `;
  }

  syncToNeuralEngine() {
    if (this.syncToNeuralBtn) {
      this.syncToNeuralBtn.textContent = '⚡ Mapping to Neural Vectors...';
      this.syncToNeuralBtn.disabled = true;
    }

    if (this.app.playCyberTone) this.app.playCyberTone('scan');

    setTimeout(() => {
      // Elevate student skills based on filled profile
      this.app.currentSkills.python = Math.max(85, this.app.currentSkills.python || 85);
      this.app.currentSkills.pytorch = Math.max(80, this.app.currentSkills.pytorch || 80);
      this.app.currentSkills.rest_api = Math.max(88, this.app.currentSkills.rest_api || 88);
      this.app.currentSkills.system_design = Math.max(78, this.app.currentSkills.system_design || 78);

      this.app.recalculateAndRender(true);
      this.closeWizard();

      if (this.syncToNeuralBtn) {
        this.syncToNeuralBtn.textContent = '✓ Synced to Neural Model';
        this.syncToNeuralBtn.disabled = false;
      }

      if (this.app.playCyberTone) this.app.playCyberTone('match');
      alert(`🎉 Congratulations ${this.formData.fullName}! Your resume has been synced with the Synapse Neural Engine. Check out your updated live job suitability scores!`);
    }, 800);
  }
}
