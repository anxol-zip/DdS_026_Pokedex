import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración del proyecto de Firebase; los valores vienen de .env (ver .env.example)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
};

// Inicializamos la app y exportamos la base de datos de Firestore
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
