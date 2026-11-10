import {
  createUserWithEmailAndPassword, // Crear usuario y contraseña
  onAuthStateChanged, // Actualización de estado en directo
  signInWithEmailAndPassword, // Acceder con usuario y contraseña
  signOut, // Cerrar sesión
} from "firebase/auth";

import { auth } from "../firebase.js";

export async function register(email, password) {
  const credencial = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return credencial.user;
}

export async function logIn(email, password) {
  const credencial = await signInWithEmailAndPassword(auth, email, password);
  return credencial.user;
}

export async function logOut() {
  await signOut(auth);
}

export function hearSession(callback) {
  return onAuthStateChanged(auth, callback);
}
