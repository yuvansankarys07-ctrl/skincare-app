# GLOWIQ - Your Personal Beauty Intelligence

A modern, user-friendly self-care & personal style web application that combines skincare routines, personal grooming, face analysis-based recommendations, and fashion & outfit styling with virtual try-on.

## Features

- **User Authentication**: Email/password login and Google OAuth 2.0 sign-in
- **Personalized Profiles**: Skincare, hair care, and fashion onboarding
- **Skincare Recommendations**: Personalized skincare routines based on skin type
- **Hair Care Profiles**: Hair type and scalp analysis with care recommendations
- **Fashion & Outfit Styling**: Outfit recommendations and styling tips
- **Dashboard**: Personalized overview with all care profiles
- **Secure Database**: MongoDB integration for data persistence
- **Profile Management**: View and update personal beauty profiles

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (for database)

### Installation

1. Clone the repo
   ```bash
   git clone <repo-url>
   cd skincare-app
   ```

2. Install dependencies
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

3. Setup environment variables
   - Frontend: Copy `.env.local.example` to `.env.local` and add your Google Client ID
   - Backend: Configure `.env` with MongoDB URI and JWT secret

4. Start development servers
   ```bash
   # Frontend (Terminal 1)
   npm run dev

   # Backend (Terminal 2)
   cd backend && npm start
   ```

5. Open http://localhost:5173 in your browser

### Google OAuth Setup

To enable "Continue with Google" login:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Identity Services API
4. Go to Credentials → Create OAuth 2.0 Client ID (Web Application)
5. Add authorized origins:
   - `http://localhost:5173`
   - `http://localhost:5174`
6. Add authorized redirect URIs (same as above)
7. Copy your Client ID and add to `.env.local`:
   ```
   VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   ```

### Build

```bash
npm run build
```

## Technologies

### Frontend
- React 19.2.0
- TypeScript
- Vite 7.3.1
- React Router v7.13.0
- Google OAuth 2.0 (@react-oauth/google)
- Tailwind CSS

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- Google Auth Library

## Project Structure

```
skincare-app/
├── src/
│   ├── pages/          # Page components
│   ├── components/     # Reusable components
│   ├── styles/         # CSS files
│   ├── assets/         # Static assets
│   └── main.tsx        # Entry point
├── backend/
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── middleware/     # Express middleware
│   └── server.js       # Express app
└── public/             # Static files
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/google-login` - Google OAuth login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile

### Quiz Results
- `POST /api/auth/quiz/skin` - Save skincare quiz results
- `POST /api/auth/quiz/hair` - Save hair care results
- `POST /api/auth/quiz/fashion` - Save fashion results

## Database Schema

### User Document
```javascript
{
  firstName: String,
  lastName: String,
  name: String,
  email: String(unique),
  password: String(optional for Google users),
  googleId: String(unique),
  profileImage: String,
  
  // Skincare
  skinType: String,
  skinProfile: Object,
  skinQuiz: Object,
  
  // Hair Care
  hairType: String,
  scalpType: String,
  hairProfile: Object,
  hairQuiz: Object,
  
  // Fashion
  fashionType: String,
  fashionProfile: Object,
  fashionQuiz: Object,
  
  createdAt: Date,
  updatedAt: Date
}
```

## Security

- JWT tokens with 7-day expiration
- Password hashing with bcryptjs
- Google token validation
- CORS configured for localhost development
- Protected API endpoints with auth middleware

## Disclaimer

This app provides general guidance only, not medical or professional advice.

