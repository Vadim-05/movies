# 🎬 Movie App

A modern full-stack movie catalog platform built with React, Node.js, and PostgreSQL.  
Users can create, view, search, favorite, edit, and delete movies with image upload support.

---

## 🚀 Features

- 📄 Pagination (Load More)
- 🔍 Search movies by name
- ❤️ Add / remove favorites
- ➕ Create movies with image upload
- ✏️ Edit movie details
- ❌ Delete movies
- 📱 Responsive UI

---

## 🧱 Architecture

- Frontend communicates with backend via REST API
- Backend uses layered architecture (Controller → Service → Repository)
- PostgreSQL database
- File upload handled via Multer

---

## 🗄️ Database (PostgreSQL)

Table: `movies`

- id → integer, primary key, auto increment
- name → text, not null
- image → text, nullable
- rating → numeric(3,1), nullable
- description → text, nullable
- is_favorite → boolean, default false

---

## ⚙️ Environment Setup

### 📦 Backend (.env in /backend folder)

```env
PORT=your_port_here (e.g. 5000)
CLIENT_URL=your_frontend_url (e.g. http://localhost:5173)

DB_HOST=your_database_host (e.g. localhost)
DB_PORT=your_database_port (e.g. 5432)
DB_USER=your_database_user (e.g. postgres)
DB_PASSWORD=your_database_password
DB_NAME=your_database_name (e.g. movie)
```

### 🌐 Frontend (.env in /react-netflix folder)

```env
VITE_API_URL=your_backend_url (e.g. http://localhost:5000)
```

---

## ▶️ How to Run

Backend:  
cd backend  
npm install  
npx tsx server.ts  

Frontend:  
cd react-movies  
npm install  
npm run dev  

---

## 🔗 Project Flow

Frontend: http://localhost:5173  
Backend: http://localhost:5000  
API communication via environment variables  

---

## ⚠️ Notes

- Run backend first  
- Make sure PostgreSQL is running  
- Check `.env` if something doesn’t work  

