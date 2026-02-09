# 🛡️ LLM Security Helper

A Next.js application that leverages Llama 3.1 (via Groq) to perform two core security analysis tasks:

1. **Code → Security Fixes** — Paste any code snippet and get identified security vulnerabilities with severity ratings, CWE references, exploit scenarios, and recommended fixes.
2. **Specs → Potential Vulnerabilities** — Describe a GenAI/Agentic application and receive a vulnerability assessment mapped to the **OWASP Top 10 for LLM Applications (2025)** and **MITRE ATLAS** framework.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **LLM Provider:** Groq (Llama 3.1 8B Instant)
- **API Key Security:** Server-side only via Next.js API routes (never exposed to the client)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A free Groq API key

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/llm-security-helper.git
cd llm-security-helper
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
GROQ_API_KEY=gsk_your_api_key_here
```

> **How to get a Groq API key (free):**
> 1. Go to [console.groq.com](https://console.groq.com)
> 2. Sign up with Google or GitHub
> 3. Navigate to **API Keys** → **Create API Key**
> 4. Copy and paste it into `.env.local`

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
llm-security-helper/
├── src/
│   └── app/
│       ├── api/
│       │   ├── code-scan/
│       │   │   └── route.ts      # Part 1: Code vulnerability analysis endpoint
│       │   └── spec-scan/
│       │       └── route.ts      # Part 2: Spec vulnerability mapping endpoint
│       ├── globals.css            # Tailwind v4 global styles
│       ├── layout.tsx             # Root layout
│       └── page.tsx               # Main UI (tabs, input, results)
├── .env.local                     # API key (not committed)
├── .gitignore
├── package.json
└── README.md
```

---

## How It Works

### Part 1 — Code → Security Fixes

The `/api/code-scan` route sends the submitted code to Llama 3.1 with a security-focused system prompt. The model analyzes the code strictly for security issues (not general refactoring) and returns:

- Vulnerability name and severity (Critical / High / Medium / Low)
- CWE identifier (where applicable)
- Description of the vulnerability
- Realistic exploit scenario
- Specific code fix to remediate the issue

### Part 2 — Specs → Potential Vulnerabilities

The `/api/spec-scan` route sends the app specifications to Llama 3.1 with a system prompt containing the full OWASP LLM Top 10 (2025) and MITRE ATLAS taxonomy. The model maps potential vulnerabilities to:

- **OWASP LLM Top 10 (2025):** LLM01 (Prompt Injection) through LLM10 (Unbounded Consumption)
- **MITRE ATLAS:** Relevant adversarial ML techniques (e.g., AML.T0054 — LLM Prompt Injection)

Each finding includes a risk level, attack scenario specific to the described app, and actionable mitigations.

---

## Example Inputs

### Part 1 — Vulnerable Code Sample

```python
import sqlite3

def login(username, password):
    conn = sqlite3.connect('users.db')
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    result = conn.execute(query)
    return result.fetchone()
```

### Part 2 — GenAI App Spec Sample

```
App: AI Customer Support Agent
- Takes user questions via chat widget on website
- Has access to internal knowledge base via RAG (Pinecone)
- Can look up order status via API call
- Can issue refunds up to $50 automatically
- Uses GPT-4 with a system prompt containing company policies
- Stores conversation history in PostgreSQL
```

---

## API Key Security

The Groq API key is stored in `.env.local` which is:

- Listed in `.gitignore` — never committed to version control
- Only accessible server-side through Next.js API routes
- Never sent to or accessible from the browser/client

---

## License

MIT
