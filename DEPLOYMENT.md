# Deployment Guide: Intelligent Conversational AI for Crime Database

This repository contains a full automated production deployment setup with **GitHub Actions CI/CD**, **Docker**, **Docker Compose**, and **Cloud Platform Blueprints**.

---

## Architecture Overview

```
                        ┌───────────────────────────────┐
                        │      Client Browser (Web)     │
                        └──────────────┬────────────────┘
                                       │ Port 80 / 3000
                                       ▼
                        ┌───────────────────────────────┐
                        │    Nginx Frontend Container   │
                        │    (React 18 + TypeScript)    │
                        └──────────────┬────────────────┘
                                       │ /api/ reverse proxy
                                       ▼
                        ┌───────────────────────────────┐
                        │  Spring Boot Backend Service  │
                        │   (Java 17 + LangChain4j)     │
                        └──────────────┬────────────────┘
                                       │ JDBC Port 5432
                                       ▼
                        ┌───────────────────────────────┐
                        │  PostgreSQL Database Service  │
                        │   (pgvector 384-d Cosine)     │
                        └───────────────────────────────┘
```

---

## 1. Automated GitHub Actions CI/CD Pipeline

Every commit pushed to the `master` or `main` branch automatically triggers the `.github/workflows/deploy.yml` workflow:

1. **Java Backend Validation**:
   - Executes automated JUnit 5 and Spring Data JPA integration tests.
   - Compiles and packages production Spring Boot `.jar`.
2. **React Frontend Validation**:
   - Typechecks with TypeScript `tsc`.
   - Generates optimized static production bundle (`dist/`).
3. **Container Registry Publishing**:
   - Builds multi-stage production Docker images for both backend and frontend.
   - Tags and publishes images to **GitHub Container Registry (GHCR)**:
     - `ghcr.io/<owner>/crime-database-ai-backend:latest`
     - `ghcr.io/<owner>/crime-database-ai-frontend:latest`

---

## 2. One-Command Production Docker Compose Launch

To run the entire stack on any Linux, Windows, or macOS server with Docker:

```bash
# Clone the repository
git clone https://github.com/Sivasakthi-Vengatesan/crime-database-ai.git
cd crime-database-ai

# Launch all 3 services in the background
docker compose up -d --build
```

### Verified Service Endpoints

| Container | Host Port | Internal Port | Healthcheck |
| :--- | :--- | :--- | :--- |
| **Nginx Frontend** | `http://localhost:80` (or `3000`) | `80` | `http://localhost/` |
| **Spring Boot Backend** | `http://localhost:8080` | `8080` | `http://localhost:8080/api/health` |
| **pgvector PostgreSQL** | `localhost:5432` | `5432` | `pg_isready -U postgres -d crimedb` |

---

## 3. Cloud Deployment (Render / Railway / Fly.io / AWS)

### Option A: Railway
1. Create a new Project in [Railway.app](https://railway.app).
2. Add a **PostgreSQL** service and enable the `pgvector` extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. Connect your GitHub repository:
   - Deploy `backend/` with Java 17 runtime.
   - Set environment variables:
     - `SPRING_DATASOURCE_URL=jdbc:postgresql://${{PGHOST}}:${{PGPORT}}/${{PGDATABASE}}`
     - `SPRING_DATASOURCE_USERNAME=${{PGUSER}}`
     - `SPRING_DATASOURCE_PASSWORD=${{PGPASSWORD}}`
   - Deploy `frontend/` as a static site or Docker service pointing to your backend URL.

### Option B: Render
1. Create a **Web Service** for `backend` pointing to `backend/Dockerfile`.
2. Create a **Static Site** or **Web Service** for `frontend` pointing to `frontend/Dockerfile`.

---

## 4. Environment Variables Reference

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://postgres:5432/crimedb` | PostgreSQL database JDBC connection URL |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | `postgres_secure_password` | Database password |
| `SERVER_PORT` | `8080` | Spring Boot HTTP listening port |
| `JAVA_OPTS` | `-Xms256m -Xmx512m -XX:+UseG1GC` | JVM memory optimization flags |
