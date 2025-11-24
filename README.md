# 🌟 YSoul - The Ultimate Integrated Entertainment Ecosystem

![YSoul Banner](https://via.placeholder.com/1200x400?text=YSoul+Entertainment+Platform)

<p align="center">
  <a href="#-about-the-project">About</a> •
  <a href="#-key-features">Features</a> •
  <a href="#-technology-stack">Tech Stack</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-documentation">API Docs</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D16.0.0-green" alt="Node Version">
  <img src="https://img.shields.io/badge/react-%5E18.2.0-blue" alt="React Version">
  <img src="https://img.shields.io/badge/license-MIT-yellow" alt="License">
  <img src="https://img.shields.io/badge/status-active-brightgreen" alt="Status">
</p>

---

## 📖 About The Project

**YSoul** is a pioneering **"All-in-One"** digital entertainment platform designed to solve the problem of application fragmentation. Instead of switching between Spotify for music, Netflix for movies, and Facebook for social interaction, YSoul integrates all three pillars into a single, seamless ecosystem.

The platform leverages a **Hybrid Database Architecture** (SQL + NoSQL) to ensure data integrity for transactions while maintaining high flexibility for social interactions. It creates a dynamic space where users can not only consume content but also connect, share, and engage in real-time.

---

## ✨ Key Features

YSoul provides a comprehensive set of features for both End-users and Administrators.

### 👤 User Modules

| Module         | Feature                 | Description                                                                                                       |
| :------------- | :---------------------- | :---------------------------------------------------------------------------------------------------------------- |
| **🔐 Auth**    | **Unified Login**       | Supports local registration/login and **Google OAuth 2.0**. Includes JWT-based session management with Redis.     |
| **🎬 Cinema**  | **Video-on-Demand**     | Watch high-quality movies with episode selection. Features include rating, commenting, and adding to "Watchlist". |
| **🎵 Music**   | **Streaming**           | Full-featured music player with background playback, playlist management, and artist discovery.                   |
| **💬 Social**  | **Newsfeed**            | Post status updates, share photos, and interact with the community via Likes and nested Comments.                 |
| **⚡ Chat**    | **Real-time Messaging** | Instant messaging with friends using **Socket.io**, supporting text and image sharing.                            |
| **💳 Payment** | **VIP Upgrade**         | Secure payment integration with **Stripe**, **MoMo**, and **VNPay** to unlock premium content.                    |

### 🛡️ Admin Modules

| Module           | Feature              | Description                                                                                      |
| :--------------- | :------------------- | :----------------------------------------------------------------------------------------------- |
| **📊 Dashboard** | **Analytics**        | Visualized charts for Revenue, User Growth, and Content Engagement statistics.                   |
| **👥 Users**     | **User Management**  | View user list, manage roles (Admin/VIP/User), and ban/unban accounts.                           |
| **📂 Content**   | **Media Management** | CRUD operations for Films, Albums, Artists, and Tracks. Upload media directly to **Cloudinary**. |

---

## 🚀 Technology Stack

The project is built using a modern MERN-based architecture, optimized for performance and scalability.

### 🖥️ Frontend (Web & Mobile)

| Technology        | Usage                             | Version   |
| :---------------- | :-------------------------------- | :-------- |
| **ReactJS**       | Core Web Framework                | `^18.2.0` |
| **React Native**  | Mobile Framework (Cross-platform) | `^0.72.0` |
| **TailwindCSS**   | Utility-first Styling             | `^3.3.0`  |
| **Ant Design**    | UI Component Library (Web)        | `^5.0.0`  |
| **Axios**         | HTTP Client with Interceptors     | `^1.4.0`  |
| **Redux Toolkit** | State Management                  | `^1.9.0`  |

### ⚙️ Backend (API & Logic)

| Technology      | Usage               | Description                                            |
| :-------------- | :------------------ | :----------------------------------------------------- |
| **Node.js**     | Runtime Environment | High-performance, non-blocking I/O.                    |
| **Express.js**  | Web Framework       | Robust routing and middleware support.                 |
| **Socket.io**   | Real-time Engine    | Bi-directional communication for Chat & Notifications. |
| **Passport.js** | Authentication      | Strategies for Local and Google OAuth.                 |
| **Bcrypt.js**   | Security            | Password hashing and salting.                          |

### 🤖 Agent

| Technology  | Usage               | Description                                                                                          |
| :---------- | :------------------ | :--------------------------------------------------------------------------------------------------- |
| **venv**    | Virtual Environment |
| **Fastapi** | Web Framework       | Designed specifically for building APIs.                                                             |
| **Agno**    | Python framework    | Designed for building high-performance, lightweight, and scalable AI agents and multi-agent systems. |
| **Gemini**  | Model               | LLM Model.                                                                                           |

### 💾 Database & Storage (Hybrid Architecture)

| Technology     | Type                  | Purpose                                                           |
| :------------- | :-------------------- | :---------------------------------------------------------------- |
| **PostgreSQL** | Relational (SQL)      | Stores structured data: Users, Transactions, VIP Subscriptions.   |
| **MongoDB**    | Document (NoSQL)      | Stores dynamic data: Comments, Posts, Likes, Notifications.       |
| **Redis**      | Key-Value (In-memory) | Caching sessions, Refresh Tokens, and hot data to reduce latency. |
| **Cloudinary** | Cloud Storage         | Hosting and optimizing images, videos, and audio files (CDN).     |

---

## 🏗️ System Architecture

YSoul operates on a **Client-Server** model with a clear separation of concerns:

- **Client Layer:** ReactJS (Web) and React Native (Mobile) communicate with the server via RESTful APIs.
- **Service Layer:** Node.js/Express handles business logic, utilizing specialized services for Auth, Payment, and Media.
- **Data Layer:** A Hybrid approach where **PostgreSQL** ensures ACID compliance for accounts, while **MongoDB** offers flexibility for social content.

---

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v16+)
- PostgreSQL & MongoDB (Local or Cloud)
- Redis
- Docker (Optional)

### Installation

1.  **Clone the repository**

    ```bash
    cd YSoul-Final-Project
    ```

2.  **Backend Setup**

    ```bash
    cd BE
    npm install
    # Create .env file and configure variables (see below)
    npm start
    ```

3.  **Frontend Web Setup**
    ```bash
    cd FE
    npm install
    npm run dev
    ```

---

---

---

## 📂 Project Structure

```bash
YSoul-Final-Project/
├── Agent/
├── src/
│   │   ├── venv/
│   │   ├── agent/
│   │   ├── data/
│   │   ├── prompts/
├── BE/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── Dockerfile
├── FE/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── redux/
├── Mobile/
└── README.md
```
