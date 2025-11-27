# FoodScroll

FoodScroll is a vertical video scrolling application focused on food content, similar to TikTok or Instagram Reels but tailored for foodies. It connects users with food partners (restaurants/chefs) who showcase their dishes through engaging short videos.

## 🚀 Project Overview

FoodScroll serves as a bridge between food lovers and culinary creators.
- **For Users**: It's a discovery platform where they can endlessly scroll through mouth-watering food videos, save their favorites for later, and interact with the community.
- **For Partners**: It's a marketing tool allowing restaurants, cafes, and home chefs to reach a wider audience by uploading dynamic video content instead of static images.

## ✨ Key Features

### 👤 User Features
- **Immersive Video Feed**: A TikTok-style vertical scrolling feed that auto-plays food videos.
- **Interaction**:
    - **Like**: Heart your favorite dishes to show appreciation.
    - **Comment**: Engage in discussions about the food, recipe, or restaurant.
    - **Save**: Bookmark videos to your personal collection for future reference (e.g., "Must try places").
- **Partner Discovery**: Click on a partner's profile from a video to see their full menu of videos, shop address, and details.
- **Zomato Integration**: Direct links to Zomato for immediate ordering if provided by the partner.

### 🏪 Partner Features
- **Business Profile**: Create a dedicated profile with shop name, profile picture, and address.
- **Content Management**:
    - **Upload Videos**: Share short videos of signature dishes.
    - **Metadata**: Add titles, descriptions, and direct Zomato ordering links to convert viewers into customers.
- **Portfolio**: Showcase a grid of all uploaded videos to build a brand identity.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Media**: [ImageKit.io React SDK](https://imagekit.io/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (with [Mongoose](https://mongoosejs.com/))
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: [ImageKit.io](https://imagekit.io/)
- **Security**: CORS, Bcryptjs

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <>
cd FOODSCROLL
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/foodtok  # Or your MongoDB Atlas URI
JWT_SECRET=your_super_secret_jwt_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

**Note on API Configuration**:
Currently, the API base URL is hardcoded in `frontend/src/services/api.js`. For local development, you may need to update this file to point to your local backend:
```javascript
// frontend/src/services/api.js
const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Update this line
});
```

Start the frontend development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## 🔌 API Endpoints

### Auth (`/api/auth`)
- `POST /register-user`: Register a new user
- `POST /register-partner`: Register a new food partner
- `POST /login`: Login for both users and partners

### Videos (`/api/videos`)
- `GET /all`: Get video feed (paginated)
- `POST /upload`: Upload a new video (Partner only)
- `GET /by-partner/:id`: Get videos for a specific partner
- `PUT /like/:id`: Like/Unlike a video
- `POST /comment/:id`: Add a comment
- `POST /save/:id`: Save a video

### Partner (`/api/partner`)
- `GET /profile`: Get current partner profile
- `PUT /profile`: Update partner profile

