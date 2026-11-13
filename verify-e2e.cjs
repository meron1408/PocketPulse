const puppeteer = require('puppeteer-core');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const executablePath = fs.existsSync(EDGE_PATH) ? EDGE_PATH : CHROME_PATH;

async function clearAndType(page, element, text) {
  await element.click();
  await page.keyboard.down('Control');
  await page.keyboard.press('a');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await element.type(text);
}

async function runVerification() {
  console.log('🚀 Starting PocketPulse E2E verification using:', executablePath);
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  try {
    // 1. Navigate to App
    const targetUrl = process.env.APP_URL || 'http://localhost:5174/';
    console.log(`1. Navigating to ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 15000 });

    const title = await page.title();
    console.log('   Page Title:', title);
    if (!title.includes('PocketPulse')) {
      throw new Error(`Unexpected page title: ${title}`);
    }

    // Capture initial screenshot
    await page.screenshot({ path: 'verification_01_dashboard.png', fullPage: false });
    console.log('   📸 Captured verification_01_dashboard.png');

    // Switch to English to verify bilingual toggle and English test flows
    const langToggleBtn = await page.$('button[aria-label="Switch to English"]');
    if (langToggleBtn) {
      console.log('   ✓ Testing bilingual language toggle: Switching to English...');
      await langToggleBtn.click();
      await new Promise((r) => setTimeout(r, 600));
    }

    // 2. Verify Initial Metrics are Loaded
    const monthlyIncomeText = await page.evaluate(() => {
      const el = document.querySelector('section[aria-label="Monthly Financial Summary"]');
      return el ? el.innerText : '';
    });
    console.log('   Summary Section text snippet:', monthlyIncomeText.slice(0, 150).replace(/\n/g, ' '));

    // 3. Flow 1: Add a Transaction
    console.log('\n2. Testing Flow 1: Adding a new transaction...');
    await page.keyboard.press('n');
    await new Promise((r) => setTimeout(r, 600));

    const modalVisible = await page.$('div[role="dialog"]');
    if (!modalVisible) throw new Error('Transaction modal did not open on pressing N');
    console.log('   ✓ Modal opened via keyboard shortcut (N)');

    // Fill in amount
    const txAmt = await page.$('#tx-amount');
    await clearAndType(page, txAmt, '125.50');
    // Fill in title
    const txTitle = await page.$('#tx-title');
    await clearAndType(page, txTitle, 'Physics Lab Manual & Safety Goggles');
    // Select category 'education'
    await page.select('#tx-category', 'education');
    // Type notes
    const txNotes = await page.$('#tx-notes');
    await clearAndType(page, txNotes, 'Purchased from University Campus Bookstore');

    // Submit form
    await page.evaluate(() => {
      const submitBtn = document.querySelector('form button[type="submit"]');
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Verify transaction appears in the list
    const hasNewItem = await page.evaluate(() => {
      const tbody = document.querySelector('tbody');
      return tbody ? tbody.innerText.includes('Physics Lab Manual & Safety Goggles') : false;
    });
    console.log('   ✓ Transaction added and displayed in list:', hasNewItem);
    if (!hasNewItem) throw new Error('New transaction not found in tbody');

    // 4. Flow 2: Filter Transactions
    console.log('\n3. Testing Flow 2: Filtering transactions...');
    const searchInput = await page.$('#search-transactions');
    await clearAndType(page, searchInput, 'Physics');
    await new Promise((r) => setTimeout(r, 500));

    const searchMatchCount = await page.evaluate(() => {
      const rows = document.querySelectorAll('tbody tr');
      return rows.length;
    });
    console.log('   ✓ Filtered search results row count for "Physics":', searchMatchCount);
    if (searchMatchCount !== 1) {
      throw new Error(`Expected 1 row matching 'Physics', got ${searchMatchCount}`);
    }

    // Clear search
    await page.click('button[aria-label="Clear search query"]');
    await new Promise((r) => setTimeout(r, 500));

    // Filter by Type: Income
    await page.click('#filter-type-income');
    await new Promise((r) => setTimeout(r, 500));

    const incomeRowCount = await page.evaluate(() => {
      return document.querySelectorAll('tbody tr').length;
    });
    console.log('   ✓ Filtered by Income only, row count:', incomeRowCount);

    // Switch back to All Types
    await page.click('#filter-type-all');
    await new Promise((r) => setTimeout(r, 500));

    // 5. Flow 3: Edit Transaction
    console.log('\n4. Testing Flow 3: Editing transaction...');
    await clearAndType(page, searchInput, 'Physics');
    await new Promise((r) => setTimeout(r, 500));

    // Click edit button on the filtered row
    await page.evaluate(() => {
      const row = document.querySelector('tbody tr');
      if (row) {
        const editBtn = row.querySelector('button[title*="Edit"]');
        if (editBtn) editBtn.click();
      }
    });
    await new Promise((r) => setTimeout(r, 600));

    // Change title to "Advanced Physics Lab Manual & Supplies"
    const editTitleField = await page.$('#tx-title');
    await clearAndType(page, editTitleField, 'Advanced Physics Lab Manual & Supplies');

    // Change amount to 140.00
    const editAmtField = await page.$('#tx-amount');
    await clearAndType(page, editAmtField, '140.00');

    // Save changes
    await page.evaluate(() => {
      const submitBtn = document.querySelector('form button[type="submit"]');
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    const updatedTextExists = await page.evaluate(() => {
      const tbody = document.querySelector('tbody');
      return tbody ? tbody.innerText.includes('Advanced Physics Lab Manual & Supplies') : false;
    });
    console.log('   ✓ Edited transaction title verified in tbody:', updatedTextExists);
    if (!updatedTextExists) throw new Error('Edited transaction title not found in tbody');

    // 6. Flow 4: Delete Transaction with Confirmation Modal
    console.log('\n5. Testing Flow 4: Deleting transaction with confirmation dialog...');
    await page.evaluate(() => {
      const row = document.querySelector('tbody tr');
      if (row) {
        const deleteBtn = row.querySelector('button[title*="Delete"]');
        if (deleteBtn) deleteBtn.click();
      }
    });
    await new Promise((r) => setTimeout(r, 600));

    // Verify Delete confirmation dialog
    const deleteModalTitle = await page.evaluate(() => {
      const el = document.querySelector('#delete-dialog-title');
      return el ? el.innerText : '';
    });
    console.log('   ✓ Delete modal dialog title:', deleteModalTitle);
    if (!deleteModalTitle.includes('Delete Transaction')) {
      throw new Error('Delete confirmation modal did not open properly');
    }

    // Confirm deletion
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const confirmBtn = btns.find((b) => b.textContent.includes('Confirm Delete'));
      if (confirmBtn) confirmBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Clear search query
    await page.click('button[aria-label="Clear search query"]');
    await new Promise((r) => setTimeout(r, 500));

    const stillInTbody = await page.evaluate(() => {
      const tbody = document.querySelector('tbody');
      return tbody ? tbody.innerText.includes('Advanced Physics Lab Manual & Supplies') : false;
    });
    console.log('   ✓ Verified deleted item is completely gone from tbody:', !stillInTbody);
    if (stillInTbody) throw new Error('Transaction still present in tbody after deletion');

    // 7. Flow 5: Budget Progress & Setting Budgets
    console.log('\n6. Testing Flow 5: Viewing and adjusting budget progress...');
    const budgetSectionExists = await page.evaluate(() => {
      const section = document.querySelector('section[aria-label="Monthly Budgets"], #budget-section');
      return Boolean(section);
    });
    console.log('   ✓ Budget Section present:', budgetSectionExists);

    // Open budget configuration modal
    const buttons = await page.$$('button');
    for (const b of buttons) {
      const text = await page.evaluate((el) => el.textContent, b);
      if (text.includes('Manage Budgets')) {
        await b.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 600));

    const budgetModalTitle = await page.evaluate(() => {
      const el = document.querySelector('#budget-modal-title');
      return el ? el.innerText : '';
    });
    console.log('   ✓ Budget Modal opened:', budgetModalTitle);

    // Select category 'groceries'
    await page.select('#budget-category', 'groceries');
    await new Promise((r) => setTimeout(r, 400));

    // Clear and enter new amount 320
    const budgetAmtInput = await page.$('#budget-amount');
    await clearAndType(page, budgetAmtInput, '320');
    await new Promise((r) => setTimeout(r, 400));

    // Click "Save Budget"
    const modalButtons = await page.$$('div[role="dialog"] button');
    for (const b of modalButtons) {
      const text = await page.evaluate((el) => el.textContent, b);
      if (text.includes('Save Budget')) {
        await b.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 1000));

    const groceriesBudgetUpdated = await page.evaluate(() => {
      const section = document.querySelector('section[aria-label="Monthly Budgets"], #budget-section');
      return section ? (section.innerText.includes('320.00') || section.innerText.includes('320')) : false;
    });
    console.log('   ✓ Groceries budget updated to 320 verified:', groceriesBudgetUpdated);
    if (!groceriesBudgetUpdated) {
      throw new Error('Groceries budget was not updated to 320');
    }

    // 8. Flow 6: Accessible Charts & Table Alternative
    console.log('\n7. Testing Flow 6: Accessible Charts & Table Alternative...');
    // Click "Table View" toggle on Spending by Category chart
    await page.click('#toggle-table-chart-btn');
    await new Promise((r) => setTimeout(r, 600));

    const tableVisible = await page.evaluate(() => {
      const tbl = document.querySelector('table');
      return Boolean(tbl);
    });
    console.log('   ✓ Accessible Table alternative rendered:', tableVisible);
    if (!tableVisible) throw new Error('Accessible table view not rendered');

    // Switch back to chart view
    await page.click('#toggle-table-chart-btn');
    await new Promise((r) => setTimeout(r, 600));

    const svgVisible = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      return Boolean(svg);
    });
    console.log('   ✓ Interactive Donut SVG chart rendered:', svgVisible);

    // Final Screenshot
    await page.screenshot({ path: 'verification_02_completed.png', fullPage: false });
    console.log('   📸 Captured verification_02_completed.png');

    console.log('\n🎉 ALL VERIFICATION FLOWS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Verification failed:', err);
    await page.screenshot({ path: 'verification_error.png', fullPage: false });
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runVerification();
