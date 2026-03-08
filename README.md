## Student Language Learning Hub – FBLA Website Design

This project is a **web-based language learning hub** built for the FBLA Website Design event.  
It uses a **Python FastAPI backend with file-based JSON storage** and a **React (Vite) frontend** with a **cream + dark brown, futuristic UI** designed for students **15–50 years old**.

### Tech stack

- **Backend**: Python, FastAPI, uvicorn, JSON files for storage (`data/`)
- **Frontend**: React + Vite, React Router
- **Styling**: Custom CSS, Oswald font, cream/dark brown theme, responsive layout

### Project structure

- `backend/` – FastAPI app, models, and file-based storage helpers
- `data/` – JSON files used as a simple "database" (seeded automatically on first backend start)
- `frontend/` – Vite React app (UI)
- `venv/` – Python virtual environment (created locally)

### 1. Python virtual environment & backend

From the project root (`website design`):

```bash
python3 -m venv venv
source venv/bin/activate  # On macOS / Linux
# .\venv\Scripts\activate  # On Windows PowerShell

pip install -r requirements.txt
```

Run the backend:

```bash
uvicorn backend.main:app --reload --port 8000
```

The backend will:

- Seed demo **user**, **sessions**, and **resources** into JSON files in `data/`
- Expose APIs such as:
  - `GET /api/health`
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `GET /api/dashboard`
  - `GET /api/sessions`
  - `GET /api/resources`
  - `POST /api/ai/chat` (mock AI tutor)

### 2. Frontend (React + Vite)

From the `frontend` folder:

```bash
cd "frontend"
npm install  # already done once, but safe to re-run
npm run dev
```

By default Vite runs on `http://localhost:5173`.  
The FastAPI app enables CORS for the common dev ports so the frontend can call the backend APIs.

### 3. Key UI features

- **Futuristic cream/dark-brown cockpit UI** with:
  - Live hero panel with **stock video of students** (replace the URL with your own approved footage)
  - **Horizontal gallery bar** of learning modes
  - **Hover cards** that light up with neon accents on focus/hover
  - Scrollable **sessions** and **resources** panels for calendar and library
- **Pages / sections** (React Router):
  - Dashboard (home)
  - Calendar
  - Resources
  - Community (pen pal + forums concept)
- **API integration**:
  - Dashboard pulls from `/api/dashboard`, `/api/sessions`, `/api/resources`
  - AI tutor panel posts to `/api/ai/chat` (mock text response with tips)

### 4. Accessibility & responsiveness

The UI was designed to align with **W3/WCAG-friendly practices**:

- Semantic landmarks: `header`, `main`, `section`, `nav`, `footer`
- **Keyboard support**:
  - Skip link: `Tab` from the top focuses "Skip to main content"
  - Clear focus outlines on interactive elements
  - Language selector is implemented as a `radiogroup`
- **Alt text & aria labels**:
  - Descriptive labels for the stock footage hero, gallery, and cards
  - `aria-live` on AI response text
- **Responsive layout**:
  - Mobile-first grid and flexbox
  - Navigation compresses gracefully on smaller screens
  - Scrollable rails instead of overflowing tables

For competition, you can:

- Swap in your own **stock video / images** for the hero and gallery
- Extend the backend to support **full login, calendar CRUD, forums, and pen pals**
- Enhance analytics and admin tools using the existing JSON storage structure as a starting point

# fblawebsitedesign
