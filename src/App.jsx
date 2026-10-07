import { useState, useEffect } from "react";
import "./App.css";
import { PokemonCard } from "./components/PokemonCard";

const API = "https://pokeapi.co/api/v2";

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función asíncrona para cargar la API
    async function load() {
      setLoading(true);
      setError(null);

      // Intentar
      try {
        // Esperar la respuesta de la API
        const response = await fetch(`${API}/pokemon/mewtwo`);
        // Si la respuesta no esta ok, lanzamos un error con "throw"
        if (!response.ok)
          throw new Error(`Pokemón no encontrado (${res.status})`);
        const data = await response.json();
        setPokemon(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();

    /*
    console.log("effect rendered");
    // "reponse" esta entre paréntesis porque es un parámetro de la función flecha que se ejecuta cuando la promesa se resuelve.
    // Si no tuviera paréntesis, es porque solo hay un parámetro, y no es necesario ponerlo entre paréntesis.
    fetch(API)
      .then((res) => res.json())
      .then((data) => setPokemon(data));
    */
  }, []);

  console.log("component <App.jsx> rendered");
  return (
    <>
      <h1> Pokedex </h1>
      {/* Llaves porque va a haber códdigo JS dentro del JSX */}
      {loading && <p> Cargando... </p>}
      {error && <p className="error"> {error} </p>}

      <h3>
        {" "}
        {pokemon && !loading && !error && (
          <PokemonCard pokemon={pokemon} />
        )}{" "}
      </h3>
    </>
  );
}

export default App;
