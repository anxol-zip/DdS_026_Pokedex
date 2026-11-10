import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase.js";

function collectionOf(uid) {
  return collection(db, "users", uid, "notes");
}

export async function saveNote(uid, texto) {
  await addDoc(collectionOf(uid), {
    text: texto.trim(),
    createdIn: serverTimestamp(),
  });
}

export async function loadNotes(uid) {
  const snap = await getDocs(
    query(collectionOf(uid), orderBy("createdIn", "desc")),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })); // "d" de docs, y función spread para devolver solo los ID's y los datos, es una lista
}
