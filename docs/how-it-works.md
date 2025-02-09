# 💡 How ChatCX Works

ChatCX is a **cutting-edge AI agent** that retrieves, processes, and generates intelligent Web3 insights using **retrieval-augmented generation (RAG) and reinforcement learning (RL)**.

🚀 **Key Technologies Used:**
✅ **Hyperbolic APIs** → Provides access to **DeepSeek R1** for response generation  
✅ **AltLayer Autonome** → Hosts the **ChatCX agent** for scalable, reliable AI execution  
✅ **pgvector (PostgreSQL)** → Stores **vectorized embeddings** for **fast semantic search**  
✅ **OpenAI Embeddings** → Converts **user queries & tweets** into **searchable vector data**

---

## **📌 High-Level Flow Diagram**

graph TD;
A[🕒 Cron Job] -->|Fetch Tweets| B[📥 Data Preprocessing]
B -->|Vectorize Data| C[🧠 OpenAI Embeddings]
C -->|Store Embeddings| D[(📦 Vector Database - pgvector)]

    E[💬 User Query] -->|Assign chatID| F[⚡ Chat Job Started]
    F -->|Vectorize Query| G[🧠 OpenAI Embeddings]
    G -->|Find Relevant Data| H[(🔎 Query Vector Database)]
    H -->|Retrieve Relevant Tweets| I[📑 Fetch Context]

    I -->|Pass to DeepSeek R1 via Hyperbolic API| J[📝 Generate Response]
    J -->|Store Response| K[(💾 Assign to chatID)]
    K -->|Send Response to User via AltLayer Autonome| L[📤 Deliver Answer]

---

## **📌 Step 1: Data Collection, Preprocessing & Storage** 📊

A **cron job** performs:

1. **Fetching fresh tweets** from a **curated list of Web3 Twitter/X accounts**.
2. **Preprocessing, filtering and customizing** to remove spam, extract useful information and convert into a meaningful schema for LLMs.
3. **Vectorizing the cleaned tweets custom schema** using **OpenAI Embeddings**.
4. **Storing vectorized embeddings** in **pgvector (PostgreSQL)**.

This allows ChatCX to **quickly retrieve relevant discussions** when answering user queries.

---

## **📌 Step 2: Query Processing & Retrieval** 🔍

When a user sends a query, ChatCX:

1. **Assigns a unique chatID** and starts processing.
2. **Vectorizes the user’s query** using **OpenAI Embeddings**.
3. **Queries the pgvector database** for the **most relevant discussions & insights**.
4. **Retrieves** the top matches (can include **recent tweets, past responses, and summaries**).

---

## **📌 Step 3: Response Generation using DeepSeek R1** 🧠

Once the **relevant data is retrieved**, ChatCX:

1. **Sends it to DeepSeek R1 via Hyperbolic APIs**.
2. **Includes**:
   - **System prompt** → Fine-tuned to **format responses accurately**.
   - **Temperature settings** → Adjusts **randomness vs. precision**.
   - **Previously generated insights** → Ensures **context-awareness**.
3. **DeepSeek R1 generates an intelligent response**.
4. **Stores the response under the assigned chatID**.

---

## **📌 Step 4: Delivering the Response via AltLayer Autonome**

1. The generated **response is stored** under the chatID.
2. **AltLayer Autonome** hosts the **ChatCX agent**, ensuring:
   - **Scalability** 🚀 → Handles large traffic efficiently.
   - **Resilience** 🔄 → Ensures uninterrupted service.
   - **Secure execution** → Unbiased generation.
3. The **response can be queried using the chatID**.

---

# **Why ChatCX is Built This Way**

Instead of using a **basic keyword search or simple chatbot responses**, ChatCX leverages **state-of-the-art AI techniques** to ensure **accurate, real-time, and context-aware insights** for Web3 users. Here’s why:

✅ **Retrieval-Augmented Generation (RAG) for Precision**  
→ Unlike traditional AI agents, ChatCX doesn’t **hallucinate** responses.  
→ It **retrieves relevant, real-world data** before generating an answer.

✅ **Reinforcement Learning (RL) for self awareness**  
→ ChatCX learns from it's previous responses.  
→ It **queries for previous generations** before generating a new answer.

✅ **Latest Web3 Narratives in Real Time**  
→ Crypto narratives **evolve fast**—ChatCX ensures **you're always up-to-date**.  
→ The bot continuously **fetches fresh discussions from Twitter/X**.

✅ **AI-Enhanced Summarization Using DeepSeek R1**  
→ Instead of overwhelming users with **raw data**, ChatCX generates **concise, meaningful insights**.

✅ **Vector Search for High-Speed, Context-Aware Responses**  
→ Instead of **scanning thousands of tweets manually**, ChatCX uses **pgvector for instant lookups**.

✅ **Scalable, Secure & Fault-Tolerant Deployment on AltLayer Autonome**  
→ ChatCX runs **entirely on AltLayer Autonome**, ensuring **no downtime, secure execution using TEE, fast processing, and smooth performance**.

---
