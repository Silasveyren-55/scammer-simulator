require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { chromium } = require('playwright');
const { URL } = require('url');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY || 'default-key';
const ENABLE_AUTH = process.env.ENABLE_AUTH === 'true';

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: parseInt(process.env.MAX_REQUESTS_PER_MINUTE) || 10,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication middleware
const authenticateRequest = (req, res, next) => {
  if (!ENABLE_AUTH) {
    return next();
  }

  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }
  next();
};

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true,
}));
app.use(express.json());
app.use(limiter);

// Store for generated accounts
let generatedAccounts = [];

// Platform detection and configuration
const PLATFORM_CONFIG = {
  tiktok: {
    name: 'TikTok',
    patterns: ['tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com'],
    selectors: {
      like: ['[data-e2e="like-icon"]', 'button[aria-label*="like" i]', '[data-testid="like-button"]'],
      comment: ['[data-e2e="comment-icon"]', 'button[aria-label*="comment" i]'],
      share: ['[data-e2e="share-icon"]', 'button[aria-label*="share" i]'],
    }
  },
  instagram: {
    name: 'Instagram',
    patterns: ['instagram.com', 'instagr.am'],
    selectors: {
      like: ['button[aria-label*="Like" i]', 'svg[aria-label*="Like" i]', '[data-testid="like-button"]'],
      comment: ['button[aria-label*="Comment" i]', '[data-testid="comment-button"]'],
      share: ['button[aria-label*="Share" i]', '[data-testid="share-button"]'],
    }
  },
  twitter: {
    name: 'Twitter/X',
    patterns: ['twitter.com', 'x.com', 't.co'],
    selectors: {
      like: ['button[aria-label*="Like" i]', '[data-testid="like"]', 'button[aria-label*="favorite" i]'],
      comment: ['button[aria-label*="Reply" i]', '[data-testid="reply"]'],
      share: ['button[aria-label*="Share" i]', '[data-testid="share"]'],
    }
  },
  facebook: {
    name: 'Facebook',
    patterns: ['facebook.com', 'fb.com'],
    selectors: {
      like: ['button[aria-label*="Like" i]', '[data-testid="like_button"]', 'button[aria-label*="React" i]'],
      comment: ['button[aria-label*="Comment" i]', '[data-testid="comment_button"]'],
      share: ['button[aria-label*="Share" i]', '[data-testid="share_button"]'],
    }
  },
  telegram: {
    name: 'Telegram',
    patterns: ['t.me', 'telegram.me'],
    selectors: {
      like: ['button[aria-label*="reaction" i]', '[data-testid="reaction-button"]'],
      comment: ['button[aria-label*="reply" i]', '[data-testid="reply-button"]'],
      share: ['button[aria-label*="share" i]', '[data-testid="share-button"]'],
    }
  }
};

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

// Detect platform from URL
function detectPlatform(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    for (const [key, config] of Object.entries(PLATFORM_CONFIG)) {
      if (config.patterns.some(pattern => hostname.includes(pattern))) {
        return key;
      }
    }
    return 'unknown';
  } catch (e) {
    return 'unknown';
  }
}

// Get platform config
function getPlatformConfig(platform) {
  return PLATFORM_CONFIG[platform.toLowerCase()] || null;
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

// Generic Login Function
async function performLogin(page, account) {
  try {
    const usernameInput = await page.$('input[name="username"]') || await page.$('input[type="email"]') || await page.$('input[placeholder*="user" i]') || await page.$('input[placeholder*="email" i]');
    const passwordInput = await page.$('input[type="password"]') || await page.$('input[name="password"]') || await page.$('input[placeholder*="password" i]');

    if (usernameInput && passwordInput) {
      await usernameInput.click();
      await randomDelay(200, 500);
      await usernameInput.type(account.username, { delay: Math.random() * 100 + 50 });

      await passwordInput.click();
      await randomDelay(200, 500);
      await passwordInput.type(account.password, { delay: Math.random() * 100 + 50 });

      const loginButton = await page.$('button[type="submit"]') || await page.$('button:has-text("Log In")') || await page.$('button:has-text("Login")') || await page.$('button[aria-label*="log in" i]');
      if (loginButton) {
        await loginButton.click();
        await randomDelay(3000, 5000);
        return true;
      }
    }
  } catch (e) {
    console.error('Login error:', e.message);
  }
  return false;
}

// Find and click element by selectors
async function findAndClickElement(page, selectors) {
  for (const selector of selectors) {
    try {
      const element = await page.$(selector);
      if (element) {
        await page.evaluate(() => window.scrollBy(0, 50));
        await randomDelay(200, 500);
        await element.click();
        return true;
      }
    } catch (e) {
      continue;
    }
  }
  return false;
}

// Health check endpoint (no auth required)
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Endpoint to generate fake accounts
app.post('/api/generate-accounts', authenticateRequest, async (req, res) => {
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

        await page.setUserAgent(getRandomUserAgent());

        const userData = generateRandomUser();
        console.log(`[${i + 1}/${count}] Creating account: ${userData.username}`);

        await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
        await randomDelay(1000, 2000);

        await simulateMouseMovement(page);

        try {
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

          const submitButton = await page.$('button[type="submit"]') || await page.$('button:has-text("Sign Up")') || await page.$('button:has-text("Register")') || await page.$('button[aria-label*="sign up" i]');
          
          if (submitButton) {
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
app.get('/api/accounts', authenticateRequest, (req, res) => {
  res.json({
    count: generatedAccounts.length,
    accounts: generatedAccounts
  });
});

// Universal Likes Boost Attack (Link-based)
app.post('/api/likes-boost', authenticateRequest, async (req, res) => {
  const { postUrl, accountsToUse, proxy } = req.body;

  if (!postUrl || !accountsToUse || accountsToUse.length === 0) {
    return res.status(400).json({ error: 'Missing required parameters: postUrl and accountsToUse' });
  }

  const platform = detectPlatform(postUrl);
  const platformConfig = getPlatformConfig(platform);

  if (!platformConfig) {
    return res.status(400).json({ error: `Unsupported platform. Supported: ${Object.keys(PLATFORM_CONFIG).join(', ')}` });
  }

  const results = [];

  try {
    const launchOptions = { headless: true };
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

        await page.setUserAgent(getRandomUserAgent());

        console.log(`[${i + 1}/${accountsToUse.length}] Liking post with account ${account.username} on ${platformConfig.name}`);

        await page.goto(postUrl, { waitUntil: 'networkidle', timeout: 30000 });
        await randomDelay(1000, 2000);

        // Try to like the post
        const liked = await findAndClickElement(page, platformConfig.selectors.like);

        if (liked) {
          await randomDelay(1000, 2000);
          results.push({
            success: true,
            account: account.username,
            platform: platformConfig.name,
            action: `Liked post on ${platformConfig.name}`
          });
        } else {
          results.push({
            success: false,
            account: account.username,
            platform: platformConfig.name,
            message: 'Like button not found or already liked'
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
      platform: platformConfig.name,
      postUrl: postUrl,
      totalAttempted: accountsToUse.length,
      totalSuccessful: results.filter(r => r.success).length,
      results: results
    });

  } catch (error) {
    console.error('Error in likes boost:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Universal Views Boost Attack (Link-based)
app.post('/api/views-boost', authenticateRequest, async (req, res) => {
  const { contentUrl, accountsToUse, proxy, viewDuration = 5000 } = req.body;

  if (!contentUrl || !accountsToUse || accountsToUse.length === 0) {
    return res.status(400).json({ error: 'Missing required parameters: contentUrl and accountsToUse' });
  }

  const platform = detectPlatform(contentUrl);
  const platformConfig = getPlatformConfig(platform);

  if (!platformConfig) {
    return res.status(400).json({ error: `Unsupported platform. Supported: ${Object.keys(PLATFORM_CONFIG).join(', ')}` });
  }

  const results = [];

  try {
    const launchOptions = { headless: true };
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

        await page.setUserAgent(getRandomUserAgent());

        console.log(`[${i + 1}/${accountsToUse.length}] Viewing content with account ${account.username} on ${platformConfig.name}`);

        await page.goto(contentUrl, { waitUntil: 'networkidle', timeout: 30000 });
        
        // Simulate viewing by scrolling and waiting
        await page.evaluate(() => window.scrollBy(0, 100));
        await randomDelay(parseInt(viewDuration) / 2, parseInt(viewDuration));
        await page.evaluate(() => window.scrollBy(0, -100));
        
        results.push({
          success: true,
          account: account.username,
          platform: platformConfig.name,
          action: `Viewed content on ${platformConfig.name}`,
          duration: `${viewDuration}ms`
        });

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
      platform: platformConfig.name,
      contentUrl: contentUrl,
      totalAttempted: accountsToUse.length,
      totalSuccessful: results.filter(r => r.success).length,
      results: results
    });

  } catch (error) {
    console.error('Error in views boost:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Endpoint for follower boost attack
app.post('/api/follower-boost', authenticateRequest, async (req, res) => {
  const { targetUsername, targetUrl, accountsToUse, proxy } = req.body;

  if (!targetUsername || !targetUrl || !accountsToUse || accountsToUse.length === 0) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const platform = detectPlatform(targetUrl);
  const platformConfig = getPlatformConfig(platform);

  const results = [];

  try {
    const launchOptions = { headless: true };
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

        await page.setUserAgent(getRandomUserAgent());

        console.log(`[${i + 1}/${accountsToUse.length}] Following ${targetUsername} with account ${account.username}`);

        await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
        await randomDelay(1000, 2000);

        const loggedIn = await performLogin(page, account);
        if (!loggedIn) {
          results.push({
            success: false,
            account: account.username,
            message: 'Failed to find or submit login form.'
          });
          await context.close();
          continue;
        }

        // Navigate to target profile
        try {
          const url = new URL(targetUrl);
          const profileUrl = `${url.protocol}//${url.hostname}/profile/${targetUsername}`;
          await page.goto(profileUrl, { waitUntil: 'networkidle', timeout: 30000 });
          await randomDelay(1000, 2000);
        } catch (e) {
          console.error('Error navigating to profile:', e.message);
        }

        const followButton = await page.$('button:has-text("Follow")') || 
                             await page.$('button[aria-label*="Follow" i]') ||
                             await page.$('button[role="button"][tabindex="0"]:has-text("Follow")');
        
        if (followButton) {
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
app.post('/api/comment-spam', authenticateRequest, async (req, res) => {
  const { postUrl, commentText, accountsToUse, proxy } = req.body;

  if (!postUrl || !commentText || !accountsToUse || accountsToUse.length === 0) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const platform = detectPlatform(postUrl);
  const platformConfig = getPlatformConfig(platform);

  const results = [];

  try {
    const launchOptions = { headless: true };
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

        await page.setUserAgent(getRandomUserAgent());

        console.log(`[${i + 1}/${accountsToUse.length}] Commenting on post with account ${account.username}`);

        await page.goto(postUrl, { waitUntil: 'networkidle', timeout: 30000 });
        await randomDelay(1000, 2000);

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

        const commentInput = await page.$('textarea[placeholder*="comment" i]') || 
                             await page.$('input[placeholder*="comment" i]') || 
                             await page.$('[contenteditable="true"]') ||
                             await page.$('textarea[aria-label*="comment" i]');
        
        if (commentInput) {
          await page.evaluate(() => window.scrollBy(0, 50));
          await commentInput.click();
          await randomDelay(200, 500);
          const finalComment = commentText + (Math.random() < 0.2 ? ` ${Math.floor(Math.random() * 99)}` : '');
          await commentInput.type(finalComment, { delay: Math.random() * 50 + 25 });

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
              action: `Posted comment on ${platform}`
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
            message: 'Comment input field not found'
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
      platform: platform,
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

// Endpoint to get supported platforms
app.get('/api/platforms', (req, res) => {
  res.json({
    platforms: Object.entries(PLATFORM_CONFIG).map(([key, config]) => ({
      id: key,
      name: config.name,
      patterns: config.patterns
    }))
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Scammer Simulator Backend running on port ${PORT}`);
  console.log(`🔐 Authentication: ${ENABLE_AUTH ? 'Enabled' : 'Disabled'}`);
  console.log(`📊 Supported Platforms: ${Object.keys(PLATFORM_CONFIG).join(', ')}`);
});
