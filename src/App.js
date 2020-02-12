import React, { useReducer } from "react";
import axios from "axios";
import styled from "styled-components";

const H1 = styled.h1`
  font-size: 20px;

  &:hover {
    color: red;
  }

  @media screen and (min-width: 768px) {
    font-size: 36px;
  }
`;

const reducer = (oldState, newState) => ({ ...oldState, ...newState });

function App() {
  const [{ query, currentPokemon, error }, setState] = useReducer(reducer, {
    query: "",
    currentPokemon: null,
    error: ""
  });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${query}`
      );
      const { name, sprites } = response.data;
      setState({
        currentPokemon: { name, image: sprites.front_default },
        error: ""
      });
    } catch (error) {
      setState({ error: "Pokemon not found!", currentPokemon: null });
    }
    setState({ query: "" });
  };

  return (
    <div className="App" data-testid="app-container">
      <H1 data-testid="header">Pokemon Searcher!</H1>
      <form action="" onSubmit={onSubmit}>
        <label htmlFor="pokemon-name">Enter pokemon name:</label>
        <input
          type="text"
          value={query}
          id="pokemon-name"
          onChange={e => setState({ query: e.target.value })}
        />
        <button type="submit" disabled={!query}>
          Search
        </button>
      </form>
      {currentPokemon && (
        <div data-testid="result">
          <h3>{currentPokemon.name}</h3>
          <img src={currentPokemon.image} alt={currentPokemon.name} />
        </div>
      )}
      {error && <p data-testid="error">{error}</p>}
    </div>
  );
}

export default App;
