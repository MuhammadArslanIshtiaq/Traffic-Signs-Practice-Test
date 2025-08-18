import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_8r8wBkLkYApRDoUWxTOZJF-iZ0OOwz4",
  authDomain: "quizly-6a073.firebaseapp.com",
  projectId: "quizly-6a073",
  storageBucket: "quizly-6a073.firebasestorage.app",
  messagingSenderId: "492098529245",
  appId: "1:492098529245:web:33921b0f19ff30c93b3834",
  measurementId: "G-BET5QXEPSY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize other Firebase services
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app; 