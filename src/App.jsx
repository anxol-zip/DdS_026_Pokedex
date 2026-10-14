import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { PokemonCard } from "./components/PokemonCard";
import "./App.css";

// URL base de la PokéAPI
const API = "https://pokeapi.co/api/v2";
// Último id de Pokémon "normal" (después vienen formas especiales)
const LAST_ID = 1025;
// Cuántos Pokémon se muestran por página
const PAGE_SIZE = 25;
// Tamaño máximo del equipo
const TEAM_SIZE = 6;
// Colección de Firestore donde se guarda el equipo
const TEAM_COLLECTION = "team";

function App() {
  // offset = cuántos Pokémon nos saltamos desde el inicio.
  // Página 1 → offset 0, página 2 → offset 25, página 3 → offset 50...
  const [offset, setOffset] = useState(0);
  // Los 25 Pokémon de la página actual (o el resultado de la búsqueda)
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estados para la barra de búsqueda:
  // text = lo que se va escribiendo en el input; search = lo que se busca al dar "Buscar"
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  // El equipo: un arreglo de máximo 6 Pokémon, identificados por su id
  const [team, setTeam] = useState([]);

  // useEffect con [offset, search]: se vuelve a ejecutar al cambiar de página o al buscar
  useEffect(() => {
    // "ignore" evita que una respuesta vieja pise a la nueva si cambias rápido de página
    let ignore = false;

    // Función asíncrona para cargar la API
    async function loadPokemons() {
      setLoading(true);
      setError(null);

      try {
        let list;

        if (search) {
          // Con búsqueda: pedimos directo ese Pokémon por su nombre
          const response = await fetch(`${API}/pokemon/${search}`);
          // Si la respuesta no está ok, lanzamos un error con "throw"
          if (!response.ok) {
            throw new Error(
              `No se encontró ningún Pokémon llamado "${search}"`,
            );
          }
          // Lo metemos en un arreglo de uno para dibujarlo en la misma cuadrícula
          list = [await response.json()];
        } else {
          // Sin búsqueda: pedimos la lista de 25 a partir del offset.
          // Esta lista solo trae { name, url } de cada Pokémon, no su imagen ni tipos.
          const response = await fetch(
            `${API}/pokemon?limit=${PAGE_SIZE}&offset=${offset}`,
          );
          if (!response.ok) {
            throw new Error(`Error al cargar la lista (${response.status})`);
          }
          const data = await response.json();

          // Por eso pedimos el detalle de cada uno (su url) al mismo tiempo con Promise.all.
          // Promise.all espera a que terminen las 25 peticiones y regresa un arreglo con todas.
          list = await Promise.all(
            data.results.map(async (item) => {
              const detailResponse = await fetch(item.url);
              return detailResponse.json();
            }),
          );
        }

        // Si la respuesta sigue siendo la más reciente, la guardamos en el estado
        if (!ignore) setPokemons(list);
      } catch (err) {
        // catch captura el error y lo guarda en el estado de error
        if (!ignore) setError(err.message);
      } finally {
        // finally se ejecuta siempre, haya habido error o no, y pone loading en false
        if (!ignore) setLoading(false);
      }
    }

    loadPokemons();

    // La función de limpieza marca como vieja la petición anterior
    return () => {
      ignore = true;
    };
  }, [offset, search]);

  // useEffect con []: solo se ejecuta una vez, al abrir la app, para recuperar el equipo de Firestore
  useEffect(() => {
    async function loadTeam() {
      try {
        // getDocs trae todos los documentos de la colección "team"
        const snapshot = await getDocs(collection(db, TEAM_COLLECTION));
        // Cada documento se llama como el id del Pokémon (team/150, team/25...),
        // pero solo guarda { name, img }. La tarjeta necesita tipos, altura y peso,
        // así que pedimos el detalle de cada uno a la PokéAPI al mismo tiempo con Promise.all.
        const members = await Promise.all(
          snapshot.docs.map(async (teamDoc) => {
            const response = await fetch(`${API}/pokemon/${teamDoc.id}`);
            return response.json();
          }),
        );
        setTeam(members);
      } catch (err) {
        // Si falla, lo mostramos en consola como en agregar/eliminar,
        // sin usar setError para no ocultar la cuadrícula
        console.error("Error loading the team:", err);
      }
    }

    loadTeam();
  }, []);

  // Paginación: valores derivados del offset
  const isFirstPage = offset === 0;
  const isLastPage = offset + PAGE_SIZE >= LAST_ID;
  // Número de página para mostrar: offset 0 → página 1, offset 25 → página 2...
  const page = offset / PAGE_SIZE + 1;
  const totalPages = Math.ceil(LAST_ID / PAGE_SIZE);

  // ¿El equipo ya está lleno?
  const teamFull = team.length >= TEAM_SIZE;

  // Paginación: movemos el offset de 25 en 25, sin bajar de 0
  function goToPrevPage() {
    setOffset((current) => Math.max(0, current - PAGE_SIZE));
  }

  function goToNextPage() {
    setOffset((current) => current + PAGE_SIZE);
  }

  // Búsqueda: e.preventDefault() evita que el formulario recargue la página.
  // La API solo acepta nombres en minúsculas y sin espacios a los lados.
  function handleSearch(e) {
    e.preventDefault();
    setSearch(text.trim().toLowerCase());
  }

  // Limpiar: vaciamos el input y la búsqueda, y regresamos a la cuadrícula
  function clearSearch() {
    setText("");
    setSearch("");
  }

  // ¿Este Pokémon ya está en el equipo? Lo buscamos por id con .some()
  function isInTeam(pokemon) {
    return team.some((member) => member.id === pokemon.id);
  }

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

  // Eliminar: primero se borra de Firestore con deleteDoc y luego del estado;
  // .filter() regresa un arreglo nuevo sin el Pokémon con ese id
  async function removeFromTeam(pokemon) {
    try {
      // Borramos el documento team/<id> en Firestore, igual que setDoc lo creó
      await deleteDoc(doc(db, TEAM_COLLECTION, String(pokemon.id)));
      setTeam(team.filter((member) => member.id !== pokemon.id));
    } catch (err) {
      console.error("Error removing from the team:", err);
    }
  }

  return (
    <>
      <h1>Pokédex</h1>

      {/* Barra de búsqueda: onSubmit funciona con el botón y también con Enter */}
      <form className="search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar por nombre (ej. pikachu)"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="nav-btn">
          Buscar
        </button>
        {/* El botón de limpiar solo aparece si hay una búsqueda activa */}
        {search && (
          <button type="button" className="nav-btn" onClick={clearSearch}>
            Limpiar
          </button>
        )}
      </form>

      {/* Llaves porque va a haber código JS dentro del JSX */}
      {loading && <p className="status">Cargando...</p>}
      {error && <p className="error">{error}</p>}

      {/* Equipo: una tarjeta por cada Pokémon del arreglo, con botón de eliminar */}
      <section className="team">
        <h2>
          Mi equipo ({team.length}/{TEAM_SIZE})
        </h2>
        {team.length === 0 && <p>Todavía no agregas ningún Pokémon.</p>}
        <div className="team-grid">
          {/* .map() convierte cada Pokémon del arreglo en una tarjeta; key usa el id */}
          {team.map((member) => (
            <PokemonCard
              key={member.id}
              pokemon={member}
              onRemove={removeFromTeam}
            />
          ))}
        </div>
      </section>

      {/* Cuadrícula: .map() convierte cada Pokémon del arreglo en una tarjeta */}
      {!loading && !error && (
        <section className="pokemon-grid">
          {pokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onAdd={addToTeam}
              inTeam={isInTeam(pokemon)}
              teamFull={teamFull}
            />
          ))}
        </section>
      )}

      {/* Paginación: solo tiene sentido cuando no estamos buscando */}
      {!search && (
        <nav className="pagination">
          <button
            className="nav-btn"
            onClick={goToPrevPage}
            disabled={isFirstPage || loading}
          >
            ◀ Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            className="nav-btn"
            onClick={goToNextPage}
            disabled={isLastPage || loading}
          >
            Siguiente ▶
          </button>
        </nav>
      )}
    </>
  );
}

export default App;
