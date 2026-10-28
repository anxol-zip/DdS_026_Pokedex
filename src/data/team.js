// Acceso a Firestore para el equipo.
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { fetchPokemon } from "./pokemon";

// Colección de Firestore donde se guarda el equipo: team/{idDelPokemon}
const TEAM_COLLECTION = "team";

// Trae el equipo guardado.
// Cada documento se llama como el id del Pokémon
// pero solo guarda { name, img }. La tarjeta necesita tipos, altura y peso, así que pedimos el detalle de cada uno a la PokéAPI al mismo tiempo con Promise.all
export async function loadTeam() {
  const snapshot = await getDocs(collection(db, TEAM_COLLECTION));
  return Promise.all(snapshot.docs.map((teamDoc) => fetchPokemon(teamDoc.id)));
}

// Guarda un Pokémon en team/{id} con setDoc
export async function saveTeamMember(pokemon) {
  await setDoc(doc(db, TEAM_COLLECTION, String(pokemon.id)), {
    name: pokemon.name,
    img: pokemon.sprites.other["official-artwork"].front_default,
  });
}

// Borra el documento team/{id}, igual que setDoc lo creó
export async function deleteTeamMember(id) {
  await deleteDoc(doc(db, TEAM_COLLECTION, String(id)));
}
