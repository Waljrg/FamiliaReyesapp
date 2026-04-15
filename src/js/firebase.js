// 1. Importaciones modulares
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Si usas base de datos
import { getAuth } from "firebase/auth";           // Si usas autenticación

// 2. Configuración
const firebaseConfig = {
  apiKey: "AIzaSyCRUwA2b31CsILBAmRhTRQ7xqE8aqb2_lM",
  authDomain: "familia-reyess.firebaseapp.com",
  databaseURL: "https://familia-reyess-default-rtdb.firebaseio.com",
  projectId: "familia-reyess",
  storageBucket: "familia-reyess.firebasestorage.app",
  messagingSenderId: "109313819653",
  appId: "1:109313819653:web:bc46b01f69dfa3e690886c",
  measurementId: "G-NKWGWPGRTT"
};

// 3. Inicialización
const app = initializeApp(firebaseConfig);

// 4. Exportar servicios listos para usar
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export default app;
