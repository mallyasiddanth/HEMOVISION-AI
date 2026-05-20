# Project: Test Workspace

## Directory Overview
This directory serves as a dedicated environment for practicing software engineering tasks, exploring codebase analysis, and experimenting with the Gemini CLI and its integrated tools. It is currently a clean workspace intended for initialization and prototyping.

## Key Files
- **GEMINI.md**: This file.
- **clinical-app/**: The main React application (Frontend).
- **backend/**: Python FastAPI application (Backend).

## Development Mandates
- **Frontend**: Vite + React (TypeScript) + Glassmorphism CSS.
- **Backend**: Python FastAPI + SQLAlchemy + SQLite.
- **API**: RESTful endpoints at `http://localhost:8000/api`.
- **Testing**: Run `npm run build` for frontend and `pytest` (if added) for backend.

## Getting Started
### 1. Start the Backend
1. Navigate to `backend/`.
2. Run `pip install -r requirements.txt`.
3. Run `python main.py`.

### 2. Start the Frontend
1. Navigate to `clinical-app/`.
2. Run `npm install`.
3. Run `npm run dev`.

## Mobile Camera Access (DEMO)
To use the live camera on mobile during a demo:
1. Ensure the frontend is running on port 5173.
2. Run `npx localtunnel --port 5173`.
3. Share the generated **HTTPS** link with your mobile device.
4. (Optional) Repeat for the backend on port 8000 if using external hosting.

