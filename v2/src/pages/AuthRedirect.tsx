import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// Este componente lida com o redirecionamento de autenticação, validando o token e redirecionando o usuário para a página de login.
const AuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (error) {
        console.error('Erro ao validar o token:', error.message);
        alert('Erro ao validar o token. Tente novamente.');
      } else {
        alert('E-mail validado com sucesso!');
        navigate('/login'); // Redireciona para a página de login
      }
    };

    handleAuthRedirect();
  }, [navigate]);

  return <p>Validando o e-mail, por favor aguarde...</p>;
};

export default AuthRedirect;