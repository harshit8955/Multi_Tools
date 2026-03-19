/* ============================================================
   FIREBASE SERVICE — v12.10.0
   Handles: Auth (signup/login/logout) + Realtime DB (tools state + admin creds)
   Falls back to localStorage when offline or Firebase not ready
============================================================ */

const FB_VER = '12.10.0';
const FB_CDN = `https://www.gstatic.com/firebasejs/${FB_VER}`;

let _app   = null;
let _auth  = null;
let _db    = null;
let _ready = false;

/* ── Internal module refs (populated after dynamic import) ── */
let _authMod = null;
let _dbMod   = null;

/* ─────────────────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────────────────── */
async function initFirebase() {
  if (!window.FIREBASE_ENABLED) {
    console.info('[FB] Disabled → localStorage fallback');
    return false;
  }
  if (_ready) return true;
  try {
    const [appMod, authMod, dbMod, analyticsMod] = await Promise.all([
      import(`${FB_CDN}/firebase-app.js`),
      import(`${FB_CDN}/firebase-auth.js`),
      import(`${FB_CDN}/firebase-database.js`),
      import(`${FB_CDN}/firebase-analytics.js`),
    ]);

    _app  = appMod.initializeApp(window.FIREBASE_CONFIG);
    _auth = authMod.getAuth(_app);
    _db   = dbMod.getDatabase(_app);

    // Analytics (optional — won't break if it fails)
    try { analyticsMod.getAnalytics(_app); } catch (_) {}

    _authMod = authMod;
    _dbMod   = dbMod;
    _ready   = true;

    console.info('[FB] ✅ Ready (v' + FB_VER + ')');
    return true;
  } catch (err) {
    console.warn('[FB] Init failed → localStorage fallback:', err.message);
    return false;
  }
}

/* ─────────────────────────────────────────────────────────────
   AUTH — Sign Up
───────────────────────────────────────────────────────────── */
async function fbSignUp(name, email, password) {
  if (!_ready) return _localSignUp(name, email, password);
  const { createUserWithEmailAndPassword, updateProfile } = _authMod;
  const { ref, set } = _dbMod;
  try {
    const cred = await createUserWithEmailAndPassword(_auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await set(ref(_db, `users/${cred.user.uid}`), {
      name,
      email,
      role: 'user',
      createdAt: Date.now()
    });
    _saveLocalSession({ name, email, uid: cred.user.uid, loggedIn: true }, true);
    return { ok: true, user: { uid: cred.user.uid, name, email } };
  } catch (err) {
    return { ok: false, error: _fbErr(err.code) };
  }
}

/* ─────────────────────────────────────────────────────────────
   AUTH — Sign In
───────────────────────────────────────────────────────────── */
async function fbSignIn(email, password, remember = true) {
  if (!_ready) return _localSignIn(email, password, remember);
  const {
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
  } = _authMod;
  try {
    await setPersistence(_auth, remember ? browserLocalPersistence : browserSessionPersistence);
    const cred = await signInWithEmailAndPassword(_auth, email, password);
    const name = cred.user.displayName || email.split('@')[0];
    const sess = { name, email, uid: cred.user.uid, loggedIn: true };
    _saveLocalSession(sess, remember);
    return { ok: true, user: sess };
  } catch (err) {
    return { ok: false, error: _fbErr(err.code) };
  }
}

/* ─────────────────────────────────────────────────────────────
   AUTH — Sign Out
───────────────────────────────────────────────────────────── */
async function fbSignOut() {
  if (_ready) {
    try { await _authMod.signOut(_auth); } catch (_) {}
  }
  localStorage.removeItem('toolbox_session');
  sessionStorage.removeItem('toolbox_session');
}

/* ─────────────────────────────────────────────────────────────
   AUTH — Get current user (sync)
───────────────────────────────────────────────────────────── */
function fbGetCurrentUser() {
  if (_ready && _auth?.currentUser) {
    return {
      uid:      _auth.currentUser.uid,
      name:     _auth.currentUser.displayName || _auth.currentUser.email.split('@')[0],
      email:    _auth.currentUser.email,
      loggedIn: true
    };
  }
  return JSON.parse(
    localStorage.getItem('toolbox_session') ||
    sessionStorage.getItem('toolbox_session') ||
    'null'
  );
}

/* ─────────────────────────────────────────────────────────────
   AUTH — Watch auth state changes
───────────────────────────────────────────────────────────── */
function fbOnAuthStateChanged(callback) {
  if (!_ready) {
    callback(fbGetCurrentUser());
    return;
  }
  _authMod.onAuthStateChanged(_auth, fbUser => {
    if (fbUser) {
      callback({
        uid:      fbUser.uid,
        name:     fbUser.displayName || fbUser.email.split('@')[0],
        email:    fbUser.email,
        loggedIn: true
      });
    } else {
      callback(null);
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   DB — Save tools enabled state
───────────────────────────────────────────────────────────── */
async function fbSaveToolsState(state) {
  localStorage.setItem('toolbox_enabled', JSON.stringify(state));
  if (!_ready) return;
  const { ref, set } = _dbMod;
  try {
    await set(ref(_db, 'config/toolsEnabled'), state);
    console.info('[FB] Tools state saved to Firebase ✅');
  } catch (err) {
    console.warn('[FB] Could not save tools state:', err.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   DB — Load tools enabled state (one-time)
───────────────────────────────────────────────────────────── */
async function fbLoadToolsState() {
  if (!_ready) return _localToolsState();
  const { ref, get } = _dbMod;
  try {
    const snap = await get(ref(_db, 'config/toolsEnabled'));
    if (snap.exists()) {
      const state = snap.val();
      localStorage.setItem('toolbox_enabled', JSON.stringify(state));
      return state;
    }
  } catch (err) {
    console.warn('[FB] Load tools state failed:', err.message);
  }
  return _localToolsState();
}

/* ─────────────────────────────────────────────────────────────
   DB — Watch tools state in real-time
   Used by index.html so all visitors see changes instantly
───────────────────────────────────────────────────────────── */
function fbWatchToolsState(callback) {
  if (!_ready) {
    callback(_localToolsState());
    return;
  }
  const { ref, onValue } = _dbMod;
  onValue(ref(_db, 'config/toolsEnabled'), snap => {
    if (snap.exists()) {
      const state = snap.val();
      localStorage.setItem('toolbox_enabled', JSON.stringify(state));
      window._enabledTools = state;
      callback(state);
    } else {
      callback(_localToolsState());
    }
  }, err => {
    console.warn('[FB] Watch tools failed:', err.message);
    callback(_localToolsState());
  });
}

/* ─────────────────────────────────────────────────────────────
   DB — Save admin credentials
───────────────────────────────────────────────────────────── */
async function fbSaveAdminCreds(username, password) {
  const payload = { username: btoa(username), password: btoa(password) };
  localStorage.setItem('toolbox_admin_creds', JSON.stringify(payload));
  if (!_ready) return;
  const { ref, set } = _dbMod;
  try {
    await set(ref(_db, 'config/adminCreds'), payload);
    console.info('[FB] Admin creds saved ✅');
  } catch (err) {
    console.warn('[FB] Could not save admin creds:', err.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   DB — Load admin credentials
───────────────────────────────────────────────────────────── */
async function fbLoadAdminCreds() {
  if (!_ready) return _localAdminCreds();
  const { ref, get } = _dbMod;
  try {
    const snap = await get(ref(_db, 'config/adminCreds'));
    if (snap.exists()) {
      const creds = snap.val();
      localStorage.setItem('toolbox_admin_creds', JSON.stringify(creds));
      return creds;
    }
  } catch (err) {
    console.warn('[FB] Load admin creds failed:', err.message);
  }
  return _localAdminCreds();
}

/* ─────────────────────────────────────────────────────────────
   PRIVATE HELPERS
───────────────────────────────────────────────────────────── */
function _saveLocalSession(sess, remember) {
  const s = JSON.stringify(sess);
  if (remember) localStorage.setItem('toolbox_session', s);
  else sessionStorage.setItem('toolbox_session', s);
}

function _localSignUp(name, email, password) {
  const users = JSON.parse(localStorage.getItem('toolbox_users') || '[]');
  if (users.find(u => u.email === email))
    return { ok: false, error: 'Email already registered.' };
  users.push({ name, email, password: btoa(password), createdAt: Date.now() });
  localStorage.setItem('toolbox_users', JSON.stringify(users));
  const sess = { name, email, loggedIn: true };
  sessionStorage.setItem('toolbox_session', JSON.stringify(sess));
  return { ok: true, user: { name, email } };
}

function _localSignIn(email, password, remember) {
  const users = JSON.parse(localStorage.getItem('toolbox_users') || '[]');
  const user  = users.find(u => u.email === email);
  if (!user || user.password !== btoa(password))
    return { ok: false, error: 'Invalid email or password.' };
  const sess = { name: user.name, email, loggedIn: true };
  _saveLocalSession(sess, remember);
  return { ok: true, user: { name: user.name, email } };
}

function _localToolsState() {
  const s = localStorage.getItem('toolbox_enabled');
  return s ? JSON.parse(s) : null;
}

function _localAdminCreds() {
  const s = localStorage.getItem('toolbox_admin_creds');
  return s ? JSON.parse(s) : { username: btoa('admin'), password: btoa('admin123') };
}

function _fbErr(code) {
  const map = {
    'auth/email-already-in-use':   'Email already registered.',
    'auth/invalid-email':          'Invalid email address.',
    'auth/weak-password':          'Password must be at least 6 characters.',
    'auth/user-not-found':         'No account found with this email.',
    'auth/wrong-password':         'Incorrect password.',
    'auth/invalid-credential':     'Invalid email or password.',
    'auth/too-many-requests':      'Too many attempts. Please wait and try again.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/user-disabled':          'This account has been disabled.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}

/* ─────────────────────────────────────────────────────────────
   EXPOSE GLOBALS
───────────────────────────────────────────────────────────── */
window.initFirebase           = initFirebase;
window.fbSignUp               = fbSignUp;
window.fbSignIn               = fbSignIn;
window.fbSignOut              = fbSignOut;
window.fbGetCurrentUser       = fbGetCurrentUser;
window.fbOnAuthStateChanged   = fbOnAuthStateChanged;
window.fbSaveToolsState       = fbSaveToolsState;
window.fbLoadToolsState       = fbLoadToolsState;
window.fbWatchToolsState      = fbWatchToolsState;
window.fbSaveAdminCreds       = fbSaveAdminCreds;
window.fbLoadAdminCreds       = fbLoadAdminCreds;

/* ─────────────────────────────────────────────────────────────
   AUTO-INIT on page load
───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initFirebase().then(ready => {
    if (ready) {
      console.info('[FB] Auto-init complete');
    }
  });
});
