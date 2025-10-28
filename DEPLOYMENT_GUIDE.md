# Scammer Simulator - Private Deployment Guide

## Deployment Status: LIVE

Your **Scammer Simulator** is now deployed and ready for testing. This document contains all the information you need to access and use the tool securely.

---

## Access URLs

### Frontend Dashboard (Web Interface)
**URL:** https://3000-id77xwzmalx86c9jrc6wv-327093ec.manusvm.computer

This is the main interface where you can:
- Configure target URLs
- Generate fake accounts
- Launch follower boost attacks
- Launch comment spam attacks
- Monitor real-time logs

### Backend API (Direct API Access)
**Base URL:** https://5000-id77xwzmalx86c9jrc6wv-327093ec.manusvm.computer/api

---

## Security Credentials

### API Key (For Direct API Calls)
```
X-API-Key: scammer-simulator-secure-key-2025
```

**Important:** Include this header in all API requests to the backend.

---

## How to Use the Deployed Tool

### Method 1: Using the Web Dashboard (Recommended)

1. **Open the Frontend URL** in your browser:
   ```
   https://3000-id77xwzmalx86c9jrc6wv-327093ec.manusvm.computer
   ```

2. **Configure Your Test:**
   - Enter your app's signup/login URL in the **Target App URL** field
   - (Optional) Enter a proxy server address if you want to simulate distributed attacks
   - Click on the desired attack tab (Generate Accounts, Follower Boost, or Comment Spam)

3. **Launch the Test:**
   - Click the action button (e.g., "Generate Accounts")
   - Monitor the real-time logs to see the bot activity
   - Review the results

### Method 2: Using Direct API Calls

If you want to integrate the tool with your own systems or scripts, you can make direct API calls to the backend.

#### Example: Generate Fake Accounts

```bash
curl -X POST https://5000-id77xwzmalx86c9jrc6wv-327093ec.manusvm.computer/api/generate-accounts \
  -H "Content-Type: application/json" \
  -H "X-API-Key: scammer-simulator-secure-key-2025" \
  -d '{
    "count": 10,
    "targetUrl": "https://your-app.com/signup",
    "proxy": "http://user:pass@host:port"
  }'
```

#### Example: Follower Boost Attack

```bash
curl -X POST https://5000-id77xwzmalx86c9jrc6wv-327093ec.manusvm.computer/api/follower-boost \
  -H "Content-Type: application/json" \
  -H "X-API-Key: scammer-simulator-secure-key-2025" \
  -d '{
    "targetUsername": "testuser",
    "targetUrl": "https://your-app.com/login",
    "accountsToUse": [...],
    "proxy": "http://user:pass@host:port"
  }'
```

#### Example: Comment Spam Attack

```bash
curl -X POST https://5000-id77xwzmalx86c9jrc6wv-327093ec.manusvm.computer/api/comment-spam \
  -H "Content-Type: application/json" \
  -H "X-API-Key: scammer-simulator-secure-key-2025" \
  -d '{
    "postUrl": "https://your-app.com/post/123",
    "commentText": "Great post!",
    "accountsToUse": [...],
    "proxy": "http://user:pass@host:port"
  }'
```

---

## Security Features

### Authentication
- All endpoints (except `/api/health`) require the API key in the `X-API-Key` header
- Requests without a valid API key will receive a **401 Unauthorized** response

### Rate Limiting
- Maximum **10 requests per minute** per IP address
- Exceeding this limit will result in a **429 Too Many Requests** response
- Rate limits help prevent abuse and protect your testing infrastructure

### CORS Protection
- The frontend and backend are configured to communicate securely
- Cross-origin requests are restricted to authorized domains

---

## Testing Workflow

### Step 1: Generate Fake Accounts
1. Go to the **"Generate Accounts"** tab
2. Enter your app's signup URL
3. Set the number of accounts (1-100)
4. Click **"Generate Accounts"**
5. Wait for the process to complete
6. Download the generated accounts for reference

### Step 2: Test Follower Boosting
1. Go to the **"Follower Boost"** tab
2. Enter the target username you want to test
3. Click **"Boost Followers"**
4. Monitor the logs to see how many accounts successfully followed the target
5. Analyze your app's response:
   - **High success rate (80%+):** Your app may need stronger bot detection
   - **Medium success rate (40-80%):** Your app has some protection but can be improved
   - **Low success rate (<40%):** Your app has strong bot detection

### Step 3: Test Comment Spam
1. Go to the **"Comment Spam"** tab
2. Enter the URL of a test post
3. Enter the comment text you want to spam
4. Click **"Spam Comments"**
5. Monitor the logs and analyze results

### Step 4: Analyze Results
- Review the real-time logs for detailed information about each bot action
- Check success/failure rates for each attack type
- Identify patterns in what gets blocked vs. what succeeds
- Use these insights to improve your app's security

---

## Interpreting Results

### Success Rate Analysis

| Success Rate | Interpretation | Recommended Actions |
| :--- | :--- | :--- |
| **80%+** | Your app is vulnerable to bot attacks | Implement CAPTCHA, rate limiting, behavioral analysis, IP reputation checking |
| **40-80%** | Your app has basic bot detection | Add ML-based detection, device fingerprinting, email/phone verification |
| **<40%** | Your app has strong bot detection | Continue monitoring for new attack vectors and sophisticated bots |

### Log Indicators

- **✅ Success (Green):** Bot action completed successfully
- **❌ Error (Red):** Bot action failed (likely blocked by your security measures)
- **ℹ️ Info (Blue):** General information about the test progress

---

## Advanced Features

### Using Proxies for Distributed Testing

To simulate attacks from multiple geographic locations or IP addresses:

1. Obtain proxy server addresses (HTTP or SOCKS5)
2. In the **Proxy Server** field, enter: `http://user:pass@host:port`
3. Run the test
4. The bot traffic will be routed through the proxy

**Example Proxy Formats:**
- `http://proxy.example.com:8080`
- `http://user:password@proxy.example.com:8080`
- `socks5://proxy.example.com:1080`

---

## Troubleshooting

### "Unauthorized: Invalid or missing API key"
- Make sure you're including the `X-API-Key` header in your API requests
- Verify the API key is exactly: `scammer-simulator-secure-key-2025`

### "Too many requests from this IP"
- You've exceeded the 10 requests per minute limit
- Wait a minute and try again
- For higher limits, contact support

### "Target URL is required"
- Make sure you've entered a valid URL in the Target App URL field
- The URL should include the protocol (e.g., `https://`)

### "Failed to find or submit login form"
- Your app's login form might use custom HTML attributes
- Try adjusting the form field names or using a different URL
- Check the logs for more details

### Frontend not loading
- Clear your browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Try accessing the URL in an incognito/private window
- Check your internet connection

---

## Important Notes

1. **Authorization Required:** Always ensure you have explicit permission from the app owner before testing
2. **Staging Environment:** Test on a staging/development environment, not production
3. **Rate Limiting:** Be mindful of the 10 requests/minute limit
4. **Data Privacy:** Generated accounts contain randomly generated data and should not be used for any purpose other than testing
5. **Monitoring:** Keep an eye on your app's server logs during testing

---

## Support & Documentation

- **GitHub Repository:** https://github.com/Silasveyren-55/scammer-simulator
- **Full Documentation:** See README.md in the repository
- **Contributing Guide:** See CONTRIBUTING.md in the repository

---

## Deployment Information

- **Backend Status:** Running on port 5000
- **Frontend Status:** Running on port 3000
- **Authentication:** Enabled
- **Rate Limiting:** 10 requests/minute
- **Deployment Date:** October 28, 2025
- **API Version:** 1.0

---

**This deployment is private and intended for authorized security testing only.**

For questions or issues, please refer to the GitHub repository or contact the development team.
