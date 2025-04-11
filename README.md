# Monaco Web - E-commerce Clothing Catalog

React-based clothing catalog for an online store. Features product listings and Firebase integration.

## 🚀 Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites

- Node.js (v14+ recommended)
- Firebase project setup

### Firebase Configuration

1. Create a `.env` file in the root directory with your Firebase credentials:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```
2. Set up the Firebase configuration file at src/firebase.js:
```
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
```

## 🛠 Available Scripts

### `npm start`
Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view in browser.

### `npm run build`
Builds the app for production to the `build` folder.

## 🔒 Security Best Practices
**Never commit** sensitive files to version control. Ensure:

✔️ `.env` is listed in your `.gitignore` file  
✔️ Firebase security rules are properly configured  
✔️ All API keys are stored as environment variables  

## 📚 Learn More
- [React Documentation](https://reactjs.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Security Rules Guide](https://firebase.google.com/docs/rules)
