// Curated Base Resource Catalog for ConnectEd Hybrid Learning System
// Guarantees reliable, official, free learning materials for standard tech topics

export const LEARNING_RESOURCES_CATALOG = [
  // PYTHON
  {
    topic: 'Python Async/Await & Concurrency',
    keywords: ['async', 'asyncio', 'await', 'event loop', 'concurrency', 'multiprocessing', 'threads'],
    skills: ['Python', 'AsyncIO', 'Concurrency'],
    resources: [
      {
        title: 'asyncio — Asynchronous I/O',
        url: 'https://docs.python.org/3/library/asyncio.html',
        source: 'Python Documentation',
        type: 'Official Docs',
        level: 'Intermediate',
        reason: 'Official Python reference manual for event loop management, coroutines, and async tasks.'
      },
      {
        title: 'Python Asyncio HOWTO Guide',
        url: 'https://docs.python.org/3/howto/a-conceptual-overview-of-asyncio.html',
        source: 'Python Documentation',
        type: 'Official Guide',
        level: 'Intermediate',
        reason: 'Conceptual walkthrough explaining event loops, tasks, and non-blocking I/O.'
      },
      {
        title: 'Python Concurrent Execution Reference',
        url: 'https://docs.python.org/3/library/concurrency.html',
        source: 'Python Documentation',
        type: 'Official Docs',
        level: 'Intermediate',
        reason: 'Comprehensive guide to threading, multiprocessing, and concurrent futures in Python.'
      }
    ],
    practice: 'Build an asynchronous HTTP client that fetches multiple API endpoints concurrently with timeout error handling.',
    outcome: 'Master non-blocking event loops, async/await syntax, Task execution, and concurrent execution in Python.'
  },
  {
    topic: 'Python Fundamentals & OOP',
    keywords: ['python', 'oop', 'data structures', 'clean code', 'decorators'],
    skills: ['Python', 'Data Structures', 'OOP'],
    resources: [
      {
        title: 'The Python Tutorial (Official)',
        url: 'https://docs.python.org/3/tutorial/index.html',
        source: 'Python Documentation',
        type: 'Official Docs',
        level: 'Beginner',
        reason: 'Official step-by-step introduction to core Python syntax, data types, and object-oriented principles.'
      },
      {
        title: 'Python Standard Library Index',
        url: 'https://docs.python.org/3/library/index.html',
        source: 'Python Documentation',
        type: 'Official Docs',
        level: 'Beginner',
        reason: 'Complete reference for built-in functions, data types, and core standard modules.'
      }
    ],
    practice: 'Implement an Object-Oriented repository pattern class hierarchy with custom decorators for logging execution time.',
    outcome: 'Write clean, idiomatic Python using modern OOP design patterns and built-in standard library utilities.'
  },

  // REACT & JAVASCRIPT
  {
    topic: 'React & Modern Frontend Stack',
    keywords: ['react', 'jsx', 'hooks', 'state', 'components', 'next.js', 'typescript'],
    skills: ['React', 'JavaScript', 'TypeScript', 'Frontend'],
    resources: [
      {
        title: 'React Documentation (react.dev)',
        url: 'https://react.dev/learn',
        source: 'React Docs',
        type: 'Official Docs',
        level: 'Beginner',
        reason: 'Official modern React documentation with interactive examples covering components, state, and hooks.'
      },
      {
        title: 'MDN JavaScript Guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
        source: 'MDN Web Docs',
        type: 'Official Docs',
        level: 'Beginner',
        reason: 'Industry-standard reference for JavaScript ES6+, asynchronous promises, closures, and DOM APIs.'
      }
    ],
    practice: 'Build a modular dashboard component featuring custom hooks for API state management and optimistic UI updates.',
    outcome: 'Understand modern React component architecture, custom hook composition, and performant state rendering.'
  },

  // GIT & GITHUB
  {
    topic: 'Git Version Control & PR Workflows',
    keywords: ['git', 'version control', 'github', 'branching', 'pr', 'commit', 'rebase'],
    skills: ['Git', 'GitHub', 'DevOps'],
    resources: [
      {
        title: 'Pro Git Book (Official)',
        url: 'https://git-scm.com/book/en/v2',
        source: 'Git Documentation',
        type: 'Official Docs',
        level: 'Beginner',
        reason: 'Official comprehensive guide to Git command-line fundamentals, branching models, and distributed workflows.'
      },
      {
        title: 'GitHub Documentation & Flow',
        url: 'https://docs.github.com/en/get-started/quickstart/hello-world',
        source: 'GitHub Docs',
        type: 'Official Docs',
        level: 'Beginner',
        reason: 'Official step-by-step guide for repositories, pull request reviews, and collaborative team development.'
      }
    ],
    practice: 'Configure a Git feature-branch workflow with interactive rebasing, clean commit messages, and GitHub PR reviews.',
    outcome: 'Master professional version control, feature-branching strategies, merge conflict resolution, and PR reviews.'
  },

  // DATA STRUCTURES & ALGORITHMS
  {
    topic: 'Data Structures & Algorithms',
    keywords: ['dsa', 'data structures', 'algorithms', 'trees', 'graphs', 'sorting', 'complexity'],
    skills: ['Data Structures & Algorithms', 'Problem Solving', 'Computer Science'],
    resources: [
      {
        title: 'VisuAlgo — Visualizing Data Structures and Algorithms',
        url: 'https://visualgo.net/en',
        source: 'VisuAlgo',
        type: 'Interactive Tutorial',
        level: 'Intermediate',
        reason: 'Interactive animated visualizer for binary search trees, graph traversals, sorting, and dynamic programming.'
      },
      {
        title: 'freeCodeCamp Data Structures & Algorithms Course',
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
        source: 'freeCodeCamp',
        type: 'Interactive Tutorial',
        level: 'Beginner',
        reason: 'Hands-on interactive curriculum covering algorithmic complexity, recursion, and core data structures.'
      }
    ],
    practice: 'Implement a min-heap priority queue and run Dijkstra algorithm for finding shortest paths in a graph.',
    outcome: 'Understand time/space complexity analysis (Big-O) and implement foundational computer science data structures.'
  },

  // REST APIS
  {
    topic: 'RESTful API Architecture & HTTP Protocols',
    keywords: ['rest', 'api', 'http', 'endpoint', 'json', 'status codes', 'authentication'],
    skills: ['REST & GraphQL APIs', 'Backend Development', 'HTTP'],
    resources: [
      {
        title: 'MDN HTTP Protocols & REST Guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP',
        source: 'MDN Web Docs',
        type: 'Official Docs',
        level: 'Beginner',
        reason: 'Official documentation for HTTP request methods, headers, status codes, CORS, and web security.'
      },
      {
        title: 'RESTful API Design Standards & Best Practices',
        url: 'https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design',
        source: 'Microsoft Learn',
        type: 'Official Guide',
        level: 'Intermediate',
        reason: 'Enterprise guidance for resource URL structuring, versioning, pagination, and error handling.'
      }
    ],
    practice: 'Design a RESTful API specification with OpenAPI/Swagger including JWT bearer authentication and structured error payloads.',
    outcome: 'Master HTTP specification details, REST design principles, status code standards, and API authentication.'
  },

  // gRPC & PROTOCOL BUFFERS
  {
    topic: 'gRPC & Protocol Buffers Microservices',
    keywords: ['grpc', 'protobuf', 'protocol buffers', 'rpc', 'microservices', 'streaming'],
    skills: ['gRPC', 'Protocol Buffers', 'Microservices'],
    resources: [
      {
        title: 'Introduction to gRPC (Official)',
        url: 'https://grpc.io/docs/what-is-grpc/introduction/',
        source: 'gRPC Documentation',
        type: 'Official Docs',
        level: 'Intermediate',
        reason: 'Official architectural overview of high-performance RPC framework, unary RPCs, and bi-directional streaming.'
      },
      {
        title: 'Protocol Buffers Developer Guide',
        url: 'https://protobuf.dev/overview/',
        source: 'Protocol Buffers Docs',
        type: 'Official Docs',
        level: 'Intermediate',
        reason: 'Official specification for language-neutral serialization schemas and proto3 syntax definitions.'
      },
      {
        title: 'gRPC Python Quick Start Guide',
        url: 'https://grpc.io/docs/languages/python/quickstart/',
        source: 'gRPC Documentation',
        type: 'Official Guide',
        level: 'Intermediate',
        reason: 'Hands-on tutorial for compiling proto files and building gRPC clients and server stubs in Python.'
      }
    ],
    practice: 'Define a protobuf schema for a real-time metrics service and build a bi-directional streaming gRPC client/server.',
    outcome: 'Understand binary serialization efficiency, gRPC HTTP/2 transport advantages, and microservice RPC patterns.'
  },

  // SYSTEM DESIGN & DISTRIBUTED SYSTEMS
  {
    topic: 'System Design & High-Availability Architecture',
    keywords: ['system design', 'scalability', 'distributed systems', 'load balancer', 'caching', 'rate limiting', 'circuit breaker'],
    skills: ['System Design Architecture', 'Load Balancing & Rate Limiting', 'Scalability'],
    resources: [
      {
        title: 'Azure System Architecture Design Styles',
        url: 'https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/microservices',
        source: 'Microsoft Learn',
        type: 'Official Docs',
        level: 'Advanced',
        reason: 'Comprehensive guide to microservices decomposition, high-availability patterns, and fault tolerance.'
      },
      {
        title: 'The System Design Primer (Open Source)',
        url: 'https://github.com/donnemartin/system-design-primer',
        source: 'GitHub Repository',
        type: 'Open Source Docs',
        level: 'Intermediate',
        reason: 'Definitive open-source guide to scaling web applications, CAP theorem, load balancing, and distributed data.'
      }
    ],
    practice: 'Architect an end-to-end system design diagram for a global URL shortener with distributed caching and rate limiting.',
    outcome: 'Learn to design scalable, high-throughput distributed systems that handle horizontal scaling and failovers gracefully.'
  },

  // DOCKER & CONTAINERIZATION
  {
    topic: 'Docker Containerization & Multi-stage Builds',
    keywords: ['docker', 'container', 'dockerfile', 'compose', 'multi-stage', 'image'],
    skills: ['Docker & Docker Compose', 'Containerization', 'DevOps'],
    resources: [
      {
        title: 'Docker Documentation & Getting Started',
        url: 'https://docs.docker.com/get-started/',
        source: 'Docker Documentation',
        type: 'Official Docs',
        level: 'Beginner',
        reason: 'Official documentation for Docker containers, Dockerfile instructions, image caching, and container isolation.'
      },
      {
        title: 'Multi-stage Builds in Docker Guide',
        url: 'https://docs.docker.com/build/building/multi-stage/',
        source: 'Docker Documentation',
        type: 'Official Guide',
        level: 'Intermediate',
        reason: 'Best practices guide for minimizing production container image sizes using multi-stage build layers.'
      }
    ],
    practice: 'Write a multi-stage Dockerfile for a Node/Python service reducing final image size under 100MB and run with Docker Compose.',
    outcome: 'Understand container runtime isolation, layer caching, multi-stage build optimization, and multi-container orchestration.'
  },

  // KUBERNETES & ORCHESTRATION
  {
    topic: 'Kubernetes Container Orchestration & Ingress',
    keywords: ['kubernetes', 'k8s', 'ingress', 'pod', 'deployment', 'service', 'probes', 'helm'],
    skills: ['Kubernetes Orchestration', 'Cloud Infrastructure Deployment', 'DevOps'],
    resources: [
      {
        title: 'Kubernetes Documentation & Tutorials',
        url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/',
        source: 'Kubernetes Docs',
        type: 'Official Docs',
        level: 'Intermediate',
        reason: 'Official hands-on tutorials covering Pods, Deployments, Services, Ingress routing, and liveness/readiness probes.'
      },
      {
        title: 'Kubernetes Concepts Reference Manual',
        url: 'https://kubernetes.io/docs/concepts/',
        source: 'Kubernetes Docs',
        type: 'Official Docs',
        level: 'Intermediate',
        reason: 'Architectural reference for cluster components, API objects, networking models, and storage volumes.'
      }
    ],
    practice: 'Create Kubernetes deployment manifests with liveness/readiness health probes, ClusterIP service, and NGINX Ingress rules.',
    outcome: 'Master production container orchestration, rolling zero-downtime updates, health checking, and cluster ingress routing.'
  },

  // POSTGRESQL & DATABASES
  {
    topic: 'PostgreSQL Database Optimization & Indexing',
    keywords: ['postgresql', 'postgres', 'sql', 'indexing', 'explain analyze', 'partitioning', 'database'],
    skills: ['PostgreSQL Query Tuning', 'Database Indexing Strategies', 'SQL'],
    resources: [
      {
        title: 'PostgreSQL Official Documentation',
        url: 'https://www.postgresql.org/docs/current/',
        source: 'PostgreSQL Docs',
        type: 'Official Docs',
        level: 'Intermediate',
        reason: 'Official documentation for relational schema design, transaction isolation levels, indexing, and EXPLAIN ANALYZE.'
      },
      {
        title: 'PostgreSQL Performance Optimization Guide',
        url: 'https://www.postgresql.org/docs/current/performance-tips.html',
        source: 'PostgreSQL Docs',
        type: 'Official Guide',
        level: 'Advanced',
        reason: 'Expert tips on query execution plans, composite B-tree indexes, VACUUM tuning, and connection pooling.'
      }
    ],
    practice: 'Use EXPLAIN ANALYZE on a slow SQL query with millions of records and optimize execution time using partial composite indexes.',
    outcome: 'Understand database indexing mechanics, query execution plans, schema normalization, and query performance tuning.'
  },

  // VECTOR DATABASES & RAG
  {
    topic: 'Vector Databases & Similarity Search (pgvector)',
    keywords: ['vector', 'pgvector', 'pinecone', 'embeddings', 'similarity search', 'rag', 'hnsw'],
    skills: ['Vector DBs (pgvector/Pinecone)', 'RAG Embeddings', 'AI Infrastructure'],
    resources: [
      {
        title: 'pgvector Extension Documentation (Supabase Docs)',
        url: 'https://supabase.com/docs/guides/database/extensions/pgvector',
        source: 'Supabase / PostgreSQL Docs',
        type: 'Official Docs',
        level: 'Intermediate',
        reason: 'Official integration guide for storing OpenAI/HuggingFace embeddings, cosine distance queries, and HNSW indexes.'
      },
      {
        title: 'pgvector GitHub Official Repository & Benchmarks',
        url: 'https://github.com/pgvector/pgvector',
        source: 'GitHub Repository',
        type: 'Open Source Docs',
        level: 'Intermediate',
        reason: 'Official repository documentation detailing vector operators (<->, <=>), IVF flat indexing, and memory limits.'
      }
    ],
    practice: 'Integrate pgvector into PostgreSQL, store text embedding vectors, and execute fast cosine-distance similarity search queries.',
    outcome: 'Master vector embeddings persistence, similarity metrics (Cosine vs L2), and indexing strategies for AI RAG applications.'
  },

  // MODEL DEPLOYMENT & MLOPS
  {
    topic: 'Model Serving, vLLM & MLOps Infrastructure',
    keywords: ['model deployment', 'vllm', 'huggingface', 'mlops', 'serving', 'inference', 'quantization'],
    skills: ['Model Deployment & Monitoring', 'MLOps', 'AI Infrastructure'],
    resources: [
      {
        title: 'Hugging Face Open LLM Deployment Docs',
        url: 'https://huggingface.co/docs/transformers/index',
        source: 'Hugging Face Docs',
        type: 'Official Docs',
        level: 'Intermediate',
        reason: 'Official documentation for transformer model loading, tokenization pipelines, and optimized inference runtimes.'
      },
      {
        title: 'vLLM Fast Inference Engine Documentation',
        url: 'https://docs.vllm.ai/en/latest/',
        source: 'vLLM Docs',
        type: 'Official Docs',
        level: 'Advanced',
        reason: 'Official guide to high-throughput LLM serving using PagedAttention, continuous batching, and tensor parallelism.'
      }
    ],
    practice: 'Deploy an open-source 3B LLM model endpoint using vLLM or FastAPI with streaming response tokenization.',
    outcome: 'Learn GPU memory optimization, continuous batching, model quantization, and production AI model serving.'
  },

  // MONITORING & OBSERVABILITY
  {
    topic: 'Prometheus & Grafana Observability',
    keywords: ['prometheus', 'grafana', 'monitoring', 'metrics', 'tracing', 'logging', 'alerts'],
    skills: ['Prometheus & Grafana Monitoring', 'Observability', 'DevOps'],
    resources: [
      {
        title: 'Prometheus Overview & Metrics Documentation',
        url: 'https://prometheus.io/docs/introduction/overview/',
        source: 'Prometheus Docs',
        type: 'Official Docs',
        level: 'Intermediate',
        reason: 'Official guide to time-series metric collection, PromQL query syntax, counters, gauges, and histograms.'
      },
      {
        title: 'Grafana Dashboard Setup & Visualization Guide',
        url: 'https://grafana.com/docs/grafana/latest/',
        source: 'Grafana Docs',
        type: 'Official Docs',
        level: 'Intermediate',
        reason: 'Official reference for constructing real-time monitoring dashboards, alert rules, and log visualization.'
      }
    ],
    practice: 'Expose Prometheus metrics from a backend service and build a Grafana dashboard displaying p99 latency and error rates.',
    outcome: 'Master site reliability metrics (RED/USE signals), PromQL queries, alerting rules, and live infrastructure dashboards.'
  },

  // CLOUD INFRASTRUCTURE
  {
    topic: 'Cloud Infrastructure & Automated CI/CD Pipelines',
    keywords: ['aws', 'cloud', 'ci/cd', 'github actions', 'ec2', 's3', 'lambda', 'deployment'],
    skills: ['AWS EC2 / S3 / Lambda', 'GitHub Actions CI/CD', 'Cloud Infrastructure'],
    resources: [
      {
        title: 'AWS Developer Documentation & Cloud Fundamentals',
        url: 'https://docs.aws.amazon.com/',
        source: 'AWS Documentation',
        type: 'Official Docs',
        level: 'Beginner',
        reason: 'Official architectural reference for AWS EC2 virtual servers, S3 storage, IAM security policies, and Serverless Lambda.'
      },
      {
        title: 'GitHub Actions CI/CD Automation Guide',
        url: 'https://docs.github.com/en/actions',
        source: 'GitHub Docs',
        type: 'Official Docs',
        level: 'Intermediate',
        reason: 'Official guide to writing workflow YAML files, automated unit testing pipelines, and cloud deployment actions.'
      }
    ],
    practice: 'Write a GitHub Actions CI/CD pipeline that automatically runs linting, unit tests, builds Docker images, and deploys to cloud.',
    outcome: 'Understand cloud deployment models, infrastructure security, automated test automation, and continuous delivery pipelines.'
  }
];

/**
 * Find matching curated base resources for a given task and skill set
 */
export function findCuratedResources(taskText = '', skills = []) {
  if (!taskText && (!skills || skills.length === 0)) {
    return null;
  }

  const searchText = (taskText + ' ' + (Array.isArray(skills) ? skills.join(' ') : String(skills))).toLowerCase();

  let bestMatch = null;
  let highestScore = 0;

  for (const entry of LEARNING_RESOURCES_CATALOG) {
    let score = 0;

    for (const kw of entry.keywords) {
      if (searchText.includes(kw.toLowerCase())) {
        score += 15;
      }
    }

    for (const sk of entry.skills) {
      if (searchText.includes(sk.toLowerCase())) {
        score += 25;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && highestScore >= 15) {
    return {
      topic: bestMatch.topic,
      resources: bestMatch.resources,
      practice: bestMatch.practice,
      outcome: bestMatch.outcome
    };
  }

  // Fallback for general programming tasks
  const fallbackEntry = LEARNING_RESOURCES_CATALOG[0];
  return {
    topic: 'Technical Core Fundamentals',
    resources: fallbackEntry.resources,
    practice: fallbackEntry.practice,
    outcome: fallbackEntry.outcome
  };
}
