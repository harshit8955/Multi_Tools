/* ============================================================
   TOOLBOX — Admin Panel JavaScript
   ============================================================ */

// Shared tools data reference (duplicated for standalone admin page)
const ADMIN_TOOLS = [
  { id:'img-compress', name:'Image Compressor', icon:'🖼️', category:'Image', badge:'hot' },
  { id:'img-resize',   name:'Image Resizer',    icon:'📐', category:'Image', badge:'' },
  { id:'img-convert',  name:'Image Converter',  icon:'🔄', category:'Image', badge:'new' },
  { id:'img-bg-color', name:'Image to Base64',  icon:'🔢', category:'Image', badge:'' },
  { id:'qr-gen',       name:'QR Code Generator',icon:'⬛', category:'Generator', badge:'hot' },
  { id:'barcode-gen',  name:'Barcode Generator',icon:'|||', category:'Generator', badge:'new' },
  { id:'color-picker', name:'Color Picker',     icon:'🎨', category:'Design', badge:'' },
  { id:'color-palette',name:'Color Palette Generator', icon:'🌈', category:'Design', badge:'new' },
  { id:'word-counter', name:'Word Counter',     icon:'📝', category:'Text', badge:'' },
  { id:'text-case',    name:'Text Case Converter', icon:'🔤', category:'Text', badge:'' },
  { id:'lorem-gen',    name:'Lorem Ipsum Generator', icon:'📄', category:'Text', badge:'' },
  { id:'json-formatter', name:'JSON Formatter',icon:'{}', category:'Developer', badge:'hot' },
  { id:'base64',       name:'Base64 Encoder/Decoder', icon:'🔐', category:'Developer', badge:'' },
  { id:'url-encode',   name:'URL Encoder/Decoder', icon:'🔗', category:'Developer', badge:'' },
  { id:'hash-gen',     name:'Hash Generator',  icon:'#', category:'Developer', badge:'' },
  { id:'unit-conv',    name:'Unit Converter',  icon:'⚖️', category:'Calculator', badge:'' },
  { id:'age-calc',     name:'Age Calculator',  icon:'🎂', category:'Calculator', badge:'' },
  { id:'password-gen', name:'Password Generator', icon:'🔒', category:'Security', badge:'hot' },
  { id:'uuid-gen',     name:'UUID Generator',  icon:'🆔', category:'Developer', badge:'' },
  { id:'css-gradient', name:'CSS Gradient Generator', icon:'🌅', category:'Design', badge:'new' },
];

// ===== STORAGE =====
function getEnabled() {
  const s = localStorage.getItem('toolbox_enabled');
  if (s) return JSON.parse(s);
  const d = {};
  ADMIN_TOOLS.forEach(t => d[t.id] = true);
  return d;
}
function saveEnabled(state) {
  localStorage.setItem('toolbox_enabled', JSON.stringify(state));
}
let enabledState = getEnabled();

// ===== THEME =====
function initAdminTheme() {
  const t = localStorage.getItem('toolbox_theme') || 'light';
  document.documentElement.setAttribute('data-theme', t);
  document.querySelectorAll('.theme-toggle').forEach(b => b.textContent = t === 'dark' ? '☀️' : '🌙');
}
function toggleAdminTheme() {
  const curr = document.documentElement.getAttribute('data-theme');
  const next = curr === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('toolbox_theme', next);
  document.querySelectorAll('.theme-toggle').forEach(b => b.textContent = next === 'dark' ? '☀️' : '🌙');
}

// ===== TOAST =====
function toast(msg, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) { container = document.createElement('div'); container.className = 'toast-container'; document.body.appendChild(container); }
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => { el.style.animation = 'toastOut 0.3s ease forwards'; setTimeout(() => el.remove(), 300); }, 2800);
}

// ===== CURRENT PAGE =====
let currentPage = 'dashboard';
let searchFilter = '';
let categoryFilter = 'all';
let editingToolId = null;

function showAdminPage(page) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const activeNav = document.querySelector(`[data-page="${page}"]`);
  if (activeNav) activeNav.classList.add('active');
  document.getElementById('pageTitle').textContent = {
    dashboard: 'Dashboard', tools: 'Manage Tools', settings: 'Settings'
  }[page] || page;
  renderPage();
}

function renderPage() {
  const content = document.getElementById('adminContent');
  if (currentPage === 'dashboard') renderDashboard(content);
  else if (currentPage === 'tools') renderToolsManager(content);
  else if (currentPage === 'settings') renderSettings(content);
}

// ===== DASHBOARD =====
function renderDashboard(el) {
  const enabledCount = Object.values(enabledState).filter(Boolean).length;
  const disabledCount = ADMIN_TOOLS.length - enabledCount;
  const categories = [...new Set(ADMIN_TOOLS.map(t => t.category))];

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Welcome back, Admin 👋</div>
        <div class="page-subtitle">Here's your toolbox overview</div>
      </div>
      <a href="index.html" class="btn btn-primary btn-sm">🌐 View Site</a>
    </div>

    <div class="stats-grid">
      <div class="stat-card" style="animation-delay:0s">
        <div class="stat-card-header">
          <span class="stat-card-icon">🧰</span>
          <span class="stat-card-trend trend-up">+${ADMIN_TOOLS.filter(t=>t.badge==='new').length} new</span>
        </div>
        <div class="val">${ADMIN_TOOLS.length}</div>
        <div class="lbl">Total Tools</div>
        <div class="mini-chart">${[40,60,45,80,55,70,90].map(h=>`<div class="mini-bar" style="height:${h}%"></div>`).join('')}</div>
      </div>
      <div class="stat-card" style="animation-delay:0.08s">
        <div class="stat-card-header">
          <span class="stat-card-icon">✅</span>
          <span class="stat-card-trend trend-up">${Math.round(enabledCount/ADMIN_TOOLS.length*100)}%</span>
        </div>
        <div class="val">${enabledCount}</div>
        <div class="lbl">Enabled Tools</div>
        <div class="mini-chart">${[50,70,65,90,75,80,85].map(h=>`<div class="mini-bar" style="height:${h}%"></div>`).join('')}</div>
      </div>
      <div class="stat-card" style="animation-delay:0.16s">
        <div class="stat-card-header">
          <span class="stat-card-icon">⏸️</span>
          <span class="stat-card-trend trend-down">${disabledCount} paused</span>
        </div>
        <div class="val">${disabledCount}</div>
        <div class="lbl">Disabled Tools</div>
        <div class="mini-chart">${[30,20,35,15,25,10,20].map(h=>`<div class="mini-bar" style="height:${h}%"></div>`).join('')}</div>
      </div>
      <div class="stat-card" style="animation-delay:0.24s">
        <div class="stat-card-header">
          <span class="stat-card-icon">📂</span>
          <span class="stat-card-trend trend-up">categorized</span>
        </div>
        <div class="val">${categories.length}</div>
        <div class="lbl">Categories</div>
        <div class="mini-chart">${[60,80,70,90,65,75,85].map(h=>`<div class="mini-bar" style="height:${h}%"></div>`).join('')}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem">
      <div class="table-card">
        <div class="table-header"><h3>📂 Tools by Category</h3></div>
        <div style="padding:1.25rem">
          ${categories.map(cat => {
            const count = ADMIN_TOOLS.filter(t => t.category === cat).length;
            const en = ADMIN_TOOLS.filter(t => t.category === cat && enabledState[t.id] !== false).length;
            const pct = Math.round(en/count*100);
            return `<div style="margin-bottom:1rem">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:0.85rem">
                <span style="font-weight:500">${cat}</span>
                <span style="color:var(--text3)">${en}/${count} enabled</span>
              </div>
              <div style="background:var(--bg3);border-radius:99px;height:6px;overflow:hidden">
                <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:99px;transition:width .5s ease"></div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>
      <div class="table-card">
        <div class="table-header"><h3>🔥 Hot & New Tools</h3></div>
        <div style="padding:0.5rem 0">
          ${ADMIN_TOOLS.filter(t => t.badge).map(t => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1.25rem;border-bottom:1px solid var(--border)">
              <div style="display:flex;align-items:center;gap:10px">
                <span style="font-size:1.2rem">${t.icon}</span>
                <div>
                  <div style="font-size:0.88rem;font-weight:600">${t.name}</div>
                  <div style="font-size:0.75rem;color:var(--text3)">${t.category}</div>
                </div>
              </div>
              <span class="badge ${t.badge === 'new' ? 'badge-enabled' : ''}" style="${t.badge === 'hot' ? 'background:rgba(245,158,11,0.12);color:var(--amber)' : ''}">${t.badge === 'hot' ? '🔥 Hot' : '✨ New'}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-header">
        <h3>Quick Tool Toggle</h3>
        <div style="display:flex;gap:8px">
          <button class="btn btn-primary btn-sm" onclick="enableAll()">Enable All</button>
          <button class="btn btn-secondary btn-sm" onclick="disableAll()">Disable All</button>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1px;background:var(--border)">
        ${ADMIN_TOOLS.map(t => `
          <div style="background:var(--surface);padding:1rem;display:flex;align-items:center;justify-content:space-between;gap:10px">
            <div style="display:flex;align-items:center;gap:10px;min-width:0">
              <span style="font-size:1rem;flex-shrink:0">${t.icon}</span>
              <span style="font-size:0.82rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t.name}</span>
            </div>
            <label class="toggle" style="flex-shrink:0">
              <input type="checkbox" ${enabledState[t.id] !== false ? 'checked' : ''} onchange="quickToggle('${t.id}', this.checked)">
              <span class="toggle-slider"></span>
            </label>
          </div>`).join('')}
      </div>
    </div>
  `;
}

// ===== TOOLS MANAGER =====
function renderToolsManager(el) {
  const filtered = ADMIN_TOOLS.filter(t => {
    const sm = !searchFilter || t.name.toLowerCase().includes(searchFilter) || t.category.toLowerCase().includes(searchFilter);
    const cm = categoryFilter === 'all' || t.category === categoryFilter;
    return sm && cm;
  });
  const categories = ['all', ...new Set(ADMIN_TOOLS.map(t => t.category))];

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Manage Tools</div>
        <div class="page-subtitle">${filtered.length} of ${ADMIN_TOOLS.length} tools shown</div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary btn-sm" onclick="enableAll()">✅ Enable All</button>
        <button class="btn btn-secondary btn-sm" onclick="disableAll()">⏸ Disable All</button>
      </div>
    </div>
    <div class="table-card">
      <div class="table-header">
        <h3>All Tools</h3>
        <div class="table-controls">
          <input class="search-input" placeholder="🔍 Search tools..." value="${searchFilter}" oninput="searchFilter=this.value.toLowerCase();renderPage()">
          <select class="filter-select" onchange="categoryFilter=this.value;renderPage()">
            ${categories.map(c=>`<option value="${c}" ${categoryFilter===c?'selected':''}>${c==='all'?'All Categories':c}</option>`).join('')}
          </select>
        </div>
      </div>
      <div style="overflow-x:auto">
        <table>
          <thead><tr><th>Tool</th><th>Category</th><th>Badge</th><th>Status</th><th>Toggle</th><th>Actions</th></tr></thead>
          <tbody>
            ${filtered.map(t => `
              <tr id="row-${t.id}">
                <td>
                  <div class="tool-cell">
                    <div class="tool-cell-icon">${t.icon}</div>
                    <div>
                      <div class="tool-cell-name">${t.name}</div>
                      <div class="tool-cell-cat">${t.id}</div>
                    </div>
                  </div>
                </td>
                <td><span class="badge badge-cat">${t.category}</span></td>
                <td>${t.badge ? `<span class="badge" style="${t.badge==='hot'?'background:rgba(245,158,11,0.12);color:var(--amber)':'background:rgba(16,185,129,0.12);color:var(--green)'}">${t.badge==='hot'?'🔥 Hot':'✨ New'}</span>` : '<span style="color:var(--text3);font-size:0.8rem">—</span>'}</td>
                <td><span class="badge ${enabledState[t.id]!==false?'badge-enabled':'badge-disabled'}" id="badge-${t.id}">${enabledState[t.id]!==false?'● Enabled':'○ Disabled'}</span></td>
                <td>
                  <label class="toggle">
                    <input type="checkbox" ${enabledState[t.id]!==false?'checked':''} onchange="toggleTool('${t.id}',this.checked)">
                    <span class="toggle-slider"></span>
                  </label>
                </td>
                <td>
                  <div class="action-btns">
                    <button class="action-btn" title="Preview" onclick="window.open('index.html','_blank')" title="View on site">🔗</button>
                    <button class="action-btn ${enabledState[t.id]!==false?'':'danger'}" title="${enabledState[t.id]!==false?'Disable':'Enable'}" onclick="toggleTool('${t.id}',${enabledState[t.id]===false})">
                      ${enabledState[t.id]!==false?'⏸':'▶'}
                    </button>
                  </div>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
        ${filtered.length === 0 ? '<div class="empty-state"><div class="icon">🔍</div><p>No tools found</p></div>' : ''}
      </div>
    </div>
  `;
}

// ===== SETTINGS =====
function renderSettings(el) {
  const siteName = localStorage.getItem('toolbox_sitename') || 'Toolbox';
  const siteTagline = localStorage.getItem('toolbox_tagline') || 'All your web tools in one place';

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Settings</div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">
      <div class="table-card" style="padding:1.5rem">
        <h3 style="font-family:var(--font-display);font-size:1rem;font-weight:700;margin-bottom:1.5rem">🌐 Site Settings</h3>
        <div class="form-group">
          <label>Site Name</label>
          <input type="text" id="s-name" value="${siteName}" placeholder="Toolbox">
        </div>
        <div class="form-group">
          <label>Tagline</label>
          <input type="text" id="s-tagline" value="${siteTagline}" placeholder="All your web tools in one place">
        </div>
        <div class="form-group">
          <label>Theme</label>
          <select id="s-theme" onchange="setTheme(this.value)">
            <option value="light" ${localStorage.getItem('toolbox_theme')!=='dark'?'selected':''}>Light</option>
            <option value="dark" ${localStorage.getItem('toolbox_theme')==='dark'?'selected':''}>Dark</option>
          </select>
        </div>
        <button class="btn btn-primary" onclick="saveSiteSettings()">💾 Save Settings</button>
      </div>

      <div class="table-card" style="padding:1.5rem">
        <h3 style="font-family:var(--font-display);font-size:1rem;font-weight:700;margin-bottom:1.5rem">🔐 Admin Access</h3>
        <div class="form-group">
          <label>Admin Password (set to protect panel)</label>
          <input type="password" id="s-pass" placeholder="Enter new password">
        </div>
        <div class="form-group">
          <label>Confirm Password</label>
          <input type="password" id="s-pass2" placeholder="Confirm password">
        </div>
        <button class="btn btn-primary" onclick="savePassword()">🔒 Update Password</button>
      </div>

      <div class="table-card" style="padding:1.5rem">
        <h3 style="font-family:var(--font-display);font-size:1rem;font-weight:700;margin-bottom:1.5rem">🗄️ Data Management</h3>
        <p style="font-size:0.88rem;color:var(--text2);margin-bottom:1.5rem;line-height:1.6">Export or reset your tool configuration. Exporting saves a JSON file you can re-import later.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="exportConfig()">📤 Export Config</button>
          <button class="btn btn-secondary" onclick="document.getElementById('importFile').click()">📥 Import Config</button>
          <input type="file" id="importFile" accept=".json" class="hidden" onchange="importConfig(this)">
          <button class="btn btn-danger-solid" onclick="resetConfig()">🗑 Reset All</button>
        </div>
      </div>

      <div class="table-card" style="padding:1.5rem">
        <h3 style="font-family:var(--font-display);font-size:1rem;font-weight:700;margin-bottom:1.5rem">ℹ️ About</h3>
        <div style="font-size:0.88rem;color:var(--text2);line-height:1.9">
          <div><strong>Toolbox</strong> — Multi-tool website</div>
          <div>Version: <code style="background:var(--bg3);padding:2px 8px;border-radius:6px">1.0.0</code></div>
          <div>Total tools: <strong>${ADMIN_TOOLS.length}</strong></div>
          <div>Categories: <strong>${[...new Set(ADMIN_TOOLS.map(t=>t.category))].length}</strong></div>
          <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border);color:var(--text3)">Built with pure HTML, CSS & JavaScript</div>
        </div>
      </div>
    </div>
  `;
}

// ===== ACTIONS =====
function toggleTool(id, enabled) {
  enabledState[id] = enabled;
  saveEnabled(enabledState);
  toast(`${ADMIN_TOOLS.find(t=>t.id===id)?.name} ${enabled?'enabled':'disabled'}`, enabled?'success':'info');
  renderPage();
}

function quickToggle(id, enabled) {
  enabledState[id] = enabled;
  saveEnabled(enabledState);
  toast(`${ADMIN_TOOLS.find(t=>t.id===id)?.name} ${enabled?'enabled':'disabled'}`, enabled?'success':'info');
}

function enableAll() {
  ADMIN_TOOLS.forEach(t => enabledState[t.id] = true);
  saveEnabled(enabledState);
  toast('All tools enabled!', 'success');
  renderPage();
}

function disableAll() {
  ADMIN_TOOLS.forEach(t => enabledState[t.id] = false);
  saveEnabled(enabledState);
  toast('All tools disabled', 'info');
  renderPage();
}

function setTheme(val) {
  document.documentElement.setAttribute('data-theme', val);
  localStorage.setItem('toolbox_theme', val);
  document.querySelectorAll('.theme-toggle').forEach(b => b.textContent = val === 'dark' ? '☀️' : '🌙');
}

function saveSiteSettings() {
  localStorage.setItem('toolbox_sitename', document.getElementById('s-name').value);
  localStorage.setItem('toolbox_tagline', document.getElementById('s-tagline').value);
  toast('Settings saved!', 'success');
}

function savePassword() {
  const p1 = document.getElementById('s-pass').value;
  const p2 = document.getElementById('s-pass2').value;
  if (!p1) { toast('Enter a password', 'error'); return; }
  if (p1 !== p2) { toast('Passwords do not match', 'error'); return; }
  localStorage.setItem('toolbox_admin_pass', btoa(p1));
  toast('Password updated!', 'success');
}

function exportConfig() {
  const config = { enabled: enabledState, theme: localStorage.getItem('toolbox_theme'), siteName: localStorage.getItem('toolbox_sitename'), exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'toolbox-config.json'; a.click();
  toast('Config exported!', 'success');
}

function importConfig(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const config = JSON.parse(e.target.result);
      if (config.enabled) { enabledState = config.enabled; saveEnabled(enabledState); }
      if (config.theme) { setTheme(config.theme); }
      toast('Config imported!', 'success'); renderPage();
    } catch { toast('Invalid config file', 'error'); }
  };
  reader.readAsText(file);
}

function resetConfig() {
  if (!confirm('Reset all settings to default?')) return;
  localStorage.removeItem('toolbox_enabled');
  localStorage.removeItem('toolbox_theme');
  enabledState = getEnabled();
  toast('Reset complete!', 'success');
  renderPage();
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initAdminTheme();
  document.querySelectorAll('.theme-toggle').forEach(b => b.addEventListener('click', toggleAdminTheme));
  document.querySelectorAll('.nav-item[data-page]').forEach(n => {
    n.addEventListener('click', () => showAdminPage(n.dataset.page));
  });
  renderPage();
});
