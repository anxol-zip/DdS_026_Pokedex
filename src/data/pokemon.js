// Acceso a la PokéAPI. Funciones normales de JavaScript
// Regresan los datos o lanzan un error; App decide qué hacer con él
import { PAGE_SIZE } from "../logic/pokedex";

// URL base de la PokéAPI
const API = "https://pokeapi.co/api/v2";

// Un Pokémon por su nombre o su id (pikachu, 25...)
export async function fetchPokemon(nameOrId) {
  const response = await fetch(`${API}/pokemon/${nameOrId}`);
  // Si la respuesta no está ok, lanzamos un error con "throw"
  if (!response.ok) {
    throw new Error(
      `No se encontró ningún Pokémon con nombre o ID:  "${nameOrId}"`,
    );
  }
  return response.json();
}

// Los 25 Pokémon de una página, a partir del offset
export async function fetchPokemonPage(offset) {
  const response = await fetch(
    `${API}/pokemon?limit=${PAGE_SIZE}&offset=${offset}`,
  );
  if (!response.ok) {
    throw new Error(`Error al cargar la lista (${response.status})`);
  }
  const data = await response.json();

  // La lista solo trae { name, url } de cada Pokémon, no su imagen ni tipos.
  // Por eso pedimos el detalle de cada uno al mismo tiempo con Promise.all.
  return Promise.all(
    data.results.map(async (item) => {
      const detailResponse = await fetch(item.url);
      return detailResponse.json();
    }),
  );
}
