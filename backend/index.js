const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Store for generated accounts
let generatedAccounts = [];

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
  const { count, targetUrl } = req.body;

  if (!count || count < 1) {
    return res.status(400).json({ error: 'Count must be at least 1' });
  }

  if (!targetUrl) {
    return res.status(400).json({ error: 'Target URL is required' });
  }

  generatedAccounts = [];
  const results = [];

  try {
    const browser = await chromium.launch({ headless: true });

    for (let i = 0; i < count; i++) {
      try {
        const context = await browser.createContext();
        const page = await context.newPage();

        // Set a realistic user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

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
          const submitButton = await page.$('button[type="submit"]') || await page.$('button:has-text("Sign Up")') || await page.$('button:has-text("Register")');
          
          if (submitButton) {
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
  const { targetUsername, targetUrl, accountsToUse } = req.body;

  if (!targetUsername || !targetUrl || !accountsToUse || accountsToUse.length === 0) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const results = [];

  try {
    const browser = await chromium.launch({ headless: true });

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
        const usernameInput = await page.$('input[name="username"]') || await page.$('input[type="email"]');
        const passwordInput = await page.$('input[type="password"]');

        if (usernameInput && passwordInput) {
          await usernameInput.click();
          await randomDelay(200, 500);
          await usernameInput.type(account.username, { delay: Math.random() * 100 + 50 });

          await passwordInput.click();
          await randomDelay(200, 500);
          await passwordInput.type(account.password, { delay: Math.random() * 100 + 50 });

          const loginButton = await page.$('button[type="submit"]') || await page.$('button:has-text("Login")');
          if (loginButton) {
            await loginButton.click();
            await randomDelay(3000, 5000);
          }
        }

        // Navigate to target profile
        const profileUrl = `${new URL(targetUrl).origin}/profile/${targetUsername}`;
        await page.goto(profileUrl, { waitUntil: 'networkidle', timeout: 30000 });
        await randomDelay(1000, 2000);

        // Click follow button
        const followButton = await page.$('button:has-text("Follow")') || await page.$('button[aria-label*="Follow"]');
        if (followButton) {
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
  const { postUrl, commentText, accountsToUse } = req.body;

  if (!postUrl || !commentText || !accountsToUse || accountsToUse.length === 0) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const results = [];

  try {
    const browser = await chromium.launch({ headless: true });

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

        // Login if needed (generic)
        const usernameInput = await page.$('input[name="username"]') || await page.$('input[type="email"]');
        if (usernameInput) {
          const passwordInput = await page.$('input[type="password"]');
          if (passwordInput) {
            await usernameInput.click();
            await randomDelay(200, 500);
            await usernameInput.type(account.username, { delay: Math.random() * 100 + 50 });

            await passwordInput.click();
            await randomDelay(200, 500);
            await passwordInput.type(account.password, { delay: Math.random() * 100 + 50 });

            const loginButton = await page.$('button[type="submit"]') || await page.$('button:has-text("Login")');
            if (loginButton) {
              await loginButton.click();
              await randomDelay(3000, 5000);
            }
          }
        }

        // Find comment input
        const commentInput = await page.$('textarea[placeholder*="comment" i]') || await page.$('input[placeholder*="comment" i]') || await page.$('[contenteditable="true"]');
        
        if (commentInput) {
          await commentInput.click();
          await randomDelay(200, 500);
          await commentInput.type(commentText, { delay: Math.random() * 50 + 25 });

          // Find and click submit button
          const submitButton = await page.$('button:has-text("Post")') || await page.$('button:has-text("Send")') || await page.$('button[type="submit"]');
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
