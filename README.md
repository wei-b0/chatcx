# ChatCX

ChatCX is an AI-powered agent designed to provide real-time insights and intelligence from Web3 Twitter. It tracks, analyzes, and delivers actionable data on emerging trends, narratives, and market-shifting conversations in the crypto space. The agent is built to help users stay ahead of the curve by providing pure, actionable insights powered by advanced RAG (Retrieval-Augmented Generation) and Reinforcement Learning algorithms.

---

🔗 **Live API Base URL:** [https://autonome.alt.technology/chatcx-itferc/api](https://autonome.alt.technology/chatcx-itferc/api)

📢 **Start using ChatCX:** [@ChatCX_Bot](https://t.me/ChatCX_Bot)

📢 **Start using Crypto Parrot:** [@CryptoParrotAI_Bot](https://t.me/CryptoParrotAI_Bot)

📜 **Docs:** [ChatCX Docs](https://chatcx.gitbook.io/chatcx-docs))

---

## Features

- **Real-time Data Tracking**: Continuously monitors and analyzes posts from top Web3 influencers, analysts, and builders.
- **AI-Powered Intelligence**: Uses RAG and Reinforcement Learning to filter and extract actionable insights.
- **Actionable Results**: Provides instant, data-backed answers about trending tokens, narratives, and strategies.
- **Multiple Products**:
  - **ChatCX Chat**: Instant insights through a Telegram bot.
  - **Crypto Parrot**: AI-powered newsfeed delivering curated insights on Telegram.
  - **API Access**: Integrate ChatCX insights into your own agents, tools, and dashboards.

---

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **Backend**: Node.js, Express, PostgreSQL
- **AI/ML**: OpenAI Embeddings, Hyperbolic API, RAG, Reinforcement Learning
- **Telegram Bot**: Telegraf, Telegram Web App
- **Database**: PostgreSQL
- **DevOps**: Docker, Docker Compose, **Autonome by AltLayer** (Hosting)
- **User Management**: **Privy** (Crypto Parrot)
- **Other Tools**: Puppeteer, PostHog, Sentiment Analysis, Keyword Extraction

---

## Repository Structure

```
.
├── landing/ # Landing page for ChatCX
│   ├── src/ # React components and styles
│   ├── public/ # Static assets
│   ├── tailwind.config.js # TailwindCSS configuration
│   ├── vite.config.ts # Vite configuration
│   └── package.json # Frontend dependencies
│
├── crypto-parrot/ # Crypto Parrot Telegram bot and login
│   ├── server/ # Backend server for Crypto Parrot
│   ├── login/ # Login and authentication flow
│   └── package.json # Backend dependencies
│
├── bot/ # ChatCX Telegram bot
│   ├── src/ # Bot logic and services
│   └── package.json # Bot dependencies
│
├── service/ # Core AI service and Twitter pipeline
│   ├── src/ # AI logic, Twitter scraping, and API routes
│   ├── Dockerfile # Docker configuration for the service
│   ├── docker-compose.yml # Docker Compose setup
│   └── package.json # Service dependencies
|
├── docs/ # Docs for everything
│
└── README.md
│
└── LICENSE.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- Docker (optional) (node:18-bookworm-slim: strict requirement)
- Telegram Bot Token
- OpenAI API Key
- Hyperbolic API Key
- Privy API Key (for Crypto Parrot user management)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/wei_b0/chatcx.git
   cd chatcx
   ```

2. **Install dependencies**:

   ```bash
   cd landing && npm install
   cd ../crypto-parrot/server && npm install
   cd ../../bot && npm install
   cd ../service && npm install
   ```

3. **Set up environment variables**:

   Create `.env` files in each directory (`landing`, `crypto-parrot/server`, `bot`, `service`) with the required environment variables (e.g., `BOT_TOKEN`, `OPENAI_API_KEY`, `DATABASE_URL`, `PRIVY_API_KEY`).

4. **Run the services**:

   - **Landing Page**:

     ```bash
     cd landing && npm run dev
     ```

   - **Crypto Parrot Server**:

     ```bash
     cd crypto-parrot/server && npm run dev
     ```

   - **ChatCX Bot**:

     ```bash
     cd bot && npm start
     ```

   - **AI Service**:

     ```bash
     cd service && docker-compose up --build
     ```

---

## Technical Outline

### 1. Crypto Parrot

#### Server:

- Built with Express and TypeScript.
- Handles user registration, authentication, and rate limiting.
- Integrates with Privy for user management and authentication.
- Uses PostgreSQL for storing user data and rate limits.

#### Login:

- React-based login flow for Telegram users.
- Uses Telegram Web App SDK for seamless integration.
- TailwindCSS for styling.

### 2. ChatCX Telegram Bot

- Built with Telegraf and TypeScript.
- Provides real-time insights through a Telegram bot.
- Features:
  - `/start` command to initialize user and provide instructions.
  - Text-based queries to fetch AI-generated insights.
  - Rate limiting to manage free queries.
  - Error handling and user feedback.

### 3. AI Service

#### Twitter Pipeline:

- Scrapes Twitter for Web3-related tweets using `agent-twitter-client`.
- Extracts keywords, sentiment, and engagement metrics.
- Stores tweet data in PostgreSQL with vector embeddings.

#### AI Logic:

- Uses OpenAI embeddings for semantic search.
- Hyperbolic API for generating AI responses.
- RAG (Retrieval-Augmented Generation) and RL (Reinforcement Learning) for combining retrieval and generation.

#### API Routes:

- `/chat`: Handles user queries and returns AI-generated insights.
- `/admin`: Admin routes for managing API keys, updating datasets, and adding user credits.
- `/health`: Health check endpoint.

### 5. Database

- PostgreSQL is used for storing:
  - User data (Telegram IDs, credits, rate limits).
  - Tweet embeddings and metadata.
  - API keys and admin-related data.

### 6. DevOps

- **Autonome by AltLayer**:

  - The AI service and backend are hosted on Autonome, a decentralized hosting platform by AltLayer.
  - Autonome provides scalable, secure, and decentralized infrastructure for Web3 applications.

- Docker and Docker Compose for containerization and orchestration.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---
