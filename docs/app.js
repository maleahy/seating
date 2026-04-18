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
  const tables = [
    // Bottom row
    [1,   8, 203, 78, 38],
    [2,  96, 203, 78, 38],
    [3, 184, 203, 78, 38],
    [4, 272, 203, 78, 38],
    // Row 2
    [5,   8, 138, 78, 38],
    [6,  96, 138, 78, 38],
    [7, 184, 138, 78, 38],
    [8, 272, 138, 78, 38],
    // Row 3
    [9,   8,  73, 78, 38],
    [10,  96,  73, 78, 38],
    [11, 184,  73, 78, 38],
    [12, 272,  73, 78, 38],
    // Top row
    [13,  8,   8, 78, 38],
    [14,  96,   8, 78, 38],
    [15, 184,   8, 78, 38],
    [16, 272,   8, 78, 38],
    // Right column (tall vertical rects)
    [17, 382, 138, 58, 103],
    [18, 382,  28, 58, 103],
  ];

  const rects = tables.map(([num, x, y, w, h]) => {
    const isHighlight = num === highlightTable;
    const fill   = isHighlight ? 'var(--color-accent)' : 'var(--color-card)';
    const text   = isHighlight ? '#fff' : 'var(--color-text)';
    const stroke = isHighlight ? 'var(--color-accent)' : 'var(--color-border)';
    const cx = x + w / 2;
    const cy = y + h / 2;
    return `
      <rect x="${x}" y="${y}" width="${w}" height="${h}"
        fill="${fill}" stroke="${stroke}" stroke-width="1.5" rx="2"/>
      <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
        font-size="13" font-family="var(--font-body)" fill="${text}">${num}</text>`;
  }).join('');

  return `<div class="diagram-container">
    <svg viewBox="0 0 448 249" xmlns="http://www.w3.org/2000/svg" aria-label="Seating floor plan">
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

// ── Init ──
renderFullList();
