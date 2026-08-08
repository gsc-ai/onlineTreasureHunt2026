# GSC Online Treasure Hunt 2026

A modern, responsive, and real-time online treasure hunt platform developed for the Google Students Club. Built with React and Firebase, it features secure session handling, a highly accurate active-time tracking system, and a cyberpunk-inspired UI.

## Features

- **Cyberpunk UI:** Immersive, responsive design with glassmorphism, glowing text, and seamless Dark/Light mode toggles.
- **Secure Authentication:** Frictionless yet secure login system using strict Roll Number and Email validation pairs. Ensures one unique session per user.
- **Progressive Challenges:** 10 levels of cryptography, trivia, and logic puzzles.
- **Active Session Timer:** A highly precise timer that tracks *active* participation. Safely pauses if the user disconnects or refreshes, preventing unfair advantages and keeping the competition tight.
- **Real-Time Database Sync:** Stateless frontend paired with Firebase Firestore ensures no progress is lost on reload.

## Tech Stack

- **Frontend:** React.js, Vite, Framer Motion (for animations), Lucide React (for icons)
- **Styling:** Custom Vanilla CSS (Variables, Flexbox, Custom Media Queries)
- **Backend & Database:** Firebase Firestore
- **Hosting:** Firebase Hosting

## Project Structure

- `src/components/LandingScreen.jsx`: Handles user onboarding, database validation, and session initialization.
- `src/components/Timer.jsx`: Floating, fixed-position timer component calculating active elapsed milliseconds.
- `src/App.jsx`: Main application state, clue validation logic, and Firestore synchronization.
- `src/firebase.js`: Firebase SDK initialization.

## Local Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Build for production: `npm run build`
