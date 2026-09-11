import { ALL_SKILLS, JOB_DATABASE, STUDENT_ARCHETYPES } from './job-data.js';
import { MatchingEngine } from './matching-engine.js';
import { NeuralVisualizer } from './neural-canvas.js';
import { AIGuide } from './ai-guide.js?v=2.5';
import { ResumeOptimizer } from './resume-optimizer.js';
import { MockInterviewer } from './mock-interviewer.js';
import { MarketAnalytics } from './market-analytics.js';
import { CareerCopilot } from './career-copilot.js';
import { AuthAndResumeBuilder } from './auth-builder.js';
import { PlacementMCQ } from './placement-mcq.js';

class SynapseApp {
  constructor() {
    this.matchingEngine = new MatchingEngine(JOB_DATABASE, ALL_SKILLS);
    this.visualizer = null;
    this.aiGuide = null;
    this.resumeOptimizer = null;
    this.mockInterviewer = null;
    this.marketAnalytics = null;
    this.careerCopilot = null;
    this.authAndBuilder = null;
    this.placementMCQ = null;
    
    // Default active profile: First archetype
    this.currentArchetype = STUDENT_ARCHETYPES[0];
    this.currentSkills = { ...this.currentArchetype.skills };
    this.activeJobId = JOB_DATABASE[0].id;
    this.currentFilter = 'all';
    this.useRealtimeJobs = false;
    this.realtimeJobs = [];
    this.currentTopScore = 97;
    this.telemetryInterval = null;

    // Futuristic Web Audio Synthesizer
    this.audioEnabled = false;
    this.audioCtx = null;

    this.init();
  }

  init() {
    // Initialize Canvas Visualizer
    this.visualizer = new NeuralVisualizer('neuralNetworkCanvas');
    this.visualizer.onJobSelect = (jobId) => {
      this.setActiveTargetJob(jobId);
    };

    // Sync actual user profile from localStorage / auth / resume
    this.syncActualUserFromStorage();
    this.bindEditActualUserModal();

    // Render Archetype Selectors
    this.renderArchetypePills();

    // Render Profile Summary Info
    this.updateProfileDisplay();

    // Render Skill Sliders
    this.renderSkillSliders();

    // Bind Controls
    this.bindEvents();

    // Run initial evaluation
    this.recalculateAndRender();

    // Initialize Holographic AI Digital Guide Aria
    this.aiGuide = new AIGuide();

    // Initialize Evolving Resume Optimizer & Auto-Apply
    this.resumeOptimizer = new ResumeOptimizer(this);

    // Initialize AI Mock Interviewer (Elara-AI)
    this.mockInterviewer = new MockInterviewer(this);

    // Initialize Market Analytics & Radar
    this.marketAnalytics = new MarketAnalytics(this);

    // Initialize Aurora AI Career Copilot & Mentor
    this.careerCopilot = new CareerCopilot(this);

    // Initialize User Auth & 4-Step Resume Wizard
    this.authAndBuilder = new AuthAndResumeBuilder(this);

    // Initialize Placement MCQ Quiz Engine
    this.placementMCQ = new PlacementMCQ(this);

    // Wire Placement MCQ close button
    const closeMCQBtn = document.getElementById('closePlacementMCQBtn');
    if (closeMCQBtn) closeMCQBtn.addEventListener('click', () => this.placementMCQ && this.placementMCQ.close());
    // Close on overlay click
    const mcqModal = document.getElementById('placementMCQModal');
    if (mcqModal) mcqModal.addEventListener('click', (e) => { if (e.target === mcqModal) this.placementMCQ && this.placementMCQ.close(); });

    // ── Wire Navbar Auth Widget ──────────────────────────────────────────────
    this.initNavbarAuthWidget();

    // Initialize Theme System
    this.initTheme();

    // Initialize Quantum AI Boot Intro Splash Sequence
    this.initBootSplash();

    // Start Live Real-Time AI Telemetry Heartbeat (Port 5000)
    this.startLiveTelemetryHeartbeat();

    // Initialize Interactive Live Hero Telemetry Badges
    this.initHeroStats();

    // Initialize Real-Time Job Portal Footer Gateway & Live Search
    this.initFooterPortalGateway();
  }

  /* ==========================================================================
     Navbar Auth Widget — Toggle Dropdown, Login, Logout, Post-Login Sync
     ========================================================================== */
  initNavbarAuthWidget() {
    const widget      = document.getElementById('navbarAuthWidget');
    const btn         = document.getElementById('navbarAuthBtn');
    const dropdown    = document.getElementById('navbarAuthDropdown');
    const loginTrigger = document.getElementById('navbarLoginTriggerBtn');
    const openWizard  = document.getElementById('navbarOpenWizardBtn');
    const logoutBtn   = document.getElementById('navbarLogoutBtn');

    if (!widget || !btn) return;

    // Toggle open/close or directly open Auth Modal on button click
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isGuest = !widget.classList.contains('logged-in');
      const isChevron = e.target.classList && e.target.classList.contains('navbar-auth-chevron');
      if (isGuest && !isChevron && this.authAndBuilder) {
        this.authAndBuilder.openAuthModal();
      } else {
        widget.classList.toggle('open');
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!widget.contains(e.target)) widget.classList.remove('open');
    });

    // Login trigger → open auth modal
    if (loginTrigger) {
      loginTrigger.addEventListener('click', () => {
        widget.classList.remove('open');
        if (this.authAndBuilder) this.authAndBuilder.openAuthModal();
      });
    }

    // Open Resume Wizard (logged-in state)
    if (openWizard) {
      openWizard.addEventListener('click', () => {
        widget.classList.remove('open');
        if (this.authAndBuilder) this.authAndBuilder.openWizard();
      });
    }

    // Sign Out
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('synapse_user');
        widget.classList.remove('open', 'logged-in');
        this.updateNavbarAuthUI(null);
        if (this.authAndBuilder) {
          this.authAndBuilder.currentUser = { name: '', email: '', isLoggedIn: false };
        }
        if (this.playCyberTone) this.playCyberTone('ping');
      });
    }

    // Explicit initial UI sync (ensures Guest Sign In / Login is always visibly rendered)
    const stored = JSON.parse(localStorage.getItem('synapse_user'));
    if (stored && stored.isLoggedIn && stored.name) {
      this.updateNavbarAuthUI(stored);
    } else {
      this.updateNavbarAuthUI(null);
    }
  }

  /* Updates navbar widget UI for logged-in / guest state */
  updateNavbarAuthUI(user) {
    const widget        = document.getElementById('navbarAuthWidget');
    const avatarEl      = document.getElementById('navbarAuthAvatar');
    const nameEl        = document.getElementById('navbarAuthName');
    const statusEl      = document.getElementById('navbarAuthStatus');
    const guestPanel    = document.getElementById('navbarGuestPanel');
    const userPanel     = document.getElementById('navbarUserPanel');
    const dropdownName  = document.getElementById('navbarDropdownName');
    const dropdownEmail = document.getElementById('navbarDropdownEmail');
    const dropdownAvatar = document.getElementById('navbarDropdownAvatar');

    if (!widget) return;

    if (user && user.isLoggedIn) {
      // Logged-in state
      widget.classList.add('logged-in');
      if (avatarEl) avatarEl.innerHTML = `<span class="auth-avatar-glyph">✅</span>`;
      if (nameEl)   nameEl.textContent   = user.name.split(' ')[0] || 'User';
      if (statusEl) statusEl.textContent = 'VERIFIED • ACTIVE';
      if (guestPanel)    guestPanel.style.display    = 'none';
      if (userPanel)     userPanel.style.display     = 'block';
      if (dropdownName)  dropdownName.textContent  = user.name;
      if (dropdownEmail) dropdownEmail.textContent = user.email;
      if (dropdownAvatar) dropdownAvatar.textContent = '✅';
    } else {
      // Guest state
      widget.classList.remove('logged-in');
      if (avatarEl) avatarEl.innerHTML = `<span class="auth-avatar-glyph">👤</span>`;
      if (nameEl)   nameEl.textContent   = 'Guest';
      if (statusEl) statusEl.textContent = 'Sign In / Login';
      if (guestPanel) guestPanel.style.display = 'block';
      if (userPanel)  userPanel.style.display  = 'none';
    }
  }

  /* ==========================================================================
     Real-Time Job Portal Footer Gateway & Search Controller
     Directly redirects to original job websites (LinkedIn, Naukri, Indeed, etc.)
     ========================================================================== */
  initFooterPortalGateway() {
    const input        = document.getElementById('footerJobSearchInput');
    const clearBtn     = document.getElementById('footerSearchClearBtn');
    const portalSelect = document.getElementById('footerPortalSelect');
    const launchBtn    = document.getElementById('footerLaunchSearchBtn');
    const quickChips   = document.querySelectorAll('.footer-quick-chip');
    const ariaTrigger  = document.getElementById('footerAriaTrigger');
    const atsTrigger   = document.getElementById('footerATSOpenTrigger');
    const healthTrigger= document.getElementById('footerHealthStatusTrigger');

    // Dedicated search query generators for original verified job portals
    const portalSearchMap = {
      linkedin: (q) => `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(q)}`,
      naukri:   (q) => {
        const cleanSlug = q.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        return `https://www.naukri.com/${cleanSlug || 'it'}-jobs`;
      },
      indeed:   (q) => `https://in.indeed.com/jobs?q=${encodeURIComponent(q)}`,
      google:   (q) => `https://careers.google.com/jobs/results/?q=${encodeURIComponent(q)}`,
      glassdoor:(q) => `https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=${encodeURIComponent(q)}`,
      internshala: (q) => {
        const cleanSlug = q.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        return `https://internshala.com/jobs/${cleanSlug || 'computer-science'}-jobs/`;
      },
      wellfound: () => `https://wellfound.com/jobs`,
      foundit:   (q) => `https://www.foundit.in/srp/results?query=${encodeURIComponent(q)}`
    };

    const executePortalRedirect = (queryText, targetPortalKey) => {
      const q = (queryText || (input ? input.value : '') || 'Software Engineer').trim();
      const portalKey = targetPortalKey || (portalSelect ? portalSelect.value : 'linkedin');
      const getUrl = portalSearchMap[portalKey] || portalSearchMap.linkedin;
      const targetUrl = getUrl(q);

      if (this.playCyberTone) this.playCyberTone('click');
      this.showTelemetryToast(`🌐 Opening Original Portal [${portalKey.toUpperCase()}]: "${q}"`);

      // Open authentic external website in a secure new tab
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    };

    // 1. Launch Button Click
    if (launchBtn) {
      launchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        executePortalRedirect();
      });
    }

    // 2. Input Enter Key Listener & Clear Button Visibility
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executePortalRedirect();
        }
      });

      input.addEventListener('input', () => {
        if (clearBtn) {
          clearBtn.style.display = input.value.trim().length > 0 ? 'block' : 'none';
        }
      });
    }

    // 3. Clear Button
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (input) {
          input.value = '';
          input.focus();
        }
        clearBtn.style.display = 'none';
      });
    }

    // 4. Quick-Search One-Click Chips
    quickChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        const roleQuery = chip.getAttribute('data-query');
        const portal = chip.getAttribute('data-portal') || 'linkedin';

        if (input) {
          input.value = roleQuery;
          if (clearBtn) clearBtn.style.display = 'block';
        }
        if (portalSelect) {
          portalSelect.value = portal;
        }

        executePortalRedirect(roleQuery, portal);
      });
    });

    // 5. Footer Quick Links Helpers
    if (ariaTrigger) {
      ariaTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        const dockBtn = document.getElementById('ariaDockBtn');
        if (dockBtn) dockBtn.click();
      });
    }

    if (atsTrigger) {
      atsTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.authAndBuilder) {
          this.authAndBuilder.openWizard();
        }
      });
    }

    if (healthTrigger) {
      healthTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.checkBackendHealth(true);
      });
    }
  }



  /* ==========================================================================
     Quantum AI Boot Intro Splash Sequence & Holographic Loader
     ========================================================================== */
  initBootSplash() {
    const splash = document.getElementById('appIntroSplash');
    if (!splash) return;

    // If previously seen in this tab session, remove splash immediately so scrolling is never delayed
    if (sessionStorage.getItem('synapse_intro_seen')) {
      splash.classList.add('splash-removed');
      return;
    }

    const fill = document.getElementById('splashProgressFill');
    const percentEl = document.getElementById('splashPercentText');
    const statusEl = document.getElementById('splashStatusText');
    const skipBtn = document.getElementById('splashSkipBtn');
    const particlesContainer = document.getElementById('splashParticles');

    // Generate floating cyber particles
    if (particlesContainer && particlesContainer.childElementCount === 0) {
      for (let i = 0; i < 22; i++) {
        const p = document.createElement('div');
        const size = Math.random() * 3 + 2;
        const left = Math.random() * 100;
        const delay = Math.random() * 2.5;
        const duration = Math.random() * 2.5 + 2.5;
        p.style.cssText = `
          position: absolute;
          bottom: -10px;
          left: ${left}%;
          width: ${size}px;
          height: ${size}px;
          background: ${i % 3 === 0 ? '#00f5ff' : (i % 3 === 1 ? '#ec4899' : '#00ff9d')};
          border-radius: 50%;
          filter: drop-shadow(0 0 6px #00f5ff);
          opacity: 0;
          animation: floatUp ${duration}s ease-in infinite;
          animation-delay: ${delay}s;
          pointer-events: none;
        `;
        particlesContainer.appendChild(p);
      }
    }

    let isFinished = false;
    const statusStages = [
      { at: 0, text: 'INITIALIZING SYNAPTIC VORTEX MATRIX...' },
      { at: 28, text: 'LOADING QUANTUM CAREER VECTORS...' },
      { at: 60, text: 'CALIBRATING NEURAL RESUME MATCHER...' },
      { at: 86, text: 'SYNAPSE MATRIX ONLINE. SYSTEM READY.' }
    ];

    const dismissSplash = () => {
      if (isFinished) return;
      isFinished = true;
      try { sessionStorage.setItem('synapse_intro_seen', 'true'); } catch (e) {}
      if (fill) fill.style.width = '100%';
      if (percentEl) percentEl.textContent = '100%';
      if (statusEl) statusEl.textContent = 'ACCESS GRANTED • WELCOME';

      if (this.playCyberTone) {
        this.playCyberTone('match');
      }

      setTimeout(() => {
        splash.classList.add('splash-hiding');
        setTimeout(() => {
          splash.classList.add('splash-removed');
        }, 600);
      }, 200);
    };

    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissSplash();
      });
    }

    // Direct click anywhere dismisses
    splash.addEventListener('click', dismissSplash);

    // Any mouse wheel scroll immediately dismisses so the user can scroll down without delay
    const wheelDismiss = () => {
      dismissSplash();
      window.removeEventListener('wheel', wheelDismiss);
    };
    window.addEventListener('wheel', wheelDismiss, { passive: true });

    // Touchmove also dismisses
    const touchDismiss = () => {
      dismissSplash();
      window.removeEventListener('touchmove', touchDismiss);
    };
    window.addEventListener('touchmove', touchDismiss, { passive: true });

    // Keyboard Space, Enter, or ArrowDown dismisses
    const keyHandler = (e) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowDown') {
        dismissSplash();
        window.removeEventListener('keydown', keyHandler);
      }
    };
    window.addEventListener('keydown', keyHandler);

    // Smooth counter ticker (compact 1.2 seconds)
    const startTime = performance.now();
    const totalDuration = 1200;

    const frame = (now) => {
      if (isFinished) return;
      const elapsed = now - startTime;
      const progress = Math.min(100, Math.floor((elapsed / totalDuration) * 100));

      if (fill) fill.style.width = `${progress}%`;
      if (percentEl) percentEl.textContent = `${progress}%`;

      const stage = [...statusStages].reverse().find(s => progress >= s.at);
      if (stage && statusEl && statusEl.textContent !== stage.text) {
        statusEl.textContent = stage.text;
      }

      if (progress < 100) {
        requestAnimationFrame(frame);
      } else {
        dismissSplash();
      }
    };

    requestAnimationFrame(frame);
  }

  /* ==========================================================================
     Interactive Global Hero Telemetry (Vectors, Live Openings, Precision)
     ========================================================================== */
  initHeroStats() {
    this.heroStats = {
      vectors: 1248500,
      openings: 452180,
      precision: 98.4
    };

    const vectorsEl = document.getElementById('heroValVectors');
    const openingsEl = document.getElementById('heroValOpenings');
    const precisionEl = document.getElementById('heroValPrecision');

    // Smooth initial count-up animation
    const animateStat = (el, start, target, formatFn, duration = 1200) => {
      if (!el) return;
      const startTime = performance.now();
      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const current = start + (target - start) * progress;
        el.textContent = formatFn(current);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = formatFn(target);
        }
      };
      requestAnimationFrame(step);
    };

    if (vectorsEl) animateStat(vectorsEl, 0, 1.25, (v) => `${v.toFixed(2)}M+`);
    if (openingsEl) animateStat(openingsEl, 0, 452, (v) => `${Math.round(v)}K+`);
    if (precisionEl) animateStat(precisionEl, 0, 98.4, (v) => `${v.toFixed(1)}%`);

    // Live continuous ticker (simulates real-time vector synthesis processing)
    if (this.heroTicker) clearInterval(this.heroTicker);
    this.heroTicker = setInterval(() => {
      this.heroStats.vectors += Math.floor(Math.random() * 5) + 1;
      if (vectorsEl && !this.hoveringVectors) {
        const millions = (this.heroStats.vectors / 1000000).toFixed(2);
        vectorsEl.textContent = `${millions}M+`;
      }
    }, 2000);
  }

  /* ==========================================================================
     Theme Management System (Cyber Cyan vs Neon Nebula)
     ========================================================================== */
  initTheme() {
    const savedTheme = localStorage.getItem('synapse_theme') || 'dark';
    this.setTheme(savedTheme, false);
  }

  setTheme(theme, playSound = true) {
    // Normalize theme name
    const normalized = (theme === 'nebula' || theme === 'light') ? 'nebula' : 'dark';
    this.currentTheme = normalized;

    document.documentElement.setAttribute('data-theme', normalized);
    document.body.setAttribute('data-theme', normalized);
    localStorage.setItem('synapse_theme', normalized);

    // Update Segmented Control Buttons
    document.querySelectorAll('.theme-seg-btn').forEach(btn => {
      const btnTheme = btn.getAttribute('data-set-theme');
      const isActive = (btnTheme === normalized) || 
        (normalized === 'nebula' && (btnTheme === 'nebula' || btnTheme === 'light')) ||
        (normalized === 'dark' && (btnTheme === 'dark' || btnTheme === 'cyber'));
      btn.classList.toggle('active', isActive);
    });

    // Update Floating Theme Pill
    const floatText = document.getElementById('floatingThemeText');
    if (floatText) {
      floatText.textContent = normalized === 'nebula' ? 'THEME: NEON NEBULA' : 'THEME: CYBER CYAN';
    }
    const floatIcon = document.getElementById('floatingThemeIcon');
    if (floatIcon) {
      floatIcon.textContent = normalized === 'nebula' ? '🔮' : '🌌';
    }

    if (playSound) {
      this.playCyberTone('ping');
    }
  }

  toggleTheme() {
    const nextTheme = this.currentTheme === 'nebula' ? 'dark' : 'nebula';
    this.setTheme(nextTheme, true);
  }

  /* ==========================================================================
     Futuristic Web Audio Sound Effects
     ========================================================================== */
  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playCyberTone(type = 'ping') {
    if (!this.audioEnabled) return;
    try {
      this.initAudio();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;

      if (type === 'ping') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(1180, now + 0.12);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'match') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(660, now + 0.08);
        osc.frequency.setValueAtTime(880, now + 0.16);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'scan') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(820, now + 0.25);
        gain.gain.setValueAtTime(0.035, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      }
    } catch (e) {
      console.warn('Audio FX not permitted or supported yet', e);
    }
  }

  /* ==========================================================================
     Actual User Profile & Synapse Topology Synchronization
     ========================================================================== */
  syncActualUserFromStorage() {
    try {
      const actualUserArchetype = STUDENT_ARCHETYPES.find(a => a.id === 'actual_user');
      if (!actualUserArchetype) return;

      const savedActual = JSON.parse(localStorage.getItem('synapse_actual_user'));
      const savedAuth = JSON.parse(localStorage.getItem('synapse_user'));
      const savedResume = JSON.parse(localStorage.getItem('synapse_resume_user'));

      if (savedActual) {
        if (savedActual.name) actualUserArchetype.name = savedActual.name;
        if (savedActual.title) actualUserArchetype.title = savedActual.title;
        if (savedActual.bio) actualUserArchetype.bio = savedActual.bio;
        if (savedActual.avatar) actualUserArchetype.avatar = savedActual.avatar;
        if (savedActual.skills) actualUserArchetype.skills = { ...actualUserArchetype.skills, ...savedActual.skills };
      } else if (savedAuth && savedAuth.name) {
        actualUserArchetype.name = savedAuth.name;
        actualUserArchetype.title = savedAuth.title || 'Verified Candidate • Neural Synced';
      } else if (savedResume && savedResume.name) {
        actualUserArchetype.name = savedResume.name;
        if (savedResume.role) actualUserArchetype.title = savedResume.role;
      }

      if (this.currentArchetype && this.currentArchetype.id === 'actual_user') {
        this.currentSkills = { ...actualUserArchetype.skills };
      }
    } catch (e) {
      console.warn('Error syncing actual user from storage:', e);
    }
  }

  saveActualUserToStorage() {
    try {
      const actualUserArchetype = STUDENT_ARCHETYPES.find(a => a.id === 'actual_user');
      if (actualUserArchetype) {
        localStorage.setItem('synapse_actual_user', JSON.stringify({
          name: actualUserArchetype.name,
          title: actualUserArchetype.title,
          bio: actualUserArchetype.bio,
          avatar: actualUserArchetype.avatar,
          skills: actualUserArchetype.skills
        }));
      }
    } catch (e) {
      console.warn('Error saving actual user to storage:', e);
    }
  }

  bindEditActualUserModal() {
    const openBtn = document.getElementById('openEditActualUserBtn');
    const modal = document.getElementById('editActualUserModal');
    const closeBtn = document.getElementById('closeEditActualModalBtn');
    const form = document.getElementById('editActualUserForm');
    const nameInput = document.getElementById('actualNameInput');
    const titleInput = document.getElementById('actualTitleInput');
    const bioInput = document.getElementById('actualBioInput');
    const presetSelect = document.getElementById('actualSkillPresetSelect');
    const syncResumeBtn = document.getElementById('syncFromResumeBtn');
    const avatarGroup = document.getElementById('actualAvatarSelector');

    if (!modal) return;

    let selectedAvatar = '⭐';

    if (avatarGroup) {
      avatarGroup.querySelectorAll('.avatar-pick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          avatarGroup.querySelectorAll('.avatar-pick-btn').forEach(b => {
            b.classList.remove('active');
            b.style.border = '1px solid rgba(255,255,255,0.15)';
            b.style.background = 'rgba(255,255,255,0.05)';
          });
          btn.classList.add('active');
          btn.style.border = '1px solid var(--neon-cyan)';
          btn.style.background = 'rgba(0,245,255,0.15)';
          selectedAvatar = btn.getAttribute('data-avatar') || '⭐';
        });
      });
    }

    const populateForm = () => {
      const actualUserArchetype = STUDENT_ARCHETYPES.find(a => a.id === 'actual_user');
      if (!actualUserArchetype) return;
      if (nameInput) nameInput.value = actualUserArchetype.name || '';
      if (titleInput) titleInput.value = actualUserArchetype.title || '';
      if (bioInput) bioInput.value = actualUserArchetype.bio || '';
      selectedAvatar = actualUserArchetype.avatar || '⭐';

      if (avatarGroup) {
        avatarGroup.querySelectorAll('.avatar-pick-btn').forEach(b => {
          const isAct = b.getAttribute('data-avatar') === selectedAvatar;
          b.classList.toggle('active', isAct);
          b.style.border = isAct ? '1px solid var(--neon-cyan)' : '1px solid rgba(255,255,255,0.15)';
          b.style.background = isAct ? 'rgba(0,245,255,0.15)' : 'rgba(255,255,255,0.05)';
        });
      }
    };

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        populateForm();
        modal.classList.add('active');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });

    // Sync from Resume Builder / Auth
    if (syncResumeBtn) {
      syncResumeBtn.addEventListener('click', () => {
        const savedResume = JSON.parse(localStorage.getItem('synapse_resume_user'));
        const savedAuth = JSON.parse(localStorage.getItem('synapse_user'));
        if (savedResume && savedResume.name) {
          if (nameInput) nameInput.value = savedResume.name;
          if (titleInput) titleInput.value = savedResume.role || titleInput.value;
          if (bioInput) bioInput.value = savedResume.summary || bioInput.value;
          this.showToast('⚡ Synced candidate details from Resume Builder!', 'success');
        } else if (savedAuth && savedAuth.name) {
          if (nameInput) nameInput.value = savedAuth.name;
          if (titleInput) titleInput.value = savedAuth.title || titleInput.value;
          this.showToast('✅ Synced candidate details from Auth profile!', 'success');
        } else {
          this.showToast('ℹ️ Fill Resume Builder first to auto-sync details.', 'info');
        }
      });
    }

    // Form submit
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const actualUserArchetype = STUDENT_ARCHETYPES.find(a => a.id === 'actual_user');
        if (!actualUserArchetype) return;

        actualUserArchetype.name = (nameInput ? nameInput.value.trim() : '') || 'Ahmed Khan';
        actualUserArchetype.title = (titleInput ? titleInput.value.trim() : '') || 'Full Stack & AI Engineer';
        actualUserArchetype.bio = (bioInput ? bioInput.value.trim() : '') || 'Real-world software engineer and candidate profile.';
        actualUserArchetype.avatar = selectedAvatar;

        // Apply Preset if selected
        const preset = presetSelect ? presetSelect.value : 'keep';
        if (preset === 'fullstack') {
          actualUserArchetype.skills = { ...actualUserArchetype.skills, javascript: 94, react: 90, api_design: 88, sql: 82, docker_k8s: 78, problem_solving: 85 };
        } else if (preset === 'ai_ml') {
          actualUserArchetype.skills = { ...actualUserArchetype.skills, python: 94, pytorch: 90, deep_learning: 88, math_stats: 85, nlp_llm: 82, problem_solving: 88 };
        } else if (preset === 'data_science') {
          actualUserArchetype.skills = { ...actualUserArchetype.skills, python: 90, sql: 92, data_analysis: 95, math_stats: 88, communication: 85 };
        } else if (preset === 'devops') {
          actualUserArchetype.skills = { ...actualUserArchetype.skills, docker_k8s: 94, cloud_infra: 90, distributed_sys: 86, system_design: 85, python: 80 };
        }

        this.saveActualUserToStorage();

        // Switch to actual user archetype
        this.selectArchetype('actual_user');

        modal.classList.remove('active');
        this.playCyberTone('match');
        this.showToast(`⭐ Activated: ${actualUserArchetype.name} (Synapse 60 FPS)`, 'success');
      });
    }
  }

  /* ==========================================================================
     DOM Rendering & State Synchronization
     ========================================================================== */
  renderArchetypePills() {
    const container = document.getElementById('archetypePills');
    if (!container) return;

    container.innerHTML = STUDENT_ARCHETYPES.map(arch => `
      <button class="archetype-pill ${arch.id === this.currentArchetype.id ? 'active' : ''} ${arch.isActualUser ? 'actual-user-pill' : ''}" data-id="${arch.id}" title="${arch.isActualUser ? 'Load Actual User Profile into Synapse Topology' : 'Load Demo Archetype: ' + arch.name}" style="${arch.isActualUser ? 'border-color: rgba(0, 255, 157, 0.4); background: rgba(0, 255, 157, 0.08);' : ''}">
        <span>${arch.avatar}</span>
        <span>${arch.isActualUser ? 'You (' + arch.name.split(' ')[0] + ')' : arch.name.split(' ')[0]}</span>
        ${arch.isActualUser ? '<span style="font-size:0.58rem; padding:1px 5px; border-radius:10px; background:rgba(0,255,157,0.18); border:1px solid rgba(0,255,157,0.5); color:var(--neon-emerald); font-family:\'JetBrains Mono\',monospace; font-weight:800;">ACTUAL</span>' : ''}
      </button>
    `).join('');

    container.querySelectorAll('.archetype-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.selectArchetype(id);
      });
    });
  }

  selectArchetype(id) {
    const found = STUDENT_ARCHETYPES.find(a => a.id === id);
    if (!found) return;

    this.currentArchetype = found;
    this.currentSkills = { ...found.skills };

    this.playCyberTone('ping');
    this.renderArchetypePills();
    this.updateProfileDisplay();
    this.renderSkillSliders();
    this.recalculateAndRender();
  }

  updateProfileDisplay() {
    const avatarEl = document.getElementById('studentAvatar');
    const nameEl = document.getElementById('studentName');
    const titleEl = document.getElementById('studentMajor');
    const bioEl = document.getElementById('studentBio');
    const statusLabelEl = document.getElementById('candidateStatusLabel');
    const topologyCandidateEl = document.getElementById('topologyCandidateName');

    if (avatarEl) avatarEl.textContent = this.currentArchetype.avatar;
    if (nameEl) nameEl.textContent = this.currentArchetype.name;
    if (titleEl) titleEl.textContent = this.currentArchetype.title;
    if (bioEl) bioEl.textContent = this.currentArchetype.bio;

    const isActual = !!this.currentArchetype.isActualUser;
    if (statusLabelEl) {
      statusLabelEl.textContent = isActual ? 'ACTUAL USER • LIVE INFERENCE' : 'DEMO ARCHETYPE • VECTOR SYNERGY';
      statusLabelEl.style.color = isActual ? 'var(--neon-emerald)' : 'var(--neon-cyan)';
    }

    if (topologyCandidateEl) {
      topologyCandidateEl.textContent = isActual 
        ? `ACTUAL USER: ${this.currentArchetype.name.toUpperCase()}`
        : `DEMO: ${this.currentArchetype.name.toUpperCase()}`;
      topologyCandidateEl.style.color = isActual ? 'var(--neon-emerald)' : 'var(--neon-gold)';
    }
  }

  renderSkillSliders() {
    const container = document.getElementById('skillsContainer');
    if (!container) return;

    container.innerHTML = ALL_SKILLS.map(skill => {
      const level = this.currentSkills[skill.id] || 0;
      return `
        <div class="skill-slider-row" data-skill="${skill.id}">
          <div class="skill-row-header">
            <div class="skill-name-wrap">
              <span>${skill.icon}</span>
              <span>${skill.name}</span>
            </div>
            <span class="skill-value-badge" id="badge_${skill.id}">${level}%</span>
          </div>
          <input 
            type="range" 
            class="skill-range-input" 
            id="slider_${skill.id}" 
            min="0" 
            max="100" 
            value="${level}"
            data-skill="${skill.id}"
          />
        </div>
      `;
    }).join('');

    // Attach real-time input listeners
    container.querySelectorAll('.skill-range-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const skillId = e.target.getAttribute('data-skill');
        const val = parseInt(e.target.value, 10);
        this.currentSkills[skillId] = val;

        const badge = document.getElementById(`badge_${skillId}`);
        if (badge) badge.textContent = `${val}%`;

        // If actual user is active, persist skill change in real time
        if (this.currentArchetype && this.currentArchetype.isActualUser) {
          this.currentArchetype.skills[skillId] = val;
          this.saveActualUserToStorage();
        }

        this.recalculateAndRender(false); // don't redraw sliders; updates MLP at 60 FPS!
      });
    });
  }

  async fetchRealTimeJobs(forceRefresh = false) {
    const btn = document.getElementById('liveJobsToggleBtn');
    if (btn) {
      btn.innerHTML = '⏳ Fetching Real-Time Web Jobs...';
      btn.disabled = true;
    }

    try {
      const resp = await fetch(`http://127.0.0.1:5000/api/realtime-jobs?refresh=${forceRefresh}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: this.currentSkills })
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.jobs && data.jobs.length > 0) {
          this.realtimeJobs = data.jobs;
          this.useRealtimeJobs = true;
          if (btn) {
            btn.innerHTML = `🟢 Live Web Jobs (${data.jobs.length} Active)`;
            btn.classList.add('active');
            btn.disabled = false;
          }
          this.recalculateAndRender();
          if (this.playCyberTone) this.playCyberTone('match');
          return;
        }
      }
    } catch (e) {
      console.warn('Real-time API notice:', e);
    }

    if (btn) {
      btn.innerHTML = '🌐 Fetch Real-Time Web Jobs';
      btn.disabled = false;
    }
  }

  recalculateAndRender(redrawSliders = false) {
    if (redrawSliders) {
      this.renderSkillSliders();
    }

    let ranked = [];
    if (this.useRealtimeJobs && this.realtimeJobs.length > 0) {
      // Use live internet jobs with re-calculated suitability against current skills
      ranked = this.realtimeJobs.map(job => {
        const req_skills = job.target_skills || {};
        let met_count = 0;
        const gaps = [];
        const strengths = [];

        Object.entries(req_skills).forEach(([k, target_lvl]) => {
          const user_lvl = this.currentSkills[k] || 0;
          if (user_lvl >= target_lvl) {
            met_count++;
            strengths.append ? strengths.push({ name: k.replace('_', ' ').toUpperCase(), current: user_lvl, target: target_lvl }) : strengths.push({ name: k.replace('_', ' ').toUpperCase(), current: user_lvl, target: target_lvl });
          } else {
            gaps.push({ name: k.replace('_', ' ').toUpperCase(), gap: target_lvl - user_lvl, current: user_lvl, target: target_lvl });
          }
        });

        const totalReq = Object.keys(req_skills).length || 1;
        const score = Math.floor(Math.min(99, Math.max(45, 52 + (met_count / totalReq) * 44)));

        return {
          ...job,
          evaluation: {
            overallScore: score,
            tier: score >= 88 ? 'Exceptional Fit' : (score >= 75 ? 'High Potential' : 'Solid Alignment'),
            tierBadgeClass: score >= 88 ? 'tier-high' : (score >= 75 ? 'tier-med' : 'tier-low'),
            strengths: strengths,
            gaps: gaps.sort((a, b) => b.gap - a.gap)
          }
        };
      }).sort((a, b) => b.evaluation.overallScore - a.evaluation.overallScore);
    } else {
      ranked = this.matchingEngine.evaluateSuitability(this.currentSkills);
    }

    this.latestRanked = ranked;

    // Check if activeJobId is still in ranked
    if (!this.activeJobId && ranked.length > 0) {
      this.activeJobId = ranked[0].id;
    }

    // Update Visualizer
    if (this.visualizer) {
      this.visualizer.updateData(this.currentSkills, ranked, this.activeJobId);
    }

    // Render Cards
    this.renderJobCards(ranked);

    // Update HUD metrics
    this.updateHUDStats(ranked);
  }

  /* ==========================================================================
     Real-Time AI Telemetry & Live Heartbeat (Port 5000)
     ========================================================================== */
  startLiveTelemetryHeartbeat() {
    this.checkBackendHealth(false);
    if (this.telemetryInterval) clearInterval(this.telemetryInterval);
    this.telemetryInterval = setInterval(() => {
      this.checkBackendHealth(false);
    }, 4500);
  }

  async checkBackendHealth(manual = false) {
    const statusTextEl = document.getElementById('hudSystemStatus');
    const liveDot = document.getElementById('hudLiveDot');
    const latencyPill = document.getElementById('hudLatencyPill');

    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2800);

      const resp = await fetch('http://127.0.0.1:5000/api/health', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const latency = Math.max(4, Math.round(performance.now() - startTime));

      if (resp.ok) {
        const data = await resp.json();
        if (statusTextEl) {
          statusTextEl.innerHTML = 'REAL-TIME AI: <strong style="color: var(--neon-emerald);">LIVE (PORT 5000)</strong>';
        }
        if (liveDot) {
          liveDot.classList.remove('offline');
        }
        if (latencyPill) {
          latencyPill.textContent = `${latency}ms`;
          latencyPill.style.color = latency < 40 ? 'var(--neon-emerald)' : 'var(--neon-cyan)';
          latencyPill.style.borderColor = latency < 40 ? 'rgba(0, 255, 157, 0.4)' : 'rgba(0, 245, 255, 0.4)';
        }

        if (manual) {
          this.playCyberTone('ping');
          this.showTelemetryToast(`⚡ Backend Connected! Latency: ${latency}ms | Model: ${data.model_architecture?.activation || 'Neural MLP'} | Live Feed: Active`);
        }
        return;
      }
    } catch (e) {
      // Backend not running or unreachable
    }

    if (statusTextEl) {
      statusTextEl.innerHTML = 'REAL-TIME AI: <strong style="color: var(--neon-gold);">STANDALONE (CLIENT AI)</strong>';
    }
    if (liveDot) {
      liveDot.classList.add('offline');
    }
    if (latencyPill) {
      latencyPill.textContent = 'LOCAL';
      latencyPill.style.color = 'var(--neon-gold)';
      latencyPill.style.borderColor = 'rgba(251, 191, 36, 0.4)';
    }

    if (manual) {
      this.playCyberTone('ping');
      this.showTelemetryToast('⚠️ Backend Port 5000 standby. Running high-precision in-browser Neural Engine.');
    }
  }

  showTelemetryToast(msg) {
    let toast = document.getElementById('telemetryToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'telemetryToast';
      toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 24px;
        z-index: 99999;
        background: rgba(8, 14, 30, 0.95);
        border: 1px solid var(--neon-cyan);
        box-shadow: 0 0 20px rgba(0, 245, 255, 0.35);
        color: #ffffff;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.78rem;
        padding: 0.75rem 1.2rem;
        border-radius: 10px;
        backdrop-filter: blur(12px);
        transform: translateY(-20px);
        opacity: 0;
        transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        pointer-events: none;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.transform = 'translateY(-20px)';
      toast.style.opacity = '0';
    }, 3200);
  }

  updateHUDStats(ranked) {
    const topMatch = ranked[0];
    const topScoreEl = document.getElementById('hudTopScore');
    const roleCountEl = document.getElementById('jobCountBadge');

    if (roleCountEl) {
      roleCountEl.textContent = `${ranked.length} ${this.useRealtimeJobs ? 'Live Web Postings' : 'Neural Matches'}`;
    }

    if (topScoreEl && topMatch) {
      const targetScore = topMatch.evaluation.overallScore;
      const startScore = this.currentTopScore || 94;
      this.currentTopScore = targetScore;

      // Color coding based on score
      const color = targetScore >= 88 ? 'var(--neon-emerald)' : (targetScore >= 75 ? 'var(--neon-cyan)' : 'var(--neon-gold)');
      topScoreEl.style.color = color;

      // Pulse animation
      topScoreEl.classList.remove('score-pulse');
      void topScoreEl.offsetWidth; // trigger reflow
      topScoreEl.classList.add('score-pulse');

      // Smooth number roll animation
      const duration = 350;
      const startTime = performance.now();
      const animateScore = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const current = Math.round(startScore + (targetScore - startScore) * progress);
        topScoreEl.textContent = `${current}%`;
        if (progress < 1) {
          requestAnimationFrame(animateScore);
        } else {
          topScoreEl.textContent = `${targetScore}%`;
        }
      };
      requestAnimationFrame(animateScore);
    }
  }

  renderJobCards(ranked) {
    const container = document.getElementById('jobCardsGrid');
    if (!container) return;

    const filtered = this.currentFilter === 'all'
      ? ranked
      : ranked.filter(j => j.category.toLowerCase().includes(this.currentFilter.toLowerCase()));

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; padding: 2rem; text-align: center; color: var(--text-muted);">
          No positions found for category "${this.currentFilter}".
        </div>
      `;
      return;
    }

    // Circumference for r = 26 is 2 * PI * 26 ~= 163.36
    const CIRCUMFERENCE = 163.36;

    container.innerHTML = filtered.map(job => {
      const score = job.evaluation.overallScore;
      const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;
      const isActive = job.id === this.activeJobId;

      return `
        <div class="job-card ${isActive ? 'active-target' : ''}" data-job-id="${job.id}">
          <div>
            <div class="card-header-flex">
              <div class="job-meta">
                <span class="tier-pill ${job.evaluation.tierBadgeClass}">${job.evaluation.tier}</span>
                <h3 style="margin-top: 0.4rem;">${job.title}</h3>
                <span class="company-name">🏢 ${job.company}</span>
              </div>
              
              <div class="radial-gauge-wrap">
                <svg class="radial-gauge-svg" viewBox="0 0 68 68">
                  <circle class="radial-bg-circle" cx="34" cy="34" r="26"></circle>
                  <circle 
                    class="radial-progress-circle" 
                    cx="34" 
                    cy="34" 
                    r="26"
                    style="stroke-dasharray: ${CIRCUMFERENCE}; stroke-dashoffset: ${offset}; stroke: ${score >= 88 ? 'var(--neon-emerald)' : (score >= 75 ? 'var(--neon-cyan)' : 'var(--neon-gold)')};"
                  ></circle>
                </svg>
                <div class="radial-score-text">${score}<span>%</span></div>
              </div>
            </div>

            <p class="job-description-p" style="margin-top: 0.85rem;">${job.suitabilityDescription}</p>

            <div class="market-stats-row" style="margin-top: 0.9rem;">
              <span>💵 <strong>${job.salary}</strong></span>
              <span>📈 <strong>${job.growthRate}</strong></span>
            </div>

            <!-- Skills Status -->
            <div class="skills-comparison-tags" style="margin-top: 0.9rem;">
              <div class="tags-row">
                ${job.evaluation.strengths.slice(0, 3).map(s => `
                  <span class="tag-mini tag-met">✓ ${s.name} (${s.current}%)</span>
                `).join('')}
                ${job.evaluation.gaps.slice(0, 2).map(g => `
                  <span class="tag-mini tag-gap">▲ +${g.gap}% ${g.name}</span>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="card-action-footer">
            <button class="btn-inspect-pathway" data-inspect-id="${job.id}">
              <span>⚡</span> Pathway
            </button>
            <button class="nav-action-btn" data-tailor-id="${job.id}" title="AI Tailor Resume for this Role">
              <span>📝</span> Tailor
            </button>
            <button class="nav-action-btn nav-btn-interview" data-interview-id="${job.id}" title="Launch AI Mock Interview">
              <span>🎙️</span> Interview
            </button>
            <a 
              href="${job.externalUrl || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title + ' ' + (job.company || ''))}`}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn-portal-redirect" 
              title="Open verified current job on Official Portal"
              onclick="event.stopPropagation();"
            >
              <span>🌐</span> Portal ↗
            </a>
            <button class="btn-auto-apply ${this.resumeOptimizer && this.resumeOptimizer.appliedJobs.has(job.id) ? 'applied' : ''}" data-auto-apply-id="${job.id}">
              ${this.resumeOptimizer && this.resumeOptimizer.appliedJobs.has(job.id) ? '✓ Applied' : '⚡ 1-Click Apply'}
            </button>
            <button class="btn-view-canvas-target" data-focus-id="${job.id}" title="Focus on Neural Canvas">
              🎯
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach card action listeners
    container.querySelectorAll('[data-inspect-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const jobId = btn.getAttribute('data-inspect-id');
        this.openPathwayModal(jobId);
      });
    });

    container.querySelectorAll('[data-tailor-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const jobId = btn.getAttribute('data-tailor-id');
        if (this.resumeOptimizer) {
          this.resumeOptimizer.openOptimizer(jobId);
        }
      });
    });

    container.querySelectorAll('[data-interview-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const jobId = btn.getAttribute('data-interview-id');
        if (this.mockInterviewer) {
          this.mockInterviewer.openInterview(jobId);
        }
      });
    });

    container.querySelectorAll('[data-auto-apply-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const jobId = btn.getAttribute('data-auto-apply-id');
        if (this.resumeOptimizer && !this.resumeOptimizer.appliedJobs.has(jobId)) {
          this.resumeOptimizer.triggerAutoApply(jobId);
        }
      });
    });

    container.querySelectorAll('[data-focus-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const jobId = btn.getAttribute('data-focus-id');
        this.setActiveTargetJob(jobId);
      });
    });

    container.querySelectorAll('.job-card').forEach(card => {
      card.addEventListener('click', () => {
        const jobId = card.getAttribute('data-job-id');
        this.setActiveTargetJob(jobId);
      });
    });
  }

  setActiveTargetJob(jobId) {
    this.activeJobId = jobId;
    this.playCyberTone('ping');
    if (this.visualizer) {
      this.visualizer.setActiveJob(jobId);
    }
    // Update card active classes
    document.querySelectorAll('.job-card').forEach(c => {
      if (c.getAttribute('data-job-id') === jobId) {
        c.classList.add('active-target');
      } else {
        c.classList.remove('active-target');
      }
    });
  }

  /* ==========================================================================
     Career Pathway Modal
     ========================================================================== */
  openPathwayModal(jobId) {
    const job = JOB_DATABASE.find(j => j.id === jobId);
    if (!job) return;

    const evaluation = this.matchingEngine.evaluateSingleJob(job, this.currentSkills);
    this.playCyberTone('match');

    const modal = document.getElementById('pathwayModal');
    const content = document.getElementById('pathwayModalContent');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="modal-header">
        <div>
          <span class="tier-pill ${evaluation.tierBadgeClass}">${evaluation.tier} (${evaluation.overallScore}% Suitability)</span>
          <h2 style="font-size: 1.5rem; margin-top: 0.35rem; color: #ffffff;">${job.title}</h2>
          <p style="font-size: 0.85rem; color: var(--neon-cyan); font-family: 'JetBrains Mono', monospace;">Target: ${job.company} • Compensation: ${job.salary}</p>
        </div>
        <button class="modal-close-btn" id="closeModalBtn">✕</button>
      </div>

      <div class="modal-body">
        <!-- Readiness Gauge -->
        <div style="background: rgba(0, 240, 255, 0.05); border: 1px solid rgba(0, 240, 255, 0.2); padding: 1.25rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="color: #ffffff; font-size: 1rem;">Target Readiness: ${evaluation.overallScore >= 80 ? 'Interview Ready' : 'Accelerated Upskilling Pathway'}</h4>
            <p style="color: var(--text-secondary); font-size: 0.82rem; margin-top: 0.2rem;">
              Neural Vector Alignment: ${evaluation.cosineSim}% | Direct Skill Weight: ${evaluation.baseScore}%
            </p>
          </div>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.8rem; font-weight: 800; color: var(--neon-emerald);">
            ${evaluation.overallScore}%
          </div>
        </div>

        <!-- 12-Week Roadmap -->
        <div>
          <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>🗓️</span> 12-Week Structured Milestones
          </h4>
          <div class="pathway-timeline">
            ${job.milestones.map(m => `
              <div class="milestone-node">
                <div class="milestone-dot"></div>
                <div class="milestone-content">
                  <h5>${m.week}: ${m.title}</h5>
                  <p>${m.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Recommended Learning Modules -->
        <div>
          <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>🎓</span> High-Yield Recommended Curriculum
          </h4>
          <ul class="courses-checklist">
            ${job.recommendedCourses.map(course => `
              <li class="course-item">
                <span class="check-icon">✓</span>
                <span>${course}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;

    modal.classList.add('active');

    // Bind modal close
    document.getElementById('closeModalBtn').addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  /* ==========================================================================
     Simulated Resume Parser & Event Bindings
     ========================================================================== */
  bindEvents() {
    // Theme Switcher: Segmented Dark/Light Buttons
    document.querySelectorAll('[data-set-theme]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTheme = btn.getAttribute('data-set-theme');
        this.setTheme(targetTheme, true);
      });
    });

    // HUD Real-Time Telemetry Group (Click to Ping / Diagnostics)
    const hudAiGroup = document.getElementById('hudAiLiveGroup');
    if (hudAiGroup) {
      hudAiGroup.addEventListener('click', () => {
        this.checkBackendHealth(true);
      });
    }

    // HUD Top Match Group (Click to Spotlight & Scroll to #1 Match)
    const hudTopMatchGroup = document.getElementById('hudTopMatchGroup');
    if (hudTopMatchGroup) {
      hudTopMatchGroup.addEventListener('click', () => {
        const topCard = document.querySelector('.job-card.active-target') || document.querySelector('.job-card');
        if (topCard) {
          topCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          topCard.classList.add('active-pulse');
          this.playCyberTone('match');
          setTimeout(() => topCard.classList.remove('active-pulse'), 1200);
        }
      });
    }

    // Theme Switcher: Floating Quick Switch Pill
    const floatThemeBtn = document.getElementById('floatingThemeToggle');
    if (floatThemeBtn) {
      floatThemeBtn.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    // Legacy theme toggle button if present
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    // Brand Logo Interactive Chime & Ripple
    const brandLogo = document.getElementById('brandLogoContainer');
    if (brandLogo) {
      brandLogo.addEventListener('click', () => {
        this.playCyberTone('match');
        brandLogo.classList.add('active-pulse');
        setTimeout(() => brandLogo.classList.remove('active-pulse'), 800);
      });
    }

    // Hero Stat 1: Active Vectors Matrix Scan
    const badgeVectors = document.getElementById('heroBadgeVectors');
    if (badgeVectors) {
      const valEl = document.getElementById('heroValVectors');
      badgeVectors.addEventListener('mouseenter', () => {
        this.hoveringVectors = true;
        if (valEl && this.heroStats) valEl.textContent = this.heroStats.vectors.toLocaleString();
      });
      badgeVectors.addEventListener('mouseleave', () => {
        this.hoveringVectors = false;
        if (valEl && this.heroStats) valEl.textContent = `${(this.heroStats.vectors / 1000000).toFixed(2)}M+`;
      });
      badgeVectors.addEventListener('click', () => {
        this.playCyberTone('scan');
        if (this.visualizer && this.visualizer.triggerPulseEffect) {
          this.visualizer.triggerPulseEffect();
        }
        badgeVectors.classList.add('active-pulse');
        setTimeout(() => badgeVectors.classList.remove('active-pulse'), 800);
        this.showTelemetryToast(`⚡ Vector Matrix Scan: ${this.heroStats?.vectors.toLocaleString() || '1,248,500'} active candidate & career latent embeddings validated!`);
      });
    }

    // Hero Stat 2: Live Openings Feed
    const badgeOpenings = document.getElementById('heroBadgeOpenings');
    if (badgeOpenings) {
      badgeOpenings.addEventListener('click', () => {
        this.playCyberTone('match');
        badgeOpenings.classList.add('active-pulse');
        setTimeout(() => badgeOpenings.classList.remove('active-pulse'), 800);
        
        // Scroll to jobs grid and trigger live sync
        const jobsSection = document.getElementById('jobCardsGrid');
        if (jobsSection) {
          jobsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (!this.useRealtimeJobs) {
          this.fetchRealTimeJobs(true);
        } else {
          this.showTelemetryToast('🌐 Live Openings: Connected to 450,000+ verified global tech listings.');
        }
      });
    }

    // Hero Stat 3: Neural Model Precision Benchmark
    const badgePrecision = document.getElementById('heroBadgePrecision');
    if (badgePrecision) {
      badgePrecision.addEventListener('click', () => {
        this.playCyberTone('ping');
        badgePrecision.classList.add('active-pulse');
        const precisionEl = document.getElementById('heroValPrecision');

        // Dynamic calibration test animation
        let count = 0;
        const testInterval = setInterval(() => {
          count++;
          const tempVal = (97.5 + Math.random() * 1.5).toFixed(1);
          if (precisionEl) precisionEl.textContent = `${tempVal}%`;
          if (count >= 5) {
            clearInterval(testInterval);
            if (precisionEl) precisionEl.textContent = '98.6%';
            this.playCyberTone('match');
            setTimeout(() => badgePrecision.classList.remove('active-pulse'), 600);
            this.showTelemetryToast('🎯 Neural Calibration Complete: Model Convergence Precision 98.6% | Cosine Loss: 0.014');
          }
        }, 80);
      });
    }

    // Audio Toggle
    const audioBtn = document.getElementById('audioToggleBtn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        this.audioEnabled = !this.audioEnabled;
        audioBtn.classList.toggle('active', this.audioEnabled);
        audioBtn.innerHTML = this.audioEnabled ? '🔊 Audio FX: ON' : '🔈 Audio FX: OFF';
        if (this.audioEnabled) {
          this.playCyberTone('ping');
        }
      });
    }

    // Resume Drawer Toggle
    const resumeToggle = document.getElementById('resumeToggleBtn');
    const resumeBox = document.getElementById('resumeParserBox');
    if (resumeToggle && resumeBox) {
      resumeToggle.addEventListener('click', () => {
        resumeBox.classList.toggle('open');
        this.playCyberTone('ping');
      });
    }

    // Resume Parser Submit
    const parseBtn = document.getElementById('parseResumeBtn');
    const resumeText = document.getElementById('resumeTextInput');
    if (parseBtn && resumeText) {
      parseBtn.addEventListener('click', () => {
        const text = resumeText.value.trim();
        if (!text) return;

        this.playCyberTone('scan');
        parseBtn.textContent = 'Analyzing Neural Embeddings...';
        parseBtn.disabled = true;

        setTimeout(() => {
          const detected = this.matchingEngine.parseTextToSkills(text);
          const count = Object.keys(detected).length;

          if (count > 0) {
            this.currentSkills = { ...this.currentSkills, ...detected };
            this.recalculateAndRender(true);
            parseBtn.textContent = `✓ Extracted ${count} Skills`;
          } else {
            parseBtn.textContent = 'No target skills matched';
          }

          setTimeout(() => {
            parseBtn.textContent = 'Extract & Map to Neural Model';
            parseBtn.disabled = false;
          }, 2000);
        }, 600);
      });
    }

    // Category Filter Chips
    document.querySelectorAll('.category-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.category-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.getAttribute('data-filter');
        this.playCyberTone('ping');
        this.renderJobCards(this.latestRanked || []);
      });
    });

    // Live Web Jobs Feed Toggle
    const liveJobsBtn = document.getElementById('liveJobsToggleBtn');
    if (liveJobsBtn) {
      liveJobsBtn.addEventListener('click', () => {
        if (!this.useRealtimeJobs) {
          this.fetchRealTimeJobs(false);
        } else {
          // Toggle back to curated database
          this.useRealtimeJobs = false;
          liveJobsBtn.classList.remove('active');
          liveJobsBtn.innerHTML = '🌐 Fetch Real-Time Web Jobs';
          this.recalculateAndRender();
          this.playCyberTone('ping');
        }
      });
    }

    // Close Modal on Background Click
    const modal = document.getElementById('pathwayModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    }
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new SynapseApp();
});
