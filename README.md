# 🎤 Toastmasters Role Assignment – Frontend (Next.js)

This is the frontend for the Toastmasters Role Assignment App.  
It connects to the [API backend](https://tm-api.fly.dev) to manage meeting roles and track member progress.

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a .env.local file:

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
# For production, use:
# NEXT_PUBLIC_API_URL=https://tm-api.fly.dev
```

## 🏃 Run Locally

```bash
npm run dev
```

## 🛫 Deploy

This project is deployed on Vercel.
Push to the main branch to trigger deployment.

## 🗂️ Git Workflow

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## ✅ Notes

The API server must be running at the URL specified in NEXT_PUBLIC_API_URL.
You can switch between local and production APIs by changing the .env.local value.
