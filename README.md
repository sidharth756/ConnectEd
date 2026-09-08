# ConnectEd - Hackathon Repository Skeleton

## Directory Structure

```text
ConnectEd/
├── src/
│   ├── ai/               # AI Team workspace
│   │   ├── services/     # AI service modules (roadmaps, skill gap analysis)
│   │   ├── matching/     # Alumni & mentor semantic matching logic
│   │   ├── rag/          # Vector search, embeddings, RAG assistant
│   │   ├── schemas/      # Zod schemas for structured LLM output
│   │   └── prompts/      # System & user prompt templates
│   ├── backend/          # Backend Team workspace
│   │   ├── controllers/  # API controllers
│   │   ├── routes/       # Express / Node API routes
│   │   ├── services/     # Business logic
│   │   ├── db/           # PostgreSQL + pgvector schema & connection
│   │   └── middleware/   # Authentication, validation, error handling
│   ├── frontend/         # Frontend Team workspace (React)
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page views
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API client services
│   │   └── styles/       # CSS / styling files
│   └── shared/           # Shared types, constants, and utilities across teams
│       ├── types/        # Shared TypeScript definitions
│       └── utils/        # Shared helper functions
├── .env.example          # Environment variables template
└── README.md
```
