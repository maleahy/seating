# Seating Chart App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page static web app where wedding guests can search their name to find their assigned table, tablemates, and any related guests seated at other tables.

**Architecture:** Pure vanilla HTML/CSS/JS — no build tools, no framework, no dependencies beyond Google Fonts. All guest data lives in `data.js` as a plain JS array derived from `seating_chart.csv`. The app renders dynamically via DOM manipulation in `app.js`.

**Tech Stack:** HTML5, CSS3 (custom properties, flexbox/grid), Vanilla JS (ES6+), Google Fonts (Courier Prime), Amoresa Aged font (local file — see Task 1 note)

---

## File Structure

| File | Responsibility |
|---|---|
| `seating-chart/index.html` | Page shell: font links, layout sections, script tags |
| `seating-chart/styles.css` | All visual styling — fonts, layout, colors, responsive |
| `seating-chart/data.js` | Guest array — single source of truth, no logic |
| `seating-chart/app.js` | Search logic, DOM rendering, event listeners |

---

### Task 1: Set Up Project and Guest Data

**Files:**
- Create: `seating-chart/data.js`
- Create: `seating-chart/fonts/` (directory for Amoresa Aged font file)

> **Font note:** "Amoresa Aged" is not on Google Fonts. Download the `.woff2`/`.ttf` file from a font site (e.g. dafont.com, myfonts.com) and place it at `seating-chart/fonts/amoresa-aged.woff2`. The CSS in Task 3 will reference it via `@font-face`.

- [ ] **Step 1: Create the project directory**

```bash
mkdir seating-chart
mkdir seating-chart/fonts
```

- [ ] **Step 2: Create `seating-chart/data.js` with the full guest array**

Convert every row from `seating_chart.csv`. The `related` field is an array of name strings (empty array if none). Table is a number.

```js
// seating-chart/data.js
const GUESTS = [
  { name: "Maleah Yee", table: 1, related: [] },
  { name: "Joshua Perkins", table: 1, related: [] },
  { name: "Alana Yee", table: 1, related: [] },
  { name: "Carly Chen", table: 1, related: [] },
  { name: "Irene Park", table: 1, related: [] },
  { name: "Christian Kim", table: 1, related: [] },
  { name: "Trigg Randall", table: 2, related: [] },
  { name: "Ryan Morrow", table: 2, related: [] },
  { name: "Jack Moyer", table: 2, related: [] },
  { name: "Maleah Moyer", table: 2, related: [] },
  { name: "Michael Gould", table: 3, related: [] },
  { name: "Audrey Gould", table: 3, related: [] },
  { name: "Will Hougen", table: 3, related: [] },
  { name: "Sabrina Hougen", table: 3, related: [] },
  { name: "Joanna Lam", table: 4, related: [] },
  { name: "Justin Singh", table: 4, related: [] },
  { name: "Sylvie Singh", table: 4, related: [] },
  { name: "Terry Yee", table: 4, related: [] },
  { name: "Ivan Chiu", table: 4, related: ["Ethan Chiu", "Christopher Chiu", "Naomi Chiu"] },
  { name: "Bonnie Chiu", table: 4, related: ["Ethan Chiu", "Christopher Chiu", "Naomi Chiu"] },
  { name: "Alicia Abelmann", table: 5, related: [] },
  { name: "Koa Abelmann", table: 5, related: [] },
  { name: "Kalena Abelmann", table: 5, related: [] },
  { name: "Ann Kim", table: 5, related: [] },
  { name: "River Yee", table: 5, related: [] },
  { name: "Luna Yee", table: 5, related: [] },
  { name: "Ethan Chiu", table: 6, related: [] },
  { name: "Christopher Chiu", table: 6, related: [] },
  { name: "Naomi Chiu", table: 6, related: [] },
  { name: "Callie Yee", table: 6, related: [] },
  { name: "Kendall Yee", table: 6, related: [] },
  { name: "Ute Perkins", table: 7, related: [] },
  { name: "Rebecca Perkins", table: 7, related: [] },
  { name: "Matthew Perkins", table: 7, related: [] },
  { name: "Jessica Perkins", table: 7, related: [] },
  { name: "Megan Noall", table: 7, related: [] },
  { name: "Jordan Noall", table: 7, related: [] },
  { name: "Clinton Yee", table: 8, related: [] },
  { name: "Lisa Yee", table: 8, related: [] },
  { name: "Makai Yee", table: 8, related: [] },
  { name: "Jennifer Yee", table: 8, related: [] },
  { name: "Michael Papillo", table: 8, related: [] },
  { name: "Emily Perkins", table: 8, related: [] },
  { name: "Alvin Yee", table: 9, related: [] },
  { name: "Faye Yee", table: 9, related: [] },
  { name: "Spencer Yee", table: 9, related: ["Callie Yee", "Kendall Yee"] },
  { name: "Vivian Yee", table: 9, related: ["Callie Yee", "Kendall Yee"] },
  { name: "Cary Yee", table: 9, related: [] },
  { name: "Nancy Yee", table: 9, related: [] },
  { name: "John Yee", table: 10, related: [] },
  { name: "Irene Yee", table: 10, related: [] },
  { name: "Iveth Castillo Moradkanian", table: 10, related: [] },
  { name: "Allen Moradkanian", table: 10, related: [] },
  { name: "Dylan Liu", table: 10, related: [] },
  { name: "Joel Wong", table: 11, related: [] },
  { name: "Angie Wong", table: 11, related: [] },
  { name: "Kaitlyn Wong", table: 11, related: [] },
  { name: "Wendy Tong", table: 11, related: [] },
  { name: "Miki Ah Heong", table: 12, related: [] },
  { name: "Sophey Tiet", table: 12, related: [] },
  { name: "Luis Morao", table: 12, related: [] },
  { name: "Ori Morao", table: 12, related: [] },
  { name: "Celso Morao", table: 12, related: [] },
  { name: "Serafina Morao", table: 12, related: [] },
  { name: "John Kuo", table: 13, related: [] },
  { name: "Beth Kolbe", table: 13, related: [] },
  { name: "Tom Kuo", table: 13, related: [] },
  { name: "Huong Do", table: 13, related: [] },
  { name: "Brendan Kuo", table: 13, related: [] },
  { name: "Haylee Sanchez", table: 13, related: [] },
  { name: "Michael Azarmi", table: 14, related: [] },
  { name: "Sarah Azarmi", table: 14, related: [] },
  { name: "Mia Kuo", table: 14, related: [] },
  { name: "Taylor Dorfmeister", table: 14, related: [] },
  { name: "Virgilio Villacorta", table: 15, related: [] },
  { name: "Jenny Magalong", table: 15, related: [] },
  { name: "Tarun Mathur", table: 15, related: [] },
  { name: "Monica Mathur", table: 15, related: [] },
  { name: "Charles Wilson", table: 16, related: [] },
  { name: "Neila Wilson", table: 16, related: [] },
  { name: "Eda Nacario", table: 16, related: [] },
  { name: "Vicente Nacario", table: 16, related: [] },
  { name: "Aedan Nacario", table: 16, related: [] },
  { name: "Evin Nacario", table: 16, related: [] },
  { name: "Aaron Zhao", table: 17, related: [] },
  { name: "Joyce He", table: 17, related: [] },
  { name: "Daniel Zau", table: 17, related: [] },
  { name: "Christine Chang", table: 17, related: [] },
  { name: "Darren Ammara", table: 17, related: [] },
  { name: "Vanessa Sun", table: 17, related: [] },
  { name: "Ashley Langford", table: 18, related: [] },
  { name: "Porter Langford", table: 18, related: [] },
  { name: "Dallin Moody", table: 18, related: [] },
  { name: "Lily Hansen", table: 18, related: [] },
  { name: "Kris Pauni", table: 18, related: [] },
  { name: "Trenna Pauni", table: 18, related: [] },
];
```

- [ ] **Step 3: Verify data in browser console**

Open any blank HTML page with `<script src="data.js"></script>`, then in the console run:
```js
console.log(GUESTS.length); // expected: 96
console.log(GUESTS.filter(g => g.table === 4).map(g => g.name));
// expected: ["Joanna Lam", "Justin Singh", "Sylvie Singh", "Terry Yee", "Ivan Chiu", "Bonnie Chiu"]
console.log(GUESTS.find(g => g.name === "Ivan Chiu").related);
// expected: ["Ethan Chiu", "Christopher Chiu", "Naomi Chiu"]
```

---

### Task 2: HTML Structure

**Files:**
- Create: `seating-chart/index.html`

- [ ] **Step 1: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Find Your Table</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>

  <!-- TOP: Title + instructions -->
  <header class="site-header">
    <h1 class="site-title">Find Your Seat</h1>
    <p class="site-instructions">Type your name to find your table.</p>
  </header>

  <!-- SEARCH -->
  <section class="search-section">
    <form class="search-form" id="search-form" role="search">
      <input
        type="text"
        id="search-input"
        class="search-input"
        placeholder="Your name..."
        autocomplete="off"
        aria-label="Search for your name"
      />
      <button type="submit" class="search-btn">Find My Seat</button>
    </form>
  </section>

  <!-- RESULTS -->
  <section class="results-section" id="results-section" aria-live="polite" hidden>
    <div class="results-inner" id="results-inner"></div>
  </section>

  <!-- FULL TABLE LIST -->
  <section class="full-list-section">
    <h2 class="full-list-heading">All Tables</h2>
    <div class="full-list" id="full-list"></div>
  </section>

  <script src="data.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify structure**

Open `seating-chart/index.html` directly in a browser (no server needed).
Expected: page loads with a header, an input, a button, and a blank results area. No JS errors in console.

- [ ] **Step 3: Commit**

```bash
git add seating-chart/index.html seating-chart/data.js
git commit -m "feat: add HTML shell and guest data"
```

---

### Task 3: CSS Styling

**Files:**
- Create: `seating-chart/styles.css`

- [ ] **Step 1: Create `styles.css`**

```css
/* seating-chart/styles.css */

/* ── Fonts ── */
@font-face {
  font-family: 'Amoresa Aged';
  src: url('fonts/amoresa-aged.woff2') format('woff2'),
       url('fonts/amoresa-aged.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* ── Custom Properties ── */
:root {
  --color-bg: #fbfaf4;
  --color-text: #3c3333;
  --color-muted: #777;
  --color-accent: #d64d1c;
  --color-border: #d8cfc4;
  --color-card: #ffffff;
  --color-highlight: #f0ebe3;
  --font-body: 'Courier Prime', 'Courier New', monospace;
  --font-title: 'Amoresa Aged', serif;
  --max-width: 720px;
  --radius: 4px;
}

/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Base ── */
body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.6;
  padding: 2rem 1rem 4rem;
}

/* ── Header ── */
.site-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.site-title {
  font-family: var(--font-title);
  font-size: clamp(2.5rem, 8vw, 5rem);
  color: var(--color-accent);
  font-weight: normal;
  letter-spacing: 0.02em;
  line-height: 1.1;
}

.site-instructions {
  margin-top: 0.5rem;
  color: var(--color-muted);
  font-size: 0.95rem;
}

/* ── Search ── */
.search-section {
  max-width: var(--max-width);
  margin: 0 auto 2rem;
}

.search-form {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.search-input {
  flex: 1 1 260px;
  max-width: 420px;
  padding: 0.65rem 1rem;
  font-family: var(--font-body);
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-card);
  color: var(--color-text);
  outline: none;
  transition: border-color 0.15s;
}

.search-input:focus {
  border-color: var(--color-accent);
}

.search-btn {
  padding: 0.65rem 1.4rem;
  font-family: var(--font-body);
  font-size: 1rem;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: opacity 0.15s;
  white-space: nowrap;
}

.search-btn:hover {
  opacity: 0.88;
}

/* ── Results ── */
.results-section {
  max-width: var(--max-width);
  margin: 0 auto 3rem;
  background: var(--color-highlight);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
}

.results-section[hidden] {
  display: none;
}

.result-match-name {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.result-table-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-accent);
  margin-bottom: 0.75rem;
}

.result-section-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-muted);
  margin-bottom: 0.3rem;
  margin-top: 1rem;
}

.result-names-list {
  list-style: none;
  padding: 0;
}

.result-names-list li {
  padding: 0.15rem 0;
  border-bottom: 1px solid var(--color-border);
}

.result-names-list li:last-child {
  border-bottom: none;
}

.result-names-list li.is-you {
  font-weight: 700;
  color: var(--color-accent);
}

.related-group {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: var(--color-card);
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
}

.related-group + .related-group {
  margin-top: 0.5rem;
}

.related-table-label {
  font-size: 0.85rem;
  color: var(--color-muted);
}

.no-result-msg {
  text-align: center;
  color: var(--color-muted);
  padding: 0.5rem 0;
}

/* ── Multiple matches ── */
.match-card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: border-color 0.15s;
}

.match-card:hover {
  border-color: var(--color-accent);
}

.match-prompt {
  margin-bottom: 0.75rem;
  color: var(--color-muted);
  font-size: 0.95rem;
}

/* ── Full List ── */
.full-list-section {
  max-width: var(--max-width);
  margin: 0 auto;
}

.full-list-heading {
  font-family: var(--font-body);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-muted);
  margin-bottom: 1rem;
  font-weight: 700;
}

.full-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.table-card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1rem;
}

.table-card-number {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-accent);
  margin-bottom: 0.5rem;
}

.table-card-names {
  list-style: none;
  padding: 0;
  font-size: 0.9rem;
}

.table-card-names li {
  padding: 0.1rem 0;
  border-bottom: 1px solid var(--color-highlight);
}

.table-card-names li:last-child {
  border-bottom: none;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }
  .search-input {
    max-width: 100%;
  }
  .full-list {
    grid-template-columns: 1fr 1fr;
  }
}
```

- [ ] **Step 2: Verify styles in browser**

Open `index.html`. Expected:
- Title renders in Amoresa Aged (if font file is present) or falls back to serif
- Body text in Courier Prime (monospace family)
- Search input and button are centered and styled
- Full list section heading is visible

- [ ] **Step 3: Commit**

```bash
git add seating-chart/styles.css
git commit -m "feat: add CSS styling with Courier Prime and Amoresa Aged fonts"
```

---

### Task 4: Search Logic

**Files:**
- Create: `seating-chart/app.js`

- [ ] **Step 1: Implement search and lookup helpers in `app.js`**

These are pure functions — no DOM side effects — so they can be verified in the console.

```js
// seating-chart/app.js

/**
 * Normalize a string for comparison: lowercase + collapse whitespace.
 * @param {string} s
 * @returns {string}
 */
function normalize(s) {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Find all guests whose name partially matches the query.
 * Case-insensitive, ignores extra spaces, partial match allowed.
 * @param {string} query
 * @returns {Array<{name:string, table:number, related:string[]}>}
 */
function searchGuests(query) {
  const q = normalize(query);
  if (!q) return [];
  return GUESTS.filter(g => normalize(g.name).includes(q));
}

/**
 * Get all guests seated at a given table number.
 * @param {number} tableNum
 * @returns {Array<{name:string, table:number, related:string[]}>}
 */
function getTablemates(tableNum) {
  return GUESTS.filter(g => g.table === tableNum);
}

/**
 * Resolve a guest's related names to full guest objects.
 * Groups related guests by table number.
 * @param {string[]} relatedNames
 * @returns {Map<number, string[]>}  tableNum → [name, ...]
 */
function getRelatedByTable(relatedNames) {
  const byTable = new Map();
  for (const rName of relatedNames) {
    const match = GUESTS.find(g => normalize(g.name) === normalize(rName));
    if (!match) continue;
    if (!byTable.has(match.table)) byTable.set(match.table, []);
    byTable.get(match.table).push(match.name);
  }
  return byTable;
}
```

- [ ] **Step 2: Verify helpers in browser console**

Open `index.html` (which loads `data.js` and `app.js`). In the console:

```js
// Exact match
searchGuests("Maleah Yee");
// expected: [{ name: "Maleah Yee", table: 1, related: [] }]

// Partial, case-insensitive
searchGuests("yee");
// expected: array with all guests whose name contains "yee"

// Extra spaces
searchGuests("  ivan  chiu  ");
// expected: [{ name: "Ivan Chiu", table: 4, related: [...] }]

// No match
searchGuests("zzzzz");
// expected: []

// Tablemates
getTablemates(4).map(g => g.name);
// expected: ["Joanna Lam", "Justin Singh", "Sylvie Singh", "Terry Yee", "Ivan Chiu", "Bonnie Chiu"]

// Related lookup
getRelatedByTable(["Ethan Chiu", "Christopher Chiu", "Naomi Chiu"]);
// expected: Map { 6 => ["Ethan Chiu", "Christopher Chiu", "Naomi Chiu"] }
```

- [ ] **Step 3: Commit**

```bash
git add seating-chart/app.js
git commit -m "feat: add search and lookup helper functions"
```

---

### Task 5: Results Rendering

**Files:**
- Modify: `seating-chart/app.js` (add render functions + event wiring)

- [ ] **Step 1: Add `renderResults` function to `app.js`**

Append below the helpers from Task 4:

```js
/**
 * Render the results section for a single matched guest.
 * @param {object} guest  - the matched guest object
 * @param {string} originalQuery - raw user input, to highlight their name
 */
function renderSingleResult(guest, originalQuery) {
  const tablemates = getTablemates(guest.table);
  const relatedByTable = getRelatedByTable(guest.related);

  let html = '';

  // Guest name + table
  html += `<p class="result-match-name">${escapeHtml(guest.name)}</p>`;
  html += `<p class="result-table-number">Table ${guest.table}</p>`;

  // Tablemates
  html += `<p class="result-section-label">Others at your table</p>`;
  html += `<ul class="result-names-list">`;
  for (const tm of tablemates) {
    const isYou = normalize(tm.name) === normalize(guest.name);
    html += `<li class="${isYou ? 'is-you' : ''}">${escapeHtml(tm.name)}${isYou ? ' ★' : ''}</li>`;
  }
  html += `</ul>`;

  // Related at other tables
  if (relatedByTable.size > 0) {
    html += `<p class="result-section-label">Your people at other tables</p>`;
    for (const [tNum, names] of relatedByTable) {
      html += `<div class="related-group">`;
      html += `<p class="related-table-label">Table ${tNum}</p>`;
      html += `<ul class="result-names-list">`;
      for (const n of names) {
        html += `<li>${escapeHtml(n)}</li>`;
      }
      html += `</ul></div>`;
    }
  }

  return html;
}

/**
 * Render a "multiple matches — which one are you?" prompt.
 * @param {Array} matches
 */
function renderMultipleMatches(matches) {
  let html = `<p class="match-prompt">We found a few people matching that name. Which one are you?</p>`;
  for (const g of matches) {
    html += `<div class="match-card" data-name="${escapeHtml(g.name)}" tabindex="0">`;
    html += `<strong>${escapeHtml(g.name)}</strong> — Table ${g.table}`;
    html += `</div>`;
  }
  return html;
}

/** Minimal HTML escape to prevent XSS. */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Show the results section with given HTML content.
 * @param {string} innerHtml
 */
function showResults(innerHtml) {
  const section = document.getElementById('results-section');
  const inner = document.getElementById('results-inner');
  inner.innerHTML = innerHtml;
  section.hidden = false;
  section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/** Hide the results section. */
function hideResults() {
  const section = document.getElementById('results-section');
  section.hidden = true;
  document.getElementById('results-inner').innerHTML = '';
}
```

- [ ] **Step 2: Add event listeners to `app.js`**

Append below the render functions:

```js
// ── Event: form submit ──
document.getElementById('search-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const query = document.getElementById('search-input').value;
  const matches = searchGuests(query);

  if (matches.length === 0) {
    showResults(`<p class="no-result-msg">We couldn't find "${escapeHtml(query.trim())}" on the guest list. Double-check the spelling!</p>`);
    return;
  }

  if (matches.length === 1) {
    showResults(renderSingleResult(matches[0], query));
    return;
  }

  // Multiple matches — show picker
  showResults(renderMultipleMatches(matches));
});

// ── Event: click a match card ──
document.getElementById('results-inner').addEventListener('click', function (e) {
  const card = e.target.closest('.match-card');
  if (!card) return;
  const name = card.dataset.name;
  const guest = GUESTS.find(g => g.name === name);
  if (guest) showResults(renderSingleResult(guest, name));
});

// ── Event: keyboard select on match card ──
document.getElementById('results-inner').addEventListener('keydown', function (e) {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.match-card');
  if (!card) return;
  e.preventDefault();
  card.click();
});
```

- [ ] **Step 3: Manually test in browser**

Test cases to verify in the browser:

| Input | Expected |
|---|---|
| `Ivan Chiu` | Table 4, tablemates listed, related section shows Ethan/Christopher/Naomi at Table 6 |
| `ivan chiu` | Same result (case-insensitive) |
| `  ivan  chiu  ` | Same result (trims spaces) |
| `Spencer Yee` | Table 9, related shows Callie Yee + Kendall Yee at Table 6 |
| `Bonnie Chiu` | Table 4, related shows Ethan/Christopher/Naomi at Table 6 |
| `yee` | Multiple-match picker shows all guests with "Yee" in their name |
| `zzzzz` | Friendly "couldn't find" message |
| *(click a match card)* | Expands to full single result |

- [ ] **Step 4: Commit**

```bash
git add seating-chart/app.js
git commit -m "feat: add results rendering and search event handling"
```

---

### Task 6: Full Table List

**Files:**
- Modify: `seating-chart/app.js` (add `renderFullList` + call on load)

- [ ] **Step 1: Add `renderFullList` to `app.js` and call on DOMContentLoaded**

Append to `app.js`:

```js
/**
 * Build the full table list grouped by table number and render it.
 */
function renderFullList() {
  const container = document.getElementById('full-list');

  // Group guests by table number, preserving order
  const tables = new Map();
  for (const g of GUESTS) {
    if (!tables.has(g.table)) tables.set(g.table, []);
    tables.get(g.table).push(g.name);
  }

  let html = '';
  for (const [tableNum, names] of tables) {
    html += `<div class="table-card">`;
    html += `<p class="table-card-number">Table ${tableNum}</p>`;
    html += `<ul class="table-card-names">`;
    for (const name of names) {
      html += `<li>${escapeHtml(name)}</li>`;
    }
    html += `</ul></div>`;
  }

  container.innerHTML = html;
}

// ── Init ──
renderFullList();
```

- [ ] **Step 2: Verify full list in browser**

Open `index.html`. Expected:
- 18 table cards render in a grid
- Each card shows the correct names in the correct order
- Spot-check: Table 4 has 6 names including Ivan Chiu and Bonnie Chiu
- Spot-check: Table 18 is the last card with Kris + Krenna Pauni

- [ ] **Step 3: Commit**

```bash
git add seating-chart/app.js
git commit -m "feat: render full table list on page load"
```

---

### Task 7: Final Polish and Mobile Check

**Files:**
- Modify: `seating-chart/index.html` (minor tweaks if needed)
- Modify: `seating-chart/styles.css` (minor tweaks if needed)

- [ ] **Step 1: Test on mobile viewport**

In browser DevTools, toggle device toolbar. Test at 375px width (iPhone SE).

Verify:
- Search form stacks vertically — input above button, both full width
- Table grid is 2 columns
- Title scales down gracefully with `clamp()`
- Results section is readable with no horizontal overflow

Fix any issues in `styles.css`.

- [ ] **Step 2: Test keyboard / accessibility**

- Tab through the form and submit with Enter key — results should appear
- Tab into a match card and press Enter — should expand to single result
- Screen reader: results section has `aria-live="polite"` so new results are announced

- [ ] **Step 3: Clear search input after no-match and keep input value on match**

The current implementation naturally preserves the input value — verify this is true. The input should not be cleared on submit.

- [ ] **Step 4: Final commit**

```bash
git add seating-chart/
git commit -m "feat: seating chart app complete — search, results, full table list"
```

---

## Spec Coverage Check

| Requirement | Covered by |
|---|---|
| Search bar on home screen | Task 2 (HTML), Task 5 (events) |
| Display assigned table | Task 5 `renderSingleResult` |
| Display all tablemates | Task 5 `renderSingleResult` → `getTablemates` |
| Display related people + their tables | Task 4 `getRelatedByTable`, Task 5 `renderSingleResult` |
| Title + instructions at top | Task 2 header section |
| Centered search bar + submit button | Task 2 + Task 3 |
| Dynamic results section | Task 5 `showResults` / `hideResults` |
| Full table list below | Task 6 `renderFullList` |
| Courier Prime body font | Task 3 Google Fonts link + CSS |
| Amoresa Aged title font | Task 3 `@font-face` + font file note |
| Mobile-friendly / responsive | Task 3 CSS + Task 7 verification |
| Case-insensitive search | Task 4 `normalize()` |
| Ignore extra spaces | Task 4 `normalize()` `.replace(/\s+/g, ' ').trim()` |
| Friendly no-match message | Task 5 zero-match branch |
| Partial matches | Task 4 `.includes(q)` |
| Data sourced from seating_chart.csv | Task 1 `data.js` |
