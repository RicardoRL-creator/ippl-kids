import React, { useState, useEffect } from 'react';
import { signIn, checkIfAccountInUse, removeSession } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Importar para gerar um deviceId único
import './Register.css'; // Reutilizando o CSS da tela de registro
import './Login.css'; // Importar para aplicar os estilos corretamente
import PageLayout from './PageLayout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isAuthenticated = false; // Página não logada

  useEffect(() => {
    const handleBeforeUnload = async () => {
      await removeSession(email); // Remove a sessão ao fechar a página
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [email]);

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
    <PageLayout isAuthenticated={isAuthenticated}>
      <div className="login-background">
        <div className="login-container">
          <div className="login-form-container">
            <div className="register-container">
              <h1 className="register-title">Bem-vindo de volta!</h1>
              <p className="register-subtitle">Por favor, faça login para continuar</p>
              <form className="register-form" onSubmit={handleLogin}>
                <label className="register-label input-container">
                  <div className="input-wrapper">
                    <span className="icon">📧</span>
                    <input
                      type="email"
                      className="register-input"
                      placeholder="Digite seu e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </label>
                <label className="register-label input-container">
                  <div className="input-wrapper">
                    <span className="icon">🔒</span>
                    <input
                      type="password"
                      className="register-input"
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </label>
                <button type="submit" className="register-button same-size">Entrar</button>
              </form>
              {error && <p className="register-error">{error}</p>}
              <button className="register-button same-size" onClick={() => navigate('/register')}>Novo cadastro</button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Login;