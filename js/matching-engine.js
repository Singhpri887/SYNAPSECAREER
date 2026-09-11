import { ALL_SKILLS, JOB_DATABASE } from './job-data.js';

export class MatchingEngine {
  constructor(jobDatabase = JOB_DATABASE, skillsList = ALL_SKILLS) {
    this.jobs = jobDatabase;
    this.skills = skillsList;
    this.apiBaseUrl = 'http://127.0.0.1:5000';
  }

  /**
   * Optionally requests neural inference from the live Python backend
   */
  async fetchBackendMatch(studentSkills) {
    try {
      const resp = await fetch(`${this.apiBaseUrl}/api/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: studentSkills })
      });
      if (resp.ok) {
        return await resp.json();
      }
    } catch (e) {
      // Backend not running or unreachable, fallback silently
    }
    return null;
  }

  /**
   * Computes comprehensive AI suitability score and metrics for all jobs given student skills
   * @param {Object} studentSkills - Map of skillId -> score (0-100)
   * @returns {Array} Array of ranked job matches with metrics
   */
  evaluateSuitability(studentSkills) {
    const results = this.jobs.map(job => {
      const evaluation = this.evaluateSingleJob(job, studentSkills);
      return {
        ...job,
        evaluation
      };
    });

    // Rank descending by final match score
    return results.sort((a, b) => b.evaluation.overallScore - a.evaluation.overallScore);
  }

  /**
   * Evaluates a single job against student skills
   */
  evaluateSingleJob(job, studentSkills) {
    let weightedSum = 0;
    let totalWeight = 0;
    const skillBreakdowns = [];
    const gaps = [];
    const strengths = [];

    job.requiredSkills.forEach(req => {
      const studentLevel = studentSkills[req.id] || 0;
      const weight = req.weight || 1.0;
      totalWeight += weight;

      // Fulfillment calculation with saturation over minLevel
      const ratio = Math.min(1.2, studentLevel / req.minLevel);
      const scoreContribution = Math.min(100, ratio * 100);
      weightedSum += scoreContribution * weight;

      const skillMeta = this.skills.find(s => s.id === req.id) || { name: req.id, icon: '✨' };

      const detail = {
        id: req.id,
        name: skillMeta.name,
        icon: skillMeta.icon,
        required: req.minLevel,
        current: studentLevel,
        met: studentLevel >= req.minLevel,
        gap: Math.max(0, req.minLevel - studentLevel),
        fulfillment: Math.round(scoreContribution)
      };

      skillBreakdowns.push(detail);

      if (studentLevel >= req.minLevel) {
        strengths.push(detail);
      } else {
        gaps.push(detail);
      }
    });

    // Base score is weighted average
    const baseScore = Math.round(weightedSum / totalWeight);

    // Vector cosine similarity computation across common skill space
    const cosineSim = this.computeCosineSimilarity(job.requiredSkills, studentSkills);

    // Final blended suitability score (85% weighted requirements + 15% vector alignment)
    const rawScore = (baseScore * 0.85) + (cosineSim * 15);
    const overallScore = Math.min(99, Math.max(12, Math.round(rawScore)));

    // Categorize tier
    let tier = 'Developing Fit';
    let tierBadgeClass = 'tier-developing';
    if (overallScore >= 88) {
      tier = 'Exceptional Match';
      tierBadgeClass = 'tier-exceptional';
    } else if (overallScore >= 75) {
      tier = 'High Potential';
      tierBadgeClass = 'tier-high';
    } else if (overallScore >= 60) {
      tier = 'Solid Alignment';
      tierBadgeClass = 'tier-solid';
    }

    return {
      overallScore,
      baseScore,
      cosineSim: Math.round(cosineSim * 100),
      tier,
      tierBadgeClass,
      strengths,
      gaps: gaps.sort((a, b) => b.gap - a.gap),
      skillBreakdowns
    };
  }

  /**
   * Vector cosine similarity between student and job target vectors
   */
  computeCosineSimilarity(requiredSkills, studentSkills) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    requiredSkills.forEach(req => {
      const valA = req.minLevel;
      const valB = studentSkills[req.id] || 0;
      dotProduct += valA * valB;
      normA += valA * valA;
      normB += valB * valB;
    });

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Simulates an AI NLP extraction on a resume text or bio
   * Detects keywords and assigns baseline skill levels
   */
  parseTextToSkills(text) {
    const lower = text.toLowerCase();
    const detectedSkills = {};

    const keywordMap = {
      python: ['python', 'pandas', 'numpy', 'scipy', 'django', 'flask', 'fastapi'],
      pytorch: ['pytorch', 'tensorflow', 'keras', 'cuda', 'huggingface', 'tensors'],
      sql: ['sql', 'postgres', 'postgresql', 'mysql', 'database', 'queries', 'bigquery'],
      data_analysis: ['analysis', 'eda', 'visualization', 'tableau', 'powerbi', 'cleaning'],
      math_stats: ['statistics', 'linear algebra', 'calculus', 'probability', 'stochastic'],
      deep_learning: ['cnn', 'rnn', 'transformer', 'neural', 'backprop', 'diffusion'],
      nlp_llm: ['nlp', 'llm', 'rag', 'langchain', 'llama', 'gpt', 'token', 'embeddings'],
      javascript: ['javascript', 'typescript', 'node', 'es6', 'js', 'html', 'css'],
      react: ['react', 'next.js', 'vue', 'frontend', 'redux', 'tailwind'],
      api_design: ['api', 'rest', 'graphql', 'endpoints', 'microservices'],
      docker_k8s: ['docker', 'kubernetes', 'k8s', 'containers', 'helm', 'dockerfile'],
      cloud_infra: ['aws', 'gcp', 'azure', 'cloud', 's3', 'ec2', 'cloud run', 'serverless'],
      distributed_sys: ['distributed', 'concurrency', 'kafka', 'redis', 'consensus', 'raft'],
      problem_solving: ['algorithms', 'data structures', 'leetcode', 'hackerrank', 'optimization'],
      system_design: ['system design', 'architecture', 'scalability', 'load balancing'],
      ui_ux: ['ui', 'ux', 'wireframe', 'figma', 'user research', 'interaction'],
      product_strategy: ['product', 'roadmap', 'kpi', 'metrics', 'agile', 'scrum'],
      cybersecurity: ['security', 'auth', 'oauth', 'jwt', 'encryption', 'owasp', 'firewall'],
      git_collaboration: ['git', 'github', 'pr', 'pull request', 'code review', 'collaboration'],
      communication: ['presentation', 'speaking', 'documentation', 'written', 'leadership']
    };

    for (const [skillId, keywords] of Object.entries(keywordMap)) {
      let matches = 0;
      keywords.forEach(kw => {
        if (lower.includes(kw)) matches++;
      });

      if (matches > 0) {
        // Base proficiency between 60 and 92 depending on frequency
        const estimated = Math.min(95, 55 + (matches * 12));
        detectedSkills[skillId] = estimated;
      }
    }

    return detectedSkills;
  }
}
