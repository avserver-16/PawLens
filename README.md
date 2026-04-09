<p align="center">
  <img src="https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Express-5.2-000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/PyTorch-ViT-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" alt="PyTorch" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.2-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
</p>

# 🐾 PawLens — AI-Powered Skin Disease Detection for Dogs

**PawLens** is a full-stack web application that uses a **Vision Transformer (ViT)** deep learning model to detect and classify skin diseases in dogs from uploaded images. It provides instant AI-powered analysis with detailed diagnosis reports, severity assessments, symptom breakdowns, and treatment recommendations — all through a clean, professional dashboard.

---

## 📋 Table of Contents

- [Features](#-features)
- [Disease Classes](#-disease-classes)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [AI Model](#-ai-model)
  - [Architecture](#architecture)
  - [Dataset](#dataset)
  - [Training](#training)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [License](#-license)

---

## ✨ Features

| Feature | Description |
|---|---|
| **AI Diagnosis** | Upload a photo of your dog's skin and receive an instant diagnosis powered by a Vision Transformer model |
| **6-Class Classification** | Detects Demodicosis, Dermatitis, Fungal Infections, Hypersensitivity, Ringworm, and Healthy skin |
| **Severity Assessment** | Each diagnosis includes a severity rating (Low / Medium / High / Critical) |
| **Symptom Breakdown** | Detailed list of symptoms associated with the detected condition |
| **Treatment Recommendations** | Actionable treatment advice for each diagnosed disease |
| **Scan History** | View, search, and manage all past diagnoses with pagination |
| **Dashboard Analytics** | Overview dashboard with disease distribution, severity charts, and recent scans |
| **Image Storage** | All uploaded images are securely stored via ImageKit CDN |
| **Authentication** | JWT-based authentication with secure HTTP-only cookies |
| **Responsive Design** | Clean, modern white-themed UI that works across all devices |

---

## 🦠 Disease Classes

The model classifies canine skin conditions into **6 categories**:

| Class | Description | Severity |
|---|---|---|
| **Demodicosis** | Mange caused by Demodex mites, leading to hair loss and skin lesions | High |
| **Dermatitis** | Inflammatory skin condition with redness, swelling, and irritation | Medium |
| **Fungal Infections** | Infections caused by dermatophytes or Malassezia (e.g., yeast) | Medium |
| **Hypersensitivity** | Allergic reactions to food, pollen, dust mites, or flea saliva | Medium |
| **Ringworm** | Contagious fungal infection causing circular patches of hair loss | Medium |
| **Healthy** | Normal, healthy skin with no visible disease indicators | Low |

---

## 🛠 Tech Stack

### Frontend
- **React 19** with React Router v7
- **Tailwind CSS 4** for utility-first styling
- **Vite 7** for fast development and bundling
- **Lucide React** for iconography
- **Framer Motion** for animations
- **Axios** for HTTP requests
- **React Hot Toast** for notifications

### Backend
- **Express 5** (Node.js)
- **MongoDB Atlas** with Mongoose 9 ODM
- **JWT** for stateless authentication
- **bcryptjs** for password hashing
- **Multer** for file upload handling
- **ImageKit** SDK for cloud image storage
- **Cookie-parser** for HTTP-only cookie auth

### AI / ML
- **PyTorch** with Vision Transformer (ViT) architecture
- **Roboflow** for dataset curation and augmentation
- Custom training pipeline with hyperparameter tuning

---

## 📁 Project Structure

```
PawLens/
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── features/
│   │   │   ├── landing/        # Landing page
│   │   │   ├── auth/           # Login & Register pages + services
│   │   │   └── dashboard/      # Dashboard layout + pages
│   │   │       ├── DashboardLayout.jsx
│   │   │       └── pages/
│   │   │           ├── OverviewPage.jsx
│   │   │           ├── ScanPage.jsx
│   │   │           ├── HistoryPage.jsx
│   │   │           └── DiagnosisDetailPage.jsx
│   │   ├── components/         # ProtectedRoute, GuestRoute
│   │   ├── context/            # AuthContext provider
│   │   ├── app.routes.jsx      # Route definitions
│   │   ├── index.css           # Global styles & theme tokens
│   │   └── main.jsx            # App entry point
│   ├── index.html
│   └── package.json
│
├── backend/                    # Express API server
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── diagnosis.controller.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   └── diagnosis.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── diagnosis.routes.js
│   │   ├── middleswares/
│   │   │   └── auth.middleware.js
│   │   ├── services/
│   │   │   └── storage.service.js
│   │   ├── config/
│   │   │   └── database.js
│   │   └── app.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── pawlensai/                  # AI model training
│   ├── training_model.ipynb    # Main training notebook
│   ├── hyperparameterized_model.ipynb
│   ├── predict.ipynb           # Inference notebook
│   ├── predict_best.ipynb      # Best model inference
│   ├── web_scrapping.ipynb     # Data collection scripts
│   ├── visaulize.ipynb         # Data visualization
│   ├── best_vit_model.pth      # Best trained model weights (~327MB)
│   ├── vit_skin_disease.pth    # Base model weights (~327MB)
│   └── dataset/                # Image dataset
│       ├── train/              # 2,946 training images
│       ├── valid/              # 856 validation images
│       └── test/               # 431 test images
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm**
- **MongoDB Atlas** account (or local MongoDB instance)
- **ImageKit** account for image storage
- **Python 3.9+** and **PyTorch** (for model training only)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/avserver-16/PawLens.git
cd PawLens
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/pawlens
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
JWT_SECRET=your_jwt_secret_key
```

> **Note:** Generate a strong `JWT_SECRET` using `openssl rand -hex 32`

### Running the Application

**Start the backend server:**

```bash
cd backend
npm run dev        # Development (with nodemon)
# or
npm start          # Production
```

**Start the frontend dev server:**

```bash
cd frontend
npm run dev
```

The app will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

---

## 🧠 AI Model

### Architecture

PawLens uses a **Vision Transformer (ViT)** architecture for image classification. ViTs split images into fixed-size patches, linearly embed them, add position embeddings, and feed the sequence into a standard Transformer encoder — achieving state-of-the-art results on image classification tasks.

### Dataset

The dataset was curated using [Roboflow](https://universe.roboflow.com/errol-iylrb/dogs-skin-disease-fxh4x-j8pqs) and contains **4,233 labeled images** across 6 classes:

| Class | Train | Valid | Test | Total |
|---|---|---|---|---|
| Demodicosis | 588 | 174 | 100 | 862 |
| Ringworm | 791 | 212 | 115 | 1,118 |
| Dermatitis | 544 | 175 | 66 | 785 |
| Healthy | 492 | 139 | 69 | 700 |
| Fungal Infections | 336 | 95 | 53 | 484 |
| Hypersensitivity | 195 | 61 | 28 | 284 |
| **Total** | **2,946** | **856** | **431** | **4,233** |

**License:** CC BY 4.0

### Training

- **Framework:** PyTorch
- **Model:** Pre-trained ViT with fine-tuning on the custom dataset
- **Hyperparameter tuning:** Documented in `hyperparameterized_model.ipynb`
- **Model weights:** `best_vit_model.pth` (~327 MB)

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login and receive auth cookie | No |
| `POST` | `/api/auth/logout` | Clear auth cookie | No |
| `GET` | `/api/auth/me` | Get current user profile | Yes |

### Diagnosis

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/diagnosis` | Upload image & get diagnosis | Yes |
| `GET` | `/api/diagnosis` | Get user's diagnosis history (paginated) | Yes |
| `GET` | `/api/diagnosis/stats` | Get dashboard statistics | Yes |
| `GET` | `/api/diagnosis/:id` | Get single diagnosis details | Yes |
| `DELETE` | `/api/diagnosis/:id` | Delete a diagnosis | Yes |

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | API health check |

---

## 📸 Screenshots

### Landing Page
The landing page features a hero section, feature highlights, a 4-step process overview, and a call-to-action.

### Dashboard — Overview
A comprehensive overview with stat cards (total scans, conditions detected, healthy results, high severity), disease distribution charts, severity breakdown, and recent scan history.

### Dashboard — New Scan
Upload interface with drag-and-drop support, pet name and notes fields, and tips for best results.

### Dashboard — Scan History
Paginated history of all past diagnoses with search functionality, severity badges, and confidence scores.

### Authentication
Clean split-screen login and registration pages with form validation.

---

## 📄 License

This project is built for educational purposes. The dataset is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

---

<p align="center">
  Built by <strong>Errol D'Mello</strong>
</p>
