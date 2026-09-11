/**
 * Holographic Neural Network Canvas Visualizer
 * Renders 3-layer neural architecture:
 * Layer 0: Student Skills (Input features)
 * Layer 1: Latent Neural Representation (Hidden dense layer with activation pulses)
 * Layer 2: Target Career Nodes (Output suitability predictions)
 * Also renders ambient floating Python code telemetry & particle physics
 */

export class NeuralVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.width = 0;
    this.height = 0;
    this.pixelRatio = window.devicePixelRatio || 1;

    // Simulation nodes & state
    this.inputNodes = [];
    this.hiddenNodes = [];
    this.outputNodes = [];
    this.synapses = [];
    this.particles = [];
    this.codeStreams = [];
    this.activeJobId = null;
    this.hoveredNode = null;

    // Mouse interaction
    this.mouse = { x: -1000, y: -1000, isHovering: false };

    // Python code snippets for ambient backdrop flow
    this.pythonSnippets = [
      'def match_skills(student_profile, job_database):',
      '    tensor = torch.tensor(student_profile.vectors)',
      '    weights = self.synaptic_weights.forward(tensor)',
      '    suitability = F.cosine_similarity(weights, job_embedding)',
      '    return F.softmax(suitability * temperature, dim=-1)',
      'class NeuralJobRecommender(nn.Module):',
      '    def __init__(self, in_features=20, hidden_dim=64):',
      '        self.dense_1 = nn.Linear(in_features, hidden_dim)',
      '        self.activation = nn.GELU()',
      '        self.dropout = nn.Dropout(p=0.15)',
      '    latent_rep = self.activation(self.dense_1(x))',
      '>>> loss.backward()  # Gradient descent converged (lr=0.001)',
      '>>> Top candidate match verified: 94.2% suitability index',
      '>>> Vector dimension normalized: L2_norm(vec) == 1.000',
      '>>> Attention scores: [Python: 0.95, PyTorch: 0.88, Stats: 0.91]'
    ];

    this.initResize();
    this.initCodeStreams();
    this.initParticles();
    this.bindEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initResize() {
    const handleResize = () => {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.width = Math.max(320, rect.width);
      this.height = Math.max(380, rect.height || 460);

      this.canvas.width = this.width * this.pixelRatio;
      this.canvas.height = this.height * this.pixelRatio;
      this.ctx.scale(this.pixelRatio, this.pixelRatio);

      this.rebuildNetworkTopology();
    };

    window.addEventListener('resize', handleResize);
    handleResize();
  }

  bindEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.isHovering = true;
      this.checkNodeHover();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
      this.mouse.isHovering = false;
      this.hoveredNode = null;
    });

    this.canvas.addEventListener('click', () => {
      if (this.hoveredNode && this.hoveredNode.type === 'output' && this.onJobSelect) {
        this.onJobSelect(this.hoveredNode.data.id);
      }
    });
  }

  initCodeStreams() {
    this.codeStreams = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      this.codeStreams.push({
        text: this.pythonSnippets[i % this.pythonSnippets.length],
        x: Math.random() * 400 + 40,
        y: Math.random() * 300 + 50,
        speed: 0.25 + Math.random() * 0.35,
        opacity: 0.12 + Math.random() * 0.18,
        size: 11 + Math.floor(Math.random() * 3)
      });
    }
  }

  initParticles() {
    this.particles = [];
    const num = 45;
    for (let i = 0; i < num; i++) {
      this.particles.push({
        x: Math.random() * 800,
        y: Math.random() * 500,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.5 ? '#00f0ff' : '#00ff9d'
      });
    }
  }

  /**
   * Updates visualizer with latest student skills and evaluated job matches
   */
  updateData(studentSkills, rankedJobs, activeJobId = null) {
    this.currentSkills = studentSkills;
    this.currentJobs = rankedJobs;
    this.activeJobId = activeJobId || (rankedJobs[0] ? rankedJobs[0].id : null);
    this.rebuildNetworkTopology();
  }

  setActiveJob(jobId) {
    this.activeJobId = jobId;
  }

  rebuildNetworkTopology() {
    if (!this.width || !this.height) return;

    this.inputNodes = [];
    this.hiddenNodes = [];
    this.outputNodes = [];
    this.synapses = [];

    // Filter top skills active for the student (sorted descending by level for highest neural activation)
    const activeSkillsList = Object.entries(this.currentSkills || {})
      .filter(([_, level]) => level > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    // If empty, supply placeholder skills
    const displaySkills = activeSkillsList.length > 0 ? activeSkillsList : [
      ['python', 85],
      ['pytorch', 80],
      ['math_stats', 75],
      ['problem_solving', 82],
      ['data_analysis', 70]
    ];

    // Layer 0: Input Nodes (Left side)
    const inputX = this.width * 0.14;
    const inputSpacing = (this.height - 100) / (displaySkills.length + 1);
    displaySkills.forEach(([id, level], idx) => {
      this.inputNodes.push({
        id,
        type: 'input',
        label: id.replace('_', ' ').toUpperCase(),
        level,
        x: inputX,
        y: 60 + (idx + 1) * inputSpacing,
        radius: 14,
        glowColor: '#00f0ff'
      });
    });

    // Layer 1: Hidden Dense Latent Layer (Center)
    const hiddenX = this.width * 0.50;
    const hiddenCount = 5;
    const hiddenSpacing = (this.height - 110) / (hiddenCount + 1);
    for (let i = 0; i < hiddenCount; i++) {
      this.hiddenNodes.push({
        id: `h_${i}`,
        type: 'hidden',
        label: `H${i + 1}`,
        x: hiddenX,
        y: 65 + (i + 1) * hiddenSpacing,
        radius: 8,
        pulseOffset: i * 1.2,
        glowColor: '#00ff9d'
      });
    }

    // Layer 2: Output Nodes (Right side)
    const outputX = this.width * 0.84;
    const displayJobs = (this.currentJobs || []).slice(0, 5);
    const outputSpacing = (this.height - 100) / (displayJobs.length + 1);

    displayJobs.forEach((job, idx) => {
      this.outputNodes.push({
        id: job.id,
        type: 'output',
        label: job.title.length > 20 ? job.title.substring(0, 18) + '…' : job.title,
        score: job.evaluation ? job.evaluation.overallScore : 85,
        data: job,
        x: outputX,
        y: 60 + (idx + 1) * outputSpacing,
        radius: 16,
        glowColor: job.id === this.activeJobId ? '#ffd15c' : '#00f0ff'
      });
    });

    // Create Synaptic Connections: Input -> Hidden
    this.inputNodes.forEach(inNode => {
      const inFactor = ((inNode.level || 50) / 100);
      this.hiddenNodes.forEach(hNode => {
        this.synapses.push({
          from: inNode,
          to: hNode,
          weight: inFactor * 0.6 + 0.4,
          pulseProgress: Math.random(),
          speed: 0.007 + inFactor * 0.016,
          active: true
        });
      });
    });

    // Create Synaptic Connections: Hidden -> Output
    this.hiddenNodes.forEach(hNode => {
      this.outputNodes.forEach(outNode => {
        const isTarget = outNode.id === this.activeJobId;
        this.synapses.push({
          from: hNode,
          to: outNode,
          weight: isTarget ? 1.0 : Math.random() * 0.5 + 0.2,
          pulseProgress: Math.random(),
          speed: isTarget ? 0.018 : 0.009,
          active: isTarget
        });
      });
    });
  }

  checkNodeHover() {
    const allNodes = [...this.inputNodes, ...this.hiddenNodes, ...this.outputNodes];
    let found = null;
    for (const node of allNodes) {
      const dist = Math.hypot(this.mouse.x - node.x, this.mouse.y - node.y);
      if (dist < node.radius + 10) {
        found = node;
        break;
      }
    }
    this.hoveredNode = found;
    this.canvas.style.cursor = found ? (found.type === 'output' ? 'pointer' : 'crosshair') : 'default';
  }

  animate(timestamp) {
    if (!this.ctx || !this.width) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw ambient Python code stream
    this.drawCodeStreams();

    // 2. Draw cybernetic background particles
    this.drawParticles();

    // 3. Draw Synaptic Links with glowing pulses
    this.drawSynapses(timestamp);

    // 4. Draw Layer Nodes
    this.drawNodes(timestamp);

    // 5. Draw Layer Column Headers (HUD annotations)
    this.drawHUDHeaders();

    requestAnimationFrame(this.animate);
  }

  drawCodeStreams() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    this.ctx.save();
    this.ctx.font = '11px "JetBrains Mono", Consolas, monospace';
    this.codeStreams.forEach(stream => {
      this.ctx.fillStyle = isLight 
        ? `rgba(2, 132, 199, ${stream.opacity * 0.85})` 
        : `rgba(0, 240, 255, ${stream.opacity})`;
      this.ctx.fillText(stream.text, stream.x, stream.y);
      stream.y += stream.speed;
      if (stream.y > this.height + 20) {
        stream.y = -20;
        stream.x = Math.random() * (this.width - 250);
      }
    });
    this.ctx.restore();
  }

  drawParticles() {
    this.ctx.save();
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Mouse repulsion
      if (this.mouse.isHovering) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 80) {
          p.x += (dx / dist) * 2;
          p.y += (dy / dist) * 2;
        }
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
    });
    this.ctx.restore();
  }

  drawSynapses(timestamp) {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    this.ctx.save();
    this.synapses.forEach(syn => {
      const isHighlighted = syn.to.id === this.activeJobId ||
        (this.hoveredNode && (syn.from === this.hoveredNode || syn.to === this.hoveredNode));

      this.ctx.beginPath();
      this.ctx.moveTo(syn.from.x, syn.from.y);
      this.ctx.lineTo(syn.to.x, syn.to.y);

      if (isHighlighted) {
        this.ctx.strokeStyle = syn.to.id === this.activeJobId 
          ? (isLight ? 'rgba(217, 119, 6, 0.7)' : 'rgba(255, 209, 92, 0.45)') 
          : (isLight ? 'rgba(5, 150, 105, 0.7)' : 'rgba(0, 255, 157, 0.6)');
        this.ctx.lineWidth = 2.0;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = isLight ? '#0284c7' : '#00f0ff';
      } else {
        this.ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.15)' : 'rgba(0, 240, 255, 0.08)';
        this.ctx.lineWidth = 0.8;
        this.ctx.shadowBlur = 0;
      }
      this.ctx.stroke();

      // Traveling glowing signal pulse
      syn.pulseProgress = (syn.pulseProgress + syn.speed) % 1.0;
      const px = syn.from.x + (syn.to.x - syn.from.x) * syn.pulseProgress;
      const py = syn.from.y + (syn.to.y - syn.from.y) * syn.pulseProgress;

      this.ctx.beginPath();
      this.ctx.arc(px, py, isHighlighted ? 3.5 : 1.8, 0, Math.PI * 2);
      this.ctx.fillStyle = isHighlighted 
        ? (isLight ? '#d97706' : '#ffd15c') 
        : (isLight ? '#059669' : '#00ff9d');
      this.ctx.shadowBlur = isHighlighted ? 12 : 6;
      this.ctx.shadowColor = isLight ? '#059669' : '#00ff9d';
      this.ctx.fill();
    });
    this.ctx.restore();
  }

  drawNodes(timestamp) {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const allNodes = [...this.inputNodes, ...this.hiddenNodes, ...this.outputNodes];

    allNodes.forEach(node => {
      const isHovered = this.hoveredNode === node;
      const isActiveJob = node.type === 'output' && node.id === this.activeJobId;

      this.ctx.save();

      // Outer pulsating aura
      const pulseRate = Math.sin((timestamp / 450) + (node.pulseOffset || 0));
      const auraRadius = node.radius + (isHovered || isActiveJob ? 6 + pulseRate * 2.5 : 2 + pulseRate * 1.5);

      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, auraRadius, 0, Math.PI * 2);
      this.ctx.strokeStyle = isActiveJob 
        ? (isLight ? '#d97706' : '#ffd15c') 
        : (isHovered ? (isLight ? '#059669' : '#00ff9d') : node.glowColor);
      this.ctx.lineWidth = isActiveJob ? 2.5 : 1.2;
      this.ctx.globalAlpha = isActiveJob ? 0.8 : (isHovered ? 0.9 : 0.4);
      this.ctx.shadowBlur = isActiveJob ? 18 : 10;
      this.ctx.shadowColor = node.glowColor;
      this.ctx.stroke();

      // Inner Core Node Circle
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = isActiveJob 
        ? (isLight ? '#fef3c7' : '#1b2234') 
        : (isLight ? '#ffffff' : '#0c1220');
      this.ctx.globalAlpha = 0.95;
      this.ctx.fill();
      this.ctx.strokeStyle = isActiveJob 
        ? (isLight ? '#d97706' : '#ffd15c') 
        : node.glowColor;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Core center glowing pip
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2);
      this.ctx.fillStyle = isActiveJob 
        ? (isLight ? '#d97706' : '#ffd15c') 
        : (isHovered ? (isLight ? '#059669' : '#00ff9d') : node.glowColor);
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = node.glowColor;
      this.ctx.fill();

      // Text Labels
      this.ctx.font = '600 11px "Outfit", sans-serif';
      this.ctx.fillStyle = isActiveJob 
        ? (isLight ? '#b45309' : '#ffd15c') 
        : (isLight ? '#0f172a' : '#e0eaff');
      this.ctx.shadowBlur = isLight ? 0 : 4;
      this.ctx.shadowColor = '#000000';

      if (node.type === 'input') {
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`${node.label} [${node.level}%]`, node.x - node.radius - 10, node.y + 4);
      } else if (node.type === 'output') {
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`${node.label}`, node.x + node.radius + 12, node.y - 2);

        // Subtext with match score badge
        this.ctx.font = '700 12px "JetBrains Mono", monospace';
        this.ctx.fillStyle = isActiveJob 
          ? (isLight ? '#d97706' : '#ffd15c') 
          : (isLight ? '#059669' : '#00ff9d');
        this.ctx.fillText(`MATCH: ${node.score}%`, node.x + node.radius + 12, node.y + 14);
      } else {
        // Hidden node label
        this.ctx.textAlign = 'center';
        this.ctx.font = '500 9px "JetBrains Mono", monospace';
        this.ctx.fillStyle = isLight ? '#059669' : 'rgba(0, 255, 157, 0.7)';
        this.ctx.fillText(node.label, node.x, node.y - node.radius - 4);
      }

      this.ctx.restore();
    });
  }

  drawHUDHeaders() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    this.ctx.save();
    this.ctx.font = '700 11px "JetBrains Mono", monospace';
    this.ctx.letterSpacing = '1px';

    // Input Layer Header
    this.ctx.fillStyle = isLight ? 'rgba(2, 132, 199, 0.95)' : 'rgba(0, 240, 255, 0.8)';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('⟨ LAYER 01: STUDENT SKILL VECTOR ⟩', this.width * 0.15, 28);

    // Hidden Representation Header
    this.ctx.fillStyle = isLight ? 'rgba(5, 150, 105, 0.95)' : 'rgba(0, 255, 157, 0.8)';
    this.ctx.fillText('⟨ LAYER 02: NEURAL LATENT MATCH ⟩', this.width * 0.50, 28);

    // Career Target Header
    this.ctx.fillStyle = isLight ? 'rgba(217, 119, 6, 0.95)' : 'rgba(255, 209, 92, 0.9)';
    this.ctx.fillText('⟨ LAYER 03: SUITABILITY PREDICTOR ⟩', this.width * 0.84, 28);

    // Glowing divider line under headers
    this.ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.25)' : 'rgba(0, 240, 255, 0.2)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(30, 42);
    this.ctx.lineTo(this.width - 30, 42);
    this.ctx.stroke();

    this.ctx.restore();
  }

  triggerPulseEffect() {
    // Accelerate synapse pulses temporarily for a high-tech scan wave
    this.synapses.forEach(s => {
      s.speed = s.speed * 3.5;
    });
    setTimeout(() => {
      this.synapses.forEach(s => {
        s.speed = s.speed / 3.5;
      });
    }, 1200);
  }
}
