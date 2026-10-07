import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [pokemon, setPokemon] = useState(null);
  console.log("component <App.jsx> rendered");

  useEffect(() => {
    console.log("effect rendered");
    // "reponse" esta entre paréntesis porque es un parámetro de la función flecha que se ejecuta cuando la promesa se resuelve.
    // Si no tuviera paréntesis, es porque solo hay un parámetro, y no es necesario ponerlo entre paréntesis.
    fetch("https://pokeapi.co/api/v2/pokemon/mewtwo")
      .then((res) => res.json())
      .then((data) => setPokemon(data));
  }, []);

  return (
    <>
      <h1> Pokedex </h1>
      {/* Llaves porque va a haber códdigo JS dentro del JSX */}
      <h3> {pokemon ? pokemon.name : "Cargando..."} </h3>
    </>
  );
}

export default App;
