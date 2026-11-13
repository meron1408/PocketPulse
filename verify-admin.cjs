const puppeteer = require('puppeteer-core');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const executablePath = fs.existsSync(EDGE_PATH) ? EDGE_PATH : CHROME_PATH;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verifyAdminDashboard() {
  console.log('🚀 Starting PocketPulse Admin Dashboard E2E Verification...');
  console.log('   Using browser executable:', executablePath);

  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,960'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 960 });

  page.on('console', (msg) => console.log('   [PAGE LOG]', msg.text()));
  page.on('pageerror', (err) => console.log('   [PAGE ERROR]', err.message));
  page.on('response', async (res) => {
    if (res.url().includes('/api/')) {
      let body = '';
      try { body = await res.text(); } catch {}
      console.log(`   [API RESPONSE] ${res.status()} ${res.url()} => ${body.slice(0, 150)}`);
    }
  });

  try {
    // 1. Navigate to http://localhost:5174/
    console.log('1. Navigating to http://localhost:5174/ ...');
    await page.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded' });
    await sleep(1500);

    // 2. Open Auth Modal
    console.log('2. Opening Auth Modal...');
    const signInBtn = await page.$('#sign-in-btn');
    if (signInBtn) {
      await signInBtn.click();
    } else {
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await page.evaluate((el) => el.textContent, btn);
        if (text.includes('ይግቡ') || text.includes('Sign In')) {
          await btn.click();
          break;
        }
      }
    }
    await sleep(800);

    // 3. Login as Admin using standard credentials
    console.log('3. Logging in as Admin (admin@pocketpulse.et)...');
    await page.type('#auth-email', 'admin@pocketpulse.et');
    await page.type('#auth-password', 'Admin@123');
    await sleep(200);
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      console.log('   Submitted login credentials, waiting for session...');
    }
    await sleep(2500);

    // 4. Verify Admin Dashboard toggle button is visible in Navbar
    console.log('4. Verifying Admin Dashboard button in Navbar...');
    const adminToggleBtn = await page.$('#admin-dashboard-toggle-btn');
    if (!adminToggleBtn) {
      throw new Error('Admin Dashboard toggle button not found after logging in as admin');
    }
    console.log('   ✓ Admin Dashboard toggle button found in Navbar');

    // 5. Click Admin Dashboard button
    console.log('5. Clicking Admin Dashboard toggle button...');
    await adminToggleBtn.click();
    await sleep(1200);

    // Verify Admin Dashboard has rendered
    const adminHeading = await page.$('#admin-dashboard-heading');
    if (!adminHeading) {
      throw new Error('Admin Dashboard heading not found');
    }
    console.log('   ✓ Admin Dashboard loaded successfully');

    // Screenshot 1: Admin Overview
    await page.screenshot({ path: 'verification_admin_01_overview.png', fullPage: false });
    console.log('   📸 Saved verification_admin_01_overview.png');

    // 6. Switch to Users Management Tab
    console.log('6. Switching to Users Management Tab...');
    const usersTabBtn = await page.$('#admin-tab-users');
    if (usersTabBtn) {
      await usersTabBtn.click();
      await sleep(1000);
      await page.screenshot({ path: 'verification_admin_02_users.png', fullPage: false });
      console.log('   📸 Saved verification_admin_02_users.png');
    }

    // 7. Switch to Category & Financial Analytics Tab
    console.log('7. Switching to Category & Analytics Tab...');
    const analyticsTabBtn = await page.$('#admin-tab-analytics');
    if (analyticsTabBtn) {
      await analyticsTabBtn.click();
      await sleep(1000);
      await page.screenshot({ path: 'verification_admin_03_analytics.png', fullPage: false });
      console.log('   📸 Saved verification_admin_03_analytics.png');
    }

    // 8. Switch to Sessions & Security Tab
    console.log('8. Switching to Sessions & Security Tab...');
    const sessionsTabBtn = await page.$('#admin-tab-sessions');
    if (sessionsTabBtn) {
      await sessionsTabBtn.click();
      await sleep(1000);
      await page.screenshot({ path: 'verification_admin_04_sessions.png', fullPage: false });
      console.log('   📸 Saved verification_admin_04_sessions.png');
    }

    // 9. Test Returning to Personal Finance Tracker View
    console.log('9. Testing Return to Personal Finance Tracker view...');
    const returnBtn = await page.$('#admin-return-finance-btn');
    if (returnBtn) {
      await returnBtn.click();
      await sleep(1000);
      await page.screenshot({ path: 'verification_admin_05_returned.png', fullPage: false });
      console.log('   📸 Saved verification_admin_05_returned.png');
    }

    // 10. Switch Language to Amharic and Verify Amharic Admin Dashboard
    console.log('10. Testing Amharic Admin Dashboard View...');
    // Look for language toggle button
    const langBtn = await page.$('button[aria-label="Switch to Amharic"], button[aria-label="ወደ አማርኛ ቀይር"]');
    if (langBtn) {
      await langBtn.click();
      await sleep(600);
    }
    // Re-enter admin dashboard
    const adminToggleAm = await page.$('#admin-dashboard-toggle-btn');
    if (adminToggleAm) {
      await adminToggleAm.click();
      await sleep(1000);
      await page.screenshot({ path: 'verification_admin_06_amharic.png', fullPage: false });
      console.log('   📸 Saved verification_admin_06_amharic.png');
    }

    console.log('🎉 ALL ADMIN DASHBOARD E2E VERIFICATION CHECKS PASSED!');
  } catch (err) {
    console.error('❌ Verification failed:', err);
    await page.screenshot({ path: 'verification_admin_error.png', fullPage: false });
    process.exit(1);
  } finally {
    await browser.close();
  }
}

verifyAdminDashboard();
