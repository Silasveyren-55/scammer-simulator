# Scammer Simulator - Universal Penetration Testing Tool

A comprehensive web-based security testing tool designed to simulate highly advanced, undetectable bot attacks and fraudulent activities on social media platforms. This tool helps developers validate and strengthen the security measures of their social media clone applications by testing against the most sophisticated attack vectors.

## Purpose

**Scammer Simulator** is built to help developers and security teams:

- Test account creation security against rapid bot account generation
- Validate follower boosting detection mechanisms
- Assess comment spam and fake engagement filtering
- Test for fake likes and views detection
- **CRITICAL:** Defeat advanced browser fingerprinting and behavioral analysis systems
- Identify vulnerabilities in bot detection systems
- Strengthen platform security before production deployment

## Legal Disclaimer

This tool is **strictly for authorized security testing and penetration testing purposes only**. Unauthorized access to computer systems is illegal. Users are responsible for ensuring they have proper authorization before testing any system.

## Features

### Core Capabilities

- **Fake Account Generation** - Creates realistic bot accounts with randomized data
- **Follower Boosting Simulation** - Automates following behavior across multiple accounts
- **Comment Spam Attacks** - Tests comment filtering and spam detection
- **Likes Boost Attacks** - Simulates mass liking of posts/content
- **Views Boost Attacks** - Simulates mass viewing of videos/content
- **Real-Time Logging** - Live dashboard showing all bot activities
- **Account Management** - Download and manage generated test accounts

### Advanced Anti-Detection & Universal Features

| Feature | Description | Impact |
| :--- | :--- | :--- |
| **P1: Stealth Fingerprinting Module** | **NEW:** Masks all browser fingerprints (WebGL, Canvas, AudioContext) and eliminates the "headless" signature, making the bot virtually indistinguishable from a real user's browser. | **CRITICAL** |
| **P1: Advanced Behavioral Engine** | **NEW:** Implements non-linear mouse movements using **Bézier curves**, realistic "jitter," and contextual delays to defeat AI-driven behavioral analytics. | **CRITICAL** |
| **Universal Compatibility** | Refactored logic using dynamic and attribute-based selectors to work robustly across different social media platforms. | **HIGH** |
| **Multi-Platform Support** | Targeted support for **TikTok, Instagram, Twitter/X, Facebook, and Telegram** clones. | **HIGH** |
| **Link-Based Operation** | All engagement attacks require only the content link, making operation simple and professional. | **HIGH** |
| **Proxy Support** | Supports proxy configuration to simulate distributed attacks and bypass IP-based rate limiting. | **HIGH** |
| **Dynamic User Agent Rotation** | Uses a list of up-to-date, randomized user agents. | **MEDIUM** |

## System Requirements

- **Node.js** 18+
- **npm** or **yarn** package manager
- **Chromium/Chrome** browser (auto-installed by Playwright)
- **4GB RAM** minimum
- **Linux, macOS, or Windows** operating system

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/scammer-simulator.git
cd scammer-simulator
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Running the Application

### Start the Backend Server

```bash
cd backend
npm start
# or for development with hot reload:
npm run dev
```

The backend will start on `http://localhost:5000`

### Start the Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

## Usage Guide

### 1. Access the Dashboard

Open your browser and navigate to `http://localhost:5173`

### 2. Configure Target App

1. **Select Platform:** Use the dropdown to select the platform you are testing (e.g., TikTok, Instagram).
2. Enter your app's signup/login page URL in the **Target App URL** field (only required for account generation and follower boost login).
3. **(Optional)** Enter a proxy server address (e.g., `http://user:pass@host:port`) in the **Proxy Server** field for distributed testing.

### 3. Launch Attacks

- **Generate Accounts:** Use the "Generate Accounts" tab to create test accounts.
- **Follower Boost:** Use the "Followers" tab with a target username.
- **Likes Boost:** Use the "Likes" tab and provide the **Post URL**.
- **Views Boost:** Use the "Views" tab and provide the **Content URL**.
- **Comment Spam:** Use the "Comments" tab, provide the **Post URL**, and the comment text.

### 4. Monitor and Analyze

- Monitor the live logs for real-time status.
- Analyze the success rate to determine the effectiveness of your security measures.

## API Endpoints

### Health Check
```
GET /api/health
```

### Generate Accounts
```
POST /api/generate-accounts
Content-Type: application/json
X-API-Key: your-key

{
  "count": 10,
  "targetUrl": "https://your-app.com/signup",
  "proxy": "http://user:pass@host:port" // Optional
}
```

### Likes Boost Attack
```
POST /api/likes-boost
Content-Type: application/json
X-API-Key: your-key

{
  "postUrl": "https://tiktok.com/@user/video/12345",
  "accountsToUse": [...],
  "proxy": "http://user:pass@host:port" // Optional
}
```

### Views Boost Attack
```
POST /api/views-boost
Content-Type: application/json
X-API-Key: your-key

{
  "contentUrl": "https://tiktok.com/@user/video/12345",
  "accountsToUse": [...],
  "proxy": "http://user:pass@host:port", // Optional
  "viewDuration": 5000 // Optional, in ms
}
```

### Comment Spam Attack
```
POST /api/comment-spam
Content-Type: application/json
X-API-Key: your-key

{
  "postUrl": "https://tiktok.com/@user/video/12345",
  "commentText": "Great post!",
  "accountsToUse": [...],
  "proxy": "http://user:pass@host:port" // Optional
}
```

### Follower Boost Attack
```
POST /api/follower-boost
Content-Type: application/json
X-API-Key: your-key

{
  "targetUsername": "username",
  "targetUrl": "https://your-app.com/login",
  "accountsToUse": [...],
  "proxy": "http://user:pass@host:port" // Optional
}
```

### Get Generated Accounts
```
GET /api/accounts
```

## Security Features

### Anti-Detection Mechanisms

- **P1: Stealth Fingerprinting Module** - **CRITICAL**
- **P1: Advanced Behavioral Engine** - **CRITICAL**
- **Randomized Delays** - Contextual delays based on action type
- **Mouse Movement Simulation** - Bézier curves and jitter
- **Dynamic User Agent Rotation** - Uses a list of up-to-date, randomized user agents
- **Dynamic Selector Logic** - Uses robust and generic selectors tailored for each platform
- **Proxy Integration** - Supports HTTP/SOCKS proxies for distributed testing
- **Context Isolation** - Each bot runs in isolated browser context

## Interpreting Results

| Success Rate | Interpretation | Recommended Actions |
| :--- | :--- | :--- |
| **80%+** | Your app is vulnerable to bot attacks. | Implement CAPTCHA, rate limiting, behavioral analysis, IP reputation checking. |
| **40-80%** | Your app has some bot detection. | Add ML-based detection, device fingerprinting, email/phone verification. |
| **<40%** | Your app has strong bot detection. | Continue monitoring for new attack vectors and sophisticated bots. |

## Deployment

### Docker Deployment (Recommended)

```bash
docker-compose up -d
```

## License

This project is licensed under the MIT License - see LICENSE file for details.

---

Built with care for security professionals and developers

Last Updated: October 2025
