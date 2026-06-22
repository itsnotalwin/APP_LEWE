# Life OS — Personal Intelligence Engine

A high-fidelity, production-ready personal intelligence engine for behavioral tracking, capital management, and narrative journaling.

## 🚀 Vision: Data Sovereignty
Life OS is designed for **decades of reliable use**. 
- **100% Client-Side Persistence**: Your data never leaves your device unless you choose to export it. It is stored in your browser's IndexedDB/LocalStorage.
- **Privacy First**: No telemetry, no logs, no external servers (except for the optional AI Advisor logic).
- **Standalone PWA**: Installable as a standalone app on iOS, Android, and Desktop. Works offline.

## 🛠 Deployment Guide (Decade-Proof)

The recommended way to host this for free and forever is **GitHub Pages**.

### 1. Requirements
- A GitHub account.
- Your personal **Groq API Key** (optional, for the AI Coach).

### 2. Immediate Setup (Manual)
1. Export your app to a ZIP file from the AI Studio menu.
2. Unzip the contents.
3. Push the entire source code to a new GitHub Repository.
4. In the repository settings, go to **Pages**.
5. Set up a GitHub Action to deploy your project (usually the "Static HTML" or "Vite" template).

### 3. Professional Setup (CI/CD)
If you want to build from source automatically:
1. Ensure your `package.json` and `vite.config.ts` are in the root.
2. GitHub Actions will detect the Vite project.
3. On every push, GitHub will build the `dist/` folder and serve it as a PWA.

## 📥 Data Safety Protocol
To ensure your data survives for years:
1. **Weekly Backups**: Navigate to **OS Controls &rarr; Data Migration Sandbox** and click **Export Archive**.
2. **Cloud Storage**: Store your `.json` backups in a safe place (Google Drive, iCloud, Dropbox).
3. **Restoration**: If you clear your browser cache or switch devices, simply drop your backup file into the **Restore Archive** box in Settings.

## 🔧 AI Integration
To use the **Groq Advisor**:
1. Get an API key from [Groq](https://console.groq.com/).
2. Paste it into the **System Authentication Layer** in the Settings tab.
3. The key is stored locally in your browser.

---
*Crafted for longevity and structural efficiency.*
