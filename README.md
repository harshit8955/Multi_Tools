# 🧰 Toolbox — All-in-One Web Tools Website

A fully-featured, free web tools website built with pure **HTML, CSS, and JavaScript** — no frameworks, no backend, no dependencies to install. Just open in a browser and it works.

---

## ✨ Features at a Glance

- 🛠️ **20+ fully working tools** across 6 categories
- 🔐 **Login & Signup system** with localStorage-based auth
- ⚙️ **Admin panel** to enable/disable tools on the main page
- 🌙 **Light & Dark theme** toggle, persisted across sessions
- 🔍 **Search & filter** tools by name or category
- 📱 **Responsive design** — works on mobile, tablet, and desktop
- ✨ **Smooth animations** — page load, hover, card transitions
- 🏗️ **Zero dependencies** — no Node.js, no npm, no build step

---

## 📁 Project Structure

```
toolbox/
├── index.html          ← Main tools website (homepage)
├── auth.html           ← Login & Signup page
├── admin.html          ← Admin panel (manage tools)
├── README.md           ← This file
│
├── css/
│   ├── style.css       ← Main site styles (light/dark + animations)
│   └── admin.css       ← Admin panel styles
│
└── js/
    ├── main.js         ← All 20 tool implementations + routing
    └── admin.js        ← Admin panel logic + dashboard
```

---

## 🚀 Getting Started

### Option 1 — Open Directly (Quickest)
Just double-click `index.html` to open it in your browser. Everything runs locally.

### Option 2 — Local Dev Server (Recommended)
If you have Python installed:
```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```
Then open `http://localhost:3000` in your browser.

Or with Node.js:
```bash
npx serve .
```

### Option 3 — Deploy to the Web
Upload all files to any static hosting provider:
- **Netlify** — drag & drop the folder at netlify.com/drop
- **Vercel** — `vercel deploy`
- **GitHub Pages** — push to a repo, enable Pages in Settings
- **Hostinger / cPanel** — upload via File Manager to `public_html/`

---

## 🧰 All Tools

### 🖼️ Image Tools
| Tool | Description |
|------|-------------|
| **Image Compressor** | Reduce image file size with quality slider. Shows original vs compressed size and % saved. Download as JPEG. |
| **Image Resizer** | Resize to exact width/height in pixels. Maintains aspect ratio option. Downloads as PNG. |
| **Image Converter** | Convert between JPEG, PNG, and WebP formats. |
| **Image to Base64** | Encode any image to a Base64 data URI string for use in HTML/CSS. |

### ⬛ Generator Tools
| Tool | Description |
|------|-------------|
| **QR Code Generator** | Generate QR codes for URLs, text, etc. Custom size and color. Download as PNG. |
| **Barcode Generator** | Generate barcodes in CODE128, EAN-13, UPC-A, CODE39, ITF-14. Custom colors. Download as SVG or PNG. |
| **Password Generator** | Strong random passwords with custom length and character sets. Strength indicator. |
| **UUID Generator** | Generate RFC-compliant UUID v4 strings in bulk. |
| **Lorem Ipsum Generator** | Generate placeholder paragraphs, sentences, or words. |

### 🎨 Design Tools
| Tool | Description |
|------|-------------|
| **Color Picker** | Pick any color, copy as HEX, RGB, or HSL. Includes preset swatches. |
| **Color Palette Generator** | Generate color palettes from a seed color using complementary, analogous, triadic, or monochromatic schemes. |
| **CSS Gradient Generator** | Create linear or radial CSS gradients with 3 color stops. Live preview. Copy CSS. |

### 📝 Text Tools
| Tool | Description |
|------|-------------|
| **Word Counter** | Count words, characters, sentences, paragraphs, and estimated reading time. |
| **Text Case Converter** | Convert to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, aLtErNaTe. |

### 💻 Developer Tools
| Tool | Description |
|------|-------------|
| **JSON Formatter** | Format (prettify), minify, and validate JSON. |
| **Base64 Encoder/Decoder** | Encode or decode text to/from Base64. |
| **URL Encoder/Decoder** | Percent-encode or decode URL strings. |
| **Hash Generator** | Generate SHA-1, SHA-256, and SHA-512 hashes from any text. |

### ⚖️ Calculator Tools
| Tool | Description |
|------|-------------|
| **Unit Converter** | Convert length, weight, temperature, and speed between common units. |
| **Age Calculator** | Calculate exact age in years/months/days + days until next birthday. |

---

## 🔐 Authentication System

The auth system is fully **client-side using localStorage** — no backend needed.

### How it works
- Users register with name, email, and password
- Passwords are stored as Base64-encoded strings (for demo purposes)
- Sessions are stored in `localStorage` (Remember Me) or `sessionStorage` (session only)
- The navbar dynamically shows Sign In/Get Started or user avatar based on session

### Files involved
- `auth.html` — login & signup UI
- `index.html` — navbar reads session and shows user menu
- `localStorage` keys:
  - `toolbox_users` — array of registered users
  - `toolbox_session` — current logged-in user (if Remember Me)
  - `sessionStorage toolbox_session` — session-only login

### Sign up a new account
1. Open `auth.html`
2. Click "Create Account" tab
3. Fill in name, email, password
4. Click "Create Free Account"

### Default admin access
There is no default user. Create one via the signup page. The admin panel (`admin.html`) is accessible to everyone in this demo — add a password check in `admin.js` to restrict it.

> ⚠️ **Security Note:** This auth system uses localStorage and is suitable for demos and prototypes. For a production app, use a real backend with hashed passwords (bcrypt), JWTs, and HTTPS.

---

## ⚙️ Admin Panel

Open `admin.html` to manage your toolbox.

### Features
| Feature | Description |
|---------|-------------|
| **Dashboard** | Overview of total tools, enabled/disabled counts, category breakdown chart |
| **Quick Toggle Grid** | Toggle any tool on/off from a single grid view |
| **Manage Tools Table** | Full table with search, category filter, status badges, enable/disable toggles |
| **Enable All / Disable All** | Bulk enable or disable every tool at once |
| **Export Config** | Download your tool toggle settings as a JSON file |
| **Import Config** | Re-apply a previously exported JSON config |
| **Reset** | Reset all settings to defaults |
| **Site Settings** | Change site name, tagline, default theme |

### How tool visibility works
- Admin toggles are saved to `localStorage` key `toolbox_enabled`
- The main `index.html` reads this on load and only shows enabled tools
- Changes take effect immediately on the next page load/refresh

---

## 🎨 Theming

The site uses CSS custom properties (variables) for both light and dark themes.

### Toggle theme
Click the 🌙 / ☀️ button in the navbar. Preference is saved to `localStorage` as `toolbox_theme`.

### Customize colors
Edit the `:root` and `[data-theme="dark"]` blocks at the top of `css/style.css`:

```css
:root {
  --accent: #7c3aed;      /* Primary purple */
  --accent2: #a855f7;     /* Secondary purple */
  --accent3: #06b6d4;     /* Cyan accent */
  --bg: #f8f6ff;          /* Page background */
  --surface: #ffffff;     /* Card background */
  /* ... */
}
```

---

## 🔧 Adding a New Tool

### Step 1 — Add to TOOLS_DATA array in `js/main.js`
```js
{ 
  id: 'my-tool', 
  name: 'My New Tool', 
  desc: 'Short description of what it does.', 
  icon: '🔧', 
  category: 'Developer',   // Image | Generator | Design | Text | Developer | Calculator
  badge: 'new',            // 'new' | 'hot' | ''
  accent: '#7c3aed', 
  accent2: '#a855f7', 
  iconBg: 'rgba(124,58,237,0.12)' 
},
```

### Step 2 — Add to renderers map in `loadToolContent()`
```js
const renderers = {
  // ... existing tools ...
  'my-tool': renderMyTool,
};
```

### Step 3 — Write the renderer function
```js
function renderMyTool(el) {
  el.innerHTML = card('My New Tool', `
    <label>Input</label>
    <input type="text" id="mt-input" placeholder="Enter something...">
    <div class="btn-row">
      <button class="btn btn-primary" onclick="runMyTool()">Run</button>
    </div>
    <div class="result-box hidden" id="mt-result"></div>
  `);

  window.runMyTool = () => {
    const val = document.getElementById('mt-input').value;
    const result = document.getElementById('mt-result');
    result.classList.remove('hidden');
    result.textContent = 'Result: ' + val.toUpperCase();
    showToast('Done!', 'success');
  };
}
```

### Step 4 — Add to Admin tools list in `js/admin.js`
```js
{ id: 'my-tool', name: 'My New Tool', icon: '🔧', category: 'Developer', badge: 'new' },
```

That's it! The tool will automatically appear on the homepage and in the admin panel.

---

## 🛠️ Helper Functions (available globally)

| Function | Usage |
|----------|-------|
| `showToast(msg, type)` | Show a notification. `type`: `'success'`, `'error'`, `'info'` |
| `copyToClipboard(text, label)` | Copy text and show success toast |
| `card(title, html)` | Wrap HTML in a styled tool card |
| `showToast('msg', 'success')` | Green toast notification |
| `goHome()` | Navigate back to the tools grid |
| `openTool(id)` | Open a tool by its ID |

---

## 📦 External Libraries Used

All libraries are loaded from CDN — no installation needed.

| Library | Version | Used For |
|---------|---------|----------|
| [QRCode.js](https://github.com/davidshimjs/qrcodejs) | 1.0.0 | QR code generation |
| [JsBarcode](https://github.com/lindell/JsBarcode) | 3.11.6 | Barcode generation |
| [Google Fonts — Syne](https://fonts.google.com/specimen/Syne) | — | Display/heading font |
| [Google Fonts — DM Sans](https://fonts.google.com/specimen/DM+Sans) | — | Body font |

Libraries are loaded lazily (only when the tool is opened), so the initial page load stays fast.

---

## 🌐 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full support |
| Firefox 88+ | ✅ Full support |
| Safari 14+ | ✅ Full support |
| Edge 90+ | ✅ Full support |
| IE 11 | ❌ Not supported |

Requires: `CSS custom properties`, `CSS Grid`, `Clipboard API`, `SubtleCrypto API` (for hash tool), `Canvas API`.

---

## 🚢 Deployment Guide

### Netlify (Recommended — Free)
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop the `toolbox/` folder
3. Your site is live instantly with a URL like `https://toolbox-abc123.netlify.app`

### GitHub Pages
```bash
# 1. Create a new GitHub repository
# 2. Push your files
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/toolbox.git
git push -u origin main

# 3. In GitHub → Settings → Pages → Source: Deploy from branch (main)
```

### Vercel
```bash
npm i -g vercel
vercel deploy
```

### cPanel / Shared Hosting
1. Compress the `toolbox/` folder to a `.zip`
2. Login to cPanel → File Manager
3. Upload and extract to `public_html/`
4. Visit `yourdomain.com` — done!

---

## 🙋 FAQ

**Q: Can I use this commercially?**
A: Yes, this is open for personal and commercial use.

**Q: Can I add my own tools?**
A: Absolutely — see the "Adding a New Tool" section above.

**Q: Is user data safe?**
A: All data stays in the user's browser localStorage. Nothing is sent to any server.

**Q: How do I connect a real backend?**
A: Replace the localStorage auth in `auth.html` with API calls to your backend (Node.js, PHP, Python, etc.). The UI is ready — just swap the data layer.

**Q: The barcode/QR tool isn't working offline?**
A: The barcode and QR tools load JS libraries from a CDN. You need an internet connection the first time, after which the browser may cache them.

---

## 📝 Changelog

### v1.0.0
- Initial release with 20 tools
- Light/dark theme
- Admin panel with tool toggle
- Login/Signup with localStorage auth
- Barcode generator (SVG + PNG download)
- QR code generator
- Full responsive design

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<div align="center">

Made with ❤️ | **Toolbox** — Your all-in-one web utility belt

</div>
