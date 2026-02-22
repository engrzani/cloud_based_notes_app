# Cloud Notes — Secure Cloud-Based Note-Taking Application

A secure, cloud-based note-taking web application inspired by Google Keep. Built with React.js and Firebase (Authentication + Cloud Firestore).

## Features

- **OAuth 2.0 Authentication** — Sign in with Google or Microsoft accounts (no passwords stored)
- **CRUD Notes** — Create, view, edit, and delete personal notes
- **Real-time Sync** — Notes update instantly across devices via Cloud Firestore
- **Search** — Filter notes by title or content
- **Color Labels** — Assign colors to notes for visual organization
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Security Rules** — Firestore rules ensure users can only access their own data

## Tech Stack

| Layer          | Technology                       |
| -------------- | -------------------------------- |
| Frontend       | React.js (Vite), JavaScript, CSS |
| Authentication | Firebase Auth (OAuth 2.0)        |
| Database       | Cloud Firestore (NoSQL)          |
| Hosting        | Firebase Hosting (optional)      |

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A [Firebase project](https://console.firebase.google.com/)

## Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.

2. **Enable Authentication providers:**
   - Navigate to **Authentication → Sign-in method**
   - Enable **Google** provider
   - Enable **Microsoft** provider (requires Azure AD app registration — see below)

3. **Create a Cloud Firestore database:**
   - Navigate to **Firestore Database → Create database**
   - Choose **Production mode**
   - Deploy the security rules from `firestore.rules` in this project

4. **Register a Web App:**
   - Go to **Project Settings → General → Your apps → Add app → Web**
   - Copy the Firebase config values

5. **Microsoft OAuth Setup (Azure AD):**
   - Go to [Azure Portal](https://portal.azure.com/) → Azure Active Directory → App Registrations
   - Register a new application
   - Add a redirect URI: `https://<your-project-id>.firebaseapp.com/__/auth/handler`
   - Copy the **Application (client) ID** and **Client secret**
   - Paste them into the Firebase Console under Authentication → Microsoft provider

## Installation

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
```

Edit the `.env` file with your Firebase config values:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Running the Application

```bash
cd frontend
npm run dev
```

The app will open at **http://localhost:3000**.

## Deploying Firestore Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

## Project Structure

```
cloud_based_note_taking_application/
├── firebase.json              # Firebase project config
├── firestore.rules            # Firestore security rules
├── README.md
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── .env.example           # Template for environment variables
    ├── public/
    │   └── favicon.svg
    └── src/
        ├── main.jsx           # App entry point
        ├── App.jsx            # Router & auth provider setup
        ├── App.css            # Global styles
        ├── firebase.js        # Firebase initialization
        ├── contexts/
        │   └── AuthContext.jsx # Auth state management
        └── components/
            ├── Auth/
            │   ├── Login.jsx          # Login page (Google + Microsoft)
            │   ├── Login.css
            │   └── ProtectedRoute.jsx # Route guard
            ├── Layout/
            │   ├── Header.jsx         # App header with user info
            │   └── Header.css
            └── Notes/
                ├── Dashboard.jsx      # Main notes dashboard
                ├── Dashboard.css
                ├── NoteForm.jsx       # Create new note
                ├── NoteForm.css
                ├── NoteCard.jsx       # Individual note (view/edit/delete)
                └── NoteCard.css
```

## Security

- **No passwords stored** — Authentication is handled entirely by Firebase Auth via OAuth 2.0
- **Firestore Security Rules** — Users can only read, create, update, and delete their own notes
- **User isolation** — Each note is linked to a `userId` field that must match the authenticated user's UID
