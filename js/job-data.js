// Comprehensive Tech & AI Career Taxonomy & Job Profiles
export const ALL_SKILLS = [
  { id: 'python', name: 'Python', category: 'Programming', icon: '🐍' },
  { id: 'pytorch', name: 'PyTorch / TensorFlow', category: 'AI & ML', icon: '🧠' },
  { id: 'sql', name: 'SQL & Database Design', category: 'Data', icon: '🗄️' },
  { id: 'data_analysis', name: 'Data Analysis & Pandas', category: 'Data', icon: '📊' },
  { id: 'math_stats', name: 'Math & Statistics', category: 'Foundations', icon: '📐' },
  { id: 'deep_learning', name: 'Deep Learning & Neural Nets', category: 'AI & ML', icon: '⚡' },
  { id: 'nlp_llm', name: 'NLP & Large Language Models', category: 'AI & ML', icon: '💬' },
  { id: 'javascript', name: 'JavaScript / TypeScript', category: 'Programming', icon: '🌐' },
  { id: 'react', name: 'React / Next.js', category: 'Frontend', icon: '⚛️' },
  { id: 'api_design', name: 'REST & GraphQL APIs', category: 'Backend', icon: '🔌' },
  { id: 'docker_k8s', name: 'Docker & Kubernetes', category: 'DevOps & Cloud', icon: '🐳' },
  { id: 'cloud_infra', name: 'GCP / AWS Cloud Infra', category: 'DevOps & Cloud', icon: '☁️' },
  { id: 'distributed_sys', name: 'Distributed Systems', category: 'Engineering', icon: '🔗' },
  { id: 'problem_solving', name: 'Algorithms & Problem Solving', category: 'Foundations', icon: '🧩' },
  { id: 'system_design', name: 'System Architecture', category: 'Engineering', icon: '🏗️' },
  { id: 'ui_ux', name: 'UI/UX & Design Thinking', category: 'Product', icon: '🎨' },
  { id: 'product_strategy', name: 'Product Roadmapping & Metrics', category: 'Product', icon: '🎯' },
  { id: 'cybersecurity', name: 'Application Security', category: 'Security', icon: '🛡️' },
  { id: 'git_collaboration', name: 'Git & Agile Teamwork', category: 'Collaboration', icon: '👥' },
  { id: 'communication', name: 'Technical Storytelling', category: 'Collaboration', icon: '📢' }
];

export const JOB_DATABASE = [
  {
    id: 'data-scientist',
    title: 'AI Data Scientist',
    company: 'Nexus Intelligence Labs',
    category: 'AI & Data',
    salary: '$125,000 - $165,000',
    matchBenchmark: 88,
    growthRate: '+36% Demand (High)',
    hiringOutlook: 'Immediate Intake',
    suitabilityDescription: 'Designs predictive machine learning algorithms, analyzes high-dimensional behavioral data, and communicates strategic insights to product leads.',
    requiredSkills: [
      { id: 'python', minLevel: 80, weight: 1.2 },
      { id: 'math_stats', minLevel: 75, weight: 1.3 },
      { id: 'data_analysis', minLevel: 80, weight: 1.1 },
      { id: 'pytorch', minLevel: 65, weight: 1.0 },
      { id: 'sql', minLevel: 70, weight: 0.9 },
      { id: 'communication', minLevel: 60, weight: 0.8 }
    ],
    recommendedCourses: [
      'Advanced Mathematical Statistics & Probabilistic Modeling',
      'Applied PyTorch for Deep Tabular & Time-series Forecasting',
      'Production SQL for BigQuery Analytics'
    ],
    milestones: [
      { week: 'Weeks 1-3', title: 'Exploratory Data Mastery', desc: 'Synthesize raw behavioral datasets using Pandas and Vectorized NumPy.' },
      { week: 'Weeks 4-7', title: 'Predictive Pipeline Architecture', desc: 'Deploy production scikit-learn & LightGBM cross-validation models.' },
      { week: 'Weeks 8-12', title: 'Enterprise Model Deployment', desc: 'Publish REST endpoints with FastAPI and monitor data drift metrics.' }
    ]
  },
  {
    id: 'ml-engineer',
    title: 'Machine Learning Infrastructure Engineer',
    company: 'HyperScale AI Cloud',
    category: 'AI & Data',
    salary: '$140,000 - $190,000',
    matchBenchmark: 92,
    growthRate: '+48% Demand (Surging)',
    hiringOutlook: 'High Demand',
    suitabilityDescription: 'Architects scalable distributed training pipelines, fine-tunes open-source LLMs, and optimizes inference latency across distributed GPU clusters.',
    requiredSkills: [
      { id: 'python', minLevel: 85, weight: 1.2 },
      { id: 'pytorch', minLevel: 85, weight: 1.3 },
      { id: 'deep_learning', minLevel: 80, weight: 1.2 },
      { id: 'distributed_sys', minLevel: 70, weight: 1.1 },
      { id: 'docker_k8s', minLevel: 70, weight: 1.0 },
      { id: 'problem_solving', minLevel: 80, weight: 0.9 }
    ],
    recommendedCourses: [
      'Distributed Deep Learning with Ray & PyTorch FSDP',
      'Kubernetes Engine & GPU Cluster Optimization',
      'vLLM & TensorRT Inference Acceleration'
    ],
    milestones: [
      { week: 'Weeks 1-4', title: 'CUDA & Compute Profiling', desc: 'Benchmark tensor operations, memory bottlenecks, and GPU bandwidth.' },
      { week: 'Weeks 5-8', title: 'Distributed Model Training', desc: 'Run multi-GPU data-parallel jobs with mixed precision (bfloat16).' },
      { week: 'Weeks 9-12', title: 'Zero-Downtime Serving', desc: 'Implement automated Triton inference servers behind load balancers.' }
    ]
  },
  {
    id: 'genai-architect',
    title: 'Generative AI Solutions Architect',
    company: 'Cognitive Engine Systems',
    category: 'AI & Engineering',
    salary: '$150,000 - $210,000',
    matchBenchmark: 94,
    growthRate: '+65% Demand (Breakthrough)',
    hiringOutlook: 'Priority Recruitment',
    suitabilityDescription: 'Engineers Agentic workflows, Multi-Agent Swarms, Retrieval-Augmented Generation (RAG) vector engines, and guardrailed LLM orchestration pipelines.',
    requiredSkills: [
      { id: 'nlp_llm', minLevel: 85, weight: 1.4 },
      { id: 'python', minLevel: 80, weight: 1.1 },
      { id: 'api_design', minLevel: 75, weight: 1.0 },
      { id: 'system_design', minLevel: 75, weight: 1.1 },
      { id: 'cloud_infra', minLevel: 70, weight: 0.9 },
      { id: 'problem_solving', minLevel: 75, weight: 0.9 }
    ],
    recommendedCourses: [
      'Advanced RAG: Hybrid Search, Reranking & Context Compression',
      'Agentic Systems with LangGraph & Google Antigravity SDK',
      'LLM Safety, Red-Teaming, & Evaluator Frameworks'
    ],
    milestones: [
      { week: 'Weeks 1-3', title: 'Semantic Embeddings & Indexing', desc: 'Construct dense vector stores with Qdrant / Pinecone and BM25 hybrid ranking.' },
      { week: 'Weeks 4-7', title: 'Autonomous Multi-Agent Networks', desc: 'Structure self-correcting tool-calling pipelines and cyclic workflows.' },
      { week: 'Weeks 8-12', title: 'Enterprise Production RAG', desc: 'Implement streaming citations, latency caches, and automated hallucination filters.' }
    ]
  },
  {
    id: 'fullstack-dev',
    title: 'Modern Full-Stack Systems Engineer',
    company: 'Aetheria Cloud Platforms',
    category: 'Software Engineering',
    salary: '$110,000 - $155,000',
    matchBenchmark: 85,
    growthRate: '+24% Demand (Steady)',
    hiringOutlook: 'Steady Intake',
    suitabilityDescription: 'Builds responsive, high-performance web applications backed by robust microservices, real-time WebSockets, and modern TypeScript frameworks.',
    requiredSkills: [
      { id: 'javascript', minLevel: 85, weight: 1.3 },
      { id: 'react', minLevel: 80, weight: 1.2 },
      { id: 'api_design', minLevel: 75, weight: 1.1 },
      { id: 'sql', minLevel: 70, weight: 1.0 },
      { id: 'git_collaboration', minLevel: 75, weight: 0.8 },
      { id: 'problem_solving', minLevel: 70, weight: 0.8 }
    ],
    recommendedCourses: [
      'Modern TypeScript & Next.js Server Components',
      'PostgreSQL Query Optimization & Prisma ORM',
      'Scalable WebSockets & State Synchronization'
    ],
    milestones: [
      { week: 'Weeks 1-4', title: 'Design System & State Flow', desc: 'Assemble reactive, accessible component architectures.' },
      { week: 'Weeks 5-8', title: 'High-Concurrency Backends', desc: 'Implement typed RPC/REST microservices with caching and auth.' },
      { week: 'Weeks 9-12', title: 'End-to-End Delivery', desc: 'Containerize, configure CI/CD pipelines, and achieve 99.9% uptime.' }
    ]
  },
  {
    id: 'ai-product-manager',
    title: 'Technical AI Product Manager',
    company: 'Synergy Future Technologies',
    category: 'Product & Strategy',
    salary: '$130,000 - $175,000',
    matchBenchmark: 82,
    growthRate: '+31% Demand (Fast Growing)',
    hiringOutlook: 'Active Recruitment',
    suitabilityDescription: 'Bridges deep algorithmic capabilities with human student experiences, defining product specifications, evaluating model UX, and driving telemetry metrics.',
    requiredSkills: [
      { id: 'product_strategy', minLevel: 85, weight: 1.4 },
      { id: 'ui_ux', minLevel: 75, weight: 1.1 },
      { id: 'communication', minLevel: 85, weight: 1.2 },
      { id: 'data_analysis', minLevel: 70, weight: 1.0 },
      { id: 'problem_solving', minLevel: 75, weight: 0.9 },
      { id: 'python', minLevel: 50, weight: 0.6 }
    ],
    recommendedCourses: [
      'Human-Centered AI Interaction Design',
      'Product Metrics, A/B Testing & User Behavioral Cohorts',
      'AI Ethics, Governance, and Trust Safety'
    ],
    milestones: [
      { week: 'Weeks 1-4', title: 'User Problem Framing', desc: 'Run qualitative discovery interviews and synthesize customer pain matrices.' },
      { week: 'Weeks 5-8', title: 'Spec & Evaluation Frameworks', desc: 'Author detailed PRDs with model accuracy thresholds and latency budgets.' },
      { week: 'Weeks 9-12', title: 'Growth & Launch Execution', desc: 'Coordinate multi-disciplinary engineering teams to deliver pilot release.' }
    ]
  },
  {
    id: 'cloud-devops',
    title: 'Cloud Platform & MLOps Architect',
    company: 'Orbit Infrastructure',
    category: 'Cloud & Infrastructure',
    salary: '$135,000 - $180,000',
    matchBenchmark: 86,
    growthRate: '+40% Demand (Surging)',
    hiringOutlook: 'High Demand',
    suitabilityDescription: 'Constructs automated CI/CD deployment pipelines, manages Kubernetes clusters, enforces cloud security posture, and orchestrates model registry lifecycles.',
    requiredSkills: [
      { id: 'docker_k8s', minLevel: 85, weight: 1.3 },
      { id: 'cloud_infra', minLevel: 85, weight: 1.3 },
      { id: 'system_design', minLevel: 75, weight: 1.1 },
      { id: 'cybersecurity', minLevel: 70, weight: 1.0 },
      { id: 'python', minLevel: 65, weight: 0.8 },
      { id: 'git_collaboration', minLevel: 80, weight: 0.8 }
    ],
    recommendedCourses: [
      'Terraform & Infrastructure-as-Code Mastery',
      'Kubernetes Operators & Automated Canary Releases',
      'Cloud Security & Zero Trust Architecture'
    ],
    milestones: [
      { week: 'Weeks 1-4', title: 'Declarative Cloud Infrastructure', desc: 'Automate multi-region VPC and compute provisioning with Terraform.' },
      { week: 'Weeks 5-8', title: 'GitOps Pipeline Automation', desc: 'Deploy ArgoCD continuous delivery workflows with automated smoke tests.' },
      { week: 'Weeks 9-12', title: 'Observability & Telemetry Mesh', desc: 'Instrument Prometheus, Grafana, and distributed tracing across microservices.' }
    ]
  }
];

export const ACTUAL_USER_DEFAULT = {
  id: 'actual_user',
  name: 'Ahmed Khan',
  title: 'Full Stack & AI Engineer • Candidate',
  bio: 'Real-world software engineer specializing in scalable full-stack web applications, neural APIs, and cloud deployments.',
  avatar: '⭐',
  isActualUser: true,
  skills: {
    python: 90,
    javascript: 92,
    react: 88,
    deep_learning: 82,
    pytorch: 78,
    api_design: 85,
    sql: 80,
    docker_k8s: 75,
    cloud_infra: 70,
    problem_solving: 88,
    git_collaboration: 85,
    nlp_llm: 76,
    math_stats: 72,
    system_design: 75,
    ui_ux: 78,
    communication: 80
  }
};

export const STUDENT_ARCHETYPES = [
  ACTUAL_USER_DEFAULT,
  {
    id: 'ai_explorer',
    name: 'Maya Chen',
    title: 'Junior CS Major • Machine Learning Track',
    bio: 'Passionate about deep learning, neural computer vision, and building intelligent agents. Solid foundation in Python math and algorithmic problem solving.',
    avatar: '👩‍💻',
    skills: {
      python: 88,
      pytorch: 82,
      deep_learning: 78,
      math_stats: 80,
      data_analysis: 75,
      problem_solving: 85,
      git_collaboration: 70,
      sql: 60,
      nlp_llm: 72,
      javascript: 45,
      api_design: 55,
      cloud_infra: 40,
      docker_k8s: 50,
      ui_ux: 35,
      communication: 75
    }
  },
  {
    id: 'fullstack_builder',
    name: 'Leo Rodriguez',
    title: 'Software Engineering Senior • Web & Cloud',
    bio: 'Experienced in developing responsive web portals, microservices, and interactive UI systems. Enthusiastic about integrating AI API capabilities.',
    avatar: '👨‍💻',
    skills: {
      javascript: 92,
      react: 88,
      api_design: 82,
      sql: 78,
      git_collaboration: 85,
      problem_solving: 78,
      docker_k8s: 68,
      python: 65,
      cloud_infra: 62,
      ui_ux: 75,
      communication: 72,
      math_stats: 50,
      nlp_llm: 58,
      system_design: 68
    }
  },
  {
    id: 'data_enthusiast',
    name: 'Priya Sharma',
    title: 'Data Science & Economics Double Major',
    bio: 'Driven by extracting actionable intelligence from messy datasets. Strong statistics background with storytelling flair and business analytics acumen.',
    avatar: '👩‍🔬',
    skills: {
      python: 82,
      data_analysis: 92,
      sql: 88,
      math_stats: 85,
      communication: 86,
      product_strategy: 74,
      problem_solving: 76,
      pytorch: 55,
      git_collaboration: 70,
      ui_ux: 60,
      cloud_infra: 45
    }
  },
  {
    id: 'aspiring_architect',
    name: 'Alex Vance',
    title: 'Cloud & Distributed Systems Specialist',
    bio: 'Enjoys operating systems, infrastructure as code, container orchestration, and building resilient distributed systems with high availability.',
    avatar: '⚡',
    skills: {
      docker_k8s: 90,
      cloud_infra: 88,
      system_design: 82,
      distributed_sys: 80,
      python: 75,
      cybersecurity: 74,
      problem_solving: 80,
      git_collaboration: 82,
      sql: 65,
      api_design: 70
    }
  }
];
