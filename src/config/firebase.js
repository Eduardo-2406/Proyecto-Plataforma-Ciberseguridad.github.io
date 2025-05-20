import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAaaTmb8t8dnNmBYVq1quzsr2F1HtW0r4Y",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "base-de-datos-foro-f82b6.firebaseapp.com",
  databaseURL: "https://base-de-datos-foro-f82b6-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "base-de-datos-foro-f82b6",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "base-de-datos-foro-f82b6.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "815598812065",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:815598812065:web:19137de0979df1b549a9e0",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-K28KG87S5G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

// Initialize Analytics only if supported and not blocked
let analytics = null;
isSupported().then(yes => yes && (analytics = getAnalytics(app))).catch(() => {
  console.log('Analytics no está disponible o está bloqueado');
});
export { analytics };

export default app; 