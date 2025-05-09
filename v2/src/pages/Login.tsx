import React, { useState, useEffect } from 'react';
import { signIn, checkIfAccountInUse, removeSession } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Importar para gerar um deviceId único
import './AuthPages.css'; // Importando os estilos compartilhados para as páginas de autenticação

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = async () => {
      await removeSession(email); // Remove a sessão ao fechar a página
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [email]);

  useEffect(() => {
    // Adicionando a classe auth-page ao body
    document.body.className = "auth-page";
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isAccountInUse = await checkIfAccountInUse(email);
      if (isAccountInUse) {
        setError('Esta conta já está em uso em outro dispositivo.');
        return;
      }

      const deviceId = uuidv4(); // Gerar um deviceId único
      await signIn(email, password, deviceId);
      navigate('/'); // Redireciona para a página Home após login bem-sucedido
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Bem-vindo!</h1>
      <form className="auth-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">Entrar</button>
        <button
          type="button"
          className="auth-button"
          onClick={() => navigate('/register')}
        >
          Novo cadastro
        </button>
      </form>
      {error && <p className="auth-error">{error}</p>}
    </div>
  );
};

export default Login;