export const PokemonCard = ({ pokemon }) => {
  const image = pokemon.sprites.other["official-artwork"].front_default;
  return (
    <article className="card">
      <img src={image} alt={pokemon.name} width="200" />
      <h2>
        {" "}
        #{pokemon.id} {pokemon.name}
      </h2>
      <ul className="types">
        {pokemon.types.map((typeInfo) => (
          <li key={typeInfo.type.name}> {typeInfo.type.name} </li>
        ))}
      </ul>
      <p>
        {" "}
        Altura: {pokemon.height / 10}m / Peso: {pokemon.weight / 10}kg{" "}
      </p>
    </article>
  );
};
