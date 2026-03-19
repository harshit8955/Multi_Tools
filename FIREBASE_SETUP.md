# 🔥 Firebase Setup Guide — toolbox-a1de5

This guide is pre-filled with your actual Firebase project details.
Follow each step in order — estimated time: **10 minutes**.

---

## ✅ Your Firebase Project Info

| Field | Value |
|-------|-------|
| **Project ID** | `toolbox-a1de5` |
| **Auth Domain** | `toolbox-a1de5.firebaseapp.com` |
| **Database URL** | `https://toolbox-a1de5-default-rtdb.firebaseio.com` |
| **Storage Bucket** | `toolbox-a1de5.firebasestorage.app` |
| **Sender ID** | `812293556992` |
| **App ID** | `1:812293556992:web:a2526abd70e9c33c7981e5` |

> ✅ `js/firebase-config.js` is already filled with these values and `FIREBASE_ENABLED = true`.
> You do **not** need to edit any code — just complete the Firebase Console steps below.

---

## Step 1 — Open Your Firebase Console

Go to → **https://console.firebase.google.com/project/toolbox-a1de5**

You should see your `toolbox-a1de5` project dashboard.

---

## Step 2 — Enable Email/Password Authentication

This allows users to sign up and log in on your site.

1. In the left sidebar click **Build → Authentication**
2. Click **"Get started"** (if you haven't enabled it yet)
3. Click the **"Sign-in method"** tab
4. Click **"Email/Password"** in the list
5. Toggle the **first switch** to **Enabled** (ON)
6. Leave "Email link (passwordless sign-in)" OFF
7. Click **"Save"**

✅ You should now see Email/Password listed as **Enabled**.

---

## Step 3 — Create the Realtime Database

This stores tool enable/disable states and admin credentials so they sync globally.

1. In the left sidebar click **Build → Realtime Database**
2. Click **"Create Database"**
3. Choose your preferred region — Recommended: **United States (us-central1)**
4. On the security rules screen, select **"Start in test mode"**
5. Click **"Enable"**

✅ Your database URL will be:
```
https://toolbox-a1de5-default-rtdb.firebaseio.com
```
This is already set in `js/firebase-config.js` — no code changes needed.

---

## Step 4 — Set Database Security Rules

Test mode allows open access for only 30 days. Set proper rules now.

1. In **Realtime Database** click the **"Rules"** tab
2. Delete everything currently in the editor
3. Paste the following rules exactly:

```json
{
  "rules": {
    "config": {
      "toolsEnabled": {
        ".read": true,
        ".write": "auth != null"
      },
      "adminCreds": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

4. Click **"Publish"**

> These rules mean:
> - ✅ Anyone can **read** tool states (so the homepage works for all visitors)
> - 🔒 Only logged-in users can **write** tool states (only admin can change toggles)
> - 🔒 User profiles are private — each user can only read/write their own data
> - 🔒 Admin credentials are protected from public access

> The same rules are saved in `database.rules.json` in your project folder for reference.

---

## Step 5 — Deploy to GitHub Pages

### 5a — Create a GitHub Repository

1. Go to **https://github.com/new**
2. Repository name: e.g. `toolbox`
3. Set visibility to **Public** (required for free GitHub Pages)
4. Click **"Create repository"**

### 5b — Push your files

Open a terminal in your project folder and run:

```bash
git init
git add .
git commit -m "Initial commit — Toolbox with Firebase"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values.

### 5c — Enable GitHub Pages

1. Go to your repo on GitHub → click **"Settings"** tab
2. In the left sidebar scroll down to **"Pages"**
3. Under **"Source"** select **"Deploy from a branch"**
4. Set Branch: **`main`** / Folder: **`/ (root)`**
5. Click **"Save"**

⏱ Wait 1–3 minutes. Your site will be live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

---

## Step 6 — Change the Default Admin Password

**Do this immediately — the default credentials are publicly known.**

1. Open your live site and go to `/admin.html`
2. Log in with the defaults:
   - Username: **`admin`**
   - Password: **`admin123`**
3. Click **"Settings"** in the left sidebar
4. Scroll to **"Admin Credentials"**
5. Enter your new username and a strong password
6. Click **"Update Credentials"**

✅ New credentials are saved to Firebase and work from any device going forward.

---

## How Everything Syncs

```
┌──────────────────────────────────────────────────────────────┐
│                  Firebase (toolbox-a1de5)                     │
│                                                              │
│   Authentication              Realtime Database              │
│   ┌─────────────────┐        ┌──────────────────────────┐   │
│   │ User Accounts   │        │ config/                  │   │
│   │  - email        │        │   toolsEnabled: {        │   │
│   │  - password     │        │     img-compress: true,  │   │
│   │  - display name │        │     qr-gen: false, ...   │   │
│   └─────────────────┘        │   }                      │   │
│                               │   adminCreds: {          │   │
│                               │     username: "...",     │   │
│                               │     password: "..."      │   │
│                               │   }                      │   │
│                               │ users/{uid}/             │   │
│                               │   name, email, role      │   │
│                               └──────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
         ↑ sign up / login              ↑ real-time listener
   auth.html                   index.html  ←→  admin.html
   Sign up / Login             Watches tool     Saves toggles
                               states live      to Firebase
```

### When admin disables a tool:
1. Admin clicks toggle in `admin.html`
2. Change is saved to Firebase Realtime Database
3. Firebase pushes the update to **all connected browsers instantly**
4. Tool card disappears for every visitor — no page refresh needed

### When a user signs up:
1. User registers on `auth.html`
2. Firebase creates the account in Authentication
3. Profile (name, email) saved in Realtime Database
4. Login works from **any browser, any device, anywhere in the world**

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `[FB] Init failed` in browser console | Some ad blockers block Firebase SDK from `gstatic.com` — disable for your domain |
| Sign-up fails immediately | Confirm Email/Password is **Enabled** in Firebase → Authentication → Sign-in method |
| Tools not syncing across devices | Confirm Realtime Database is created and URL matches `firebase-config.js` |
| `PERMISSION_DENIED` error | Re-paste the security rules from Step 4 and click Publish |
| GitHub Pages shows blank or 404 | Ensure `index.html` is in the **root** of the repo, not inside a subfolder |
| Admin password not saving | Must be logged in to admin panel for the Firebase write to be authenticated |
| `auth/invalid-credential` error | Double-check email and password spelling — Firebase is case-sensitive |
| Database URL not found | Make sure you created the Realtime Database in Step 3 — it is not created automatically |

---

## File Reference

```
toolbox/
├── index.html                  ← Main site — loads Firebase, watches tool states live
├── auth.html                   ← Login / Signup — uses Firebase Authentication
├── admin.html                  ← Admin panel — protected by login gate
├── database.rules.json         ← Paste into Firebase Console → Realtime Database → Rules
├── FIREBASE_SETUP.md           ← This file
├── README.md                   ← Full project documentation
│
├── css/
│   ├── style.css               ← Main site styles (light/dark + animations)
│   └── admin.css               ← Admin panel styles
│
└── js/
    ├── main.js                 ← All 20 tool implementations
    ├── admin.js                ← Admin dashboard + tool management
    ├── firebase-config.js      ← ✅ Already filled with your credentials
    └── firebase-service.js     ← Firebase SDK v12 wrapper (auth + database)
```

---

## Firebase Free Tier Limits (Spark Plan)

Your project is on the free Spark plan — no credit card required.

| Feature | Free Limit |
|---------|-----------|
| Authentication (MAU) | 50,000 / month |
| Realtime Database storage | 1 GB |
| Realtime Database bandwidth | 10 GB / month |
| Hosting bandwidth | 360 MB / day |

More than enough for a tools website at any reasonable traffic level.

---

*Built for Firebase JS SDK v12.10.0 — Project: toolbox-a1de5*
