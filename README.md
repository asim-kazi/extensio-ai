# ✦ Extensio.ai - No-Code Chrome Extension Builder

Extensio.ai is a cutting-edge platform that transforms plain English prompts into fully functional, production-ready Chrome Extensions. Powered by Gemini AI, it writes the code, packages the files into a Manifest V3 compliant ZIP, and delivers it instantly—zero coding required.

## 🚀 Features

- **AI-Powered Generation:** Translates natural language ideas into complete extension code (manifest.json, content.js, popup.html, etc.).
- **Auto-Packaging:** Node.js backend automatically compiles and zips the files securely.
- **History & Versioning:** Save, rename, and delete your generated extensions from a sleek sidebar.
- **Subscription Tiers:** Built-in limits with Free, Plus, and Pro mock subscription tiers.
- **Premium UI:** Designed with Tailwind CSS featuring glassmorphism, glowing orbs, smooth animations, and a dark mode IDE feel.

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS v4, React Router, Vite.
- **Backend:** Node.js, Express.js, PostgreSQL, Sequelize ORM.
- **AI Engine:** Google Gemini API (gemini-2.5-flash).
- **Utilities:** Archiver (for zipping), JSON/Regex sanitization.

## ⚙️ Local Setup

### 1. Prerequisites

- Node.js (v18+)
- PostgreSQL running locally

### 2. Environment Variables

Create a `.env` file in the `backend` folder:

```env
PORT=5000
DATABASE_URL=postgres://yourusername:yourpassword@localhost:5432/extensio_db
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_key
FRONTEND_URL=http://localhost:5173
```

### 3. Backend Setup

```bash
cd backend
npm install
node src/server.js
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 5. 🧩 How to Install Generated Extensions

- Extract the downloaded ZIP file.
- Go to chrome://extensions/ in Google Chrome.
- Turn on Developer Mode.
- Click Load unpacked and select the extracted folder.

### 6. 🔒 Security

Output from the AI goes through a strict sanitization process to ensure clean JSON parsing and removal of hallucinated image/base64 strings, enforcing strict Manifest V3 compliance.
