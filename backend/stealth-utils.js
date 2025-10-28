const { chromium } = require('playwright');
const StealthPlugin = require('playwright-extra-plugin-stealth');
const BezierEasing = require('bezier-easing');

// Apply stealth plugin to Playwright
chromium.use(StealthPlugin());

/**
 * Launch a stealth browser with advanced anti-detection features
 * @param {Object} options - Launch options
 * @returns {Promise<Browser>} - Stealth browser instance
 */
async function launchStealthBrowser(options = {}) {
  const launchOptions = {
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-popup-blocking',
      '--disable-prompt-on-repost',
      '--disable-background-networking',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-sync',
      '--disable-translate',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-service-autorun',
      '--safebrowsing-disable-auto-update',
    ],
    ...options,
  };

  if (options.proxy) {
    launchOptions.proxy = options.proxy;
  }

  const browser = await chromium.launch(launchOptions);
  return browser;
}

/**
 * Create a stealth context with advanced fingerprinting evasion
 * @param {Browser} browser - Browser instance
 * @returns {Promise<BrowserContext>} - Stealth context
 */
async function createStealthContext(browser) {
  const context = await browser.createContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: getRandomUserAgent(),
    locale: 'en-US',
    timezoneId: 'America/New_York',
    geolocation: { latitude: 40.7128, longitude: -74.0060 },
    permissions: ['geolocation'],
    ignoreHTTPSErrors: true,
  });

  // Inject stealth JavaScript to mask additional fingerprints
  await context.addInitScript(() => {
    // Override navigator properties
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined,
    });

    // Override chrome property
    Object.defineProperty(window, 'chrome', {
      get: () => ({
        runtime: {},
      }),
    });

    // Override permissions
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) =>
      parameters.name === 'notifications'
        ? Promise.resolve({ state: Notification.permission })
        : originalQuery(parameters);

    // Mask headless browser detection
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5],
    });

    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    });

    // Override toString methods
    window.toString = () => '[object Window]';
  });

  return context;
}

/**
 * Simulate human-like mouse movement using Bézier curves
 * @param {Page} page - Playwright page object
 * @param {number} fromX - Starting X coordinate
 * @param {number} fromY - Starting Y coordinate
 * @param {number} toX - Ending X coordinate
 * @param {number} toY - Ending Y coordinate
 * @param {number} duration - Duration in milliseconds
 */
async function moveMouseBezier(page, fromX, fromY, toX, toY, duration = 1000) {
  // Create Bézier easing function (ease-in-out)
  const easeInOut = BezierEasing(0.25, 0.1, 0.25, 1);

  const steps = Math.ceil(duration / 16); // ~60 FPS
  const startTime = Date.now();

  for (let i = 0; i <= steps; i++) {
    const elapsed = Math.min(i * 16, duration);
    const progress = easeInOut(elapsed / duration);

    const x = fromX + (toX - fromX) * progress;
    const y = fromY + (toY - fromY) * progress;

    // Add slight jitter for realism
    const jitterX = (Math.random() - 0.5) * 2;
    const jitterY = (Math.random() - 0.5) * 2;

    await page.mouse.move(Math.round(x + jitterX), Math.round(y + jitterY));

    // Small delay between moves
    if (i < steps) {
      await new Promise(resolve => setTimeout(resolve, 16));
    }
  }
}

/**
 * Simulate human-like typing with realistic delays
 * @param {Page} page - Playwright page object
 * @param {string} selector - Element selector
 * @param {string} text - Text to type
 * @param {number} minDelay - Minimum delay between keystrokes (ms)
 * @param {number} maxDelay - Maximum delay between keystrokes (ms)
 */
async function typeHumanLike(page, selector, text, minDelay = 50, maxDelay = 150) {
  const element = await page.$(selector);
  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }

  await element.click();
  await randomDelay(200, 500);

  for (const char of text) {
    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    await page.keyboard.type(char);
    await new Promise(resolve => setTimeout(resolve, delay));

    // Occasional pause (like thinking)
    if (Math.random() < 0.1) {
      await randomDelay(200, 500);
    }
  }
}

/**
 * Simulate human-like scrolling behavior
 * @param {Page} page - Playwright page object
 * @param {number} scrollAmount - Pixels to scroll
 * @param {number} duration - Duration of scroll in milliseconds
 */
async function scrollHumanLike(page, scrollAmount = 500, duration = 1000) {
  // Easing function for smooth scrolling
  const easeInOut = BezierEasing(0.25, 0.1, 0.25, 1);

  const steps = Math.ceil(duration / 16);
  for (let i = 0; i <= steps; i++) {
    const progress = easeInOut(i / steps);
    const currentScroll = scrollAmount * progress;

    await page.evaluate((scroll) => {
      window.scrollBy(0, scroll / steps);
    }, scrollAmount);

    if (i < steps) {
      await new Promise(resolve => setTimeout(resolve, 16));
    }
  }
}

/**
 * Contextual delay based on action type
 * @param {string} actionType - Type of action (e.g., 'page_load', 'typing', 'clicking')
 * @returns {Promise<void>}
 */
async function contextualDelay(actionType = 'default') {
  const delays = {
    page_load: [2000, 4000],
    typing: [500, 1500],
    clicking: [300, 800],
    scrolling: [1000, 3000],
    default: [500, 2000],
  };

  const [min, max] = delays[actionType] || delays.default;
  await randomDelay(min, max);
}

/**
 * Random delay utility
 * @param {number} min - Minimum delay in milliseconds
 * @param {number} max - Maximum delay in milliseconds
 * @returns {Promise<void>}
 */
async function randomDelay(min = 500, max = 2000) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Get a random, realistic user agent
 * @returns {string} - Random user agent string
 */
function getRandomUserAgent() {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
  ];

  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

/**
 * Simulate random idle time (user not doing anything)
 * @param {number} minDuration - Minimum idle time (ms)
 * @param {number} maxDuration - Maximum idle time (ms)
 */
async function simulateIdleTime(minDuration = 1000, maxDuration = 5000) {
  const duration = Math.floor(Math.random() * (maxDuration - minDuration + 1)) + minDuration;
  await new Promise(resolve => setTimeout(resolve, duration));
}

/**
 * Simulate human-like page interaction pattern
 * @param {Page} page - Playwright page object
 */
async function simulatePageInteraction(page) {
  // Random scroll
  if (Math.random() < 0.6) {
    await scrollHumanLike(page, Math.random() * 300 + 100, 800);
    await contextualDelay('scrolling');
  }

  // Random mouse movement
  if (Math.random() < 0.5) {
    const randomX = Math.floor(Math.random() * 1920);
    const randomY = Math.floor(Math.random() * 1080);
    await moveMouseBezier(page, randomX, randomY, randomX + 100, randomY + 100, 500);
  }

  // Random idle time
  if (Math.random() < 0.3) {
    await simulateIdleTime(500, 2000);
  }
}

module.exports = {
  launchStealthBrowser,
  createStealthContext,
  moveMouseBezier,
  typeHumanLike,
  scrollHumanLike,
  contextualDelay,
  randomDelay,
  getRandomUserAgent,
  simulateIdleTime,
  simulatePageInteraction,
};
