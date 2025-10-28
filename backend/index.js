const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');
const { URL } = require('url');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Store for generated accounts
let generatedAccounts = [];

// List of common, up-to-date User Agents for better stealth
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
];

// Utility function to get a random User Agent
function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Utility function to create a profile URL based on the login URL
function createProfileUrl(loginUrl, username) {
  try {
    const url = new URL(loginUrl);
    // Generic social media profile path
    return `${url.protocol}//${url.hostname}/profile/${username}`;
  } catch (e) {
    console.error("Invalid URL provided:", e);
    return null;
  }
}

// Generic Login Function
async function performLogin(page, account) {
  // Try to find and fill login form fields
  const usernameInput = await page.$('input[name="username"]') || await page.$('input[type="email"]') || await page.$('input[placeholder*="user" i]') || await page.$('input[placeholder*="email" i]');
  const passwordInput = await page.$('input[type="password"]') || await page.$('input[name="password"]') || await page.$('input[placeholder*="password" i]');

  if (usernameInput && passwordInput) {
    await usernameInput.click();
    await randomDelay(200, 500);
    await usernameInput.type(account.username, { delay: Math.random() * 100 + 50 });

    await passwordInput.click();
    await randomDelay(200, 500);
    await passwordInput.type(account.password, { delay: Math.random() * 100 + 50 });

    // Look for login button
    const loginButton = await page.$('button[type="submit"]') || await page.$('button:has-text("Log In")') || await page.$('button:has-text("Login")') || await page.$('button[aria-label*="log in" i]');
    if (loginButton) {
      await loginButton.click();
      // Wait longer after login to allow for redirects and page load
      await randomDelay(3000, 5000);
      return true;
    }
  }
  return false;
}

// Utility function to generate random user data
function generateRandomUser() {
  const firstNames = ['Alex', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Riley', 'Quinn', 'Avery', 'Blake', 'Drew'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 10000)}`;
  const email = `${username}${Math.floor(Math.random() * 100000)}@tempmail.com`;
  const password = `Pass${Math.random().toString(36).substring(2, 15)}${Math.floor(Math.random() * 100)}`;

  return { username, email, password, firstName, lastName };
}

// Utility function to add realistic delays
async function randomDelay(min = 500, max = 2000) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise(resolve => setTimeout(resolve, delay));
}

// Utility function to simulate mouse movements
async function simulateMouseMovement(page) {
  const randomX = Math.floor(Math.random() * 1920);
  const randomY = Math.floor(Math.random() * 1080);
  await page.mouse.move(randomX, randomY);
  await randomDelay(100, 300);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Endpoint to generate fake accounts
app.post('/api/generate-accounts', async (req, res) => {
  const { count, targetUrl, proxy } = req.body;

  if (!count || count < 1) {
    return res.status(400).json({ error: 'Count must be at least 1' });
  }

  if (!targetUrl) {
    return res.status(400).json({ error: 'Target URL is required' });
  }

  generatedAccounts = [];
  const results = [];

  try {
    const launchOptions = {
      headless: true,
    };

    if (proxy) {
      launchOptions.proxy = { server: proxy };
      console.log(`Using proxy: ${proxy}`);
    }

    const browser = await chromium.launch(launchOptions);

    for (let i = 0; i < count; i++) {
      try {
        const context = await browser.createContext();
        const page = await context.newPage();

        // Set a realistic user agent
        await page.setUserAgent(getRandomUserAgent());

        const userData = generateRandomUser();
        console.log(`[${i + 1}/${count}] Creating account: ${userData.username}`);

        // Navigate to target URL
        await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
        await randomDelay(1000, 2000);

        // Simulate mouse movement
        await simulateMouseMovement(page);

        // Try to find and fill signup form fields
        try {
          // Look for common signup form fields
          const emailInput = await page.$('input[type="email"]') || await page.$('input[name="email"]') || await page.$('input[placeholder*="email" i]');
          const usernameInput = await page.$('input[name="username"]') || await page.$('input[placeholder*="username" i]');
          const passwordInput = await page.$('input[type="password"]') || await page.$('input[name="password"]');
          const firstNameInput = await page.$('input[name="firstName"]') || await page.$('input[placeholder*="first" i]');
          const lastNameInput = await page.$('input[name="lastName"]') || await page.$('input[placeholder*="last" i]');

          if (emailInput) {
            await emailInput.click();
            await randomDelay(200, 500);
            await emailInput.type(userData.email, { delay: Math.random() * 100 + 50 });
          }

          if (usernameInput) {
            await usernameInput.click();
            await randomDelay(200, 500);
            await usernameInput.type(userData.username, { delay: Math.random() * 100 + 50 });
          }

          if (passwordInput) {
            await passwordInput.click();
            await randomDelay(200, 500);
            await passwordInput.type(userData.password, { delay: Math.random() * 100 + 50 });
          }

          if (firstNameInput) {
            await firstNameInput.click();
            await randomDelay(200, 500);
            await firstNameInput.type(userData.firstName, { delay: Math.random() * 100 + 50 });
          }

          if (lastNameInput) {
            await lastNameInput.click();
            await randomDelay(200, 500);
            await lastNameInput.type(userData.lastName, { delay: Math.random() * 100 + 50 });
          }

          // Look for submit button
          const submitButton = await page.$('button[type="submit"]') || await page.$('button:has-text("Sign Up")') || await page.$('button:has-text("Register")') || await page.$('button[aria-label*="sign up" i]');
          
          if (submitButton) {
            // Add a small scroll before clicking to simulate human behavior
            await page.evaluate(() => window.scrollBy(0, 50));
            await randomDelay(500, 1000);
            await submitButton.click();
            await randomDelay(2000, 3000);
          }

          generatedAccounts.push(userData);
          results.push({
            success: true,
            username: userData.username,
            email: userData.email,
            password: userData.password,
            message: `Account created successfully`
          });

        } catch (formError) {
          console.error(`Error filling form for ${userData.username}:`, formError.message);
          results.push({
            success: false,
            username: userData.username,
            message: `Failed to fill form: ${formError.message}`
          });
        }

        await context.close();
        await randomDelay(1000, 2000);

      } catch (accountError) {
        console.error(`Error creating account ${i + 1}:`, accountError.message);
        results.push({
          success: false,
          index: i + 1,
          message: `Error: ${accountError.message}`
        });
      }
    }

    await browser.close();

    res.json({
      status: 'success',
      totalAttempted: count,
      totalSuccessful: results.filter(r => r.success).length,
      results: results,
      accounts: generatedAccounts
    });

  } catch (error) {
    console.error('Error in account generation:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      results: results
    });
  }
});

// Endpoint to get generated accounts
app.get('/api/accounts', (req, res) => {
  res.json({
    count: generatedAccounts.length,
    accounts: generatedAccounts
  });
});

// Endpoint for follower boost attack
app.post('/api/follower-boost', async (req, res) => {
  const { targetUsername, targetUrl, accountsToUse, proxy } = req.body;

  if (!targetUsername || !targetUrl || !accountsToUse || accountsToUse.length === 0) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const results = [];

  try {
    const launchOptions = {
      headless: true,
    };

    if (proxy) {
      launchOptions.proxy = { server: proxy };
      console.log(`Using proxy: ${proxy}`);
    }

    const browser = await chromium.launch(launchOptions);

    for (let i = 0; i < accountsToUse.length; i++) {
      try {
        const context = await browser.createContext();
        const page = await context.newPage();
        const account = accountsToUse[i];

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        console.log(`[${i + 1}/${accountsToUse.length}] Following ${targetUsername} with account ${account.username}`);

        // Navigate to login page
        await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
        await randomDelay(1000, 2000);

        // Login logic (generic)
        const loggedIn = await performLogin(page, account);
        if (!loggedIn) {
          // If login fails, log it and continue to next account
          results.push({
            success: false,
            account: account.username,
            message: 'Failed to find or submit login form.'
          });
          await context.close();
          continue;
        }

        // Navigate to target profile
        const profileUrl = createProfileUrl(targetUrl, targetUsername);
        if (!profileUrl) {
          results.push({ success: false, account: account.username, message: 'Invalid target URL provided.' });
          await context.close();
          continue;
        }
        await page.goto(profileUrl, { waitUntil: 'networkidle', timeout: 30000 });
        await randomDelay(1000, 2000);

        // Click follow button
        // More robust selectors for follow button on various social media sites
        const followButton = await page.$('button:has-text("Follow")') || 
                             await page.$('button[aria-label*="Follow" i]') ||
                             await page.$('button[role="button"][tabindex="0"]:has-text("Follow")');
        if (followButton) {
          // Add a small scroll before clicking
          await page.evaluate(() => window.scrollBy(0, 50));
          await followButton.click();
          await randomDelay(1000, 2000);
          results.push({
            success: true,
            account: account.username,
            action: `Followed ${targetUsername}`
          });
        } else {
          results.push({
            success: false,
            account: account.username,
            message: 'Follow button not found'
          });
        }

        await context.close();
        await randomDelay(1000, 2000);

      } catch (error) {
        console.error(`Error with account ${i + 1}:`, error.message);
        results.push({
          success: false,
          index: i + 1,
          message: `Error: ${error.message}`
        });
      }
    }

    await browser.close();

    res.json({
      status: 'success',
      targetUsername: targetUsername,
      totalAttempted: accountsToUse.length,
      totalSuccessful: results.filter(r => r.success).length,
      results: results
    });

  } catch (error) {
    console.error('Error in follower boost:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Endpoint for comment spam attack
app.post('/api/comment-spam', async (req, res) => {
  const { postUrl, commentText, accountsToUse, proxy } = req.body;

  if (!postUrl || !commentText || !accountsToUse || accountsToUse.length === 0) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const results = [];

  try {
    const launchOptions = {
      headless: true,
    };

    if (proxy) {
      launchOptions.proxy = { server: proxy };
      console.log(`Using proxy: ${proxy}`);
    }

    const browser = await chromium.launch(launchOptions);

    for (let i = 0; i < accountsToUse.length; i++) {
      try {
        const context = await browser.createContext();
        const page = await context.newPage();
        const account = accountsToUse[i];

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        console.log(`[${i + 1}/${accountsToUse.length}] Posting comment with account ${account.username}`);

        // Navigate to post
        await page.goto(postUrl, { waitUntil: 'networkidle', timeout: 30000 });
        await randomDelay(1000, 2000);

        // Check if login is required
        const loginFormVisible = await page.$('input[type="password"]') !== null;
        if (loginFormVisible) {
          const loggedIn = await performLogin(page, account);
          if (!loggedIn) {
            results.push({
              success: false,
              account: account.username,
              message: 'Failed to find or submit login form on post page.'
            });
            await context.close();
            continue;
          }
        }

        // Find comment input
        // More robust selectors for comment input
        const commentInput = await page.$('textarea[placeholder*="comment" i]') || 
                             await page.$('input[placeholder*="comment" i]') || 
                             await page.$('[contenteditable="true"]') ||
                             await page.$('textarea[aria-label*="comment" i]');
        
        if (commentInput) {
          // Add a small scroll before clicking
          await page.evaluate(() => window.scrollBy(0, 50));
          await commentInput.click();
          await randomDelay(200, 500);
          // Introduce slight variation in comment text to avoid simple string matching
          const finalComment = commentText + (Math.random() < 0.2 ? ` ${Math.floor(Math.random() * 99)}` : '');
          await commentInput.type(finalComment, { delay: Math.random() * 50 + 25 });

          // Find and click submit button
          const submitButton = await page.$('button:has-text("Post")') || 
                               await page.$('button:has-text("Send")') || 
                               await page.$('button[type="submit"]') ||
                               await page.$('button[aria-label*="post" i]');
          if (submitButton) {
            await randomDelay(500, 1000);
            await submitButton.click();
            await randomDelay(1000, 2000);

            results.push({
              success: true,
              account: account.username,
              action: 'Comment posted'
            });
          } else {
            results.push({
              success: false,
              account: account.username,
              message: 'Submit button not found'
            });
          }
        } else {
          results.push({
            success: false,
            account: account.username,
            message: 'Comment input not found'
          });
        }

        await context.close();
        await randomDelay(1000, 2000);

      } catch (error) {
        console.error(`Error with account ${i + 1}:`, error.message);
        results.push({
          success: false,
          index: i + 1,
          message: `Error: ${error.message}`
        });
      }
    }

    await browser.close();

    res.json({
      status: 'success',
      postUrl: postUrl,
      totalAttempted: accountsToUse.length,
      totalSuccessful: results.filter(r => r.success).length,
      results: results
    });

  } catch (error) {
    console.error('Error in comment spam:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🤖 Scammer Simulator Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
