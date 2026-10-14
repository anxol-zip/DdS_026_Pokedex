// Tarjeta de un Pokémon. Props:
// - pokemon: los datos del Pokémon que viene de la API
// - onAdd: función para agregarlo al equipo (si no se pasa, no se dibuja el botón "Agregar")
// - onRemove: función para quitarlo del equipo (si no se pasa, no se dibuja el botón "Eliminar")
// - inTeam: true si este Pokémon ya está en el equipo
// - teamFull: true si el equipo ya tiene 6
export function PokemonCard({ pokemon, onAdd, onRemove, inTeam, teamFull }) {
  const image = pokemon.sprites.other["official-artwork"].front_default;

  // Si ya está en el equipo, le agregamos la clase "in-team" para marcarlo
  return (
    <article className={inTeam ? "card in-team" : "card"}>
      <img src={image} alt={pokemon.name} width="200" />
      <h2>
        #{pokemon.id} {pokemon.name}
      </h2>
      <ul className="types">
        {pokemon.types.map((typeInfo) => (
          <li key={typeInfo.type.name}>{typeInfo.type.name}</li>
        ))}
      </ul>
      <p>
        Altura: {pokemon.height / 10} m / Peso: {pokemon.weight / 10} kg
      </p>

      {/* Botón de agregar: la función flecha llama a onAdd pasando el Pokémon.
          Se deshabilita si ya está en el equipo o si el equipo está lleno */}
      {onAdd && (
        <button
          className="card-btn"
          onClick={() => onAdd(pokemon)}
          disabled={inTeam || teamFull}
        >
          {inTeam ? "✓ En el equipo" : "+ Agregar"}
        </button>
      )}

      {/* Botón de eliminar: solo aparece en las tarjetas del equipo */}
      {onRemove && (
        <button className="card-btn remove" onClick={() => onRemove(pokemon)}>
          ✕ Eliminar
        </button>
      )}
    </article>
  );
}
