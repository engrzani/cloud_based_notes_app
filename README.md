# Cloud Notes — Secure Cloud-Based Note-Taking Application

A secure, cloud-based note-taking web application inspired by Google Keep. Built with React.js and Firebase (Authentication + Cloud Firestore).

## Features

- **OAuth 2.0 Authentication** — Sign in with Google or Microsoft accounts (no passwords stored)
- **CRUD Notes** — Create, view, edit, and delete personal notes
- **Real-time Sync** — Notes update instantly across devices via Cloud Firestore
- **Search** — Filter notes by title or content
- **Color Coding** — Assign colors to notes for visual organization
- **Labels** — Organize notes with custom labels
- **Reminders** — Set date and time reminders for notes
- **Pin Notes** — Keep important notes at the top
- **Archive** — Archive notes to keep dashboard clean
- **Trash** — Soft delete with restore capability
- **Image Attachments** — Add images to notes
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Security Rules** — Firestore rules ensure users can only access their own data

## Quick Start

```bash
# Clone the repository
git clone https://github.com/engrzani/cloud_based_notes_app.git
cd cloud_based_note_taking_application

# Install dependencies
cd frontend
npm install

# Set up Firebase configuration (see below)
# Create .env file with your Firebase credentials

# Run development server
npm run dev
```

Visit **http://localhost:5173** in your browser

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

## Firebase Setup (Step-by-Step)

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "My Cloud Notes")
4. Accept terms and click **"Continue"**
5. Disable Google Analytics (optional) and click **"Create project"**
6. Wait for the project to be created, then click **"Continue"**

### 2. Enable Authentication

1. In Firebase Console, click **"Authentication"** from the left menu
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **Google** provider:
   - Click on "Google"
   - Toggle "Enable"
   - Add a support email
   - Click "Save"
5. Enable **Microsoft** provider (optional):
   - Click on "Microsoft"
   - Toggle "Enable"
   - Follow Azure AD setup instructions (see below)

### 3. Create Firestore Database

1. Click **"Firestore Database"** from the left menu
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose a location (select closest to your users)
5. Click **"Enable"**

### 4. Register Web App

1. In Firebase Console, click the **gear icon** → **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** `</>`
4. Enter an app nickname (e.g., "Cloud Notes Web")
5. Check **"Also set up Firebase Hosting"** (optional)
6. Click **"Register app"**
7. **Copy the Firebase configuration** (you'll need this for `.env` file):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 5. Configure Environment Variables

1. Create a `.env` file in the `frontend/` directory:

```bash
cd frontend
touch .env  # or manually create the file
```

2. Add your Firebase credentials to `.env`:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 6. Deploy Firestore Security Rules

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init

# Select: Firestore, Hosting
# Use existing files: firestore.rules, firebase.json
# Set public directory: frontend/dist

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

### 7. Microsoft OAuth Setup (Optional)

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** → **App Registrations** → **New registration**
3. Enter application name
4. Add redirect URI: `https://your-project.firebaseapp.com/__/auth/handler`
5. Click **"Register"**
6. Copy the **Application (client) ID**
7. Go to **Certificates & secrets** → **New client secret**
8. Copy the **Client secret value**
9. In Firebase Console → Authentication → Microsoft provider:
   - Paste **Client ID** and **Client secret**
   - Click **"Save"**

## Available Commands

### Development

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server (with hot reload)
npm run dev
# App runs at http://localhost:5173

# Build for production
npm run build
# Output: frontend/dist/

# Preview production build locally
npm run preview
```

### Firebase Deployment

```bash
# Deploy everything (hosting + Firestore rules)
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy to specific project
firebase deploy --project your-project-id
```

### Git Commands

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main
```

## Project Structure

```
cloud_based_note_taking_application/
├── firebase.json              # Firebase hosting & Firestore config
├── firestore.rules            # Firestore security rules
├── vercel.json                # Vercel deployment config
├── README.md                  # Project documentation
│
└── frontend/                  # React application
    ├── index.html             # HTML entry point
    ├── package.json           # Dependencies and scripts
    ├── vite.config.js         # Vite configuration
    ├── .env                   # Environment variables (create this)
    │
    ├── public/                # Static assets
    │   └── favicon.svg
    │
    └── src/                   # Source code
        ├── main.jsx           # App entry point
        ├── App.jsx            # Router & auth provider setup
        ├── App.css            # Global styles
        ├── firebase.js        # Firebase initialization
        │
        ├── contexts/          # React Context providers
        │   └── AuthContext.jsx         # Auth state management
        │
        └── components/        # React components
            │
            ├── Auth/          # Authentication components
            │   ├── Login.jsx           # Login page (Google/Microsoft)
            │   ├── Login.css           # Login page styles
            │   └── ProtectedRoute.jsx  # Route protection wrapper
            │
            ├── Layout/        # Layout components
            │   ├── Header.jsx          # App header with search
            │   ├── Header.css          # Header styles
            │   ├── Sidebar.jsx         # Navigation sidebar
            │   └── Sidebar.css         # Sidebar styles
            │
            └── Notes/         # Note components
                ├── Dashboard.jsx       # Main dashboard (note list & grid)
                ├── Dashboard.css       # Dashboard styles
                ├── NoteForm.jsx        # Create new note form
                ├── NoteForm.css        # Note form styles
                ├── NoteCard.jsx        # Individual note card
                ├── NoteCard.css        # Note card styles
                ├── NoteModal.jsx       # Edit note modal
                ├── NoteModal.css       # Modal styles
                ├── EditLabels.jsx      # Label management modal
                ├── EditLabels.css      # Label modal styles
                └── noteColors.js       # Color palette constants
```

## Key Files Explained

| File/Folder | Purpose |
|------------|---------|
| `firebase.json` | Firebase configuration for hosting and Firestore |
| `firestore.rules` | Security rules for Firestore database |
| `frontend/src/firebase.js` | Firebase SDK initialization |
| `frontend/src/contexts/AuthContext.jsx` | Global auth state management |
| `frontend/src/components/Auth/Login.jsx` | Login UI with OAuth providers |
| `frontend/src/components/Notes/Dashboard.jsx` | Main app interface with filtering |
| `frontend/src/components/Notes/NoteCard.jsx` | Individual note with actions (pin, archive, delete, etc.) |
| `frontend/src/components/Notes/NoteModal.jsx` | Full-screen note editor |
| `frontend/.env` | Environment variables (API keys) - **NOT committed to Git** |

## Deployment

### Firebase Hosting (Recommended)

Firebase Hosting provides fast, secure hosting for your web app with automatic SSL.

```bash
# 1. Build the production app
cd frontend
npm run build

# 2. Deploy to Firebase
cd ..
firebase deploy --only hosting

# Your app will be available at:
# https://your-project-id.web.app
# https://your-project-id.firebaseapp.com
```

### Vercel Deployment

Deploy to Vercel for automatic deployments on every Git push.

#### Option 1: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect `vercel.json` configuration
5. Add environment variables from your `.env` file
6. Click **"Deploy"**

#### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables for Production

When deploying, make sure to add these environment variables in your hosting platform:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Security

- **No passwords stored** — Authentication is handled entirely by Firebase Auth via OAuth 2.0
- **Firestore Security Rules** — Users can only read, create, update, and delete their own notes
- **User isolation** — Each note is linked to a `userId` field that must match the authenticated user's UID
- **Environment variables** — Sensitive Firebase config is stored in `.env` (not committed to Git)

## Firestore Security Rules

The `firestore.rules` file ensures data security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{noteId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                      request.auth.uid == request.resource.data.userId;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == userId;
    }
  }
}
```

## Features in Detail

### Note Management
- Create, edit, and delete notes
- Rich text support
- Image attachments
- Color coding (8 color options)
- Custom labels

### Organization
- **Pin notes** to keep them at the top
- **Archive** notes to declutter your view
- **Trash** with restore capability
- **Labels** for categorization
- **Search** across all notes

### Reminders
- Set custom date and time reminders
- Quick options: Today, Tomorrow, Next week
- Visual reminder badges on notes
- Easy reminder removal

### Views
- **Notes** - Active notes
- **Reminders** - Notes with reminders
- **Labels** - Filter by label
- **Archive** - Archived notes
- **Trash** - Deleted notes (restore or permanently delete)

## Troubleshooting

### Common Issues

**Problem:** `firebase.js` says "No Firebase App"
- **Solution:** Make sure `.env` file exists in `frontend/` directory with all Firebase config values

**Problem:** Authentication not working
- **Solution:** Check that Google/Microsoft providers are enabled in Firebase Console → Authentication

**Problem:** Notes not saving
- **Solution:** Deploy Firestore security rules using `firebase deploy --only firestore:rules`

**Problem:** Build errors
- **Solution:** Delete `node_modules` and `package-lock.json`, then run `npm install` again

**Problem:** Port already in use
- **Solution:** Kill the process on port 5173 or use `npm run dev -- --port 3000`

### Clearing Firebase Cache

```bash
firebase logout
firebase login
firebase use --add
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/engrzani/cloud_based_notes_app/issues)

---

Made with ❤️ by [Zeenat Umer](https://github.com/engrzani)
