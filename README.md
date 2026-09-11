# Projects

This repository contains:

- `calculator/` — calculator PWA.
- Volny Amur tourism website — Django backend and Vue frontend developed in separate pull requests.

## Volny Amur structure

- `src/`, `public/`, `index.html`, `vite.config.js` — Vue frontend.
- `amur_site/`, `content/`, `manage.py` — Django backend and API.
- `deploy/` — Nginx and systemd production configuration.
- `.env.example` — environment variable template without secrets.

## Local development

```powershell
npm install
npm run build
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```

Website: http://127.0.0.1:8000  
Django Admin: http://127.0.0.1:8000/admin/
