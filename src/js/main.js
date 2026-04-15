// 1. Importaciones (Todas arriba y sin repetir)
import { db, auth } from './firebase.js';
import { collection, addDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

// 2. Lógica de Consola para verificar conexión
console.log("Firebase conectado correctamente a la app de la Familia Reyes");

// 3. Funciones de Base de Datos (Firestore)
export const guardarDato = async (texto) => {
  try {
    const docRef = await addDoc(collection(db, "mi-coleccion"), {
      nombre: texto || "Hola Familia Reyes",
      fecha: new Date() // Es buena práctica añadir timestamps
    });
    console.log("Documento escrito con ID: ", docRef.id);
  } catch (e) {
    console.error("Error al añadir documento: ", e);
  }
};

// 4. Ejemplo de uso (Opcional: vincular a un botón en tu index.html)
// Supongamos que tienes un <button id="btnGuardar"> en tu HTML
const boton = document.getElementById('btnGuardar');
if (boton) {
    boton.addEventListener('click', () => guardarDato("Prueba desde el botón"));
}

