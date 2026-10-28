import { useEffect, useState } from "react";
import { PokemonCard } from "./components/PokemonCard";
import "./App.css";
import {
  TEAM_SIZE,
  TOTAL_PAGES,
  isFirstPage,
  isLastPage,
  getPage,
  prevOffset,
  nextOffset,
  normalizeSearch,
  isTeamFull,
  isInTeam,
  addToTeam,
  removeFromTeam,
} from "./logic/pokedex";
import { fetchPokemon, fetchPokemonPage } from "./data/pokemon";
import { loadTeam, saveTeamMember, deleteTeamMember } from "./data/team";

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
        const list = search
          ? [await fetchPokemon(search)]
          : await fetchPokemonPage(offset);

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
    async function showTeam() {
      try {
        const members = await loadTeam();
        setTeam(members);
      } catch (err) {
        // Si falla, lo mostramos en consola como en agregar/eliminar,
        // sin usar setError para no ocultar la cuadrícula
        console.error("Error loading the team:", err);
      }
    }

    showTeam();
  }, []);

  // Valores derivados: se calculan en cada render
  const teamFull = isTeamFull(team);

  const goToPrevPage = () => setOffset((current) => prevOffset(current));
  const goToNextPage = () => setOffset((current) => nextOffset(current));

  function handleSearch(e) {
    e.preventDefault();
    setSearch(normalizeSearch(text));
  }

  function clearSearch() {
    setText("");
    setSearch("");
  }

  // Agregar: primero se guarda en Firestore y solo después se actualiza el estado,
  // así la pantalla no muestra un cambio que no se guardó
  async function handleAdd(pokemon) {
    if (isTeamFull(team) || isInTeam(team, pokemon)) return;

    try {
      await saveTeamMember(pokemon);
      setTeam((prev) => addToTeam(prev, pokemon));
    } catch (err) {
      console.error("Error adding to the team:", err);
    }
  }

  // Eliminar: mismo orden, primero Firestore y luego el estado
  async function handleRemove(pokemon) {
    try {
      await deleteTeamMember(pokemon.id);
      setTeam((prev) => removeFromTeam(prev, pokemon));
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
              onRemove={handleRemove}
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
              onAdd={handleAdd}
              inTeam={isInTeam(team, pokemon)}
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
            disabled={isFirstPage(offset) || loading}
          >
            ◀ Anterior
          </button>
          <span>
            Página {getPage(offset)} de {TOTAL_PAGES}
          </span>
          <button
            className="nav-btn"
            onClick={goToNextPage}
            disabled={isLastPage(offset) || loading}
          >
            Siguiente ▶
          </button>
        </nav>
      )}
    </>
  );
}

export default App;
