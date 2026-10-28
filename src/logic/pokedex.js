// Reglas de la Pokédex reunidas en un js

// Último id de Pokémon "normal" (después vienen formas especiales)
export const LAST_ID = 1025;
// Cuántos Pokémon se muestran por página
export const PAGE_SIZE = 25;
// Tamaño máximo del equipo
export const TEAM_SIZE = 6;
// Total de páginas: no depende del estado, así que puede ser constante
export const TOTAL_PAGES = Math.ceil(LAST_ID / PAGE_SIZE);

// ===== Mensajes =====
export const MESSAGES = {
  NO_NAME: "Ponle nombre a tu equipo",
  EMPTY: "Agrega al menos un Pokémon",
  OVERFLOW: "Un equipo tiene máximo ${TEAM_SIZE} miembros",
};

// ===== Paginación =====

// Reciben el offset: se recalculan cada vez que se llaman (en cada render), con el offset actual
export function isFirstPage(offset) {
  return offset === 0;
}

export function isLastPage(offset) {
  return offset + PAGE_SIZE >= LAST_ID;
}

// Número de página para mostrar: offset 0 → página 1, offset 25 → página 2...
export function getPage(offset) {
  return offset / PAGE_SIZE + 1;
}

// Movemos el offset de 25 en 25, sin bajar de 0
export function prevOffset(offset) {
  return Math.max(0, offset - PAGE_SIZE);
}

export function nextOffset(offset) {
  return offset + PAGE_SIZE;
}

// ===== Búsqueda =====

// La API solo acepta nombres en minúsculas y sin espacios a los lados
export function normalizeSearch(text) {
  return text.trim().toLowerCase();
}

// ===== Equipo =====

// ¿El equipo ya está lleno?
export function isTeamFull(team) {
  return team.length >= TEAM_SIZE;
}

// ¿Este Pokémon ya está en el equipo? Lo buscamos por id con .some()
export function isInTeam(team, pokemon) {
  return team.some((member) => member.id === pokemon.id);
}

// Añadir: si está lleno o ya está, regresamos el mismo equipo;
// si no, un arreglo nuevo con los que había más el nuevo
export function addToTeam(team, pokemon) {
  if (isTeamFull(team) || isInTeam(team, pokemon)) return team;
  return [...team, pokemon];
}

// Eliminar: .filter() regresa un arreglo nuevo sin el Pokémon con ese id
// removeFromTeam ahora no tiene acceso a Firestore, así que el deleteDoc va a ir a data/team.js
export function removeFromTeam(team, pokemon) {
  return team.filter((member) => member.id !== pokemon.id);
}
