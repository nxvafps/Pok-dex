import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import "./App.css";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 20px 0;
  max-width: 1200px;
`;

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
    boxshadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 120px;
    height: 120px;
  }

  h3 {
    margin: 10px 0;
    color: #2c3e50;
  }

  p {
    color: #7f8c8d;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #3498db;
  color: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2980b9;
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(
    "https://pokeapi.co/api/v2/pokemon"
  );
  const [nextPage, setNextPage] = useState();
  const [prevPage, setPrevPage] = useState();

  const fetchPokemon = async () => {
    setLoading(true);
    try {
      const response = await axios.get(currentPage);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
      const pokemonData = await Promise.all(
        response.data.results.map(async (pokemon) => {
          const result = await axios.get(pokemon.url);
          return result.data;
        })
      );

      setPokemon(pokemonData);
      setLoading(false);
    } catch (error) {
      console.error("error loading pokemon", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, [currentPage]);

  function goToNextPage() {
    setCurrentPage(nextPage);
  }
  function goToPrevPage() {
    setCurrentPage(prevPage);
  }

  if (loading) return "Loading...";

  return (
    <Container>
      <Title>Pokédex</Title>
      <Grid>
        {pokemon.map((p) => (
          <Card key={p.id}>
            <img src={p.sprites.front_default} alt={p.name} />
            <h3>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</h3>
            <p>#{p.id}</p>
          </Card>
        ))}
      </Grid>
      <PaginationContainer>
        {prevPage && <Button onClick={goToPrevPage}>Previous</Button>}
        {nextPage && <Button onClick={goToNextPage}>next</Button>}
      </PaginationContainer>
    </Container>
  );
}

export default App;
