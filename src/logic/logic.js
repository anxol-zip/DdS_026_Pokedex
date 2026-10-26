// URL base de la PokéAPI
export const API = "https://pokeapi.co/api/v2";
// Último id de Pokémon "normal" (después vienen formas especiales)
export const LAST_ID = 1025;
// Cuántos Pokémon se muestran por página
export const PAGE_SIZE = 25;
// Tamaño máximo del equipo
export const TEAM_SIZE = 6;
// Colección de Firestore donde se guarda el equipo
export const TEAM_COLLECTION = "team";

// Paginación: valores derivados del offset
export const isFirstPage = offset === 0;
export const isLastPage = offset + PAGE_SIZE >= LAST_ID;
// Número de página para mostrar: offset 0 → página 1, offset 25 → página 2...
export const page = offset / PAGE_SIZE + 1;
export const totalPages = Math.ceil(LAST_ID / PAGE_SIZE);

// ¿El equipo ya está lleno?
export const teamFull = team.length >= TEAM_SIZE;

// Paginación: movemos el offset de 25 en 25, sin bajar de 0
export function goToPrevPage() {
  setOffset((current) => Math.max(0, current - PAGE_SIZE));
}

export function goToNextPage() {
  setOffset((current) => current + PAGE_SIZE);
}

// Búsqueda: e.preventDefault() evita que el formulario recargue la página.
// La API solo acepta nombres en minúsculas y sin espacios a los lados.
export function handleSearch(e) {
  e.preventDefault();
  setSearch(text.trim().toLowerCase());
}

// Limpiar: vaciamos el input y la búsqueda, y regresamos a la cuadrícula
export function clearSearch() {
  setText("");
  setSearch("");
}

// ¿Este Pokémon ya está en el equipo? Lo buscamos por id con .some()
export function isInTeam(pokemon) {
  return team.some((member) => member.id === pokemon.id);
}

// Eliminar: primero se borra de Firestore con deleteDoc y luego del estado;
// .filter() regresa un arreglo nuevo sin el Pokémon con ese id
export async function removeFromTeam(pokemon) {
  try {
    // Borramos el documento team/<id> en Firestore, igual que setDoc lo creó
    await deleteDoc(doc(db, TEAM_COLLECTION, String(pokemon.id)));
    setTeam(team.filter((member) => member.id !== pokemon.id));
  } catch (err) {
    console.error("Error removing from the team:", err);
  }
}
