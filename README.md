# WomenWealthWave.AI 💰✨

_Financial literacy for every young woman, powered by open-source intelligence and community-first intent._

WomenWealthWave.AI is an MVP that guides Indian women (15–35) through money basics, investment planning, and habit formation. It blends a React experience, an Express API, and an optional Python-based Retrieval-Augmented Generation (RAG) stack backed by locally hosted open-source models—no API keys, no data harvesting, just empowerment.

---

## 🧩 The Problem We’re Solving

1. **Financial advice is either jargon-heavy or unrelatable** for first-time earners.
2. **Trust gaps** stop women from trying new fintech products, especially when conversations leave their device.
3. **Learning content is scattered**—YouTube videos, blog posts, and WhatsApp forwards rarely add up to a plan.

WomenWealthWave.AI centralizes credible lessons, interactive planners, and a contextual chat assistant so that every woman can ask "silly" questions privately and act on the answers immediately.

---

## 🌠 Vision

Equip every young woman with a judgment-free financial mentor so she can build generational wealth with confidence, cultural context, and community support.

## 🎯 Mission

1. **Democratize access** to financial literacy through human-grade explanations and playbooks.
2. **Stay privacy-first** by keeping inference on user-controlled hardware—**we never require API keys or paid model access**.
3. **Nudge towards action** using calculators, trackers, and celebratory UI moments that reward consistency.

---

## 🛠 Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend SPA** | React 18, TypeScript, Vite, TailwindCSS, Radix UI, Lucide icons |
| **Backend (Node)** | Express 5 + Vite middleware for API routes under `/api/*` |
| **AI / Knowledge** | Optional FastAPI service, ChromaDB vector store, Sentence Transformers, Ollama with DeepSeek/LLaMA/Mistral models |
| **Tooling** | pnpm, Vitest, Zod, TanStack Query, clsx + tailwind-merge |

> **Bold stance:** Everything runs on open-source intelligence. There are **zero external API keys**—models are pulled via [Ollama](https://ollama.ai/) and executed locally so users retain total control over their data.

---

## 🔁 System Workflow (How Every Piece Connects)

1. **Learning Dataset (backend/data/knowledge_base)** — markdown lessons, Indian schemes, habit prompts.
2. **Python RAG Layer (backend/)**
   - `ingest_data.py` embeds the dataset with Sentence Transformers and stores it in ChromaDB.
   - `app/services/rag_service.py` retrieves relevant passages.
   - `ollama_service.py` streams replies from locally hosted DeepSeek/LLaMA models.
3. **Express API (server/)** proxies lightweight endpoints (health, calculators, chat pass-through). During `pnpm dev`, it shares the same origin as Vite.
4. **React Frontend (client/)**
   - **Dashboards** show calculators (EMI, savings runway, tax estimator) and progress trackers.
   - **Chat interface** hits `/api/chat` → Express → FastAPI RAG → Ollama.
   - **State management** via hooks + TanStack Query ensures optimistic UI.
5. **User Loop**
   - Discover curated insights → experiment with calculators → ask AI for clarification → log learnings → receive nudges.

This layered workflow keeps sensitive reasoning on-device while letting the web UI stay fast and accessible.

---

## 📦 Setup Guide (Absolute Beginners Welcome!)

### 1. Install Prerequisites

| Requirement | Why | Install |
| --- | --- | --- |
| **Node.js 18+** | Runs the React + Express bundle | [nodejs.org](https://nodejs.org/) (LTS) |
| **pnpm** | Faster, disk-friendly package manager | `npm install -g pnpm` |
| **Git** | Needed to clone + push code | [git-scm.com](https://git-scm.com/) |
| **Python 3.10+** _(optional)_ | Only for the RAG microservice | [python.org](https://www.python.org/downloads/) |
| **Ollama** _(optional)_ | Hosts open-source LLMs locally | [ollama.ai/download](https://ollama.ai/download) |

### 2. Clone the Repository

```bash
git clone https://github.com/Fatir227/WomenWealthWave.AI.git
cd WomenWealthWave.AI
```

### 3. Install JavaScript Dependencies

```bash
pnpm install
```

### 4. Run the Dev Experience

```bash
pnpm dev
```

- Opens Vite + Express on <http://localhost:5173>.
- API routes are namespaced under `/api/*`.

### 5. Optional: Enable the Python RAG Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate           # macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
python ingest_data.py             # create/update vector store
uvicorn app.main:app --reload --port 8000
```

Configure the frontend to call `http://localhost:8000/api/v1/chat` (default).

### 6. Pull an Open-Source Model with Ollama

```bash
ollama pull deepseek-r1:1.5b    # or llama3:8b / mistral:7b
ollama serve                    # keep running in a terminal
```

### 7. Build for Production

```bash
pnpm build   # bundles client + server
pnpm start   # serves dist/server/node-build.mjs
```

### 8. Helpful Scripts

```bash
pnpm test       # Vitest suite
pnpm typecheck  # tsc --noEmit
pnpm format.fix # Prettier
```

> Tip: Copy `.env.example` → `.env` (if provided) or create your own. For the Python service use `backend/.env` to store `OLLAMA_MODEL` and related values.

---

## 🚀 Feature Highlights

- **Interactive Home** with animated metrics, habit trackers, and curated shortcuts.
- **EMI / Savings / Tax calculators** tuned for Indian slabs and currency formatting.
- **Live-ish Market Cards** showing simulated NSE + gold moves for situational awareness.
- **Guided Chat** driven by your local LLM so sensitive queries stay private.
- **Learning Modules** referencing 25+ knowledge-base chapters ranging from budgeting to government schemes for women.

---

## 📈 How We’ll Scale

1. **Voice-first assistant** with Hinglish understanding and speech synthesis.
2. **Community playbooks**—crowdsource success stories, share anonymized journeys.
3. **Goal boards & accountability pods** to make saving collaborative.
4. **Federated intelligence** so users can opt-in to share anonymized learnings while keeping raw data offline.
5. **Mobile companion (React Native)** for always-on nudges and offline-first lessons.

---

## 🧠 What We Learned Building This MVP

1. **Trust is a feature**: showing “runs locally, no API keys” upfront drastically improves user comfort.
2. **Explainability matters**: pairing RAG citations with calculators helps users connect advice to action.
3. **Design for bandwidth diversity**: lightweight charts + skeleton loaders keep the dashboard usable on unstable networks.
4. **Code sharing saves time**: colocating shared TypeScript types avoided contract drift between client and server.

---

## 🙌 Social Impact & Ethical Stand

- **Open Knowledge**: All lessons are curated from public, government, or NGO sources aimed at women’s financial inclusion.
- **Local-First AI**: Running Ollama models locally respects privacy and removes paywalls.
- **Community Contribution**: The ultimate goal is to contribute to society by making financial education a public good, not a gated product.

---

## 🗂 Project Anatomy

```text
├── client/            # React SPA (pages, widgets, chat UI)
├── server/            # Express routes wired into Vite dev server
├── backend/           # Optional FastAPI RAG pipeline + vector store
├── shared/            # TypeScript contracts shared across layers
├── public/            # Static assets (hero images, logo)
├── package.json       # Scripts (dev, build, test, typecheck)
└── README.md          # You are here
```

---

## 🤝 Contribution Flow

1. Fork on GitHub → `git clone` → `pnpm install`.
2. Create a branch: `git checkout -b feature/amazing-idea`.
3. Build + test locally (`pnpm dev`, `pnpm test`, `pnpm typecheck`).
4. Commit using conventional messages, push, and open a PR describing:
   - Problem solved
   - Screenshots / Loom (UI work)
   - Testing notes

---

## 👤 Creator

Crafted with determination by **Fatir** to uplift women’s financial journeys.

---

Start your financial literacy journey today, keep your data yours, and pass the knowledge forward. 💛
