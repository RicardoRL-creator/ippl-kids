import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { signOut, supabase } from './supabaseClient';
import { useState, useEffect } from 'react';

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

// Este é o componente principal do aplicativo
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Erro ao obter dados do usuário:', error);
        setLoading(false); // Finaliza o carregamento mesmo em caso de erro
        return;
      }

      if (user) {
        setUserEmail(user.email || '');

        // Buscar o nome do usuário na tabela profiles usando user_id
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('username')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Erro ao obter o perfil do usuário:', profileError);
        } else {
          setUserName(profile?.username || 'Usuário');
        }
      }
      setLoading(false); // Finaliza o carregamento após buscar os dados
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(userEmail); // Substitua pelo email do usuário autenticado
      navigate('/login'); // Redireciona para a página de login após o logoff
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <div>
      {location.pathname !== '/login' && (
        <div style={{ position: 'absolute', top: 5, left: 10 }}>
          <img src="/public/logo.png" alt="Logo" style={{ height: '50px' }} />
        </div>
      )}
      {location.pathname !== '/login' && (
        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: '10px' }}>
          {loading ? (
            <span>Carregando...</span> // Exibe um texto enquanto carrega
          ) : (
            <span>{userName} ({userEmail})</span>
          )}
          <button onClick={handleSignOut}>Sair</button>
        </div>
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
