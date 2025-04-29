import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Register.css';

// Este componente permite cadastrar novos pacientes, gerenciando estados e formulários.
const Cadastro = () => {
  // Estado para armazenar os valores do formulário de cadastro
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  // Hook para navegação entre páginas
  const navigate = useNavigate();

  // Função para cadastrar um novo paciente no Supabase
  const handleCadastro = async () => {
    try {
      const { data, error } = await supabase
        .from('pacientes')
        .insert([{ nome, cpf, data_nascimento: dataNascimento }]);

      if (error) {
        console.error('Erro ao cadastrar paciente:', error);
        return;
      }

      console.log('Paciente cadastrado com sucesso:', data);
      alert('Paciente cadastrado com sucesso!');
      navigate('/');
    } catch (err) {
      console.error('Erro inesperado:', err);
    }
  };

  return (
    <div className="register-container">
      {/* Renderiza o título da página */}
      <h1 className="register-title">Cadastrar Paciente</h1>

      <div className="register-section">
        <label htmlFor="nome" className="register-label">Nome:</label>
        <input
          type="text"
          id="nome"
          className="register-input"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <label htmlFor="cpf" className="register-label">CPF:</label>
        <input
          type="text"
          id="cpf"
          className="register-input"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />

        <label htmlFor="dataNascimento" className="register-label">Data de Nascimento:</label>
        <input
          type="date"
          id="dataNascimento"
          className="register-input"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
        />

        <div className="button-container">
          <button className="register-button" onClick={() => navigate('/')}>Voltar</button>
          <button className="register-button" onClick={handleCadastro}>Cadastrar</button>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;