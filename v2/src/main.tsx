// Este arquivo é o ponto de entrada principal do React. Ele configura o tema, o roteamento e renderiza o componente principal do aplicativo.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';

// Definição do tema para o styled-components
const theme = {
  colors: {
    primary: '#FFD700', // Amarelo suave
    secondary: '#87CEEB', // Azul claro
    background: '#FFF8DC', // Bege claro
    text: '#333', // Cinza escuro
  },
  fonts: {
    primary: 'Comic Sans MS, sans-serif',
  },
};

// Renderiza o aplicativo React na raiz do documento HTML
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
