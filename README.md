# GlowUp

A modern, user-friendly self-care & personal style mobile/web application that combines skincare routines, personal grooming, face analysis-based recommendations, and fashion & outfit styling with virtual try-on.

## Features

- **Onboarding & Questionnaire**: Collect user info for personalization
- **AI Face Analysis**: Mock analysis for face shape, skin condition
- **Skincare Recommendations**: Personalized routines
- **Hairstyle & Beard Suggestions**: Based on preferences
- **Interactive Try-On**: Virtual hairstyle and beard try-on
- **Fashion & Outfit Styling**: Outfit recommendations
- **Virtual Outfit Try-On**: Overlay outfits on body photo
- **Dashboard**: Personalized overview
- **Product Showcase**: With user images

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repo
2. `npm install`
3. `npm run dev`
4. Open http://localhost:5173

### Build

`npm run build`

## Technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

## Disclaimer

This app provides general guidance only, not medical or professional advice.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
