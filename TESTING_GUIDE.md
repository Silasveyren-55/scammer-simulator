# Comprehensive Testing Guide - Sentinel Test Suite

This document provides a detailed testing protocol to validate the **Sentinel Test Suite** tool's functionality, security, and effectiveness. Follow these steps to ensure the tool is production-ready and performs as expected.

---

## 1. Pre-Testing Setup

### 1.1 Environment Verification

Before running tests, verify your environment is properly configured:

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Verify all dependencies are installed
cd backend && npm list && cd ../frontend && npm list
```

### 1.2 Start Services

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Expected output: "🚀 Sentinel Test Suite Backend running on port 5000"
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Expected output: "➜  Local:   http://localhost:5173/"
```

---

## 2. Unit Testing

### 2.1 Test Stealth Utilities Module

Create a test file to validate the stealth-utils functions:

```bash
# Create test file
cat > backend/test-stealth.js << 'EOF'
const { 
  getRandomUserAgent, 
  randomDelay, 
  simulateIdleTime 
} = require('./stealth-utils');

async function testStealthUtils() {
  console.log('Testing Stealth Utilities...\n');

  // Test 1: User Agent Rotation
  console.log('Test 1: User Agent Rotation');
  const ua1 = getRandomUserAgent();
  const ua2 = getRandomUserAgent();
  console.log(`  UA 1: ${ua1.substring(0, 50)}...`);
  console.log(`  UA 2: ${ua2.substring(0, 50)}...`);
  console.log(`  ✅ User agents are different: ${ua1 !== ua2 ? 'PASS' : 'FAIL'}\n`);

  // Test 2: Random Delay
  console.log('Test 2: Random Delay Execution');
  const start = Date.now();
  await randomDelay(100, 200);
  const elapsed = Date.now() - start;
  console.log(`  Elapsed time: ${elapsed}ms`);
  console.log(`  ✅ Delay within range: ${elapsed >= 100 && elapsed <= 250 ? 'PASS' : 'FAIL'}\n`);

  // Test 3: Idle Time
  console.log('Test 3: Idle Time Simulation');
  const idleStart = Date.now();
  await simulateIdleTime(100, 200);
  const idleElapsed = Date.now() - idleStart;
  console.log(`  Idle duration: ${idleElapsed}ms`);
  console.log(`  ✅ Idle time within range: ${idleElapsed >= 100 && idleElapsed <= 250 ? 'PASS' : 'FAIL'}\n`);
}

testStealthUtils().catch(console.error);
EOF

# Run the test
node backend/test-stealth.js
```

### 2.2 Test API Endpoints

```bash
# Test health endpoint
curl -s http://localhost:5000/api/health | jq .

# Expected output:
# {
#   "status": "Server is running",
#   "timestamp": "2025-10-28T..."
# }
```

---

## 3. Integration Testing

### 3.1 Test Account Generation

**Step 1:** Open the frontend dashboard at `http://localhost:5173`

**Step 2:** Configure the test:
- Platform: Select "TikTok"
- Target App URL: Enter your test app's signup URL (e.g., `http://localhost:3000/signup`)
- Number of Accounts: Set to 3

**Step 3:** Click "Create Test Accounts" and monitor:
- ✅ Real-time logs should appear
- ✅ Logs should show account creation progress
- ✅ Logs should show contextual delays (page load, typing, etc.)
- ✅ Success rate should be displayed

**Expected Results:**
- Accounts generated successfully
- Logs show human-like behavior (Bézier curves, jitter, contextual delays)
- No errors in browser console

### 3.2 Test Likes Boost Attack

**Step 1:** Ensure accounts are generated (from 3.1)

**Step 2:** Configure the test:
- Platform: "TikTok"
- Post URL: Enter a test post URL from your app
- Click "Test Likes"

**Step 3:** Monitor:
- ✅ Logs show each account attempting to like the post
- ✅ Success/failure status for each account
- ✅ Overall success rate

**Expected Results:**
- Likes are successfully added (or blocked if your security is strong)
- Logs show stealth behavior (no obvious bot patterns)

### 3.3 Test Views Boost Attack

**Step 1:** Configure the test:
- Platform: "Instagram"
- Content URL: Enter a test video URL
- View Duration: Set to 5000ms
- Click "Test Views"

**Step 2:** Monitor:
- ✅ Logs show each account viewing the content
- ✅ View duration is respected
- ✅ Natural scrolling and interaction patterns logged

### 3.4 Test Comment Spam Attack

**Step 1:** Configure the test:
- Platform: "Twitter"
- Post URL: Enter a test post URL
- Comment Text: "Test comment from bot"
- Click "Test Comments"

**Step 2:** Monitor:
- ✅ Logs show comment posting attempts
- ✅ Success/failure status for each account
- ✅ Overall success rate

---

## 4. Security & Stealth Testing

### 4.1 Browser Fingerprinting Evasion

**Test Objective:** Verify that the browser fingerprint is masked

**Steps:**
1. Generate an account with the tool
2. Open the browser's DevTools console during account generation
3. Run the following commands:

```javascript
// Check if webdriver is masked
console.log(navigator.webdriver); // Should be undefined

// Check if chrome object exists
console.log(window.chrome); // Should have runtime property

// Check plugins
console.log(navigator.plugins.length); // Should be > 0 (not 0)
```

**Expected Results:**
- `navigator.webdriver` is `undefined`
- `window.chrome.runtime` exists
- `navigator.plugins` has entries

### 4.2 Behavioral Mimicry Testing

**Test Objective:** Verify that mouse movements and typing are human-like

**Steps:**
1. Monitor the browser during account generation
2. Observe mouse movement patterns
3. Observe typing speed

**Expected Results:**
- Mouse movements are smooth and non-linear (Bézier curves)
- Mouse has "jitter" (slight random deviations)
- Typing speed varies (not constant)
- Occasional pauses during typing (simulating thinking)
- Scrolling is smooth and natural

### 4.3 Proxy Testing

**Test Objective:** Verify proxy integration works correctly

**Steps:**
1. Set up a proxy server (e.g., using a free proxy service)
2. In the frontend, enter the proxy URL (e.g., `http://user:pass@proxy.example.com:8080`)
3. Generate accounts with the proxy enabled
4. Monitor logs for proxy usage confirmation

**Expected Results:**
- Logs show "Using proxy: [proxy URL]"
- Accounts are created successfully through the proxy
- No connection errors

---

## 5. Performance Testing

### 5.1 Load Testing

**Test Objective:** Verify the tool can handle multiple concurrent operations

**Steps:**
1. Generate 10 accounts simultaneously
2. Monitor CPU and memory usage
3. Monitor response times

**Expected Results:**
- All accounts generated successfully
- CPU usage < 80%
- Memory usage < 2GB
- Response times < 5 seconds per account

### 5.2 Stress Testing

**Test Objective:** Verify the tool remains stable under heavy load

**Steps:**
1. Generate 50 accounts
2. Launch 3 different attack types simultaneously
3. Monitor for crashes or errors

**Expected Results:**
- No crashes or unhandled errors
- All operations complete successfully
- Graceful handling of rate limits

---

## 6. Compatibility Testing

### 6.1 Platform Compatibility

Test the tool on each supported platform:

| Platform | Test URL | Expected Result |
| :--- | :--- | :--- |
| TikTok | `https://tiktok.com/@user/video/123` | Platform detected, selectors work |
| Instagram | `https://instagram.com/p/ABC123/` | Platform detected, selectors work |
| Twitter | `https://twitter.com/user/status/123` | Platform detected, selectors work |
| Facebook | `https://facebook.com/user/posts/123` | Platform detected, selectors work |
| Telegram | `https://t.me/channel/123` | Platform detected, selectors work |

### 6.2 Browser Compatibility

Test on multiple browsers:

```bash
# Test on Chrome (default)
# Test on Firefox (if Playwright supports)
# Test on Safari (if Playwright supports)
```

**Expected Results:**
- Tool works on all supported browsers
- No console errors
- Consistent performance across browsers

---

## 7. Error Handling Testing

### 7.1 Invalid Input Testing

**Test Cases:**

| Input | Expected Behavior |
| :--- | :--- |
| Empty target URL | Error message: "Target URL is required" |
| Invalid URL format | Error message: "Invalid URL" |
| Count = 0 | Error message: "Count must be at least 1" |
| Count > 100 | Error message or warning |
| Invalid proxy URL | Error message: "Proxy connection failed" |

### 7.2 Network Failure Testing

**Test Objective:** Verify graceful handling of network failures

**Steps:**
1. Disconnect internet during account generation
2. Reconnect and retry
3. Monitor error handling

**Expected Results:**
- Clear error messages
- No hanging processes
- Ability to retry without restarting

---

## 8. Documentation Verification

### 8.1 README Accuracy

- [ ] All API endpoints are documented
- [ ] Installation steps are clear and complete
- [ ] Usage examples are accurate
- [ ] All features are described
- [ ] License information is present

### 8.2 Code Comments

- [ ] All functions have JSDoc comments
- [ ] Complex logic is explained
- [ ] Parameters and return types are documented

---

## 9. Security Verification

### 9.1 API Key Protection

**Test:**
```bash
# Try to call API without key
curl -X POST http://localhost:5000/api/generate-accounts \
  -H "Content-Type: application/json" \
  -d '{"count": 1, "targetUrl": "http://example.com"}'

# Expected: 401 Unauthorized
```

### 9.2 Rate Limiting

**Test:**
```bash
# Make 15 requests in quick succession
for i in {1..15}; do
  curl -s http://localhost:5000/api/health
done

# Expected: After 10 requests, receive rate limit error
```

---

## 10. Final Validation Checklist

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Security tests pass
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] Documentation is accurate
- [ ] Code is clean and well-commented
- [ ] All features work as expected
- [ ] Error handling is robust
- [ ] Tool is ready for production

---

## 11. Reporting Issues

If you encounter any issues during testing, please:

1. Document the exact steps to reproduce
2. Include error messages and logs
3. Specify your environment (OS, Node version, etc.)
4. Create an issue on GitHub with the details

---

## Conclusion

This comprehensive testing guide ensures the **Sentinel Test Suite** is production-ready, secure, and performs reliably. Follow all sections to validate the tool before deployment.

**Last Updated:** October 2025
