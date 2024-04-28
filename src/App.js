import React, { useState, createContext, useContext } from 'react';
import './App.css';
import Button from '@mui/material/Button'; // Importando o componente Button do Material-UI
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Importando temas e estilos do Material-UI

const AdviceContext = createContext();

function AdviceProvider({ children }) {
  const [randomAdvice, setRandomAdvice] = useState('');
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const buscarConselhoAleatorio = async () => {
    try {
      const resposta = await fetch('https://api.adviceslip.com/advice');
      const dados = await resposta.json();
      setRandomAdvice(dados.slip.advice);
      setError('');
    } catch (erro) {
      setError('Erro ao buscar conselho aleatório.');
    }
  };

  const buscarConselhoPorId = async (adviceId) => {
    try {
      const resposta = await fetch(`https://api.adviceslip.com/advice/${adviceId}`);
      const dados = await resposta.json();
      setRandomAdvice(dados.slip.advice);
      setError('');
    } catch (erro) {
      setError('Erro ao buscar conselho pelo ID.');
    }
  };

  const buscarConselhoPorPalavra = async (searchWord) => {
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
    <AdviceContext.Provider
      value={{ randomAdvice, searchResults, buscarConselhoAleatorio, buscarConselhoPorId, buscarConselhoPorPalavra, error }}
    >
      {children}
    </AdviceContext.Provider>
  );
}

function RandomAdviceDisplay() {
  const { randomAdvice, searchResults, buscarConselhoAleatorio, buscarConselhoPorId, buscarConselhoPorPalavra, error } = useContext(AdviceContext);
  const [adviceId, setAdviceId] = useState('');
  const [searchWord, setSearchWord] = useState('');

  return (
    <div>
      <p>Conselho Aleatório: {randomAdvice}</p>
      <Button variant="contained" color="primary" onClick={buscarConselhoAleatorio}>
        Obter Conselho Aleatório
      </Button>

      <hr />

      <p>
      <input
        type="number"
        placeholder="Digite o ID do conselho"
        value={adviceId}
        onChange={(e) => setAdviceId(e.target.value)}
      />
      </p>
      <Button variant="contained" color="primary" onClick={() => buscarConselhoPorId(adviceId)}>
        Obter Conselho por ID
      </Button>
      {error && <p className="error">{error}</p>}

      <hr />

      <p>
      <input
        type="text"
        placeholder="Digite uma palavra para buscar"
        value={searchWord}
        size="23"
        onChange={(e) => setSearchWord(e.target.value)}
      />
      </p>
      <Button variant="contained" color="primary" onClick={() => buscarConselhoPorPalavra(searchWord)}>
        Buscar Conselho
      </Button>
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

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#007bff',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <h1>App de Conselhos</h1>
        <AdviceProvider>
          <RandomAdviceDisplay />
        </AdviceProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;