import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";

// Agregar: si el equipo está lleno o el Pokémon ya está, no hacemos nada.
  // Si no, lo guardamos en Firestore con setDoc y creamos un arreglo nuevo
  // con los que ya había (...team) más el nuevo.
  async function addToTeam(pokemon) {
    if (teamFull || isInTeam(pokemon)) return;

    try {
      await setDoc(doc(db, TEAM_COLLECTION, String(pokemon.id)), {
        name: pokemon.name,
        img: pokemon.sprites.other["official-artwork"].front_default,
      });
      setTeam([...team, pokemon]);
    } catch (err) {
      console.error("Error adding to the team:", err);
    }
  }
