---
name: Local RAG Assistant
tag: Local document Q&A · FastAPI, Ollama & React
summary: A full-stack retrieval-augmented generation service that answers questions about PDF documents with page-cited, token-streamed responses, running entirely on-device via Ollama with no external API calls. It chunks and embeds PDFs, runs cosine-similarity search in PostgreSQL/pgvector, and sits behind a provider-agnostic LLM layer so the model can be swapped without code changes. Ships with a React frontend and a one-command Docker Compose stack, tested in GitHub Actions CI.
categories: [Backend, AI/ML]
stack: [Python, FastAPI, Ollama, pgvector, PostgreSQL, React, Docker, GitHub Actions]
source: https://github.com/defoltbl/local-rag-assistant
order: 20
---
