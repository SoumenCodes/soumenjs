export const SEED_CARDS = [
  {
    id: "project-1",
    title: "DevPulse — Real-Time Cloud Infrastructure & Logs Monitor",
    tagline: "A unified telemetry dashboard monitoring Kubernetes clusters, serverless metrics, and distributed microservice logs with real-time alerting.",
    description: "DevPulse is a high-performance observability tool designed to aggregate multi-cloud telemetry into a single sub-second dashboard.",
    problemStatement: "Engineering teams frequently juggle multiple siloed monitoring tools (Datadog, AWS CloudWatch, Grafana) leading to high latency in incident detection and alert fatigue. Developers needed an intuitive, centralized monitor that correlates logs, metrics, and deployment pipelines.",
    solution: "Built an event-driven architecture using Next.js 16, WebSocket streams, and ClickHouse for ultra-fast time-series queries. Features interactive flame graphs, instant threshold alerts via Discord/Slack webhooks, and automated health checks.",
    category: "Full Stack",
    status: "Live Demo",
    date: "2024-06",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop"
    ],
    skills: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "WebSockets", "ClickHouse", "Docker"],
    liveUrl: "https://devpulse-demo.vercel.app",
    githubUrl: "https://github.com/soumenjs/devpulse-monitoring",
    featured: true
  },
  {
    id: "project-2",
    title: "SynapseAI — Context-Aware Code Review & Security Auditor",
    tagline: "AI-powered GitHub bot and web portal that scans pull requests for security vulnerabilities, race conditions, and performance bottlenecks.",
    description: "An intelligent automated code reviewer powered by LLMs, integrating directly with GitHub Actions to provide actionable AST-level PR feedback.",
    problemStatement: "Code reviews bottleneck fast-paced development cycles, while subtle security exploits (like SQL injections, SSRF, and unhandled memory leaks) easily slip past human reviewers in multi-thousand line pull requests.",
    solution: "Engineered a pipeline using AST parsing and OpenAI/Claude APIs fine-tuned on OWASP Top 10 guidelines. Generates inline code suggestions, automates unit test generation, and produces executive security audits before merging.",
    category: "AI / ML",
    status: "Live Demo",
    date: "2024-04",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop"
    ],
    skills: ["Python", "FastAPI", "Next.js", "OpenAI API", "GitHub Actions", "PostgreSQL", "LangChain"],
    liveUrl: "https://synapse-ai-audit.vercel.app",
    githubUrl: "https://github.com/soumenjs/synapse-ai-code-auditor",
    featured: true
  },
  {
    id: "project-3",
    title: "Sphere — Real-Time Spatial Collaboration Canvas",
    tagline: "Infinite-canvas whiteboard with low-latency multiplayer cursor sync, vector wireframing, markdown notes, and live audio huddles.",
    description: "A collaborative digital workspace combining the best aspects of Miro and Figma with frictionless instant room sharing.",
    problemStatement: "Distributed teams need a frictionless canvas to brainstorm architectures and sketch workflows without bloated enterprise logins or lagging multi-user synchronization.",
    solution: "Implemented CRDTs (Conflict-free Replicated Data Types) via Yjs and WebRTC for millisecond-latency multiplayer sync. Built a 60fps vector rendering engine using HTML5 Canvas and WebGL shaders for smooth infinite panning and zooming.",
    category: "Frontend",
    status: "Live Demo",
    date: "2024-02",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1200&auto=format&fit=crop"
    ],
    skills: ["React", "TypeScript", "Canvas API", "WebRTC", "Yjs / CRDT", "Tailwind CSS", "Zustand"],
    liveUrl: "https://sphere-canvas.vercel.app",
    githubUrl: "https://github.com/soumenjs/sphere-collaborative-canvas",
    featured: true
  },
  {
    id: "project-4",
    title: "Aura Commerce — Next-Gen Headless E-Commerce Experience",
    tagline: "Sub-second e-commerce storefront with AI semantic search, edge caching, animated 3D product previews, and Stripe Checkout.",
    description: "An ultra-fast headless e-commerce store designed for modern consumer brands demanding instant page transitions and high conversion rates.",
    problemStatement: "Traditional e-commerce platforms suffer from slow catalog loading times (2-4 seconds), bad mobile responsiveness, and poor search relevance which leads to cart abandonment.",
    solution: "Leveraged Next.js App Router with Incremental Static Regeneration (ISR), Edge middleware for localized currency detection, Algolia for typo-tolerant product search, and Three.js / React Three Fiber for interactive 3D model customizers.",
    category: "Full Stack",
    status: "Live Demo",
    date: "2023-11",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556742049-0a67e5572293?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200&auto=format&fit=crop"
    ],
    skills: ["Next.js", "React Three Fiber", "Stripe API", "Prisma", "PostgreSQL", "Tailwind CSS", "Algolia"],
    liveUrl: "https://aura-storefront.vercel.app",
    githubUrl: "https://github.com/soumenjs/aura-headless-commerce",
    featured: false
  },
  {
    id: "project-5",
    title: "KubePilot — Terminal & Web CLI for Kubernetes Workloads",
    tagline: "Lightweight developer companion that visualizes pod lifecycles, debugs crashed containers, and executes zero-downtime rolling deploys.",
    description: "A developer tool bridging the gap between raw `kubectl` command-line complexity and resource-heavy desktop GUI managers.",
    problemStatement: "Junior and mid-level developers struggle with verbose Kubernetes manifests, context switching across cluster namespaces, and deciphering opaque crash-loop-back-off error logs.",
    solution: "Developed an interactive web-based terminal and dashboard combining Go backend daemons with a Next.js front-end. Includes one-click pod log tailing, container shell execution, and visual YAML diffing.",
    category: "Cloud & DevOps",
    status: "Open Source",
    date: "2023-08",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=1200&auto=format&fit=crop"
    ],
    skills: ["Go", "Kubernetes", "Next.js", "xterm.js", "Docker", "Tailwind CSS", "gRPC"],
    liveUrl: "https://kubepilot-cli.vercel.app",
    githubUrl: "https://github.com/soumenjs/kubepilot-k8s-manager",
    featured: false
  },
  {
    id: "project-6",
    title: "FitPulse — AI-Driven Workout Planner & Motion Analyzer",
    tagline: "PWA and web platform utilizing computer vision in the browser to track posture, count exercise repetitions, and generate adaptive gym routines.",
    description: "An AI fitness coach running client-side PoseNet models in WebAssembly for zero-latency camera tracking with complete privacy.",
    problemStatement: "Home workout enthusiasts often train with incorrect biomechanical form, causing joint injuries without expensive personal trainers. Video-based online fitness apps fail to give real-time corrective feedback.",
    solution: "Utilized TensorFlow.js with MoveNet/PoseNet models to evaluate joint angles in real-time right inside the browser. No video is ever uploaded to a server, guaranteeing user privacy while delivering audio cues and rep counting.",
    category: "AI / ML",
    status: "Live Demo",
    date: "2023-05",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop"
    ],
    skills: ["TensorFlow.js", "React", "WebAssembly", "Tailwind CSS", "PWA", "IndexedDB"],
    liveUrl: "https://fitpulse-motion.vercel.app",
    githubUrl: "https://github.com/soumenjs/fitpulse-ai-trainer",
    featured: false
  }
];
