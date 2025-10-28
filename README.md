# Scammer Simulator - Universal Penetration Testing Tool

A comprehensive web-based security testing tool designed to simulate bot attacks and fraudulent activities on social media platforms. This tool helps developers validate and strengthen the security measures of their social media clone applications by testing against common attack vectors used by scammers.

## Purpose

**Scammer Simulator** is built to help developers and security teams:

- Test account creation security against rapid bot account generation
- Validate follower boosting detection mechanisms
- Assess comment spam and fake engagement filtering
- Identify vulnerabilities in bot detection systems
- Strengthen platform security before production deployment

## Legal Disclaimer

This tool is **strictly for authorized security testing and penetration testing purposes only**. Unauthorized access to computer systems is illegal. Users are responsible for ensuring they have proper authorization before testing any system.

## Features

### Core Capabilities

- **Fake Account Generation** - Creates realistic bot accounts with randomized data
- **Follower Boosting Simulation** - Automates following behavior across multiple accounts
- **Comment Spam Attacks** - Tests comment filtering and spam detection
- **Real-Time Logging** - Live dashboard showing all bot activities
- **Account Management** - Download and manage generated test accounts

### Advanced Anti-Detection & Universal Features (New)

- **Universal Compatibility:** Refactored logic using dynamic and attribute-based selectors to work across different social media platforms (e.g., TikTok, Instagram, Twitter, Facebook clones).
- **Proxy Support:** Added an input field to route traffic through a proxy (HTTP/SOCKS) to simulate distributed attacks and bypass IP-based rate limiting.
- **Enhanced Human Mimicry:** More sophisticated randomization of typing speeds, mouse movements, scrolling, and dynamic user agent rotation to evade advanced bot detection.
- **Robust Login Logic:** Improved generic login function to handle various form structures.

## System Requirements

- **Node.js** 14+
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

1. Enter your app's signup/login page URL in the **Target App URL** field
2. **(New)** Optionally, enter a proxy server address (e.g., `http://user:pass@host:port`) in the **Proxy Server** field for distributed testing.

### 3. Generate Fake Accounts

1. Click the "Generate Accounts" tab
2. Set the number of accounts to create (1-100)
3. Click "Generate Accounts" button
4. Monitor the live logs for progress
5. Accounts will appear in the Generated Accounts section

### 4. Test Follower Boosting

1. Click the "Follower Boost" tab
2. Enter the target username (without @)
3. Click "Boost Followers" to execute the attack
4. Monitor results in the logs

### 5. Test Comment Spam

1. Click the "Comment Spam" tab
2. Enter the post URL
3. Enter the comment text to spam
4. Click "Spam Comments" to execute the attack
5. Check logs for results

### 6. Export Results

- Click "Download Accounts" to export generated accounts as JSON
- Use the JSON file for further analysis or documentation

## API Endpoints

### Health Check
```
GET /api/health
```

### Generate Accounts
```
POST /api/generate-accounts
Content-Type: application/json

{
  "count": 10,
  "targetUrl": "https://your-app.com/signup",
  "proxy": "http://user:pass@host:port" // Optional
}
```

### Get Generated Accounts
```
GET /api/accounts
```

### Follower Boost Attack
```
POST /api/follower-boost
Content-Type: application/json

{
  "targetUsername": "username",
  "targetUrl": "https://your-app.com/login",
  "accountsToUse": [...],
  "proxy": "http://user:pass@host:port" // Optional
}
```

### Comment Spam Attack
```
POST /api/comment-spam
Content-Type: application/json

{
  "postUrl": "https://your-app.com/post/123",
  "commentText": "Great post!",
  "accountsToUse": [...],
  "proxy": "http://user:pass@host:port" // Optional
}
```

## Security Features

### Anti-Detection Mechanisms

- **Randomized Delays** - 500-2000ms between actions to mimic human behavior
- **Mouse Movement Simulation** - Random cursor movements before interactions
- **Dynamic User Agent Rotation** - Uses a list of up-to-date, randomized user agents
- **Dynamic Selector Logic** - Uses robust and generic selectors to work across various platforms
- **Proxy Integration** - Supports HTTP/SOCKS proxies for distributed testing
- **Context Isolation** - Each bot runs in isolated browser context

## Understanding the Results

### Log Types

- **Success (Green)** - Action completed successfully
- **Error (Red)** - Action failed with error details
- **Info (Blue)** - General information and progress updates

### Metrics to Monitor

- **Total Attempted** - Number of operations initiated
- **Total Successful** - Number of operations that completed
- **Success Rate** - Percentage of successful operations
- **Response Times** - How quickly your app responds to bot activity

## Interpreting Results

### High Success Rate (80%+)
Your app may be vulnerable to bot attacks. Consider implementing:
- CAPTCHA verification
- Rate limiting
- Behavioral analysis
- IP reputation checking

### Medium Success Rate (40-80%)
Your app has some bot detection. Enhance with:
- Machine learning-based detection
- Device fingerprinting
- Email verification
- Phone verification

### Low Success Rate (<40%)
Your app has strong bot detection. Continue monitoring for:
- New attack vectors
- Sophisticated bots
- Distributed attacks

## Deployment

### Deploy to Heroku

Backend:
```bash
cd backend
heroku create your-app-name-backend
git push heroku main
```

Frontend (Vercel):
```bash
cd frontend
npm run build
vercel deploy --prod
```

### Docker Deployment

```bash
docker-compose up -d
```

## Configuration

### Backend Configuration

Edit `backend/index.js` to customize:

- `PORT` - Server port (default: 5000)
- `randomDelay()` - Adjust delay ranges
- `generateRandomUser()` - Customize user data generation
- Browser launch options - Add proxy support, etc.

### Frontend Configuration

Edit `frontend/src/App.jsx` to customize:

- `API_BASE_URL` - Backend API endpoint
- Form fields and labels
- Tab names and organization
- Log display settings

## Troubleshooting

### "Cannot find module 'playwright'"
```bash
cd backend
npm install playwright
```

### "Port 5000 already in use"
```bash
# Change PORT in backend/index.js or kill the process
lsof -i :5000
kill -9 <PID>
```

### "CORS errors in browser console"
Ensure backend is running and CORS is enabled in backend/index.js

### "Playwright browser not found"
```bash
npx playwright install
```

## Best Practices

1. **Test in Staging** - Always test on a staging environment first
2. **Document Results** - Keep detailed logs of all tests
3. **Iterate** - Run tests multiple times for consistency
4. **Analyze Patterns** - Look for trends in bot detection
5. **Update Security** - Fix vulnerabilities and re-test
6. **Monitor Performance** - Ensure tests don't overload your server

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues, questions, or suggestions:

1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

## Security Notes

- Never use this tool on systems you don't own or have permission to test
- Keep your deployment credentials secure
- Use environment variables for sensitive data
- Regularly update dependencies for security patches
- Monitor your server logs during testing

## Future Enhancements

- [ ] Advanced ML-based bot detection testing
- [ ] Video/image upload simulation
- [ ] Rate limiting bypass techniques
- [ ] CAPTCHA solving integration
- [ ] Detailed analytics dashboard
- [ ] Scheduled automated testing
- [ ] Multi-language support

---

Built with care for security professionals and developers

Last Updated: October 2025
