// src/App.js

import React, { useState } from 'react';
import './App.css';

function App() {
  const [randomAdvice, setRandomAdvice] = useState('');
  const [adviceId, setAdviceId] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  const buscarConselhoAleatorio = async () => {
    try {
      const resposta = await fetch('https://api.adviceslip.com/advice');
      const dados = await resposta.json();
      setRandomAdvice(dados.slip.advice);
    } catch (erro) {
      setError('Erro ao buscar conselho aleatório.');
    }
  };

  const buscarConselhoPorId = async () => {
    try {
      const resposta = await fetch(`https://api.adviceslip.com/advice/${adviceId}`);
      const dados = await resposta.json();
      setRandomAdvice(dados.slip.advice);
      setError('');
    } catch (erro) {
      setError('Erro ao buscar conselho pelo ID.');
    }
  };

  const buscarConselhoPorPalavra = async () => {
    try {
      const resposta = await fetch(`https://api.adviceslip.com/advice/search/${searchWord}`);
      const dados = await resposta.json();
      if (dados.total_results > 0) {
        setSearchResults(dados.slips.map((item) => item.advice));
        setError('');
      } else {
        setSearchResults([]);
        setError('Nenhum resultado encontrado para a palavra informada.');
      }
    } catch (erro) {
      setError('Erro ao buscar conselho pela palavra.');
    }
  };

  return (
    <div className="App">
      <h1>App de Conselhos</h1>
      <p>Conselho Aleatório: {randomAdvice}</p>
      <button onClick={buscarConselhoAleatorio}>Obter Conselho Aleatório</button>

      <hr />

      <input
        type="number"
        placeholder="Digite o ID do conselho"
        value={adviceId}
        onChange={(e) => setAdviceId(e.target.value)}
      />
      <button onClick={buscarConselhoPorId}>Obter Conselho por ID</button>
      {error && <p className="error">{error}</p>}

      <hr />

      <input
        type="text"
        placeholder="Digite uma palavra para buscar"
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
      />
      <button onClick={buscarConselhoPorPalavra}>Buscar Conselho</button>
      {searchResults.length > 0 && (
        <ul>
          {searchResults.map((resultado, index) => (
            <li key={index}>{resultado}</li>
          ))}
        </ul>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;