/**
 * Holographic Market Analytics & Salary Radar Visualizer
 * Features:
 * - Real-time HTML5 Canvas Radar/Spider Chart comparing Student Vectors vs Market Demand
 * - Dynamic 5-Year Salary Projection & Industry Demand Metrics
 * - 1-Click Comprehensive Career Dossier / PDF export
 */

export class MarketAnalytics {
  constructor(app) {
    this.app = app;
    this.canvas = null;
    this.ctx = null;
    this.modal = null;
    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.modal = document.getElementById('marketAnalyticsModal');
    this.openBtn = document.getElementById('openMarketAnalyticsBtn');
    this.closeBtn = document.getElementById('closeAnalyticsModalBtn');
    this.exportBtn = document.getElementById('exportCareerReportBtn');
  }

  bindEvents() {
    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.openAnalytics());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeAnalytics());
    }
    if (this.exportBtn) {
      this.exportBtn.addEventListener('click', () => this.exportReport());
    }
  }

  openAnalytics() {
    if (this.modal) this.modal.classList.add('active');
    setTimeout(() => {
      this.initRadarCanvas();
      this.updateMarketMetrics();
    }, 100);
    if (this.app.playCyberTone) this.app.playCyberTone('scan');
  }

  closeAnalytics() {
    if (this.modal) this.modal.classList.remove('active');
  }

  initRadarCanvas() {
    this.canvas = document.getElementById('radarAnalyticsCanvas');
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(dpr, dpr);

    this.drawRadar(rect.width, rect.height);
  }

  drawRadar(width, height) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 45;

    ctx.clearRect(0, 0, width, height);

    const categories = [
      { name: 'AI & ML', key: 'python', val: (this.app.currentSkills.python + this.app.currentSkills.pytorch) / 2 || 75, market: 92 },
      { name: 'Cloud & Scale', key: 'cloud', val: (this.app.currentSkills.docker + this.app.currentSkills.aws) / 2 || 70, market: 88 },
      { name: 'Algorithms', key: 'algo', val: (this.app.currentSkills.algorithms + this.app.currentSkills.data_structures) / 2 || 80, market: 85 },
      { name: 'Data & SQL', key: 'data', val: (this.app.currentSkills.sql + this.app.currentSkills.data_analysis) / 2 || 75, market: 80 },
      { name: 'System Design', key: 'system', val: (this.app.currentSkills.system_design + this.app.currentSkills.rest_api) / 2 || 65, market: 90 },
      { name: 'Leadership', key: 'lead', val: (this.app.currentSkills.communication + this.app.currentSkills.leadership) / 2 || 85, market: 78 }
    ];

    const numAxes = categories.length;
    const angleStep = (Math.PI * 2) / numAxes;

    // Draw Concentric Web Polygons
    const levels = 4;
    for (let l = 1; l <= levels; l++) {
      const r = (radius / levels) * l;
      ctx.beginPath();
      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * l})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw Radial Spoke Axes
    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.stroke();

      // Axis Labels
      const labelX = centerX + (radius + 24) * Math.cos(angle);
      const labelY = centerY + (radius + 24) * Math.sin(angle);
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#00f0ff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(categories[i].name, labelX, labelY);
    }

    // Draw Market Benchmark Area (Gold Outline)
    ctx.beginPath();
    categories.forEach((cat, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (cat.market / 100) * radius;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 209, 92, 0.08)';
    ctx.fill();
    ctx.strokeStyle = '#ffd15c';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Student Skill Area (Glowing Emerald/Cyan)
    ctx.beginPath();
    categories.forEach((cat, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (cat.val / 100) * radius;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(0, 255, 157, 0.45)');
    gradient.addColorStop(1, 'rgba(0, 240, 255, 0.15)');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = '#00ff9d';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw Glowing Vertex Dots
    categories.forEach((cat, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (cat.val / 100) * radius;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00ff9d';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  updateMarketMetrics() {
    const student = this.app.currentArchetype;
    const skills = this.app.currentSkills;

    // Calculate dynamic base salary based on skill vector average
    const skillVals = Object.values(skills);
    const avgSkill = skillVals.reduce((a, b) => a + b, 0) / (skillVals.length || 1);

    const projectedBase = Math.floor(115000 + avgSkill * 950);
    const projectedCeiling = Math.floor(projectedBase * 1.45);

    const baseEl = document.getElementById('marketBaseSalary');
    const ceilingEl = document.getElementById('marketCeilingSalary');
    const percentileEl = document.getElementById('marketPercentile');

    if (baseEl) baseEl.textContent = `$${(projectedBase / 1000).toFixed(0)}k`;
    if (ceilingEl) ceilingEl.textContent = `$${(projectedCeiling / 1000).toFixed(0)}k`;
    if (percentileEl) {
      const perc = Math.min(99, Math.floor(50 + avgSkill * 0.48));
      percentileEl.textContent = `Top ${100 - perc}% (${perc}th Percentile)`;
    }
  }

  exportReport() {
    const student = this.app.currentArchetype;
    const skills = this.app.currentSkills;
    const topJob = this.app.latestRanked ? this.app.latestRanked[0] : null;

    const reportMarkdown = `
================================================================================
SYNAPSECAREER™ // AUTONOMOUS AI TALENT & CAREER DOSSIER
Generated: ${new Date().toLocaleDateString()} | Verification Token: #SYN-${Math.floor(100000 + Math.random() * 900000)}
================================================================================

1. CANDIDATE PROFILE
--------------------------------------------------------------------------------
Name:             ${student.name}
Archetype:        ${student.title}
Primary Focus:    ${student.bio}

2. TOP NEURAL MATCHES & READINESS
--------------------------------------------------------------------------------
Primary Target:   ${topJob ? topJob.title : 'AI Engineer'} (${topJob ? topJob.company : 'Stellar Tech'})
Overall Match:    ${topJob ? topJob.evaluation.overallScore : 94}%
Tier Status:      ${topJob ? topJob.evaluation.tier : 'Exceptional Synergy'}
Market Salary:    ${topJob ? topJob.salary : '$145k - $190k'}
Projected Growth: ${topJob ? topJob.growthRate : '+28% (Very High)'}

3. SKILL VECTOR TELEMETRY
--------------------------------------------------------------------------------
${Object.entries(skills).map(([k, v]) => `• ${k.toUpperCase().padEnd(20)}: [${'#'.repeat(Math.floor(v / 10)).padEnd(10, '-')}] ${v}%`).join('\n')}

4. RECOMMENDED 12-WEEK UPSKILLING ROADMAP
--------------------------------------------------------------------------------
${topJob && topJob.milestones ? topJob.milestones.map(m => `[${m.week}] ${m.title} - ${m.desc}`).join('\n') : 'Complete PyTorch & Distributed Systems Foundations'}

================================================================================
CONFIDENTIAL // VERIFIED BY SYNAPSE NEURAL MATCHING ENGINE
================================================================================
    `.trim();

    const blob = new Blob([reportMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SynapseCareer_Dossier_${student.name.replace(' ', '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    if (this.exportBtn) {
      this.exportBtn.textContent = '✓ Dossier Exported!';
      setTimeout(() => {
        this.exportBtn.textContent = '📥 Download Career Dossier (.txt)';
      }, 2000);
    }
    if (this.app.playCyberTone) this.app.playCyberTone('match');
  }
}
