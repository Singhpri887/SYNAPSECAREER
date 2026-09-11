/**
 * Holographic AI Digital Guide: Aria (Sophisticated Robot Guide & Chat Companion)
 * Features:
 * - Autonomous Flying Robot Walkthrough: Flies physically to each section on the page
 * - Language Selection Launchpad: Choose English or हिंदी, then chatbox automatically hides
 * - Auto-Pilot Next Step: When speech finishes, automatically advances to next step after natural pause
 * - Clean Speech Stop: Speech finishes and cleanly stops on each step and at tour conclusion
 * - Holographic Live Dialogue Bubble attached to Aria with real-time audio waveform
 * - Dual-Language Voice Engine: Speaks in fluent Hindi (हिंदी) and English (EN) with smart phonetic fallback
 * - Active robot speech movement (talking mouth, bobbing, gesturing) while speaking
 * - Element spotlighter with pulsating cyan/emerald scanning brackets
 */

export class AIGuide {
  constructor() {
    this.currentStep = 0;
    this.isOpen = false;
    this.isTourActive = false;
    this.voiceEnabled = true;
    this.lang = 'en'; // 'en' | 'hi'
    this.activeTab = 'chat'; // 'chat' | 'tour'
    this.synth = window.speechSynthesis || null;
    this.currentUtterance = null;
    this.voices = [];
    this.autoAdvanceTimer = null;
    this.autoAdvanceInterval = null;
    this.speechWatchdogTimer = null; // Fallback watchdog: fires if onend doesn't fire

    // Preload speech synthesis voices
    if (this.synth) {
      this.voices = this.synth.getVoices() || [];
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          this.voices = this.synth.getVoices() || [];
        };
      }
    }

    this.promptChips = {
      en: [
        { label: '🎯 Start Tour (English)', prompt: 'Start live guided tour in English' },
        { label: '🎯 टूर शुरू करें (हिंदी)', prompt: 'हिंदी में लाइव वेबसाइट टूर कराएं' },
        { label: '📈 High Growth Careers', prompt: 'Which tech career has the highest salary growth in 2026?' },
        { label: '🧠 Neural Match Logic', prompt: 'How does the neural network calculate skill match?' }
      ],
      hi: [
        { label: '🎯 टूर शुरू करें (हिंदी)', prompt: 'हिंदी में लाइव वेबसाइट टूर कराएं' },
        { label: '🎯 Start Tour (English)', prompt: 'Start live guided tour in English' },
        { label: '📈 हाई ग्रोथ करियर 2026', prompt: '2026 में सबसे ज्यादा सैलरी और डिमांड वाला टेक करियर कौन सा है?' },
        { label: '🧠 न्यूरल मैच कैसे होता है?', prompt: 'न्यूरल नेटवर्क मेरे स्किल्स को करियर से कैसे मैच करता है?' }
      ]
    };

    this.tourSteps = [
      {
        id: 'welcome',
        targetId: 'portalHeroShowcase',
        title: {
          en: 'Welcome to SynapseCareer',
          hi: 'SynapseCareer में आपका स्वागत है'
        },
        text: {
          en: "Hello! I am Aria, your AI career companion. Our quantum neural engine maps your raw skill vector directly into high-yield technology careers with real-time telemetry.",
          hi: "नमस्ते! मैं एरिया हूँ, आपकी AI करियर गाइड। हमारा क्वांटम न्यूरल इंजन आपके स्किल्स को लाइव एनालाइज करके बेस्ट टेक जॉब्स और करियर पाथवेज से जोड़ता है।"
        },
        speechText: {
          en: "Hello! I am Aria, your AI career guide. Let's explore how our deep neural network matches your skills with top technology careers.",
          hi: "नमस्ते! मैं एरिया हूँ, आपकी AI करियर गाइड। चलिए मैं आपको दिखाती हूँ कि हमारा न्यूरल नेटवर्क आपके स्किल्स को बेस्ट टेक जॉब्स से कैसे जोड़ता है।",
          hiPhonetic: "Namaste! Main Aria hoon, aapki AI career guide. Chaliye main aapko dikhati hoon ki hamara neural network aapke skills ko best tech jobs se kaise jodta hai."
        }
      },
      {
        id: 'telemetry',
        targetId: 'profilePanel',
        title: {
          en: '1. Student Profile & Archetypes',
          hi: '1. स्टूडेंट प्रोफाइल और आर्किटाइप्स'
        },
        text: {
          en: "Select pre-configured student archetypes like Maya Chen (Machine Learning) or Leo Rodriguez (Full-Stack), or paste your resume/bio to auto-extract your competencies.",
          hi: "यहाँ से आप पहले से मौजूद स्टूडेंट प्रोफाइल्स जैसे AI/ML या फुल-स्टैक चुन सकते हैं, या अपना रेज़्यूमे पेस्ट करके सीधे स्किल्स एक्सट्रैक्ट कर सकते हैं।"
        },
        speechText: {
          en: "Here in your Profile Hub, load a demo archetype or paste your resume to instantly extract and vectorize your skills.",
          hi: "यहाँ स्टूडेंट प्रोफाइल हब में आप कोई डेमो प्रोफाइल चुन सकते हैं या अपना रेज़्यूमे पेस्ट करके अपने स्किल्स लोड कर सकते हैं।",
          hiPhonetic: "Yahan Student Profile Hub mein aap koi demo profile chun sakte hain ya apna resume paste karke skills load kar sakte hain."
        }
      },
      {
        id: 'skills',
        targetId: 'skillsContainer',
        title: {
          en: '2. Live Skill Vector Sliders',
          hi: '2. लाइव स्किल स्लाइडर्स'
        },
        text: {
          en: "Fine-tune 20 individual skill coefficients including Python, PyTorch, Cloud Architecture, and Stats. The neural network recalculates your suitability tensors in real time.",
          hi: "Python, PyTorch, Cloud और System Design जैसे 20 टेक्निकल स्किल्स के स्लाइडर्स को एडजस्ट करें। हर बदलाव के साथ AI तुरंत आपकी मैचिंग री-कैलकुलेट करता है।"
        },
        speechText: {
          en: "Adjust these skill sliders. The neural model recalculates your match scores live with every adjustment.",
          hi: "इन स्किल स्लाइडर्स को ऊपर-नीचे करके देखें। न्यूरल नेटवर्क तुरंत आपकी मैचिंग और जॉब स्कोर्स को लाइव अपडेट कर देगा।",
          hiPhonetic: "In skill sliders ko adjust karke dekhein. Neural network turant aapki matching aur job scores ko live update kar dega."
        }
      },
      {
        id: 'canvas',
        targetId: 'visualizerFrame',
        title: {
          en: '3. 60 FPS Neural Visualizer',
          hi: '3. 60 FPS न्यूरल नेटवर्क विजुअलाइज़र'
        },
        text: {
          en: "Watch your skill vector flow through hidden dense layers into target career nodes. Hover over any node to trace synaptic activations, or click a career node to focus the match analyzer.",
          hi: "देखें कि कैसे आपका स्किल वेक्टर हिडन लेयर्स से होते हुए करियर नोड्स तक पहुँचता है। किसी भी नोड पर माउस ले जाकर सिनेप्टिक पल्सेस को लाइव देखें।"
        },
        speechText: {
          en: "Look at our interactive 60 FPS neural canvas. Synaptic pulses travel through hidden layers to calculate your best career synergy.",
          hi: "इस 60 FPS न्यूरल कैनवास को देखें। यहाँ सिनेप्टिक पल्सेस के जरिए आपके लिए सबसे बेहतरीन करियर प्रेडिक्ट होता है।",
          hiPhonetic: "Is 60 FPS neural canvas ko dekhein. Yahan synaptic pulses ke zariye aapke liye best career predict hota hai."
        }
      },
      {
        id: 'recommendations',
        targetId: 'recommendationsSection',
        title: {
          en: '4. AI Career Matches & Roadmaps',
          hi: '4. AI करियर मैचेस और रोडमैप्स'
        },
        text: {
          en: "Explore career opportunities ranked by multidimensional vector similarity. Click 'Pathway' on any card to unlock your 12-week preparation roadmap, ATS resume bullets, or launch an AI Mock Interview.",
          hi: "न्यूरल मैचिंग द्वारा रैंक की गई जॉब्स देखें। किसी भी जॉब कार्ड पर 'Pathway' पर क्लिक करके 12-हफ़्ते का रोडमैप, रेज़्यूमे टिप्स और मॉक इंटरव्यू एक्सेस करें।"
        },
        speechText: {
          en: "Here are your top-matched career roles. Click Pathway on any card to view your personalized 12-week preparation roadmap.",
          hi: "यहाँ आपके टॉप करियर मैचेस हैं। किसी भी कार्ड पर पाथवे पर क्लिक करके अपना 12-हफ़्ते का रोडमैप और मॉक इंटरव्यू शुरू करें।",
          hiPhonetic: "Yahan aapke top career matches hain. Kisi bhi card par Pathway par click karke apna 12-week roadmap aur mock interview shuru karein."
        }
      },
      {
        id: 'portals',
        targetId: 'synapsePortalFooter',
        title: {
          en: '5. Official Job Portals Gateway',
          hi: '5. ऑफिशियल जॉब पोर्टल्स गेटवे'
        },
        text: {
          en: "Search live verified job openings directly across LinkedIn, Naukri, Indeed, and Google Careers. Apply directly on original corporate platforms with 1-click launch.",
          hi: "LinkedIn, Naukri, Indeed और Google Careers जैसे ऑफिशियल पोर्टल्स पर लाइव जॉब्स सर्च करें और 1-क्लिक में ओरिजिनल वेबसाइट पर अप्लाई करें।"
        },
        speechText: {
          en: "Finally, our Official Job Portal Gateway connects you directly to live job listings on LinkedIn, Naukri, Indeed, and Google Careers.",
          hi: "और अंत में, हमारा ऑफिशियल जॉब पोर्टल गेटवे आपको सीधे लिंक्डइन, नौकरी और इंडीड से जोड़ता है जहाँ आप 1-क्लिक में अप्लाई कर सकते हैं।",
          hiPhonetic: "Aur aakhir mein, hamara Official Job Portal Gateway aapko seedhe LinkedIn, Naukri aur Google Careers se jodta hai jahan aap seedhe apply kar sakte hain."
        }
      }
    ];

    this.initElements();
    this.bindEvents();
    this.renderChips();
  }

  initElements() {
    this.dockBtn = document.getElementById('ariaDockBtn');
    this.guideModal = document.getElementById('ariaGuideModal');
    this.closeBtn = document.getElementById('ariaCloseBtn');
    this.langChoiceEn = document.getElementById('langChoiceEn');
    this.langChoiceHi = document.getElementById('langChoiceHi');
    this.voiceToggleBtn = document.getElementById('ariaVoiceToggle');

    // Tabs
    this.tabChat = document.getElementById('ariaTabChat');
    this.tabTour = document.getElementById('ariaTabTour');
    this.chatView = document.getElementById('ariaChatView');
    this.tourView = document.getElementById('ariaTourView');

    // Chat Elements
    this.chatStream = document.getElementById('ariaChatStream');
    this.chatInput = document.getElementById('ariaChatInput');
    this.chatSendBtn = document.getElementById('ariaChatSendBtn');
    this.welcomeMsg = document.getElementById('ariaWelcomeMsg');
    this.chipsWrap = document.querySelector('.aria-chips-wrap');

    // Tour Language Choice Launchpad Buttons in Chatbox
    this.tourStartHiBtn = document.getElementById('tourStartHiBtn');
    this.tourStartEnBtn = document.getElementById('tourStartEnBtn');

    // Autonomous Robot Tour Floating HUD Bubble
    this.tourBubble = document.getElementById('ariaTourBubble');
    this.tourStepBadge = document.getElementById('ariaTourStepBadge');
    this.tourBubbleTitle = document.getElementById('ariaTourBubbleTitle');
    this.tourBubbleText = document.getElementById('ariaTourBubbleText');
    this.tourDotsContainer = document.getElementById('ariaTourDots');
    this.tourPrevBtn = document.getElementById('ariaTourPrevBtn');
    this.tourNextBtn = document.getElementById('ariaTourNextBtn');
    this.tourLangBtn = document.getElementById('ariaTourLangBtn');
    this.tourLangLabel = document.getElementById('ariaTourLangLabel');
    this.tourVoiceBtn = document.getElementById('ariaTourVoiceBtn');
    this.tourVoiceIcon = document.getElementById('ariaTourVoiceIcon');
    this.tourExitBtn = document.getElementById('ariaTourExitBtn');
    this.tourWaveform = document.getElementById('ariaTourWaveform');
    this.tourAutoBar = document.getElementById('ariaTourAutoBar');
    this.tourAutoFill = document.getElementById('ariaTourAutoFill');

    // Robot Character Rig for Speech Animations
    this.robotRig = document.querySelector('.aria-robot');
    this.speakingTimer = null;
  }

  bindEvents() {
    // Dock Button Click: If in tour, clicking re-speaks step; else opens/closes chat
    if (this.dockBtn) {
      this.dockBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.unlockAudioContext();

        if (this.isTourActive) {
          const step = this.tourSteps[this.currentStep];
          if (step) {
            this.clearAutoAdvance();
            const speech = typeof step.speechText === 'object' ? step.speechText[this.lang] : step.speechText;
            this.speak(speech, this.lang);
            this.triggerSpeakingMovement(3600);
          }
          return;
        }

        if (this.isOpen) {
          this.closeGuide();
        } else {
          this.openGuide();
        }
      });
    }

    // Modal Close Button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeGuide();
      });
    }

    // Stop propagation on modal click
    if (this.guideModal) {
      this.guideModal.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    // Stop propagation on tour bubble click
    if (this.tourBubble) {
      this.tourBubble.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    // Auto-close chatbox when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.isOpen) return;
      const isInsideModal = this.guideModal && this.guideModal.contains(e.target);
      const isDockBtn = this.dockBtn && this.dockBtn.contains(e.target);
      if (!isInsideModal && !isDockBtn) {
        this.closeGuide();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.isTourActive) {
          this.exitTour();
        } else if (this.isOpen) {
          this.closeGuide();
        }
      }
    });

    // Chat Tab click
    if (this.tabChat) {
      this.tabChat.addEventListener('click', () => {
        this.unlockAudioContext();
        this.switchTab('chat');
      });
    }

    // Guided Tour Tab click: Switches to language chooser card
    if (this.tabTour) {
      this.tabTour.addEventListener('click', () => {
        this.unlockAudioContext();
        this.switchTab('tour');
      });
    }

    // ═══ Language Chooser Launchpad Clicks (Instantly Hides Chatbox & Starts Tour!) ═══
    if (this.tourStartHiBtn) {
      this.tourStartHiBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.unlockAudioContext();
        this.setLanguage('hi');
        // Hide chatbox immediately (no speech stop), then start tour
        this.hideChatboxOnly();
        setTimeout(() => this.startAutonomousTour(0), 200);
      });
    }

    if (this.tourStartEnBtn) {
      this.tourStartEnBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.unlockAudioContext();
        this.setLanguage('en');
        // Hide chatbox immediately (no speech stop), then start tour
        this.hideChatboxOnly();
        setTimeout(() => this.startAutonomousTour(0), 200);
      });
    }

    // Floating Tour Bubble Navigation
    if (this.tourNextBtn) {
      this.tourNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.unlockAudioContext();
        this.clearAutoAdvance();
        this.nextTourStep();
      });
    }

    if (this.tourPrevBtn) {
      this.tourPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.unlockAudioContext();
        this.clearAutoAdvance();
        this.prevTourStep();
      });
    }

    if (this.tourLangBtn) {
      this.tourLangBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.unlockAudioContext();
        this.toggleTourLanguage();
      });
    }

    if (this.tourVoiceBtn) {
      this.tourVoiceBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.unlockAudioContext();
        this.toggleVoice();
      });
    }

    if (this.tourExitBtn) {
      this.tourExitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.exitTour();
      });
    }

    // Chat Send
    if (this.chatSendBtn && this.chatInput) {
      this.chatSendBtn.addEventListener('click', () => {
        this.unlockAudioContext();
        this.handleSendMessage();
      });
      this.chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.unlockAudioContext();
          this.handleSendMessage();
        }
      });
    }

    // Voice Toggle in Modal
    if (this.voiceToggleBtn) {
      this.voiceToggleBtn.addEventListener('click', () => {
        this.unlockAudioContext();
        this.toggleVoice();
      });
    }

    // Language Switcher in Modal (EN | हिंदी)
    if (this.langChoiceEn) {
      this.langChoiceEn.addEventListener('click', () => {
        this.unlockAudioContext();
        this.setLanguage('en');
      });
    }
    if (this.langChoiceHi) {
      this.langChoiceHi.addEventListener('click', () => {
        this.unlockAudioContext();
        this.setLanguage('hi');
      });
    }

    // Dynamic repositioning on window resize or scroll during active tour
    let repositionTimer = null;
    const handleReposition = () => {
      if (!this.isTourActive) return;
      if (repositionTimer) clearTimeout(repositionTimer);
      repositionTimer = setTimeout(() => {
        const step = this.tourSteps[this.currentStep];
        if (step) {
          const targetEl = document.getElementById(step.targetId);
          if (targetEl) this.positionRobotAtTarget(targetEl);
        }
      }, 70);
    };

    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, { passive: true });
  }

  unlockAudioContext() {
    if (this.synth && this.synth.paused) {
      try {
        this.synth.resume();
      } catch (e) {
        console.warn('Synth resume error:', e);
      }
    }
  }

  setLanguage(lang) {
    this.lang = lang;

    // Update pill active states
    if (this.langChoiceEn) this.langChoiceEn.classList.toggle('active', lang === 'en');
    if (this.langChoiceHi) this.langChoiceHi.classList.toggle('active', lang === 'hi');

    // Update Welcome message
    if (this.welcomeMsg) {
      this.welcomeMsg.innerHTML = lang === 'en'
        ? "👋 Hi there! I'm <strong>Aria</strong>, your AI career mentor. Ask me anything in English or हिंदी about tech careers, salary growth, or resume tips!"
        : "👋 नमस्ते! मैं <strong>एरिया (Aria)</strong> हूँ, आपकी AI करियर मेंटर। करियर, सैलरी, रेज़्यूमे या नई स्किल्स के बारे में मुझसे हिंदी या इंग्लिश में कुछ भी पूछें!";
    }

    // Update Input placeholder
    if (this.chatInput) {
      this.chatInput.placeholder = lang === 'en'
        ? "Ask Aria in English or Hindi..."
        : "एरिया से हिंदी या इंग्लिश में पूछें...";
    }

    // Update Tab labels
    if (this.tabChat) {
      this.tabChat.innerHTML = lang === 'en' ? '<span>💬</span> Ask Aria' : '<span>💬</span> एरिया से पूछें';
    }
    if (this.tabTour) {
      this.tabTour.innerHTML = lang === 'en' ? '<span>🎯</span> Guided Tour' : '<span>🎯</span> गाइडेड टूर';
    }

    if (this.tourLangLabel) {
      this.tourLangLabel.textContent = lang === 'en' ? '🌐 हिंदी' : '🌐 English';
    }

    // Update prompt chips to matching language
    this.renderChips();
  }

  renderChips() {
    if (!this.chipsWrap) return;
    const chips = this.promptChips[this.lang] || this.promptChips.en;
    this.chipsWrap.innerHTML = chips.map(c =>
      `<button class="aria-chip" data-aria-prompt="${c.prompt}">${c.label}</button>`
    ).join('');

    // Rebind click events
    this.chipsWrap.querySelectorAll('[data-aria-prompt]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.unlockAudioContext();
        const prompt = e.currentTarget.getAttribute('data-aria-prompt');
        if (prompt) this.sendUserPrompt(prompt);
      });
    });
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    if (tabName === 'chat') {
      if (this.tabChat) this.tabChat.classList.add('active');
      if (this.tabTour) this.tabTour.classList.remove('active');
      if (this.chatView) this.chatView.classList.add('active');
      if (this.tourView) this.tourView.classList.remove('active');
      this.clearSpotlight();
    } else {
      // Switched to tour tab: Show the language selection card inside the chatbox
      if (this.tabChat) this.tabChat.classList.remove('active');
      if (this.tabTour) this.tabTour.classList.add('active');
      if (this.chatView) this.chatView.classList.remove('active');
      if (this.tourView) this.tourView.classList.add('active');
      this.clearSpotlight();
    }
  }

  openGuide() {
    if (this.isTourActive) {
      this.exitTour();
    }
    this.isOpen = true;
    if (this.guideModal) {
      this.guideModal.classList.add('active');
    }
    this.switchTab('chat');
  }

  closeGuide() {
    this.isOpen = false;
    this.stopSpeaking();
    if (this.guideModal) {
      this.guideModal.classList.remove('active');
    }
    if (!this.isTourActive) {
      this.clearSpotlight();
    }
  }

  // Hides the chatbox panel ONLY, without stopping speech or clearing state.
  // Use this when starting a tour (so speech isn't killed).
  hideChatboxOnly() {
    this.isOpen = false;
    if (this.guideModal) {
      this.guideModal.classList.remove('active');
    }
  }

  /* ═══════════════════════════════════════════════════════════
     AUTONOMOUS ROBOT WALKTHROUGH ENGINE
     Flight, Live Speech Bubble, Auto-Pilot Next Step
     ═══════════════════════════════════════════════════════════ */

  startAutonomousTour(stepIdx = 0) {
    this.clearAutoAdvance();
    this.isTourActive = true;
    this.activeTab = 'tour';
    this.currentStep = stepIdx;

    // Just hide the chatbox visually (do NOT stop speech - it hasn't started yet)
    this.hideChatboxOnly();

    // Mark robot as in tour mode
    if (this.dockBtn) {
      this.dockBtn.classList.add('tour-active');
    }

    if (this.tourBubble) {
      this.tourBubble.style.display = 'flex';
    }

    this.renderTourStep(stepIdx, true);
  }

  renderTourStep(stepIdx, shouldSpeak = true) {
    this.clearAutoAdvance();
    this.currentStep = stepIdx;
    const step = this.tourSteps[this.currentStep];
    if (!step) return;

    const title = typeof step.title === 'object' ? step.title[this.lang] : step.title;
    const text = typeof step.text === 'object' ? step.text[this.lang] : step.text;
    const speech = typeof step.speechText === 'object' ? step.speechText[this.lang] : step.speechText;

    // 1. Clear previous spotlight and spotlight target element
    this.clearSpotlight();
    const targetEl = document.getElementById(step.targetId);
    if (targetEl) {
      targetEl.classList.add('aria-spotlight-active');
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // 2. Fly robot to target element
    // Wait for smooth scroll to complete (~700ms) before positioning
    setTimeout(() => {
      this.positionRobotAtTarget(targetEl);
    }, 700);
    // Second correction after scroll fully settles
    setTimeout(() => {
      if (this.isTourActive) this.positionRobotAtTarget(targetEl);
    }, 1400);

    // 3. Update Tour Bubble UI
    if (this.tourStepBadge) {
      this.tourStepBadge.textContent = this.lang === 'en'
        ? `STEP ${this.currentStep + 1}/${this.tourSteps.length} • LIVE AI GUIDE`
        : `कदम ${this.currentStep + 1}/${this.tourSteps.length} • लाइव AI गाइड`;
    }

    if (this.tourBubbleTitle) this.tourBubbleTitle.textContent = title;
    if (this.tourBubbleText) this.tourBubbleText.textContent = text;

    // Render dot indicators
    if (this.tourDotsContainer) {
      this.tourDotsContainer.innerHTML = this.tourSteps.map((_, i) => `
        <span class="tour-bubble-dot ${i === this.currentStep ? 'active' : (i < this.currentStep ? 'completed' : '')}" data-step="${i}" title="Step ${i + 1}"></span>
      `).join('');

      this.tourDotsContainer.querySelectorAll('.tour-bubble-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          this.clearAutoAdvance();
          const targetStep = parseInt(e.currentTarget.getAttribute('data-step'), 10);
          if (!isNaN(targetStep)) this.renderTourStep(targetStep, true);
        });
      });
    }

    if (this.tourPrevBtn) {
      this.tourPrevBtn.disabled = this.currentStep === 0;
      this.tourPrevBtn.style.opacity = this.currentStep === 0 ? '0.35' : '1';
      this.tourPrevBtn.textContent = this.lang === 'en' ? '◀ Back' : '◀ पीछे';
    }

    if (this.tourNextBtn) {
      if (this.currentStep === this.tourSteps.length - 1) {
        this.tourNextBtn.textContent = this.lang === 'en' ? 'Finish Tour 🚀' : 'टूर समाप्त 🚀';
      } else {
        this.tourNextBtn.textContent = this.lang === 'en' ? 'Next Step ➔' : 'अगला कदम ➔';
      }
    }

    if (this.tourLangLabel) {
      this.tourLangLabel.textContent = this.lang === 'en' ? '🌐 हिंदी' : '🌐 English';
    }

    if (this.tourVoiceIcon) {
      this.tourVoiceIcon.textContent = this.voiceEnabled ? '🔊' : '🔇';
    }

    // 4. Voice Speech & Animation
    if (this.voiceEnabled && shouldSpeak) {
      // Estimate speech duration: ~120 words per minute average
      const wordCount = speech ? speech.split(/\s+/).length : 20;
      const estimatedMs = Math.max(4000, Math.ceil((wordCount / 120) * 60000) + 1200);
      this.speak(speech, this.lang);
      this.triggerSpeakingMovement(estimatedMs);
    } else {
      // If voice is muted, auto-advance after readable duration (5.5s)
      this.scheduleAutoAdvance(5500);
    }
  }

  positionRobotAtTarget(targetEl) {
    if (!this.dockBtn) return;
    const rect = targetEl ? targetEl.getBoundingClientRect() : null;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let robotLeft = vw - 150;
    let robotTop = vh - 200;
    let bubbleLeft = vw - 430;
    let bubbleTop = vh - 320;
    let pointerSide = 'pointer-right';

    if (rect && vw > 960) {
      const isTargetOnLeft = rect.left < vw / 2;

      if (isTargetOnLeft) {
        // Target is on left side (e.g. Profile, Skills)
        robotLeft = Math.min(vw - 160, Math.max(rect.right + 25, 410));
        robotTop = Math.max(75, Math.min(vh - 220, rect.top + 20));

        if (robotLeft + 140 + 400 < vw) {
          bubbleLeft = robotLeft + 130;
          bubbleTop = Math.max(75, Math.min(vh - 290, robotTop - 25));
          pointerSide = 'pointer-left';
        } else {
          bubbleLeft = Math.max(20, robotLeft - 400);
          bubbleTop = Math.max(75, Math.min(vh - 290, robotTop - 10));
          pointerSide = 'pointer-right';
        }
      } else {
        // Target is on right side or full width (Hero showcase, Canvas visualizer, Job cards, Footer)
        robotLeft = Math.min(vw - 150, Math.max(vw - 230, rect.right - 130));
        robotTop = Math.max(75, Math.min(vh - 240, rect.top + 20));

        bubbleLeft = Math.max(20, robotLeft - 405);
        bubbleTop = Math.max(75, Math.min(vh - 290, robotTop - 15));
        pointerSide = 'pointer-right';
      }
    } else if (rect) {
      // Mobile / Tablet screens
      robotLeft = Math.max(10, vw - 130);
      robotTop = Math.max(65, Math.min(vh - 320, rect.top));
      bubbleLeft = 12;
      bubbleTop = Math.max(70, vh - 260);
      pointerSide = 'pointer-left';
    }

    // Apply flight coordinates to Aria
    this.dockBtn.classList.add('flying');
    this.dockBtn.style.left = `${Math.round(robotLeft)}px`;
    this.dockBtn.style.top = `${Math.round(robotTop)}px`;

    // Position speech bubble
    if (this.tourBubble) {
      this.tourBubble.style.display = 'flex';
      this.tourBubble.style.left = `${Math.round(bubbleLeft)}px`;
      this.tourBubble.style.top = `${Math.round(bubbleTop)}px`;

      const pointer = document.getElementById('tourBubblePointer');
      if (pointer) {
        pointer.className = `tour-bubble-pointer ${pointerSide}`;
      }
    }

    setTimeout(() => {
      if (this.dockBtn) this.dockBtn.classList.remove('flying');
    }, 750);
  }

  // ═══ AUTO-PILOT NEXT STEP LOGIC ═══
  handleSpeechEnded() {
    this.stopSpeakingVisuals();

    if (this.isTourActive) {
      if (this.currentStep < this.tourSteps.length - 1) {
        // Speech finished! Stop speaking and schedule automatic next step
        this.scheduleAutoAdvance(2200);
      } else {
        // Last step completed: wait 2s then finish tour
        this.clearAutoAdvance();
        this.autoAdvanceTimer = setTimeout(() => {
          if (this.isTourActive) {
            this.finishTour();
          }
        }, 2000);
      }
    }
  }

  scheduleAutoAdvance(delayMs = 2200) {
    this.clearAutoAdvance();

    if (this.tourAutoBar && this.tourAutoFill) {
      this.tourAutoBar.style.display = 'block';
      this.tourAutoFill.style.transition = 'none';
      this.tourAutoFill.style.width = '0%';
      void this.tourAutoFill.offsetWidth; // force repaint
      this.tourAutoFill.style.transition = `width ${delayMs}ms linear`;
      this.tourAutoFill.style.width = '100%';
    }

    let remainingSec = Math.ceil(delayMs / 1000);
    if (this.tourNextBtn) {
      this.tourNextBtn.textContent = this.lang === 'en'
        ? `Auto-Next (${remainingSec}s) ➔`
        : `आगे बढ़ें (${remainingSec}s) ➔`;
    }

    const intervalStart = Date.now();
    this.autoAdvanceInterval = setInterval(() => {
      const elapsed = Date.now() - intervalStart;
      const left = Math.max(0, Math.ceil((delayMs - elapsed) / 1000));
      if (this.tourNextBtn && left > 0) {
        this.tourNextBtn.textContent = this.lang === 'en'
          ? `Auto-Next (${left}s) ➔`
          : `आगे बढ़ें (${left}s) ➔`;
      }
    }, 400);

    this.autoAdvanceTimer = setTimeout(() => {
      this.clearAutoAdvance();
      if (this.isTourActive) {
        this.nextTourStep();
      }
    }, delayMs);
  }

  clearAutoAdvance() {
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = null;
    }
    if (this.autoAdvanceInterval) {
      clearInterval(this.autoAdvanceInterval);
      this.autoAdvanceInterval = null;
    }
    if (this.tourAutoBar) {
      this.tourAutoBar.style.display = 'none';
    }
    if (this.tourAutoFill) {
      this.tourAutoFill.style.transition = 'none';
      this.tourAutoFill.style.width = '0%';
    }
  }

  nextTourStep() {
    this.clearAutoAdvance();
    if (this.currentStep < this.tourSteps.length - 1) {
      this.currentStep++;
      this.renderTourStep(this.currentStep, true);
    } else {
      this.finishTour();
    }
  }

  prevTourStep() {
    this.clearAutoAdvance();
    if (this.currentStep > 0) {
      this.currentStep--;
      this.renderTourStep(this.currentStep, true);
    }
  }

  toggleTourLanguage() {
    this.clearAutoAdvance();
    this.setLanguage(this.lang === 'en' ? 'hi' : 'en');
    this.renderTourStep(this.currentStep, true);
  }

  finishTour() {
    this.clearAutoAdvance();
    const farewellSpeech = this.lang === 'en'
      ? "Awesome! Our guided tour is now complete. You're ready to explore SynapseCareer and find your dream tech role!"
      : "शानदार! हमारा लाइव टूर अब पूरा हुआ। अब आप SynapseCareer एक्सप्लोर कर सकते हैं और अपनी ड्रीम जॉब पा सकते हैं!";
    const farewellText = this.lang === 'en'
      ? "🎉 <strong>Tour Complete!</strong><br>Aria has finished guiding you through the platform. Feel free to explore, customize skills, or take an AI mock interview!"
      : "🎉 <strong>टूर पूरा हुआ!</strong><br>एरिया ने आपको पूरी वेबसाइट समझा दी है। अब आप जॉब्स एक्सप्लोर कर सकते हैं या मॉक इंटरव्यू प्रैक्टिस कर सकते हैं!";

    if (this.tourBubbleTitle) this.tourBubbleTitle.textContent = this.lang === 'en' ? 'Tour Complete! 🎉' : 'टूर समाप्त हुआ! 🎉';
    if (this.tourBubbleText) this.tourBubbleText.innerHTML = farewellText;
    if (this.tourNextBtn) this.tourNextBtn.textContent = this.lang === 'en' ? 'Close & Explore' : 'समाप्त करें';

    if (this.voiceEnabled) {
      this.speak(farewellSpeech, this.lang, () => {
        // When farewell speech finishes, cleanly stop and exit
        this.stopSpeaking();
        setTimeout(() => {
          this.exitTour();
        }, 1200);
      });
      this.triggerSpeakingMovement(4500);
    } else {
      setTimeout(() => {
        this.exitTour();
      }, 3500);
    }
  }

  exitTour() {
    this.clearAutoAdvance();
    this.isTourActive = false;
    this.stopSpeaking();
    this.clearSpotlight();

    if (this.tourBubble) {
      this.tourBubble.style.display = 'none';
    }

    if (this.dockBtn) {
      this.dockBtn.classList.remove('tour-active');
      this.dockBtn.classList.remove('flying');
      this.dockBtn.style.left = '';
      this.dockBtn.style.top = '';
    }
  }

  spotlightElement(targetId) {
    this.clearSpotlight();
    const el = document.getElementById(targetId);
    if (!el) return;

    el.classList.add('aria-spotlight-active');
  }

  clearSpotlight() {
    document.querySelectorAll('.aria-spotlight-active').forEach(node => {
      node.classList.remove('aria-spotlight-active');
    });
  }

  sendUserPrompt(promptText) {
    if (this.chatInput) this.chatInput.value = promptText;
    this.handleSendMessage();
  }

  handleSendMessage() {
    if (!this.chatInput) return;
    const text = this.chatInput.value.trim();
    if (!text) return;

    this.chatInput.value = '';

    // Add user message bubble
    this.appendMessage(text, 'user');

    // Generate AI response with natural slight typing delay
    setTimeout(() => {
      const replyData = this.generateAriaResponse(text);
      this.appendMessage(replyData.html, 'ai', replyData.speechText, replyData.lang);
      this.triggerSpeakingMovement(3800);
      if (this.voiceEnabled) {
        this.speak(replyData.speechText, replyData.lang);
      }
    }, 450);
  }

  triggerSpeakingMovement(durationMs = 2800) {
    if (this.robotRig) {
      this.robotRig.classList.add('speaking');
    }
    if (this.waveContainer) {
      this.waveContainer.classList.add('speaking');
    }
    if (this.tourWaveform) {
      this.tourWaveform.classList.add('speaking');
    }
    if (this.speakingTimer) clearTimeout(this.speakingTimer);
    this.speakingTimer = setTimeout(() => {
      if (!this.synth || !this.synth.speaking) {
        this.stopSpeakingVisuals();
      }
    }, durationMs);
  }

  stopSpeakingVisuals() {
    if (this.robotRig) this.robotRig.classList.remove('speaking');
    if (this.waveContainer) this.waveContainer.classList.remove('speaking');
    if (this.tourWaveform) this.tourWaveform.classList.remove('speaking');
    if (this.speakingTimer) {
      clearTimeout(this.speakingTimer);
      this.speakingTimer = null;
    }
  }

  appendMessage(htmlText, sender, speechText = null, msgLang = 'en') {
    if (!this.chatStream) return;
    const bubble = document.createElement('div');
    bubble.className = `aria-chat-bubble ${sender === 'user' ? 'aria-bubble-user' : 'aria-bubble-ai'}`;

    if (sender === 'ai' && speechText) {
      bubble.innerHTML = `
        <div class="bubble-content">${htmlText}</div>
        <div style="display: flex; justify-content: flex-end; margin-top: 4px;">
          <button class="bubble-speak-btn" title="Listen / सुनें" style="background: none; border: none; font-size: 0.75rem; cursor: pointer; color: #7dd3fc; opacity: 0.8; padding: 2px 6px;">
            🔊 ${msgLang === 'hi' ? 'हिंदी में सुनें' : 'Listen'}
          </button>
        </div>
      `;
      const btn = bubble.querySelector('.bubble-speak-btn');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.unlockAudioContext();
          this.speak(speechText, msgLang);
        });
      }
    } else {
      bubble.innerHTML = htmlText;
    }

    this.chatStream.appendChild(bubble);
    this.chatStream.scrollTop = this.chatStream.scrollHeight;
  }

  generateAriaResponse(query) {
    const q = query.toLowerCase();

    // Auto-detect Hindi script or common Hinglish words
    const hasHindiScript = /[\u0900-\u097F]/.test(query);
    const hasHinglish = /\b(kya|kaise|kaun|kaunsa|batao|kare|seekhe|padhe|kitna|hoga|mujhe|mera|achha|achi|bataiye|hai|hein)\b/i.test(query);
    const isHi = this.lang === 'hi' || hasHindiScript || hasHinglish;

    // Direct Live Website Tour query
    if (q.includes('tour') || q.includes('guide') || q.includes('walkthrough') || q.includes('ghoom') || q.includes('samjha') || q.includes('dikhao') || q.includes('टूर') || q.includes('दिखाओ')) {
      const chosenTourLang = (q.includes('hindi') || q.includes('हिंदी') || isHi) ? 'hi' : 'en';
      setTimeout(() => {
        this.setLanguage(chosenTourLang);
        this.hideChatboxOnly(); // HIDES CHATBOX without killing speech!
        this.startAutonomousTour(0); // LAUNCHES TOUR!
      }, 1200);

      return chosenTourLang === 'hi' ? {
        lang: 'hi',
        html: "🚀 <strong>लाइव वेबसाइट टूर शुरू हो रहा है!</strong><br>चैटबॉक्स बंद करके मैं आपके पास आ रही हूँ और आपको एक-एक करके पूरी वेबसाइट समझाऊँगी। चलिए!",
        speechText: "चैटबॉक्स बंद हो रहा है। चलिए मैं आपको पूरी वेबसाइट लाइव घूमकर समझाती हूँ!"
      } : {
        lang: 'en',
        html: "🚀 <strong>Starting Autonomous Live Tour!</strong><br>Closing the chatbox now. Watch me fly over to each section and explain the entire platform in real time!",
        speechText: "Starting the live tour now. Closing chatbox, follow me across the platform!"
      };
    }

    if (q.includes('career') || q.includes('salary') || q.includes('growth') || q.includes('job') || q.includes('करियर') || q.includes('सैलरी')) {
      return isHi ? {
        lang: 'hi',
        html: "🌟 <strong>2026 के टॉप हाई-ग्रोथ टेक करियर:</strong><br>1. <strong>AI/ML Systems Engineer</strong>: ₹28 - ₹45 LPA (98% ग्रोथ)<br>2. <strong>Cloud & DevOps Architect</strong>: ₹24 - ₹38 LPA (94% डिमांड)<br>3. <strong>Full-Stack Neural Developer</strong>: ₹20 - ₹35 LPA<br><br>👉 नीचे दिए गए <em>'AI Career Matches'</em> पैनल में अपने लिए बेस्ट मैच देखें!",
        speechText: "2026 ke top tech careers hain: AI aur ML Systems Engineer, Cloud and DevOps Architect, aur Full-Stack Neural Developer. AI Career Matches panel mein apni live matching check karein!"
      } : {
        lang: 'en',
        html: "🌟 <strong>Top High-Growth Tech Roles in 2026:</strong><br>1. <strong>AI/ML Systems Engineer</strong> ($165k-$230k, 98% growth)<br>2. <strong>Cloud & Distributed Systems Architect</strong> ($150k-$210k)<br>3. <strong>Full-Stack Neural Developer</strong> ($130k-$190k).<br><br>Check your live match scores in the <em>Ranked Recommendations</em> panel!",
        speechText: "Top high growth tech roles in 2026 are AI and Machine Learning Systems Engineer, Cloud and Distributed Systems Architect, and Full-Stack Neural Developer. Check your live match scores in the recommendations panel."
      };
    }

    if (q.includes('neural') || q.includes('logic') || q.includes('how') || q.includes('math') || q.includes('calculate') || q.includes('मैच') || q.includes('न्यूरल')) {
      return isHi ? {
        lang: 'hi',
        html: "🧠 <strong>न्यूरल मैचिंग कैसे काम करता है:</strong><br>हम आपके 20 टेक्निकल स्किल्स को एक मल्टी-डायमेंशनल लेटेंट वेक्टर में कन्वर्ट करते हैं। हमारा डीप न्यूरल नेटवर्क (64→32→16 लेयर्स) कोसाइन सिमिलैरिटी और रियल-टाइम इंडस्ट्री डिमांड के आधार पर आपके लिए सबसे उपयुक्त जॉब प्रेडिक्ट करता है।",
        speechText: "Neural matching kaise kaam karta hai: Hum aapke technical skills ko multidimensional feature vector mein convert karte hain. Deep neural network cosine similarity ke zariye aapke liye best career predict karta hai."
      } : {
        lang: 'en',
        html: "🧠 <strong>How Neural Matching Works:</strong><br>We convert your proficiencies into a 20-dimensional skill vector. The neural network's dense latent layers compute cosine similarity against target job requirements, weighting by 2026 industry demand in real-time.",
        speechText: "How neural matching works: We convert your proficiencies into a 20-dimensional skill vector. The neural network computes cosine similarity against target job requirements."
      };
    }

    if (q.includes('resume') || q.includes('profile') || q.includes('level') || q.includes('tips') || q.includes('improve') || q.includes('सुधार') || q.includes('रेज़्यूमे')) {
      return isHi ? {
        lang: 'hi',
        html: "⚡ <strong>प्रोफाइल मजबूत करने के 3 टिप्स:</strong><br>1. <strong>लाइव प्रोजेक्ट्स</strong>: गिटहब पर कम से कम 2 डिप्लॉयड प्रोजेक्ट्स (Docker/FastAPI/Next.js) लिंक करें।<br>2. <strong>स्किल गैप पूरा करें</strong>: हमारे 12-हफ़्ते के रोडमैप को फॉलो करें।<br>3. <strong>मॉक इंटरव्यू</strong>: हमारे <strong>AI Mock Interviewer</strong> के साथ लाइव प्रैक्टिस करें!",
        speechText: "Profile improve karne ke teen tips: GitHub par do deployed projects add karein, 12-week roadmap se skill gaps poora karein, aur hamare AI Mock Interviewer ke saath practice karein."
      } : {
        lang: 'en',
        html: "⚡ <strong>3 Steps to Level Up Your Profile:</strong><br>1. Build & deploy 2 real-world portfolio projects (Docker/FastAPI/Next.js).<br>2. Close skill gaps using our 12-Week Interactive Roadmap.<br>3. Practice with our <strong>Mock Interview Studio</strong>!",
        speechText: "Three steps to level up your profile: Build and deploy two real-world portfolio projects on GitHub, close skill gaps using our 12-week roadmap, and practice with our Mock Interview Studio."
      };
    }

    if (q.includes('best') || q.includes('fit') || q.includes('mere') || q.includes('role')) {
      return isHi ? {
        lang: 'hi',
        html: "🎯 <strong>आपके लिए अनुशंसित करियर:</strong><br>आपके प्रोफाइल वेक्टर के आधार पर, <strong>AI/ML Research</strong> और <strong>Cloud Solutions</strong> आपके लिए सबसे हाई-कॉन्फिडेंस मैचेस हैं। आप साइड पैनल से स्किल स्लाइडर्स बदलकर लाइव मैचिंग टेस्ट कर सकते हैं!",
        speechText: "Aapke liye best career fit: Aapke skill profile ke hisaab se AI Research aur Cloud Solutions sabse strong match hain. Sliders adjust karke live match test karein!"
      } : {
        lang: 'en',
        html: "🎯 <strong>Your Best Career Fit:</strong><br>Based on your current skill coefficients, <strong>AI/ML Research</strong> and <strong>Cloud Systems</strong> have the strongest neural alignment. Adjust the sliders in the left panel to test real-time career matching!",
        speechText: "Based on your current skill coefficients, AI Research and Cloud Systems have the strongest neural alignment. Adjust the sliders to test real-time matching."
      };
    }

    // Default friendly answer
    return isHi ? {
      lang: 'hi',
      html: `🤖 <strong>नमस्ते! मैं एरिया हूँ:</strong><br>मैं आपकी पूरी करियर जर्नी में मदद करने के लिए यहाँ हूँ! आप मुझसे टेक जॉब्स, सैलरी, रेज़्यूमे या 12-हफ़्ते के रोडमैप के बारे में कुछ भी पूछ सकते हैं, या ऊपर <strong>'🎯 गाइडेड टूर'</strong> टैब दबाकर पूरा वॉकथ्रू देख सकते हैं!`,
      speechText: "Namaste! Main Aria hoon, aapki AI career mentor. Main aapki poori tech career journey mein madad kar sakti hoon. Mujhse career, salary ya roadmap ke baare mein kuch bhi poochein!"
    } : {
      lang: 'en',
      html: `🤖 <strong>Aria:</strong> I'm always here to guide your tech journey! Ask me about salary brackets, skill gaps, or click the <strong>'Guided Tour'</strong> tab above for an interactive platform walkthrough.`,
      speechText: "Hello! I am Aria, your AI career mentor. I am always here to guide your tech journey. Ask me about salary brackets, skill gaps, or click Guided Tour above!"
    };
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    if (this.voiceToggleBtn) {
      this.voiceToggleBtn.textContent = this.voiceEnabled ? '🔊' : '🔈';
      this.voiceToggleBtn.style.opacity = this.voiceEnabled ? '1' : '0.5';
    }
    if (this.tourVoiceIcon) {
      this.tourVoiceIcon.textContent = this.voiceEnabled ? '🔊' : '🔇';
    }
    if (!this.voiceEnabled) {
      this.stopSpeaking();
    } else if (this.isTourActive) {
      const step = this.tourSteps[this.currentStep];
      const speech = typeof step.speechText === 'object' ? step.speechText[this.lang] : step.speechText;
      this.speak(speech, this.lang);
    }
  }

  speak(text, forcedLang = null, customOnEnd = null) {
    this.stopSpeaking();
    if (!this.synth || !this.voiceEnabled) {
      if (typeof customOnEnd === 'function') customOnEnd();
      return;
    }

    try {
      this.unlockAudioContext();

      const activeLang = forcedLang || this.lang;
      const cleanText = text.replace(/<[^>]*>/g, '').replace(/[*_~`#]/g, '').trim();
      if (!cleanText) {
        if (typeof customOnEnd === 'function') customOnEnd();
        return;
      }

      const voices = (this.synth.getVoices && this.synth.getVoices().length > 0)
        ? this.synth.getVoices()
        : this.voices;

      const hasDevanagari = /[\u0900-\u097F]/.test(cleanText);
      const isHindi = activeLang === 'hi' || hasDevanagari;

      let chosenVoice = null;
      let speechContent = cleanText;

      if (isHindi) {
        chosenVoice = voices.find(v =>
          v.lang.toLowerCase().startsWith('hi') ||
          v.name.toLowerCase().includes('hindi') ||
          v.name.toLowerCase().includes('kalpana') ||
          v.name.toLowerCase().includes('hemant') ||
          v.name.toLowerCase().includes('google हिन्दी')
        );

        if (!chosenVoice) {
          chosenVoice = voices.find(v =>
            v.lang.toLowerCase().includes('en-in') ||
            v.name.toLowerCase().includes('india') ||
            v.name.toLowerCase().includes('heera') ||
            v.name.toLowerCase().includes('neerja')
          );
        }

        const currentStepObj = this.tourSteps[this.currentStep];
        if (currentStepObj && currentStepObj.speechText && currentStepObj.speechText.hiPhonetic) {
          if (!chosenVoice || !chosenVoice.lang.toLowerCase().startsWith('hi')) {
            speechContent = currentStepObj.speechText.hiPhonetic;
          }
        }
      } else {
        chosenVoice = voices.find(v =>
          (v.name.includes('Natural') || v.name.includes('Aria') || v.name.includes('Google') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('David')) &&
          v.lang.startsWith('en')
        );
      }

      if (!chosenVoice && voices.length > 0) {
        chosenVoice = voices[0];
      }

      this.currentUtterance = new SpeechSynthesisUtterance(speechContent);
      this.currentUtterance.rate = isHindi ? 0.98 : 1.0;
      this.currentUtterance.pitch = 1.06;

      if (chosenVoice) {
        this.currentUtterance.voice = chosenVoice;
        this.currentUtterance.lang = chosenVoice.lang;
      } else {
        this.currentUtterance.lang = isHindi ? 'hi-IN' : 'en-US';
      }

      // Track if onend was already called to prevent double-firing
      let speechEndHandled = false;
      const handleSpeechEnd = () => {
        if (speechEndHandled) return;
        speechEndHandled = true;
        // Clear watchdog since speech ended properly
        if (this.speechWatchdogTimer) {
          clearInterval(this.speechWatchdogTimer);
          this.speechWatchdogTimer = null;
        }
        this.stopSpeakingVisuals();
        if (typeof customOnEnd === 'function') {
          customOnEnd();
        } else {
          this.handleSpeechEnded();
        }
      };

      this.currentUtterance.onstart = () => {
        if (this.waveContainer) this.waveContainer.classList.add('speaking');
        if (this.tourWaveform) this.tourWaveform.classList.add('speaking');
        if (this.robotRig) this.robotRig.classList.add('speaking');

        // ═══ WATCHDOG: Polls every 400ms. If synth stopped speaking but onend didn't fire
        //     (common Chrome bug), trigger handleSpeechEnd manually. ═══
        if (this.speechWatchdogTimer) clearInterval(this.speechWatchdogTimer);
        this.speechWatchdogTimer = setInterval(() => {
          if (!this.synth) return;
          if (!this.synth.speaking && !this.synth.pending) {
            // Speech finished but onend may not have fired
            clearInterval(this.speechWatchdogTimer);
            this.speechWatchdogTimer = null;
            handleSpeechEnd();
          }
        }, 400);
      };

      this.currentUtterance.onend = () => {
        handleSpeechEnd();
      };

      this.currentUtterance.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') return; // Intentional stop
        console.warn('Speech synthesis error:', e);
        handleSpeechEnd();
      };

      this.synth.speak(this.currentUtterance);

      // Backup: if onstart never fires (rare Chrome edge case), start watchdog after 1.2s
      setTimeout(() => {
        if (!speechEndHandled && !this.speechWatchdogTimer) {
          this.speechWatchdogTimer = setInterval(() => {
            if (!this.synth) return;
            if (!this.synth.speaking && !this.synth.pending) {
              clearInterval(this.speechWatchdogTimer);
              this.speechWatchdogTimer = null;
              handleSpeechEnd();
            }
          }, 400);
        }
      }, 1200);
    } catch (e) {
      console.warn('Speech synthesis unavailable', e);
      this.stopSpeakingVisuals();
      if (typeof customOnEnd === 'function') customOnEnd();
    }
  }

  stopSpeaking() {
    this.clearAutoAdvance();
    // Clear watchdog timer on manual stop
    if (this.speechWatchdogTimer) {
      clearInterval(this.speechWatchdogTimer);
      this.speechWatchdogTimer = null;
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.warn('Synth cancel error:', e);
      }
    }
    this.stopSpeakingVisuals();
  }
}
