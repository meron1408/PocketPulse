# PocketPulse • Student & Young Professional Personal Finance Tracker

<p align="center">
  <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80" alt="PocketPulse Personal Finance Dashboard" width="100%" style="border-radius: 16px; max-height: 380px; object-fit: cover;" />
</p>

> **PocketPulse** is a personal finance tracker and monthly budgeting dashboard engineered specifically for students, interns, and early-career professionals. Track stipends, campus work-study wages, dorm rent, course materials, transit passes, and groceries with local storage persistence and accessible data visualizations.

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9+)

### 2. Setup & Installation
```powershell
# 1. Navigate to project root
cd c:\Users\user\personal-finance-tracker

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server (starts BOTH Vite frontend on 5174 and SQLite backend on 5002 automatically)
npm run dev
```

The application runs live on **[http://localhost:5174/](http://localhost:5174/)** with the backend API automatically proxied to **http://localhost:5002/**. All registration, login, session checking, and transaction persistence work out of the box with `npm run dev`.

### 3. Initial Administrator Account
The application starts with a clean slate (0 demo transactions). An administrator account is provisioned for platform oversight:

| Role | Email | Password | Features Accessible |
|---|---|---|---|
| **System Administrator** | `admin@pocketpulse.et` | `Admin@123` | Full Admin Dashboard, Platform Metrics, User Management, Session Inspector |
| **Registered User** | *Register via Sign Up* | *Min 8 characters* | Private isolated personal finance records, custom budgets, persistent SQLite storage |
| **Guest Mode** | *No account required* | *N/A* | Local device storage with versioned JSON backup export/import |

### 4. Running Automated Tests
```powershell
npm test
```
Runs the 16 automated tests covering:
- Currency rounding and decimal precision (avoiding floating-point drift)
- Bilingual Amharic and English currency formatting
- Month boundaries and leap-year shifts
- Version 2 JSON backup schema validation
- Secure scrypt password hashing and user data isolation
- Admin role-based access control (RBAC), platform aggregations, and session cleanup

---

## 🛡️ Admin Dashboard & Platform Management

When signed in as an administrator (`admin@pocketpulse.et`), an **Admin Dashboard** button with an amber shield badge appears in the navigation bar.

### Admin Dashboard Features:
1. **Platform & Financial Overview**:
   - High-level KPIs: Total registered users, total transactions, total system volume (ETB), active sessions, and SQLite database health.
   - Total Inflow vs Outflow comparison.
   - Recent registrations and recent system transactions stream.
2. **Users Management**:
   - Live search by name or email.
   - Filter by role (`All`, `Admins`, `Regular Users`).
   - Summary statistics per user: Transaction count, total income, total expense, and budget count.
   - 1-Click Promote to Admin / Demote to User (with safeguards preventing demotion of the sole system admin).
   - Administrative password reset modal.
   - Cascade delete user account with confirmation modal.
3. **Category & Financial Analytics**:
   - System-wide spending breakdown across all Ethiopian expense categories with percentage meters.
   - Payment method share (Telebirr, CBE Birr, Cash, Bank Transfer).
4. **Sessions & Security Inspector**:
   - Table of all active, unexpired user sessions with IP/token identifiers and expiry timestamps.
   - 1-Click revoke individual session.
   - 1-Click maintenance cleanup of expired sessions.
5. **Seamless Mode Switching**:
   - One-click toggle between Admin Portal and personal finance tracker view.
   - Full bilingual support in both Amharic (አማርኛ) and English.

---

## 🌟 Key Features

### 1. 💸 Income & Expense Transaction Management
- **Add Transactions**: Fast modal form with type toggles (Expense vs. Income), amount validation, date picker, payment method selector, and notes.
- **Edit & Update**: Modify any transaction record with live validation and toast notifications.
- **Delete Confirmation Dialog**: Accessible confirmation dialog to prevent accidental data loss.
- **Student-Tailored Categories**: Curated categories including *Campus Job & Work-Study*, *Internship Stipend*, *Tutoring & Freelance*, *Dorm Rent & Housing*, *Groceries*, *Dining & Coffee*, *Tuition & Textbooks*, *Tech & Subscriptions*, and *Transit*.
- **Keyboard Shortcut**: Press `N` anywhere on the dashboard to immediately open the transaction modal.

### 2. 🎯 Category Monthly Budgets & Progress
- **Custom Spending Limits**: Set and adjust monthly limits for every expense category.
- **Live Progress Bars**:
  - 🟢 **Safe (< 80%)**: Green progress meter.
  - 🟡 **Warning (80% - 99%)**: Amber alert indicating near-capacity spending.
  - 🔴 **Over Budget (≥ 100%)**: High-visibility rose alert badge displaying exact dollar amount exceeded.
- **50/30/20 Rule Benchmark**: Contextual guidance on balancing Needs (~50%), Wants (~30%), and Savings (~20%).

### 3. 📊 Accessible Spending & Cash Flow Charts
- **Interactive Donut Breakdown Chart**:
  - Dynamic SVG donut chart with hover and keyboard-focus states displaying exact dollar amount and percentage share.
  - **Table View Toggle**: One-click switch to an accessible data table formatted for screen readers and tabular scanning.
- **Multi-Month Cash Flow Trend Bar Chart**:
  - Compares monthly Income vs Expenses vs Net Savings across recent months.
  - Interactive tooltips on hover and keyboard navigation.
  - Click any month bar to jump the entire dashboard to that month's view.

### 4. 🔍 Deep Search, Filter & Sort
- **Full-Text Search**: Instant search across transaction titles, payees, tags, notes, and payment methods.
- **Type Filtering**: 1-click toggle between *All Types*, *Expenses Only*, and *Income Only*.
- **Category Filter**: Filter down to any specific expense or income category.
- **Date Range Presets**: Quick filters for *This Month*, *Last Month*, *Last 30 Days*, or custom *Start & End Dates*.
- **Multi-Field Sorting**: Sort by date (newest/oldest) or amount (highest/lowest).
- **Active Filter Chips**: Instant visual summary of filtered inflows/outflows with 1-click filter reset.

### 5. 💡 Smart Student Financial Insights
- **Dining vs. Groceries Ratio Alert**: Highlights when takeout spending outpaces groceries, with realistic meal prep saving benchmarks.
- **.Edu Discount Guide**: Prompts students to take advantage of verified academic perks (GitHub Student Developer Pack, Spotify Student, Notion Plus).
- **Emergency Fund Guidance**: Recommends starter buffer milestones ($500–$1,000) for laptop emergencies or unexpected course supplies.

### 6. 💾 Local Storage & Data Portability
- **Automatic Persistence**: All transactions, custom budgets, and currency preferences are saved to your browser's `localStorage`.
- **Export to CSV**: Export clean spreadsheet-compatible files for Excel, Google Sheets, or tax records.
- **Export to JSON**: Download complete backup snapshots of your budgets and transaction ledger.
- **Sample Data Reset**: 1-click restore to realistic student sample records at any time.

---

## ♿ Accessibility & Usability Standards

- **Semantic HTML & ARIA**:
  - Modals use `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `aria-describedby`.
  - Inline error alerts use `role="alert"` with `aria-invalid` bindings on form inputs.
  - Toast notifications use `role="status"` and `aria-live="polite"`.
  - SVG charts include `role="img"` with descriptive `aria-label` text and table alternatives.
- **Visible Focus States**: Every interactive button, link, tab, and form input has clear `focus-visible:ring-2 focus-visible:ring-indigo-500` outlines.
- **Keyboard Navigation**: Full keyboard tab sequence across all cards, filters, modal forms, and chart wedges; `Escape` key closes all open modals.
- **Responsive Mobile Layout**: Tested for touch viewports, responsive horizontal tables, and stacked mobile cards.

---

## 🔒 Demo Limitations & Privacy Notice

> [!IMPORTANT]
> **Educational & Demonstration Purposes Only**
>
> 1. **100% Client-Side Local Storage**: All financial records reside strictly within your personal web browser's Local Storage. No data is transmitted across external networks or third-party cloud servers.
> 2. **No Real Banking Connections**: PocketPulse does not connect to Plaid, bank accounts, credit cards, or financial institutions, and will **never** request bank credentials, login passwords, or account numbers.
> 3. **Demonstration Data**: All default sample data (e.g., student internships, work-study stipends, rent splits) are illustrative placeholders designed to demonstrate budgeting mechanics and visual analytics.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations & Delight**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
