# PRIS (Product Review Intelligence System)

PRIS is an Aspect-Based Sentiment Analysis (ABSA) system designed to extract granular, feature-level insights from e-commerce product reviews beyond aggregate star ratings[cite: 1]. The system uses unsupervised topic modeling (BERTopic/LDA) paired with VADER sentiment scoring, surfaced through a decoupled Django REST API and React dashboard.

---

## Repository Structure

```text
PRIS/
├── backend/          # Django REST Framework API
├── frontend/         # React (Vite) + Tailwind CSS client
├── nlp_pipeline/     # Topic modeling & sentiment analysis scripts
├── LICENSE
└── README.md
```

---

## Prerequisites

Ensure you have the following installed locally:
* **Python 3.10+**
* **Node.js 18+ & npm**
* **Git**

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/asmit-mit/PRIS.git
cd PRIS
```

---

### 2. Backend Setup (Django REST Framework)

Open a terminal and set up the Python virtual environment:

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python3 -m venv env
source env/bin/activate       # On Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations api
python manage.py migrate

# Seed mock Amazon review dataset
python manage.py seed_data

# Start backend server (runs at http://127.0.0.1:8000)
python manage.py runserver
```

---

### 3. Frontend Setup (React + Vite)

Open a **separate terminal window** and run:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server (runs at http://localhost:5173)
npm run dev
```

Open **`http://localhost:5173`** in your browser.

---

## Tech Stack

* **Frontend:** React (Vite), Tailwind CSS, Lucide Icons, Axios
* **Backend:** Python, Django, Django REST Framework, Django Filter, CORS Headers
* **NLP & Analytics:** BERTopic, Gensim (LDA), NLTK (VADER), spaCy, pandas
* **Database:** SQLite (Development)

---

## Project Team & Mentorship

* **Mentor & Guide:** Dr. Archana Praveen Kumar (SCE, MIT Manipal)
* **Team Members:**
  * Aditya Anand Baranwal (230905178)
  * Asmit Paul (230905368)
  * Harshith Goppu (230968380)