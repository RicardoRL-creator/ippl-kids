import React, { useState } from 'react';
import { signUpWithDetails, checkIfEmailExists } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Importando o CSS para estilização

const NovoLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    <div className="register-container">
      <h1 className="register-title">Bem-vindo!</h1>
      <p className="register-subtitle">Por favor, cadastre-se para continuar</p>
      <form className="register-form" onSubmit={handleRegister}>
        <label className="register-label">Nome Completo</label>
        <input
          type="text"
          className="register-input"
          placeholder="Digite seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label className="register-label">E-mail</label>
        <input
          type="email"
          className="register-input"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="register-label">Telefone</label>
        <input
          type="tel"
          className="register-input"
          placeholder="Digite seu telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <label className="register-label">Data de Nascimento</label>
        <input
          type="date"
          className="register-input"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />
        <label className="register-label">Senha</label>
        <input
          type="password"
          className="register-input"
          placeholder="Crie uma senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="register-button">Cadastrar</button>
      </form>
      {error && <p className="register-error">{error}</p>}
      <button className="back-button" onClick={() => navigate(-1)}>Voltar</button>
    </div>
  );
};

export default NovoLogin;