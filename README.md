# 🚀 Smart Event Collaboration Platform

[![Microservices](https://img.shields.io/badge/Architecture-Microservices-blueviolet)](https://github.com/Mohammed-aymane-saber/Smart-Event-Collaboration-Platform)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-blue)](https://kubernetes.io/)
[![GitOps](https://img.shields.io/badge/GitOps-ArgoCD-orange)](https://argoproj.github.io/cd/)

A scalable, high-performance microservices-based platform designed for seamless event management and real-time collaboration. This project showcases modern full-stack development combined with advanced DevOps practices.

---

## 🏗️ Architecture Overview

The platform is built using a **Microservices Architecture**, ensuring scalability, fault tolerance, and independent deployment of services.

```mermaid
graph TD
    User((User)) -->|HTTP| Gateway[API Gateway]
    Gateway -->|Auth| AuthService[Auth Service]
    Gateway -->|Events| EventService[Event Service]
    Gateway -->|Social| InteractionService[Interaction Service]
    
    AuthService --> DB[(MySQL DB)]
    EventService --> DB
    InteractionService --> DB
    
    subgraph "Observability"
        Prometheus[Prometheus] -->|Scrape| AuthService
        Prometheus -->|Scrape| EventService
    end
    
    subgraph "Infrastructure"
        K8s[Kubernetes Cluster]
        ArgoCD[Argo CD - GitOps]
    end
```

---

## 🛠️ Tech Stack

### Backend (Microservices)
- **Node.js & Express**: Core logic for each service.
- **MySQL**: Relational database for persistent storage.
- **JWT**: Secure stateless authentication.
- **Prometheus**: Integrated metrics for real-time monitoring.

### Frontend
- **React (Vite)**: Modern, fast, and responsive user interface.
- **Tailwind CSS**: Sleek and professional styling.

### DevOps & Infrastructure
- **Docker & Docker Compose**: Containerization and local orchestration.
- **Kubernetes**: Production-ready orchestration.
- **Argo CD**: Automated GitOps delivery pipeline.
- **PowerShell Scripts**: Automated deployment workflows.

---

## 🚀 Key Features

- **Decoupled Services**: Auth, Events, and Interactions communicate via an API Gateway.
- **GitOps Ready**: Fully integrated with Argo CD for automated deployments directly from GitHub.
- **Monitoring**: Built-in endpoints for Prometheus metrics scraping.
- **Cloud Native**: Designed to be deployed on any Kubernetes cluster.

---

## 🛠️ Getting Started

### Local Development (Docker Compose)

1. Clone the repository:
   ```bash
   git clone https://github.com/Mohammed-aymane-saber/Smart-Event-Collaboration-Platform.git
   cd Smart-Event-Collaboration-Platform
   ```

2. Spin up the infrastructure:
   ```bash
   docker-compose up --build
   ```

3. Access the services:
   - **Frontend**: `http://localhost:5173`
   - **API Gateway**: `http://localhost:3000`
   - **phpMyAdmin**: `http://localhost:8081`

---

## 📈 Monitoring

Each microservice exposes a `/metrics` endpoint for Prometheus. To monitor the health and performance of the system, ensure Prometheus is configured to scrape these targets.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

**Developed  by [Mohammed Aymane](https://github.com/Mohammed-aymane-saber)**
