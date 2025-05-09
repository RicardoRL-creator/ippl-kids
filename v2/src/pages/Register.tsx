import React, { useState } from 'react';
import { signUpWithDetails, checkIfEmailExists } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './AuthPages.css'; // Importando o CSS para estilização

const NovoLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Adicionando a classe auth-page ao body
  document.body.className = "auth-page";

  // Função para lidar com o registro de um novo usuário
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Verifica se o e-mail já está cadastrado
      const emailExists = await checkIfEmailExists(email);
      if (emailExists) {
        setError('O e-mail já está cadastrado. Por favor, faça login ou use outro e-mail.');
        return;
      }
      // Registra o usuário com os detalhes fornecidos
      await signUpWithDetails(email, password, { name, phone, birth_date: birthDate });
      alert('Registro bem-sucedido! Verifique seu e-mail para confirmar.');
      navigate('/login');
    } catch (err: any) {
      // Define a mensagem de erro caso ocorra algum problema
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Cadastro</h1>
      <form className="auth-form" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nome completo"
          className="auth-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Telefone"
          className="auth-input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Data de nascimento"
          className="auth-input"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
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
        <button type="submit" className="auth-button">Cadastrar</button>
        <button type="button" className="auth-button" onClick={() => navigate(-1)}>Voltar</button>
      </form>
      {error && <p className="auth-error">{error}</p>}
    </div>
  );
};

export default NovoLogin;