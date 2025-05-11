import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import AplicacaoProvas from './pages/AplicacaoProvas';
import Resumo from './pages/Resumo';
import Classificacao from './pages/Classificacao';
import Relatorio from './pages/Relatorio';
import Login from './pages/Login';
import ProtectedRoute from './pages/ProtectedRoute';
import Dashboard from './pages/Dashboard'; // Exemplo de página protegida
import NovoLogin from './pages/Register';
import AuthRedirect from './pages/AuthRedirect';
import Buscar from './pages/Buscar'; // Importando o componente correto
import TopBar from './pages/TopBar'; // Importando o componente TopBar
import DadosComplementares from './pages/DadosComplementares';

// Este é o componente principal do aplicativo
function App() {
  const location = useLocation();

  return (
    <div>
      {location.pathname !== '/login' && location.pathname !== '/register' && (
        <div style={{ position: 'absolute', top: 5, left: 10 }}>
          <img src="/public/logo.png" alt="Logo" style={{ height: '50px' }} />
        </div>
      )}
      {location.pathname !== '/login' && location.pathname !== '/register' && (
        <TopBar />
      )}
      <Routes>
        {/* Rotas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cadastro"
          element={
            <ProtectedRoute>
              <Cadastro />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buscar"
          element={
            <ProtectedRoute>
              <Buscar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/aplicacao-provas"
          element={
            <ProtectedRoute>
              <AplicacaoProvas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resumo"
          element={
            <ProtectedRoute>
              <Resumo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classificacao"
          element={
            <ProtectedRoute>
              <Classificacao />
            </ProtectedRoute>
          }
        />
        <Route
          path="/relatorio"
          element={
            <ProtectedRoute>
              <Relatorio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dados-complementares"
          element={
            <ProtectedRoute>
              <DadosComplementares />
            </ProtectedRoute>
          }
        />
        {/* Rota para login */}
        <Route path="/login" element={<Login />} />
        {/* Rota para registro */}
        <Route path="/register" element={<NovoLogin />} />
        {/* Rota para redirecionamento de autenticação */}
        <Route path="/auth-redirect" element={<AuthRedirect />} />
        {/* Rota protegida para dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
