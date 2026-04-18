// ── Search helpers ──

function normalize(s) {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

function searchGuests(query) {
  const q = normalize(query);
  if (!q) return [];
  return GUESTS.filter(g => normalize(g.name).includes(q));
}

function getTablemates(tableNum) {
  return GUESTS.filter(g => g.table === tableNum);
}

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

// ── Render helpers ──

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderSeatingDiagram(highlightTable) {
  // Each entry: [tableNum, x, y, width, height]
  // Grid rects are landscape (78×38); right column rects are portrait/rotated (38×78)
  const tables = [
    // Right column: tables 1-2, portrait orientation (rotated 90°)
    [1, 370, 133, 38, 78],  // bottom
    [2, 370,  38, 38, 78],  // top
    // Grid bottom row (tables 3-6)
    [3,   8, 203, 78, 38],
    [4,  96, 203, 78, 38],
    [5, 184, 203, 78, 38],
    [6, 272, 203, 78, 38],
    // Grid row 2 (tables 7-10)
    [7,   8, 138, 78, 38],
    [8,  96, 138, 78, 38],
    [9, 184, 138, 78, 38],
    [10, 272, 138, 78, 38],
    // Grid row 3 (tables 11-14)
    [11,  8,  73, 78, 38],
    [12, 96,  73, 78, 38],
    [13,184,  73, 78, 38],
    [14,272,  73, 78, 38],
    // Grid top row (tables 15-18)
    [15,  8,   8, 78, 38],
    [16, 96,   8, 78, 38],
    [17,184,   8, 78, 38],
    [18,272,   8, 78, 38],
  ];

  const rects = tables.map(([num, x, y, w, h]) => {
    const isHighlight = num === highlightTable;
    const fill   = isHighlight ? 'var(--color-accent)' : 'var(--color-card)';
    const text   = isHighlight ? '#fff' : 'var(--color-text)';
    const stroke = isHighlight ? 'var(--color-accent)' : 'var(--color-border)';
    const cx = x + w / 2;
    const cy = y + h / 2;
    return `
      <g onclick="showResults(renderTableResult(${num}))" style="cursor:pointer">
        <rect x="${x}" y="${y}" width="${w}" height="${h}"
          fill="${fill}" stroke="${stroke}" stroke-width="1.5" rx="2"/>
        <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
          font-size="13" font-family="var(--font-body)" fill="${text}">${num}</text>
      </g>`;
  }).join('');

  return `<div class="diagram-container">
    <svg viewBox="0 0 416 249" xmlns="http://www.w3.org/2000/svg" aria-label="Seating floor plan">
      ${rects}
    </svg>
  </div>`;
}

function renderSingleResult(guest) {
  const tablemates = getTablemates(guest.table);
  const relatedByTable = getRelatedByTable(guest.related);

  let html = '';
  html += renderSeatingDiagram(guest.table);
  html += `<p class="result-match-name">${escapeHtml(guest.name)}</p>`;
  html += `<p class="result-table-number">Table ${guest.table}</p>`;

  html += `<p class="result-section-label">Others at your table</p>`;
  html += `<ul class="result-names-list">`;
  for (const tm of tablemates) {
    const isYou = normalize(tm.name) === normalize(guest.name);
    html += `<li class="${isYou ? 'is-you' : ''}">${escapeHtml(tm.name)}${isYou ? ' ★' : ''}</li>`;
  }
  html += `</ul>`;

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

function renderMultipleMatches(matches) {
  let html = `<p class="match-prompt">We found a few people matching that name. Which one are you?</p>`;
  for (const g of matches) {
    html += `<div class="match-card" data-name="${escapeHtml(g.name)}" tabindex="0">`;
    html += `<strong>${escapeHtml(g.name)}</strong> — Table ${g.table}`;
    html += `</div>`;
  }
  return html;
}

function showResults(innerHtml) {
  const section = document.getElementById('results-section');
  const inner = document.getElementById('results-inner');
  inner.innerHTML = innerHtml;
  section.hidden = false;
  section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideResults() {
  const section = document.getElementById('results-section');
  section.hidden = true;
  document.getElementById('results-inner').innerHTML = '';
}

// ── Full table list ──

function renderFullList() {
  const container = document.getElementById('full-list');
  const tables = new Map();
  for (const g of GUESTS) {
    if (!tables.has(g.table)) tables.set(g.table, []);
    tables.get(g.table).push(g.name);
  }

  let html = '';
  for (const [tableNum, names] of tables) {
    html += `<div class="table-card" data-table="${tableNum}" tabindex="0" role="button" aria-label="Table ${tableNum}" onclick="showResults(renderTableResult(${tableNum}))">`;
    html += `<p class="table-card-number">Table ${tableNum}</p>`;
    html += `<ul class="table-card-names">`;
    for (const name of names) {
      html += `<li>${escapeHtml(name)}</li>`;
    }
    html += `</ul></div>`;
  }

  container.innerHTML = html;
}

function renderTableResult(tableNum) {
  const guests = getTablemates(tableNum);
  let html = '';
  html += renderSeatingDiagram(tableNum);
  html += `<p class="result-table-number">Table ${tableNum}</p>`;
  html += `<ul class="result-names-list">`;
  for (const g of guests) {
    html += `<li>${escapeHtml(g.name)}</li>`;
  }
  html += `</ul>`;
  return html;
}

// ── Events ──

document.getElementById('search-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const query = document.getElementById('search-input').value;
  const matches = searchGuests(query);

  if (matches.length === 0) {
    showResults(`<p class="no-result-msg">We couldn't find "${escapeHtml(query.trim())}" on the guest list. Double-check the spelling!</p>`);
    return;
  }

  if (matches.length === 1) {
    showResults(renderSingleResult(matches[0]));
    return;
  }

  showResults(renderMultipleMatches(matches));
});

document.getElementById('results-inner').addEventListener('click', function (e) {
  const card = e.target.closest('.match-card');
  if (!card) return;
  const name = card.dataset.name;
  const guest = GUESTS.find(g => g.name === name);
  if (guest) showResults(renderSingleResult(guest));
});

document.getElementById('results-inner').addEventListener('keydown', function (e) {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.match-card');
  if (!card) return;
  e.preventDefault();
  card.click();
});

document.getElementById('full-list').addEventListener('click', function (e) {
  const card = e.target.closest('.table-card');
  if (!card) return;
  const tableNum = parseInt(card.dataset.table, 10);
  if (isNaN(tableNum)) return;
  showResults(renderTableResult(tableNum));
});

document.getElementById('full-list').addEventListener('keydown', function (e) {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.table-card');
  if (!card) return;
  e.preventDefault();
  card.click();
});

// ── Init ──
renderFullList();
