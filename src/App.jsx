import { useState, useEffect } from "react";
import "./App.css";
import { PokemonCard } from "./components/PokemonCard";

// Establecemos la API, el valor mínimo y máximo de id de Pokémon que podemos pedir
const API = "https://pokeapi.co/api/v2";
const FIRST_ID = 1;
const LAST_ID = 1025;

// Pide un Pokémon vecino; si no existe (fuera de rango o falla), regresa null
async function fetchNeighbor(n) {
  if (n < FIRST_ID || n > LAST_ID) return null;
  try {
    const response = await fetch(`${API}/pokemon/${n}`);
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}

function App() {
  // El id del Pokémon actual; empezamos en Mewtwo (#150)
  const [id, setId] = useState(150);
  // El Pokémon actual, si está cargando y si hubo error
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Vistazo del anterior y siguiente
  const [prevPokemon, setPrevPokemon] = useState(null);
  const [nextPokemon, setNextPokemon] = useState(null);

  // useEffect con [id] pide el Pokémon actual
  useEffect(() => {
    // Función asíncrona para cargar la API
    async function load() {
      setLoading(true);
      setError(null);

      // Intentar
      try {
        // Esperar la respuesta de la API
        // El fetch ya no pide "mewtwo" fijo, ahora usa `${API}/pokemon/${id}`
        const response = await fetch(`${API}/pokemon/${id}`);
        // Si la respuesta no esta ok, lanzamos un error con "throw"
        if (!response.ok)
          throw new Error(`Pokemón no encontrado (${response.status})`);
        // Si la respuesta está ok, la convertimos a JSON y la guardamos en el estado
        const data = await response.json();
        setPokemon(data);
      } catch (err) {
        // Catch captura el error y lo guarda en el estado de error
        setError(err.message);
      } finally {
        // Finally se ejecuta siempre, haya habido error o no, y pone loading en false
        setLoading(false);
      }
    }
    // Llamamos a la función asíncrona para cargar la API
    load();
    // El efecto se vuelve a ejecutar cada vez que cambia el id
  }, [id]);

  // Un segundo useEffect con [id] pide los dos vecinos al mismo tiempo con Promise.all
  useEffect(() => {
    // "ignore" evita que una respuesta vieja pise a la nueva si cambias rápido de Pokémon
    let ignore = false;
    // La función fetchNeighbor(n) pide un Pokémon.
    // Si está fuera de rango o falla, regresa null, así que nunca rompe la app.
    async function loadNeighbors() {
      const [prev, next] = await Promise.all([
        fetchNeighbor(id - 1),
        fetchNeighbor(id + 1),
      ]);
      if (!ignore) {
        setPrevPokemon(prev);
        setNextPokemon(next);
      }
    }
    loadNeighbors();
    // la función de limpieza (return () => { ignore = true }) descartan las respuestas viejas.
    return () => {
      ignore = true;
    };
    // El efecto se vuelve a ejecutar cada vez que cambia el id
  }, [id]);

  //  goPrev y goNext llaman a setId(current => current ± 1).
  // Con Math.max y Math.min el id no puede salir del rango 1–1025.
  const goPrev = () => setId((current) => Math.max(FIRST_ID, current - 1));
  const goNext = () => setId((current) => Math.min(LAST_ID, current + 1));

  console.log("component <App.jsx> rendered");
  return (
    <>
      <h1> Pokedex </h1>

      {/* Fila principal: botón, vecino anterior, tarjeta actual, vecino siguiente, botón */}
      <section className="viewer">
        {/* Los botones se desactivan con disabled en los extremos y mientras carga. */}
        <button
          className="nav-btn"
          onClick={goPrev}
          disabled={id === FIRST_ID || loading}
        >
          ◀ #{id - 1}
        </button>

        {/* Vistazo del anterior: solo se dibuja si prevPokemon no es null */}
        <div className="card-peek">
          {prevPokemon && <PokemonCard pokemon={prevPokemon} />}
        </div>

        {/* Tarjeta principal: muestra "Cargando...", el error o el Pokémon */}
        <div className="card-slot">
          {/* Llaves porque va a haber códdigo JS dentro del JSX */}
          {loading && <p> Cargando... </p>}
          {error && <p className="error"> {error} </p>}
          {pokemon && !loading && !error && <PokemonCard pokemon={pokemon} />}
        </div>

        {/* Vistazo del siguiente: solo se dibuja si nextPokemon no es null */}
        <div className="card-peek">
          {nextPokemon && <PokemonCard pokemon={nextPokemon} />}
        </div>

        <button
          className="nav-btn"
          onClick={goNext}
          disabled={id === LAST_ID || loading}
        >
          #{id + 1} ▶
        </button>
      </section>
    </>
  );
}

export default App;
