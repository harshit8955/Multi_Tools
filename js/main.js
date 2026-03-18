/* ============================================================
   TOOLBOX — Main JavaScript
   ============================================================ */

// ===== TOOLS DATA =====
const TOOLS_DATA = [
  { id:'img-compress', name:'Image Compressor', desc:'Reduce image file size without losing visible quality. Supports JPEG, PNG and WebP.', icon:'🖼️', category:'Image', badge:'hot', accent:'#7c3aed', accent2:'#a855f7', iconBg:'rgba(124,58,237,0.12)' },
  { id:'img-resize',   name:'Image Resizer',    desc:'Resize images to exact dimensions or percentage while preserving aspect ratio.', icon:'📐', category:'Image', badge:'', accent:'#a855f7', accent2:'#ec4899', iconBg:'rgba(168,85,247,0.12)' },
  { id:'img-convert',  name:'Image Converter',  desc:'Convert images between PNG, JPEG, WebP and BMP formats instantly.', icon:'🔄', category:'Image', badge:'new', accent:'#ec4899', accent2:'#f97316', iconBg:'rgba(236,72,153,0.12)' },
  { id:'img-bg-color', name:'Image to Base64',  desc:'Encode any image to Base64 string for embedding in HTML or CSS directly.', icon:'🔢', category:'Image', badge:'', accent:'#f97316', accent2:'#eab308', iconBg:'rgba(249,115,22,0.12)' },
  { id:'qr-gen',       name:'QR Code Generator',desc:'Generate QR codes for URLs, text, contacts and more with custom colors.', icon:'⬛', category:'Generator', badge:'hot', accent:'#06b6d4', accent2:'#3b82f6', iconBg:'rgba(6,182,212,0.12)' },
  { id:'barcode-gen',  name:'Barcode Generator',desc:'Create barcodes in CODE128, EAN-13, UPC-A and other formats for products.', icon:'|||', category:'Generator', badge:'new', accent:'#3b82f6', accent2:'#6366f1', iconBg:'rgba(59,130,246,0.12)' },
  { id:'color-picker', name:'Color Picker',     desc:'Pick colors and get values in HEX, RGB, HSL. Includes palette swatches.', icon:'🎨', category:'Design', badge:'', accent:'#ec4899', accent2:'#f43f5e', iconBg:'rgba(236,72,153,0.12)' },
  { id:'color-palette',name:'Color Palette Generator', desc:'Generate beautiful color palettes from a seed color using various color theories.', icon:'🌈', category:'Design', badge:'new', accent:'#f43f5e', accent2:'#f97316', iconBg:'rgba(244,63,94,0.12)' },
  { id:'word-counter', name:'Word Counter',     desc:'Count words, characters, sentences, paragraphs and estimate reading time.', icon:'📝', category:'Text', badge:'', accent:'#10b981', accent2:'#06b6d4', iconBg:'rgba(16,185,129,0.12)' },
  { id:'text-case',    name:'Text Case Converter', desc:'Convert text to UPPERCASE, lowercase, Title Case, camelCase and more.', icon:'🔤', category:'Text', badge:'', accent:'#059669', accent2:'#10b981', iconBg:'rgba(5,150,105,0.12)' },
  { id:'lorem-gen',    name:'Lorem Ipsum Generator', desc:'Generate placeholder text in various lengths for design mockups and prototypes.', icon:'📄', category:'Text', badge:'', accent:'#6366f1', accent2:'#8b5cf6', iconBg:'rgba(99,102,241,0.12)' },
  { id:'json-formatter', name:'JSON Formatter',  desc:'Format, validate and minify JSON data with syntax highlighting and error detection.', icon:'{ }', category:'Developer', badge:'hot', accent:'#f59e0b', accent2:'#f97316', iconBg:'rgba(245,158,11,0.12)' },
  { id:'base64',       name:'Base64 Encoder/Decoder', desc:'Encode or decode strings in Base64 format, useful for data encoding in web apps.', icon:'🔐', category:'Developer', badge:'', accent:'#8b5cf6', accent2:'#a78bfa', iconBg:'rgba(139,92,246,0.12)' },
  { id:'url-encode',   name:'URL Encoder/Decoder', desc:'Encode special characters in URLs or decode percent-encoded URL strings.', icon:'🔗', category:'Developer', badge:'', accent:'#0ea5e9', accent2:'#38bdf8', iconBg:'rgba(14,165,233,0.12)' },
  { id:'hash-gen',     name:'Hash Generator',    desc:'Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any text input.', icon:'#️', category:'Developer', badge:'', accent:'#64748b', accent2:'#94a3b8', iconBg:'rgba(100,116,139,0.12)' },
  { id:'unit-conv',    name:'Unit Converter',    desc:'Convert between length, weight, temperature, volume and speed units easily.', icon:'⚖️', category:'Calculator', badge:'', accent:'#d97706', accent2:'#f59e0b', iconBg:'rgba(217,119,6,0.12)' },
  { id:'age-calc',     name:'Age Calculator',    desc:'Calculate exact age in years, months and days from any birth date.', icon:'🎂', category:'Calculator', badge:'', accent:'#e11d48', accent2:'#f43f5e', iconBg:'rgba(225,29,72,0.12)' },
  { id:'password-gen', name:'Password Generator',desc:'Generate strong, random passwords with custom length and character sets.', icon:'🔒', category:'Security', badge:'hot', accent:'#7c3aed', accent2:'#4f46e5', iconBg:'rgba(124,58,237,0.12)' },
  { id:'uuid-gen',     name:'UUID Generator',    desc:'Generate RFC-compliant UUID v4 strings for unique identifiers in apps.', icon:'🆔', category:'Developer', badge:'', accent:'#0891b2', accent2:'#06b6d4', iconBg:'rgba(8,145,178,0.12)' },
  { id:'css-gradient', name:'CSS Gradient Generator', desc:'Create beautiful linear and radial CSS gradients with live preview and copy.', icon:'🌅', category:'Design', badge:'new', accent:'#ec4899', accent2:'#8b5cf6', iconBg:'rgba(236,72,153,0.12)' },
];

// Load enabled states from localStorage
function getEnabledTools() {
  const saved = localStorage.getItem('toolbox_enabled');
  if (saved) return JSON.parse(saved);
  const def = {};
  TOOLS_DATA.forEach(t => def[t.id] = true);
  return def;
}
function saveEnabledTools(state) {
  localStorage.setItem('toolbox_enabled', JSON.stringify(state));
}
let enabledTools = getEnabledTools();

// ===== THEME =====
function initTheme() {
  const saved = localStorage.getItem('toolbox_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcons(saved);
}
function toggleTheme() {
  const curr = document.documentElement.getAttribute('data-theme');
  const next = curr === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('toolbox_theme', next);
  updateThemeIcons(next);
}
function updateThemeIcons(theme) {
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  });
}

// ===== TOAST =====
function showToast(msg, type='info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success:'✅', error:'❌', info:'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.animation='toastOut 0.3s ease forwards'; setTimeout(()=>toast.remove(), 300); }, 2800);
}

// ===== COPY =====
function copyToClipboard(text, label='') {
  navigator.clipboard.writeText(text).then(() => showToast((label||'Text')+' copied!', 'success')).catch(()=>showToast('Copy failed','error'));
}

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
});

// ===== RENDER TOOLS GRID =====
let currentFilter = 'All';
let searchQuery = '';

function renderTools() {
  const grid = document.getElementById('toolsGrid');
  if (!grid) return;
  const categories = ['All', ...new Set(TOOLS_DATA.map(t => t.category))];

  // Render filters
  const filtersWrap = document.getElementById('filtersWrap');
  if (filtersWrap && filtersWrap.children.length === 0) {
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn' + (cat === 'All' ? ' active' : '');
      btn.textContent = cat === 'All' ? `✦ All Tools` : cat;
      btn.onclick = () => {
        currentFilter = cat;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderToolCards();
      };
      filtersWrap.appendChild(btn);
    });
  }
  renderToolCards();
}

function renderToolCards() {
  const grid = document.getElementById('toolsGrid');
  const countEl = document.getElementById('toolsCount');
  if (!grid) return;

  const filtered = TOOLS_DATA.filter(t => {
    const enabled = enabledTools[t.id] !== false;
    const catMatch = currentFilter === 'All' || t.category === currentFilter;
    const searchMatch = !searchQuery || t.name.toLowerCase().includes(searchQuery) || t.desc.toLowerCase().includes(searchQuery) || t.category.toLowerCase().includes(searchQuery);
    return enabled && catMatch && searchMatch;
  });

  grid.innerHTML = '';
  if (countEl) countEl.textContent = `${filtered.length} tools`;

  if (!filtered.length) {
    grid.innerHTML = `<div class="no-results"><div class="icon">🔍</div><p>No tools found. Try a different search.</p></div>`;
    return;
  }

  filtered.forEach((tool, i) => {
    const card = document.createElement('a');
    card.className = 'tool-card';
    card.href = '#';
    card.style.cssText = `--card-accent:${tool.accent};--card-accent2:${tool.accent2};animation-delay:${i * 0.05}s`;
    card.innerHTML = `
      ${tool.badge ? `<span class="card-badge ${tool.badge}">${tool.badge==='hot'?'🔥 Hot':'✨ New'}</span>` : ''}
      <div class="card-icon" style="background:${tool.iconBg}">${tool.icon}</div>
      <div>
        <div class="card-name">${tool.name}</div>
        <div class="card-desc">${tool.desc}</div>
      </div>
      <div class="card-meta">
        <span class="card-category">${tool.category}</span>
        <span class="card-arrow">→</span>
      </div>`;
    card.onclick = (e) => { e.preventDefault(); openTool(tool.id); };
    grid.appendChild(card);
  });
}

// ===== NAVIGATION =====
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) { page.classList.add('active'); window.scrollTo(0,0); }
}

function openTool(id) {
  const toolPage = document.getElementById('toolPage');
  const homePage = document.getElementById('homePage');
  if (!toolPage) return;
  homePage && homePage.classList.add('hidden');
  toolPage.classList.remove('hidden');
  window.scrollTo(0,0);
  loadToolContent(id);
}

function goHome() {
  const toolPage = document.getElementById('toolPage');
  const homePage = document.getElementById('homePage');
  if (toolPage) toolPage.classList.add('hidden');
  if (homePage) homePage.classList.remove('hidden');
  window.scrollTo(0,0);
}

// ===== SEARCH =====
function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderToolCards();
    // scroll to tools
    if (searchQuery) document.getElementById('toolsGrid')?.scrollIntoView({behavior:'smooth', block:'start'});
  });
}

// ===== LOAD TOOL CONTENT =====
function loadToolContent(id) {
  const tool = TOOLS_DATA.find(t => t.id === id);
  if (!tool) return;

  document.getElementById('toolPageTitle').textContent = tool.name;
  document.getElementById('toolPageDesc').textContent = tool.desc;
  document.getElementById('toolPageIcon').textContent = tool.icon;

  const container = document.getElementById('toolContent');
  container.innerHTML = '';

  const renderers = {
    'img-compress': renderImageCompressor,
    'img-resize': renderImageResizer,
    'img-convert': renderImageConverter,
    'img-bg-color': renderImageToBase64,
    'qr-gen': renderQRGenerator,
    'barcode-gen': renderBarcodeGenerator,
    'color-picker': renderColorPicker,
    'color-palette': renderColorPalette,
    'word-counter': renderWordCounter,
    'text-case': renderTextCase,
    'lorem-gen': renderLoremGenerator,
    'json-formatter': renderJsonFormatter,
    'base64': renderBase64Tool,
    'url-encode': renderUrlEncoder,
    'hash-gen': renderHashGenerator,
    'unit-conv': renderUnitConverter,
    'age-calc': renderAgeCalculator,
    'password-gen': renderPasswordGenerator,
    'uuid-gen': renderUUIDGenerator,
    'css-gradient': renderCSSGradient,
  };

  if (renderers[id]) renderers[id](container);
  else container.innerHTML = '<div class="tool-card-inner"><p style="color:var(--text3)">Tool coming soon!</p></div>';
}

// ===========================
// ===== TOOL RENDERERS ======
// ===========================

function card(title, html) {
  return `<div class="tool-card-inner"><h3>${title}</h3>${html}</div>`;
}

// --- IMAGE COMPRESSOR ---
function renderImageCompressor(el) {
  el.innerHTML = card('Compress Image', `
    <div class="drop-zone" id="dz-compress" onclick="document.getElementById('ic-file').click()">
      <div class="dz-icon">🖼️</div>
      <p><strong>Click to upload</strong> or drag & drop</p>
      <p><small>PNG, JPG, WEBP supported</small></p>
    </div>
    <input type="file" id="ic-file" accept="image/*" class="hidden">
    <img id="ic-preview" class="preview hidden">
    <div id="ic-controls" class="hidden">
      <div class="label-row"><span>Quality</span><span id="ic-qval">80%</span></div>
      <input type="range" min="5" max="100" value="80" id="ic-quality">
      <div class="stats-row" id="ic-stats"></div>
      <div class="btn-row">
        <button class="btn btn-primary" onclick="downloadCompressed()">⬇ Download Compressed</button>
      </div>
    </div>
  `);
  let origFile=null;
  const dz=document.getElementById('dz-compress');
  const fi=document.getElementById('ic-file');
  dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('dragover')});
  dz.addEventListener('dragleave',()=>dz.classList.remove('dragover'));
  dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('dragover');if(e.dataTransfer.files[0])loadIC(e.dataTransfer.files[0])});
  fi.addEventListener('change',()=>{if(fi.files[0])loadIC(fi.files[0])});
  document.getElementById('ic-quality').addEventListener('input',e=>{document.getElementById('ic-qval').textContent=e.target.value+'%';compressIC()});
  function loadIC(f){origFile=f;const r=new FileReader();r.onload=ev=>{const img=document.getElementById('ic-preview');img.src=ev.target.result;img.classList.remove('hidden');document.getElementById('ic-controls').classList.remove('hidden');compressIC()};r.readAsDataURL(f)}
  function compressIC(){if(!origFile)return;const img=document.getElementById('ic-preview');const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);const q=parseInt(document.getElementById('ic-quality').value)/100;c.toBlob(b=>{const s=document.getElementById('ic-stats');s.innerHTML=`<div class="stat-chip"><div class="val">${fmt(origFile.size)}</div><div class="lbl">Original</div></div><div class="stat-chip"><div class="val">${fmt(b.size)}</div><div class="lbl">Compressed</div></div><div class="stat-chip"><div class="val">${Math.max(0,Math.round((1-b.size/origFile.size)*100))}%</div><div class="lbl">Saved</div></div>`;window._compressedBlob=b},'image/jpeg',q)}
  function fmt(b){return b>1048576?(b/1048576).toFixed(2)+' MB':(b/1024).toFixed(1)+' KB'}
  window.downloadCompressed=()=>{if(!window._compressedBlob){showToast('Upload an image first','error');return;}const a=document.createElement('a');a.href=URL.createObjectURL(window._compressedBlob);a.download='compressed.jpg';a.click();showToast('Downloaded!','success')};
}

// --- IMAGE RESIZER ---
function renderImageResizer(el) {
  el.innerHTML = card('Resize Image', `
    <div class="drop-zone" id="dz-resize" onclick="document.getElementById('ir-file').click()">
      <div class="dz-icon">📐</div><p><strong>Click to upload</strong> image</p>
    </div>
    <input type="file" id="ir-file" accept="image/*" class="hidden">
    <img id="ir-preview" class="preview hidden">
    <div id="ir-controls" class="hidden">
      <div class="input-row">
        <div><label>Width (px)</label><input type="number" id="ir-w" placeholder="Width"></div>
        <div><label>Height (px)</label><input type="number" id="ir-h" placeholder="Height"></div>
      </div>
      <label style="display:flex;align-items:center;gap:8px;margin-bottom:1rem;cursor:pointer">
        <input type="checkbox" id="ir-ar" checked> Maintain aspect ratio
      </label>
      <div class="btn-row">
        <button class="btn btn-primary" onclick="resizeAndDownload()">⬇ Resize & Download</button>
      </div>
    </div>
  `);
  let origImg=null,origW=0,origH=0;
  document.getElementById('ir-file').addEventListener('change',function(){if(this.files[0])loadIR(this.files[0])});
  document.getElementById('dz-resize').addEventListener('click',()=>document.getElementById('ir-file').click());
  function loadIR(f){const r=new FileReader();r.onload=e=>{origImg=new Image();origImg.onload=()=>{origW=origImg.width;origH=origImg.height;document.getElementById('ir-w').value=origW;document.getElementById('ir-h').value=origH;document.getElementById('ir-preview').src=e.target.result;document.getElementById('ir-preview').classList.remove('hidden');document.getElementById('ir-controls').classList.remove('hidden')};origImg.src=e.target.result};r.readAsDataURL(f)}
  document.getElementById('ir-w').addEventListener('input',function(){if(document.getElementById('ir-ar').checked&&origH)document.getElementById('ir-h').value=Math.round(this.value*origH/origW)});
  document.getElementById('ir-h').addEventListener('input',function(){if(document.getElementById('ir-ar').checked&&origW)document.getElementById('ir-w').value=Math.round(this.value*origW/origH)});
  window.resizeAndDownload=()=>{if(!origImg){showToast('Upload an image first','error');return;}const w=parseInt(document.getElementById('ir-w').value),h=parseInt(document.getElementById('ir-h').value);const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(origImg,0,0,w,h);const a=document.createElement('a');a.href=c.toDataURL('image/png');a.download=`resized_${w}x${h}.png`;a.click();showToast('Resized image downloaded!','success')};
}

// --- IMAGE CONVERTER ---
function renderImageConverter(el) {
  el.innerHTML = card('Convert Image Format', `
    <div class="drop-zone" id="dz-conv" onclick="document.getElementById('iconvert-file').click()">
      <div class="dz-icon">🔄</div><p><strong>Click to upload</strong> image</p>
    </div>
    <input type="file" id="iconvert-file" accept="image/*" class="hidden">
    <div id="iconv-controls" class="hidden">
      <label>Convert to format</label>
      <select id="iconv-fmt">
        <option value="image/jpeg">JPEG</option>
        <option value="image/png">PNG</option>
        <option value="image/webp">WebP</option>
      </select>
      <div class="btn-row"><button class="btn btn-primary" onclick="convertImage()">🔄 Convert & Download</button></div>
    </div>
  `);
  let convImg=null;
  document.getElementById('iconvert-file').addEventListener('change',function(){if(this.files[0])loadConv(this.files[0])});
  document.getElementById('dz-conv').addEventListener('click',()=>document.getElementById('iconvert-file').click());
  function loadConv(f){const r=new FileReader();r.onload=e=>{convImg=new Image();convImg.src=e.target.result;convImg.onload=()=>{document.getElementById('iconv-controls').classList.remove('hidden');showToast('Image loaded!','success')}};r.readAsDataURL(f)}
  window.convertImage=()=>{if(!convImg){showToast('Upload an image first','error');return;}const fmt=document.getElementById('iconv-fmt').value;const c=document.createElement('canvas');c.width=convImg.width;c.height=convImg.height;c.getContext('2d').drawImage(convImg,0,0);const ext=fmt.split('/')[1];const a=document.createElement('a');a.href=c.toDataURL(fmt,0.92);a.download=`converted.${ext}`;a.click();showToast('Converted & downloaded!','success')};
}

// --- IMAGE TO BASE64 ---
function renderImageToBase64(el) {
  el.innerHTML = card('Image to Base64', `
    <div class="drop-zone" id="dz-b64img" onclick="document.getElementById('ib64-file').click()">
      <div class="dz-icon">🔢</div><p><strong>Click to upload</strong> image</p>
    </div>
    <input type="file" id="ib64-file" accept="image/*" class="hidden">
    <div id="ib64-result" class="hidden">
      <label>Base64 Output</label>
      <textarea id="ib64-out" rows="6" readonly></textarea>
      <div class="btn-row"><button class="btn btn-primary" onclick="copyToClipboard(document.getElementById('ib64-out').value,'Base64')">📋 Copy Base64</button></div>
    </div>
  `);
  document.getElementById('ib64-file').addEventListener('change',function(){if(this.files[0]){const r=new FileReader();r.onload=e=>{document.getElementById('ib64-out').value=e.target.result;document.getElementById('ib64-result').classList.remove('hidden');showToast('Encoded!','success')};r.readAsDataURL(this.files[0])}});
  document.getElementById('dz-b64img').addEventListener('click',()=>document.getElementById('ib64-file').click());
}

// --- QR GENERATOR ---
function renderQRGenerator(el) {
  el.innerHTML = card('QR Code Generator', `
    <label>Text or URL</label>
    <input type="text" id="qr-input" placeholder="https://example.com">
    <div class="input-row">
      <div>
        <div class="label-row"><span>Size</span><span id="qr-sval">200px</span></div>
        <input type="range" min="100" max="400" step="10" value="200" id="qr-size">
      </div>
      <div>
        <label>Foreground color</label>
        <input type="color" value="#7c3aed" id="qr-color">
      </div>
    </div>
    <canvas id="qr-canvas" class="hidden" style="border-radius:12px"></canvas>
    <div class="btn-row">
      <button class="btn btn-primary" onclick="generateQR()">⚡ Generate QR</button>
      <button class="btn btn-secondary" onclick="downloadQR()">⬇ Download</button>
    </div>
  `);
  document.getElementById('qr-size').addEventListener('input',e=>document.getElementById('qr-sval').textContent=e.target.value+'px');
  window.generateQR=()=>{
    const text=document.getElementById('qr-input').value.trim();
    if(!text){showToast('Enter text or URL','error');return;}
    const size=parseInt(document.getElementById('qr-size').value);
    const color=document.getElementById('qr-color').value;
    const canvas=document.getElementById('qr-canvas');
    canvas.width=size;canvas.height=size;
    canvas.classList.remove('hidden');
    const ctx=canvas.getContext('2d');
    // Simple QR-like visual using matrix (uses external lib if available)
    if(typeof QRCode!=='undefined'){
      const tmp=document.createElement('div');
      new QRCode(tmp,{text,width:size,height:size,colorDark:color,colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.H});
      setTimeout(()=>{const img=tmp.querySelector('img')||tmp.querySelector('canvas');if(img){const i=new Image();i.onload=()=>{ctx.clearRect(0,0,size,size);ctx.drawImage(i,0,0,size,size)};i.src=img.src||img.toDataURL()}},120);
    } else {
      ctx.fillStyle='#fff';ctx.fillRect(0,0,size,size);
      ctx.fillStyle=color;ctx.font=`${size*0.08}px monospace`;ctx.textAlign='center';ctx.fillText('QR: '+text.slice(0,20),size/2,size/2);
      ctx.strokeStyle=color;ctx.lineWidth=2;ctx.strokeRect(10,10,size-20,size-20);
    }
    showToast('QR generated!','success');
  };
  window.downloadQR=()=>{const c=document.getElementById('qr-canvas');if(c.classList.contains('hidden')){showToast('Generate QR first','error');return;}const a=document.createElement('a');a.href=c.toDataURL();a.download='qrcode.png';a.click();showToast('Downloaded!','success')};
  // Load QRCode lib
  if(typeof QRCode==='undefined'){const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';document.head.appendChild(s)}
}

// --- BARCODE GENERATOR ---
function renderBarcodeGenerator(el) {
  el.innerHTML = card('Barcode Generator', `
    <label>Barcode value</label>
    <input type="text" id="bc-input" placeholder="Enter text or number (e.g. 123456789012)">
    <div class="input-row">
      <div>
        <label>Format</label>
        <select id="bc-fmt">
          <option value="CODE128">CODE128 (any text)</option>
          <option value="EAN13">EAN-13 (12 digits)</option>
          <option value="UPC">UPC-A (11 digits)</option>
          <option value="CODE39">CODE39 (alphanumeric)</option>
          <option value="ITF14">ITF-14 (14 digits)</option>
        </select>
      </div>
      <div>
        <label>Height (px)</label>
        <input type="number" id="bc-height" value="80" min="40" max="200">
      </div>
    </div>
    <div class="input-row">
      <div><label>Bar color</label><input type="color" value="#1a1035" id="bc-color"></div>
      <div><label>Background</label><input type="color" value="#ffffff" id="bc-bg"></div>
    </div>
    <label style="display:flex;align-items:center;gap:8px;margin-bottom:1rem;cursor:pointer;font-size:0.88rem">
      <input type="checkbox" id="bc-label" checked> Show text label below barcode
    </label>
    <div id="bc-preview" style="background:#fff;border-radius:12px;padding:16px;text-align:center;border:1px solid var(--border);min-height:60px;margin-bottom:1rem"></div>
    <div id="bc-error" class="result-box error hidden"></div>
    <div class="btn-row">
      <button class="btn btn-primary" onclick="generateBarcode()">⚡ Generate Barcode</button>
      <button class="btn btn-secondary" onclick="downloadBarcodeSVG()">⬇ SVG</button>
      <button class="btn btn-secondary" onclick="downloadBarcodePNG()">⬇ PNG</button>
    </div>
  `);

  function loadJsBarcode(cb) {
    if (typeof JsBarcode !== 'undefined') { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js';
    s.onload = cb;
    s.onerror = () => {
      const s2 = document.createElement('script');
      s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js';
      s2.onload = cb;
      document.head.appendChild(s2);
    };
    document.head.appendChild(s);
  }

  window.generateBarcode = () => {
    const val = document.getElementById('bc-input').value.trim();
    if (!val) { showToast('Enter a barcode value', 'error'); return; }
    const fmt = document.getElementById('bc-fmt').value;
    const color = document.getElementById('bc-color').value;
    const bg = document.getElementById('bc-bg').value;
    const height = parseInt(document.getElementById('bc-height').value) || 80;
    const showLabel = document.getElementById('bc-label').checked;
    const errEl = document.getElementById('bc-error');
    errEl.classList.add('hidden');

    loadJsBarcode(() => {
      try {
        const preview = document.getElementById('bc-preview');
        preview.style.background = bg;
        // clear and create fresh SVG
        preview.innerHTML = '<svg id="bc-svg"></svg>';
        JsBarcode('#bc-svg', val, {
          format: fmt,
          lineColor: color,
          background: bg,
          width: 2,
          height: height,
          displayValue: showLabel,
          fontOptions: '',
          font: 'DM Sans, sans-serif',
          textMargin: 6,
          fontSize: 14,
          margin: 10
        });
        showToast('Barcode generated!', 'success');
      } catch (e) {
        document.getElementById('bc-error').textContent = 'Error: ' + (e.message || 'Invalid value for selected format. Try CODE128 for any text.');
        document.getElementById('bc-error').classList.remove('hidden');
        showToast('Invalid value for this format', 'error');
      }
    });
  };

  window.downloadBarcodeSVG = () => {
    const svg = document.getElementById('bc-svg');
    if (!svg || !svg.innerHTML) { showToast('Generate a barcode first', 'error'); return; }
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'barcode.svg'; a.click();
    showToast('SVG downloaded!', 'success');
  };

  window.downloadBarcodePNG = () => {
    const svg = document.getElementById('bc-svg');
    if (!svg || !svg.innerHTML) { showToast('Generate a barcode first', 'error'); return; }
    const canvas = document.createElement('canvas');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      canvas.width = img.width * 2; canvas.height = img.height * 2;
      const ctx = canvas.getContext('2d');
      ctx.scale(2, 2);
      ctx.fillStyle = document.getElementById('bc-bg').value;
      ctx.fillRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = 'barcode.png'; a.click();
      showToast('PNG downloaded!', 'success');
    };
    img.src = url;
  };

  // Auto-generate on load with example
  setTimeout(() => {
    document.getElementById('bc-input').value = '1234567890';
    generateBarcode();
  }, 500);
}

// --- COLOR PICKER ---
function renderColorPicker(el) {
  const swatches=['#7c3aed','#ec4899','#06b6d4','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#64748b','#1a1035','#f8f6ff','#ffffff'];
  el.innerHTML = card('Color Picker', `
    <div class="input-row">
      <div>
        <label>Pick a color</label>
        <input type="color" value="#7c3aed" id="cp-input" oninput="updateCP(this.value)">
      </div>
      <div>
        <label>Hex value</label>
        <input type="text" id="cp-hex" value="#7c3aed" oninput="updateCP(this.value)" maxlength="7">
      </div>
    </div>
    <div id="cp-preview" style="width:100%;height:90px;border-radius:12px;background:#7c3aed;margin-bottom:1rem;transition:all .3s;border:1px solid var(--border)"></div>
    <div class="swatch-row" id="cp-swatches"></div>
    <div class="copy-group"><input type="text" id="cp-hex-out" value="#7c3aed" readonly><button class="btn btn-secondary btn-sm" onclick="copyToClipboard(document.getElementById('cp-hex-out').value,'HEX')">Copy HEX</button></div>
    <div class="copy-group"><input type="text" id="cp-rgb-out" readonly><button class="btn btn-secondary btn-sm" onclick="copyToClipboard(document.getElementById('cp-rgb-out').value,'RGB')">Copy RGB</button></div>
    <div class="copy-group"><input type="text" id="cp-hsl-out" readonly><button class="btn btn-secondary btn-sm" onclick="copyToClipboard(document.getElementById('cp-hsl-out').value,'HSL')">Copy HSL</button></div>
  `);
  const sr=document.getElementById('cp-swatches');
  swatches.forEach(c=>{const s=document.createElement('div');s.className='swatch';s.style.cssText=`background:${c};border:${c==='#ffffff'?'1.5px solid var(--border2)':'2px solid transparent'}`;s.onclick=()=>{document.getElementById('cp-input').value=c;updateCP(c)};sr.appendChild(s)});
  window.updateCP=hex=>{if(!/^#[0-9A-Fa-f]{6}$/.test(hex))return;document.getElementById('cp-preview').style.background=hex;document.getElementById('cp-hex-out').value=hex;document.getElementById('cp-hex').value=hex;document.getElementById('cp-input').value=hex;const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);document.getElementById('cp-rgb-out').value=`rgb(${r}, ${g}, ${b})`;const rn=r/255,gn=g/255,bn=b/255,max=Math.max(rn,gn,bn),min=Math.min(rn,gn,bn);let h,s,l=(max+min)/2;if(max===min){h=s=0}else{const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);switch(max){case rn:h=(gn-bn)/d+(gn<bn?6:0);break;case gn:h=(bn-rn)/d+2;break;default:h=(rn-gn)/d+4}h/=6}document.getElementById('cp-hsl-out').value=`hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`};
  updateCP('#7c3aed');
}

// --- COLOR PALETTE ---
function renderColorPalette(el) {
  el.innerHTML = card('Color Palette Generator', `
    <div class="input-row">
      <div><label>Base color</label><input type="color" value="#7c3aed" id="pal-base"></div>
      <div><label>Scheme</label><select id="pal-scheme"><option value="complementary">Complementary</option><option value="analogous">Analogous</option><option value="triadic">Triadic</option><option value="monochromatic">Monochromatic</option></select></div>
    </div>
    <button class="btn btn-primary btn-block" onclick="generatePalette()">🌈 Generate Palette</button>
    <div id="pal-result" style="display:flex;gap:8px;margin-top:1rem;flex-wrap:wrap"></div>
  `);
  window.generatePalette=()=>{
    const hex=document.getElementById('pal-base').value;
    const scheme=document.getElementById('pal-scheme').value;
    const r=parseInt(hex.slice(1,3),16)/255,g=parseInt(hex.slice(3,5),16)/255,b=parseInt(hex.slice(5,7),16)/255;
    const max=Math.max(r,g,b),min=Math.min(r,g,b);let h,s,l=(max+min)/2;
    if(max!==min){const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;default:h=(r-g)/d+4}h/=6}else{h=s=0}
    h*=360;s*=100;l*=100;
    let angles=[];
    if(scheme==='complementary')angles=[0,180];
    else if(scheme==='analogous')angles=[0,30,60,-30,-60];
    else if(scheme==='triadic')angles=[0,120,240];
    else angles=[0];
    const colors=[];
    if(scheme==='monochromatic'){[20,35,50,65,80].forEach(li=>colors.push(hslToHex(h,s,li)))}
    else{angles.forEach(a=>{colors.push(hslToHex((h+a+360)%360,s,l));if(scheme==='complementary'){colors.push(hslToHex(h,s,Math.max(20,l-20)));colors.push(hslToHex(h,s,Math.min(85,l+20)));colors.push(hslToHex((h+180)%360,s,Math.max(20,l-20)));colors.push(hslToHex((h+180)%360,s,Math.min(85,l+20)))}else if(scheme==='triadic'||scheme==='analogous'){colors.push(hslToHex((h+a+360)%360,s,Math.max(20,l-15)));colors.push(hslToHex((h+a+360)%360,s,Math.min(85,l+15)))}})}
    const result=document.getElementById('pal-result');
    result.innerHTML='';
    [...new Set(colors)].slice(0,10).forEach(c=>{const d=document.createElement('div');d.style.cssText=`flex:1;min-width:70px;height:80px;border-radius:10px;background:${c};cursor:pointer;transition:transform .2s;display:flex;align-items:flex-end;padding:6px`;d.title=c;const label=document.createElement('span');label.style.cssText=`font-size:0.65rem;font-weight:600;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.5);font-family:monospace`;label.textContent=c;d.appendChild(label);d.onclick=()=>{copyToClipboard(c,'Color')};d.onmouseenter=()=>d.style.transform='scale(1.05)';d.onmouseleave=()=>d.style.transform='';result.appendChild(d)});
    showToast('Palette generated!','success');
  };
  function hslToHex(h,s,l){s/=100;l/=100;const a=s*Math.min(l,1-l);const f=n=>{const k=(n+h/30)%12;const c=l-a*Math.max(Math.min(k-3,9-k,1),-1);return Math.round(255*c).toString(16).padStart(2,'0')};return `#${f(0)}${f(8)}${f(4)}`}
}

// --- WORD COUNTER ---
function renderWordCounter(el) {
  el.innerHTML = card('Word & Character Counter', `
    <textarea id="wc-text" placeholder="Start typing or paste your text here..." rows="8" oninput="updateWC()"></textarea>
    <div class="stats-row">
      <div class="stat-chip"><div class="val" id="wc-words">0</div><div class="lbl">Words</div></div>
      <div class="stat-chip"><div class="val" id="wc-chars">0</div><div class="lbl">Characters</div></div>
      <div class="stat-chip"><div class="val" id="wc-nospace">0</div><div class="lbl">No Spaces</div></div>
      <div class="stat-chip"><div class="val" id="wc-sentences">0</div><div class="lbl">Sentences</div></div>
      <div class="stat-chip"><div class="val" id="wc-para">0</div><div class="lbl">Paragraphs</div></div>
      <div class="stat-chip"><div class="val" id="wc-read">0 min</div><div class="lbl">Read Time</div></div>
    </div>
    <div class="btn-row"><button class="btn btn-secondary" onclick="document.getElementById('wc-text').value='';updateWC()">🗑 Clear</button></div>
  `);
  window.updateWC=()=>{
    const t=document.getElementById('wc-text').value;
    const words=t.trim()?t.trim().split(/\s+/).length:0;
    document.getElementById('wc-words').textContent=words;
    document.getElementById('wc-chars').textContent=t.length;
    document.getElementById('wc-nospace').textContent=t.replace(/\s/g,'').length;
    document.getElementById('wc-sentences').textContent=t.split(/[.!?]+/).filter(s=>s.trim()).length;
    document.getElementById('wc-para').textContent=t.split(/\n\n+/).filter(p=>p.trim()).length||( t.trim()?1:0);
    document.getElementById('wc-read').textContent=Math.max(1,Math.ceil(words/200))+' min';
  };
}

// --- TEXT CASE ---
function renderTextCase(el) {
  el.innerHTML = card('Text Case Converter', `
    <textarea id="tc-input" placeholder="Enter your text here..." rows="5"></textarea>
    <div class="btn-row" style="flex-wrap:wrap">
      <button class="btn btn-secondary btn-sm" onclick="tc('upper')">UPPERCASE</button>
      <button class="btn btn-secondary btn-sm" onclick="tc('lower')">lowercase</button>
      <button class="btn btn-secondary btn-sm" onclick="tc('title')">Title Case</button>
      <button class="btn btn-secondary btn-sm" onclick="tc('sentence')">Sentence case</button>
      <button class="btn btn-secondary btn-sm" onclick="tc('camel')">camelCase</button>
      <button class="btn btn-secondary btn-sm" onclick="tc('snake')">snake_case</button>
      <button class="btn btn-secondary btn-sm" onclick="tc('kebab')">kebab-case</button>
      <button class="btn btn-secondary btn-sm" onclick="tc('alternate')">aLtErNaTe</button>
    </div>
    <textarea id="tc-output" placeholder="Output will appear here..." rows="5" readonly></textarea>
    <div class="btn-row"><button class="btn btn-primary" onclick="copyToClipboard(document.getElementById('tc-output').value,'Text')">📋 Copy Output</button></div>
  `);
  window.tc=type=>{
    const t=document.getElementById('tc-input').value;let out='';
    if(type==='upper')out=t.toUpperCase();
    else if(type==='lower')out=t.toLowerCase();
    else if(type==='title')out=t.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
    else if(type==='sentence')out=t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g,c=>c.toUpperCase());
    else if(type==='camel')out=t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g,(m,c)=>c.toUpperCase());
    else if(type==='snake')out=t.toLowerCase().replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'');
    else if(type==='kebab')out=t.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
    else if(type==='alternate')out=[...t].map((c,i)=>i%2?c.toUpperCase():c.toLowerCase()).join('');
    document.getElementById('tc-output').value=out;
  };
}

// --- LOREM IPSUM ---
function renderLoremGenerator(el) {
  const lorem="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(' ');
  el.innerHTML = card('Lorem Ipsum Generator', `
    <div class="input-row">
      <div><label>Type</label><select id="li-type"><option value="para">Paragraphs</option><option value="words">Words</option><option value="sentences">Sentences</option></select></div>
      <div><label>Count</label><input type="number" id="li-count" value="3" min="1" max="20"></div>
    </div>
    <div class="btn-row"><button class="btn btn-primary" onclick="generateLorem()">✨ Generate</button></div>
    <textarea id="li-out" rows="8" readonly placeholder="Generated text will appear here..."></textarea>
    <div class="btn-row"><button class="btn btn-secondary" onclick="copyToClipboard(document.getElementById('li-out').value,'Lorem Ipsum')">📋 Copy</button></div>
  `);
  window.generateLorem=()=>{
    const type=document.getElementById('li-type').value;
    const count=parseInt(document.getElementById('li-count').value)||3;
    let out='';
    const words=()=>lorem.sort(()=>Math.random()-0.5);
    if(type==='words'){out=words().slice(0,count).join(' ')+'.';}
    else if(type==='sentences'){const sents=[];for(let i=0;i<count;i++){const w=words().slice(0,Math.floor(Math.random()*12)+8);sents.push(w[0].charAt(0).toUpperCase()+w[0].slice(1)+' '+w.slice(1).join(' ')+'.')}out=sents.join(' ');}
    else{const paras=[];for(let i=0;i<count;i++){const sents=[];for(let j=0;j<Math.floor(Math.random()*3)+3;j++){const w=words().slice(0,Math.floor(Math.random()*12)+8);sents.push(w[0].charAt(0).toUpperCase()+w[0].slice(1)+' '+w.slice(1).join(' ')+'.')}paras.push(sents.join(' '))}out=paras.join('\n\n');}
    document.getElementById('li-out').value=out;showToast('Text generated!','success');
  };
}

// --- JSON FORMATTER ---
function renderJsonFormatter(el) {
  el.innerHTML = card('JSON Formatter & Validator', `
    <textarea id="jf-input" placeholder='Paste JSON here...\n{"name":"John","age":30}' rows="7"></textarea>
    <div class="btn-row">
      <button class="btn btn-primary" onclick="formatJSON()">✨ Format</button>
      <button class="btn btn-secondary" onclick="minifyJSON()">⚡ Minify</button>
      <button class="btn btn-secondary" onclick="validateJSON()">✅ Validate</button>
    </div>
    <textarea id="jf-output" rows="7" readonly placeholder="Output..."></textarea>
    <div class="btn-row"><button class="btn btn-secondary" onclick="copyToClipboard(document.getElementById('jf-output').value,'JSON')">📋 Copy</button></div>
  `);
  window.formatJSON=()=>{try{const p=JSON.parse(document.getElementById('jf-input').value);document.getElementById('jf-output').value=JSON.stringify(p,null,2);showToast('Formatted!','success')}catch(e){showToast('Invalid JSON: '+e.message,'error')}};
  window.minifyJSON=()=>{try{const p=JSON.parse(document.getElementById('jf-input').value);document.getElementById('jf-output').value=JSON.stringify(p);showToast('Minified!','success')}catch(e){showToast('Invalid JSON','error')}};
  window.validateJSON=()=>{try{JSON.parse(document.getElementById('jf-input').value);showToast('✅ Valid JSON!','success')}catch(e){showToast('❌ Invalid: '+e.message,'error')}};
}

// --- BASE64 ---
function renderBase64Tool(el) {
  el.innerHTML = card('Base64 Encoder / Decoder', `
    <textarea id="b64-input" placeholder="Enter text to encode or Base64 to decode..." rows="5"></textarea>
    <div class="btn-row">
      <button class="btn btn-primary" onclick="b64encode()">🔐 Encode</button>
      <button class="btn btn-secondary" onclick="b64decode()">🔓 Decode</button>
    </div>
    <textarea id="b64-output" rows="5" readonly placeholder="Output..."></textarea>
    <div class="btn-row"><button class="btn btn-secondary" onclick="copyToClipboard(document.getElementById('b64-output').value,'Base64')">📋 Copy</button></div>
  `);
  window.b64encode=()=>{try{document.getElementById('b64-output').value=btoa(unescape(encodeURIComponent(document.getElementById('b64-input').value)));showToast('Encoded!','success')}catch(e){showToast('Encoding failed','error')}};
  window.b64decode=()=>{try{document.getElementById('b64-output').value=decodeURIComponent(escape(atob(document.getElementById('b64-input').value)));showToast('Decoded!','success')}catch(e){showToast('Invalid Base64','error')}};
}

// --- URL ENCODER ---
function renderUrlEncoder(el) {
  el.innerHTML = card('URL Encoder / Decoder', `
    <textarea id="url-input" placeholder="Enter URL or text to encode/decode..." rows="4"></textarea>
    <div class="btn-row">
      <button class="btn btn-primary" onclick="urlEncode()">🔗 Encode URL</button>
      <button class="btn btn-secondary" onclick="urlDecode()">🔓 Decode URL</button>
    </div>
    <textarea id="url-output" rows="4" readonly placeholder="Output..."></textarea>
    <div class="btn-row"><button class="btn btn-secondary" onclick="copyToClipboard(document.getElementById('url-output').value,'URL')">📋 Copy</button></div>
  `);
  window.urlEncode=()=>{document.getElementById('url-output').value=encodeURIComponent(document.getElementById('url-input').value);showToast('Encoded!','success')};
  window.urlDecode=()=>{try{document.getElementById('url-output').value=decodeURIComponent(document.getElementById('url-input').value);showToast('Decoded!','success')}catch(e){showToast('Invalid URL encoding','error')}};
}

// --- HASH GENERATOR ---
function renderHashGenerator(el) {
  el.innerHTML = card('Hash Generator', `
    <textarea id="hg-input" placeholder="Enter text to hash..." rows="4"></textarea>
    <div class="btn-row">
      <button class="btn btn-primary" onclick="generateHashes()">⚡ Generate All Hashes</button>
    </div>
    <div id="hg-results"></div>
  `);
  window.generateHashes=async()=>{
    const text=document.getElementById('hg-input').value;
    if(!text){showToast('Enter text first','error');return;}
    const enc=new TextEncoder();
    const data=enc.encode(text);
    const algos=['SHA-1','SHA-256','SHA-512'];
    const res=document.getElementById('hg-results');
    res.innerHTML='<div style="color:var(--text3);font-size:0.85rem;margin:0.5rem 0">Generating...</div>';
    const rows=[];
    for(const algo of algos){
      const buf=await crypto.subtle.digest(algo,data);
      const hash=[...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
      rows.push(`<div style="margin-bottom:0.75rem"><div style="font-size:0.78rem;font-weight:600;color:var(--text3);margin-bottom:4px">${algo}</div><div class="copy-group"><input type="text" value="${hash}" readonly><button class="btn btn-secondary btn-sm" onclick="copyToClipboard('${hash}','${algo}')">Copy</button></div></div>`);
    }
    res.innerHTML=rows.join('');
    showToast('Hashes generated!','success');
  };
}

// --- UNIT CONVERTER ---
function renderUnitConverter(el) {
  const units={
    Length:{m:1,km:0.001,cm:100,mm:1000,ft:3.28084,inch:39.3701,mi:0.000621371,yd:1.09361},
    Weight:{kg:1,g:1000,mg:1e6,lb:2.20462,oz:35.274,ton:0.001},
    Temperature:{special:true},
    Speed:{mps:1,'km/h':3.6,mph:2.23694,knot:1.94384}
  };
  el.innerHTML = card('Unit Converter', `
    <label>Category</label>
    <select id="uc-cat" onchange="updateUCUnits()">
      <option>Length</option><option>Weight</option><option>Temperature</option><option>Speed</option>
    </select>
    <div class="input-row">
      <div><label>From</label><select id="uc-from"></select></div>
      <div><label>To</label><select id="uc-to"></select></div>
    </div>
    <label>Value</label>
    <input type="number" id="uc-val" value="1" oninput="convertUnit()">
    <div class="result-box" id="uc-result">Result will appear here</div>
  `);
  window.updateUCUnits=()=>{
    const cat=document.getElementById('uc-cat').value;
    const u=units[cat];
    let keys=cat==='Temperature'?['Celsius','Fahrenheit','Kelvin']:Object.keys(u);
    ['uc-from','uc-to'].forEach((id,i)=>{document.getElementById(id).innerHTML=keys.map((k,j)=>`<option${j===i?'selected':''}>${k}</option>`).join('')});
    convertUnit();
  };
  window.convertUnit=()=>{
    const cat=document.getElementById('uc-cat').value;
    const from=document.getElementById('uc-from').value;
    const to=document.getElementById('uc-to').value;
    const val=parseFloat(document.getElementById('uc-val').value);
    if(isNaN(val)){document.getElementById('uc-result').textContent='Enter a number';return;}
    let result;
    if(cat==='Temperature'){
      let c;
      if(from==='Celsius')c=val;else if(from==='Fahrenheit')c=(val-32)*5/9;else c=val-273.15;
      if(to==='Celsius')result=c;else if(to==='Fahrenheit')result=c*9/5+32;else result=c+273.15;
    } else {
      const u=units[cat];result=(val/u[from])*u[to];
    }
    document.getElementById('uc-result').textContent=`${val} ${from} = ${result.toFixed(6).replace(/\.?0+$/,'')} ${to}`;
  };
  updateUCUnits();
}

// --- AGE CALCULATOR ---
function renderAgeCalculator(el) {
  el.innerHTML = card('Age Calculator', `
    <label>Date of Birth</label>
    <input type="date" id="ac-dob" max="${new Date().toISOString().split('T')[0]}">
    <button class="btn btn-primary btn-block" onclick="calcAge()">🎂 Calculate Age</button>
    <div id="ac-result" class="result-box hidden"></div>
  `);
  window.calcAge=()=>{
    const dob=new Date(document.getElementById('ac-dob').value);
    if(!document.getElementById('ac-dob').value){showToast('Select a date','error');return;}
    const now=new Date();
    let years=now.getFullYear()-dob.getFullYear();
    let months=now.getMonth()-dob.getMonth();
    let days=now.getDate()-dob.getDate();
    if(days<0){months--;days+=new Date(now.getFullYear(),now.getMonth(),0).getDate()}
    if(months<0){years--;months+=12}
    const totalDays=Math.floor((now-dob)/86400000);
    const next=new Date(now.getFullYear(),dob.getMonth(),dob.getDate());
    if(next<now)next.setFullYear(now.getFullYear()+1);
    const daysToNext=Math.ceil((next-now)/86400000);
    const r=document.getElementById('ac-result');
    r.classList.remove('hidden');
    r.innerHTML=`<strong>Age: ${years} years, ${months} months, ${days} days</strong><br>Total days alive: ${totalDays.toLocaleString()}<br>Days until next birthday: ${daysToNext}`;
  };
}

// --- PASSWORD GENERATOR ---
function renderPasswordGenerator(el) {
  el.innerHTML = card('Password Generator', `
    <div class="label-row"><span>Length</span><span id="pg-lval">16</span></div>
    <input type="range" min="4" max="64" value="16" id="pg-length" oninput="document.getElementById('pg-lval').textContent=this.value">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:1rem">
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.88rem"><input type="checkbox" id="pg-upper" checked> Uppercase (A-Z)</label>
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.88rem"><input type="checkbox" id="pg-lower" checked> Lowercase (a-z)</label>
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.88rem"><input type="checkbox" id="pg-num" checked> Numbers (0-9)</label>
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.88rem"><input type="checkbox" id="pg-sym" checked> Symbols (!@#$)</label>
    </div>
    <div class="copy-group">
      <input type="text" id="pg-out" readonly placeholder="Click Generate">
      <button class="btn btn-secondary btn-sm" onclick="copyToClipboard(document.getElementById('pg-out').value,'Password')">📋 Copy</button>
    </div>
    <div id="pg-strength" style="margin-bottom:1rem"></div>
    <button class="btn btn-primary btn-block" onclick="generatePassword()">🔒 Generate Password</button>
  `);
  window.generatePassword=()=>{
    let chars='';
    if(document.getElementById('pg-upper').checked)chars+='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if(document.getElementById('pg-lower').checked)chars+='abcdefghijklmnopqrstuvwxyz';
    if(document.getElementById('pg-num').checked)chars+='0123456789';
    if(document.getElementById('pg-sym').checked)chars+='!@#$%^&*()_+-=[]{}|;:,.<>?';
    if(!chars){showToast('Select at least one character type','error');return;}
    const len=parseInt(document.getElementById('pg-length').value);
    let pwd='';for(let i=0;i<len;i++)pwd+=chars[Math.floor(Math.random()*chars.length)];
    document.getElementById('pg-out').value=pwd;
    const strength=pwd.length>=16&&/[A-Z]/.test(pwd)&&/[a-z]/.test(pwd)&&/[0-9]/.test(pwd)&&/[^A-Za-z0-9]/.test(pwd)?'Strong':pwd.length>=10?'Medium':'Weak';
    const colors={Strong:'var(--green)',Medium:'var(--accent4)',Weak:'var(--red)'};
    document.getElementById('pg-strength').innerHTML=`<span style="font-size:0.82rem;color:${colors[strength]};font-weight:600">Strength: ${strength}</span>`;
    showToast('Password generated!','success');
  };
  generatePassword();
}

// --- UUID GENERATOR ---
function renderUUIDGenerator(el) {
  el.innerHTML = card('UUID Generator', `
    <div class="label-row"><span>Number of UUIDs</span><span id="uuid-nval">5</span></div>
    <input type="range" min="1" max="20" value="5" id="uuid-n" oninput="document.getElementById('uuid-nval').textContent=this.value">
    <button class="btn btn-primary btn-block" onclick="generateUUIDs()">🆔 Generate UUIDs</button>
    <textarea id="uuid-out" rows="8" readonly placeholder="UUIDs will appear here..."></textarea>
    <div class="btn-row"><button class="btn btn-secondary" onclick="copyToClipboard(document.getElementById('uuid-out').value,'UUIDs')">📋 Copy All</button></div>
  `);
  window.generateUUIDs=()=>{
    const n=parseInt(document.getElementById('uuid-n').value);
    const uuids=[];
    for(let i=0;i<n;i++){uuids.push('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c=='x'?r:(r&0x3|0x8)).toString(16)}))}
    document.getElementById('uuid-out').value=uuids.join('\n');showToast(`${n} UUID(s) generated!`,'success');
  };
  generateUUIDs();
}

// --- CSS GRADIENT GENERATOR ---
function renderCSSGradient(el) {
  el.innerHTML = card('CSS Gradient Generator', `
    <div class="input-row">
      <div><label>Color 1</label><input type="color" value="#7c3aed" id="cg-c1" oninput="updateGradient()"></div>
      <div><label>Color 2</label><input type="color" value="#06b6d4" id="cg-c2" oninput="updateGradient()"></div>
      <div><label>Color 3 (optional)</label><input type="color" value="#ec4899" id="cg-c3" oninput="updateGradient()"></div>
    </div>
    <div class="input-row">
      <div><label>Type</label><select id="cg-type" onchange="updateGradient()"><option value="linear">Linear</option><option value="radial">Radial</option></select></div>
      <div>
        <div class="label-row"><span>Angle</span><span id="cg-aval">135°</span></div>
        <input type="range" min="0" max="360" value="135" id="cg-angle" oninput="document.getElementById('cg-aval').textContent=this.value+'°';updateGradient()">
      </div>
    </div>
    <div id="cg-preview" style="width:100%;height:120px;border-radius:12px;margin-bottom:1rem;border:1px solid var(--border)"></div>
    <div class="copy-group"><input type="text" id="cg-css" readonly><button class="btn btn-primary btn-sm" onclick="copyToClipboard(document.getElementById('cg-css').value,'CSS')">📋 Copy CSS</button></div>
  `);
  window.updateGradient=()=>{
    const c1=document.getElementById('cg-c1').value,c2=document.getElementById('cg-c2').value,c3=document.getElementById('cg-c3').value;
    const type=document.getElementById('cg-type').value,angle=document.getElementById('cg-angle').value;
    const css=type==='linear'?`linear-gradient(${angle}deg, ${c1}, ${c2}, ${c3})`:`radial-gradient(circle, ${c1}, ${c2}, ${c3})`;
    document.getElementById('cg-preview').style.background=css;
    document.getElementById('cg-css').value=`background: ${css};`;
  };
  updateGradient();
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderTools();
  initSearch();
  document.querySelectorAll('.theme-toggle').forEach(btn => btn.addEventListener('click', toggleTheme));
});
