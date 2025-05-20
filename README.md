# 💄 Beauty Advisor Web Application

The **Beauty Advisor Web Application** is a full-stack AI-powered platform that analyzes a user’s facial features from an uploaded photo and provides personalized beauty recommendations (makeup and hairstyle). It combines computer vision, machine learning, and modern web technologies to deliver real-time, intelligent styling suggestions.

---

## 🛠️ Tech Stack

### 🔹 Frontend

* **React** – Responsive, interactive UI.
* **Axios** – API communication.
* **CSS** – Application styling.

### 🔹 Backend

* **Node.js + Express** – API routing, authentication, and communication with Python AI service.
* **Prisma ORM** – Database operations.
* **SQLite** – Lightweight database for user and recommendation storage.

### 🔹 AI Service

* **Python (Flask API)** – Image analysis service.
* **OpenCV** – Image processing.
* **MediaPipe** – Facial landmark detection.
* **NumPy** – Numerical operations.
* **Pillow** – Image file handling.

---

## 🧠 How It Works

### 👩‍💻 User Flow

1. User **registers/logs in** via the frontend (handled via backend).
2. User **uploads a photo**.
3. Frontend **sends the image** to the backend.
4. Backend **forwards the image** to the Python AI API.
5. Python API **analyzes the image**:

   * Detects face and landmarks.
   * Extracts features (face shape, skin tone, eye color, hair color, texture).
   * Generates beauty recommendations.
6. Backend **stores results** in the database.
7. Frontend **displays the recommendations**.

---

## 🧬 AI Feature Extraction (Python API)

### 🔍 Key Features Detected

* **Face Shape**: Oval, Round, Square – based on landmark ratios.
* **Skin Tone**: RGB average from cheeks.
* **Eye Color**: Sampled from eye regions.
* **Hair Color & Texture**: Sampled from image top; texture via Laplacian variance.

### 🧴 Recommendations

* **Makeup**: Foundation, blush, eyeshadow based on skin & eye color.
* **Hairstyle**: Suggestions based on face shape and hair texture.

### 🔗 API Endpoints

* `POST /api/beauty-advisor`: Upload image and get recommendations.
* `GET /api/health`: Health check.

---

## 🔧 Backend (Node.js + Express)

### 🎯 Responsibilities

* User authentication (JWT-based).
* Forwards image to Python API.
* Stores analysis results.
* Communicates with SQLite via Prisma.

### 📂 Key Files

* `server.js`: Express server.
* `routes/pythonBridge.js`: Handles image forwarding.
* `middleware/auth.js`: JWT auth middleware.

---

## 🎨 Frontend (React)

### 🚀 Responsibilities

* User authentication and image upload.
* Displays recommendations.
* Communicates with backend and handles errors.

### 🧩 Key Components

* `PhotoUpload.js`: Image upload & API request.
* `RecommendationDetail.js`: Displays results.

---

## 🗃️ Database

* **Prisma + SQLite**:

  * Stores users, images, recommendations.
  * Prisma handles migrations and schema.

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/beauty-advisor-app.git
cd beauty-advisor-app
```

### 2. Start Python AI API

```bash
cd BAapi
python api.py
```

### 3. Start Backend (Node.js)

```bash
cd BAback
npm install
npm run dev
```

### 4. Start Frontend (React)

```bash
cd BAfront
npm install
npm start
```

### 5. Open the app

Navigate to: [http://localhost:3001](http://localhost:3001)

---

## ⚠️ Error Handling

* **No Face Detected**: Handled by the Python API; user-friendly error shown on frontend.
* **Image Format**: Only JPEG/PNG supported.
* **Authentication**: JWT-based for protected routes (can be disabled during testing).

---

## 👥 Contributors

* 👩‍💻 AI Developer - \[Mariam Amgad]
* 🧑‍🎨 Frontend Developer – \[Yasmine Zidan]
* 🧠 Backend Developer – \[Roaa Alaa]

> Special thanks to **Dr. \[Hassan El Deep]** for guidance and support.

---

## 📌 Summary

This project demonstrates:

* Real-world application of AI in personalized beauty.
* End-to-end integration of AI, frontend, backend, and database.
* Scalable and modular architecture using modern web and ML tools.
