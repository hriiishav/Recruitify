# Recruitify  

Recruitify is a **mini hiring platform** built with React that enables HR teams to manage jobs, candidates, and assessments—all without a real backend. The project simulates server-like behavior using **MSW/MirageJS** and persists data locally with **IndexedDB (via Dexie)**.  

---

## 🚀 Features  

### 🔹 Jobs Management  
- Create, edit, archive, and reorder jobs.  
- Drag-and-drop job reordering with optimistic updates & rollback on failure.  
- Server-like pagination & filtering (title, status, tags).  
- Unique slugs with validation.  
- Deep linking: `/jobs/:jobId`.  

### 🔹 Candidates Management  
- Virtualized candidate list (1000+ seeded candidates).  
- Client-side search (name/email) & server-like filter by stage.  
- Candidate profile: `/candidates/:id` with a timeline of status changes.  
- Kanban board to move candidates between stages.  
- Notes with `@mentions` support (render-only).  

### 🔹 Assessments  
- Job-specific assessment builder (add sections & questions).  
- Supported types: single-choice, multi-choice, short text, long text, numeric (with range), file upload stub.  
- Live preview of assessment forms.  
- Form runtime with validation & conditional questions.  
- Candidate responses stored locally.  

### 🔹 Tech Highlights  
- **MSW/MirageJS**: Simulated REST API with artificial latency & error rates.  
- **IndexedDB via Dexie**: All persistence is local.  
- **Optimistic UI updates** with rollback.  
- **Error handling** with retry mechanisms.  
- **Responsive UI** with drag-and-drop interactions.  

---

## 🛠️ Tech Stack  

- **Frontend:** React 18, React Router DOM 6  
- **State Management:** React Hooks, Context  
- **Database:** IndexedDB (Dexie)  
- **API Simulation:** MSW / MirageJS  
- **UI/UX:** TailwindCSS + Shadcn UI + DnD Kit  
- **Deployment:** [Vercel / Netlify]  

---

## 📂 Project Structure  

<img width="647" height="382" alt="Screenshot 2025-09-21 175352" src="https://github.com/user-attachments/assets/6a377d7b-0410-4097-a07a-dcb13962e732" />

### Install dependencies  
npm install

### Run Locally
npm run dev

## 🧪 Core API Endpoints (Simulated)  

- **Jobs**  
  - `GET /jobs?search=&status=&page=&pageSize=&sort=`  
  - `POST /jobs` → `{ id, title, slug, status, tags, order }`  
  - `PATCH /jobs/:id`  
  - `PATCH /jobs/:id/reorder`  

- **Candidates**  
  - `GET /candidates?search=&stage=&page=`  
  - `POST /candidates` → `{ id, name, email, stage }`  
  - `PATCH /candidates/:id`  
  - `GET /candidates/:id/timeline`  

- **Assessments**  
  - `GET /assessments/:jobId`  
  - `PUT /assessments/:jobId`  
  - `POST /assessments/:jobId/submit`  

---

## ✅ Deliverables  

- **Deployed App:** [Live Demo Link here](https://recruitify-olomw5q8u-hrishav-rajs-projects.vercel.app/)
- **GitHub Repo:** [Recruitify](https://github.com/hriiishav/Recruitify)  

---

## 📌 Notes & Decisions  

- All persistence is **local** → IndexedDB ensures data is available across refreshes.  
- Artificial latency (200–1200ms) & error rate (5–10%) were added to mimic real-world backend challenges.  
- Drag-and-drop (jobs & candidates) is powered by **DnD Kit**.  
- Optimistic UI patterns ensure smooth user experience with rollback on failure.  

