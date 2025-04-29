import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Register.css';

// Este componente permite buscar pacientes existentes ou cadastrar novos pacientes, gerenciando estados e formulários.
// Função principal do componente de cadastro de pacientes
// Este componente permite buscar pacientes existentes ou cadastrar novos pacientes.
const Cadastro = () => {
  // Estado para armazenar o valor da busca digitada pelo usuário
  const [search, setSearch] = useState('');

  // Estado para armazenar os dados do paciente encontrado ou null se não encontrado
  const [patientData, setPatientData] = useState(null);

  // Estado para indicar se um novo cadastro está sendo criado
  const [isNew, setIsNew] = useState(false);

  // Hook para navegação entre páginas
  const navigate = useNavigate();

  // Função para atualizar o estado de busca com o valor digitado pelo usuário
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Função para buscar paciente no Supabase
  const handleSearch = async () => {
    try {
<<<<<<< HEAD
      const sanitizedSearch = search.replace(/\D/g, ''); // Remove caracteres não numéricos do CPF
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .or(`cpf.eq.${search},cpf.eq.${sanitizedSearch},nome.ilike.%${search}%`);
=======
      const sanitizedSearch = search.replace(/\D/g, ''); // Remove pontos e traços do CPF
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .or(`cpf.eq.${sanitizedSearch},nome.ilike.%${search}%`);
>>>>>>> 980686b (Update README.md)

      if (error) {
        console.error('Erro ao buscar paciente:', error);
        return;
      }

<<<<<<< HEAD
      console.log('Dados retornados pela busca:', data);

      if (!data || data.length === 0) {
=======
      if (data.length === 0) {
>>>>>>> 980686b (Update README.md)
        setPatientData(null);
        setIsNew(true);
      } else if (data.length === 1) {
        setPatientData(data[0]);
        setIsNew(false);
      } else {
        setPatientData(data); // Armazena múltiplos resultados
        setIsNew(false);
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
    }
  };

  const handleSelectPatient = (patient) => {
    setPatientData(patient);
  };

  return (
    <div className="register-container">
      {/* Renderiza o título da página */}
      <h1 className="register-title">Localizar Paciente</h1>

      {/* Seção para buscar pacientes */}
      <div className="register-section">
        <label htmlFor="search" className="register-label">Buscar Paciente:</label>
        <input
          type="text"
          id="search"
          className="register-input search-input"
          placeholder="CPF ou Nome"
          value={search}
          onChange={handleSearchChange}
        />
        <div className="button-container">
          <button className="register-button" onClick={() => navigate('/')}>Voltar</button>
          <button className="register-button" onClick={handleSearch}>Buscar</button>
        </div>
      </div>

      {/* Exibe múltiplos resultados encontrados */}
      {Array.isArray(patientData) && patientData.length > 1 && (
        <div className="register-section">
          <h2 className="register-subtitle">Selecione o Paciente</h2>
          {patientData.map((patient) => (
            <div key={patient.id}>
              <p>Nome: {patient.nome}</p>
              <p>CPF: {patient.cpf}</p>
              <button className="register-button" onClick={() => handleSelectPatient(patient)}>Selecionar</button>
            </div>
          ))}
        </div>
      )}

      {/* Exibe os dados do paciente encontrado */}
      {patientData && !Array.isArray(patientData) && (
        <div className="register-section">
          <h2 className="register-subtitle">Dados do Paciente</h2>
          <p>Nome: {patientData.nome}</p>
          <p>CPF: {patientData.cpf}</p>
          <p>Data de Nascimento: {patientData.data_nascimento ? new Date(patientData.data_nascimento).toLocaleDateString('pt-BR') : 'Data não disponível'}</p>
        </div>
      )}

      {/* Renderiza mensagem de erro e opção de cadastro se o paciente não for encontrado */}
      {isNew && (
        <div className="register-section">
          <p>Cadastro não encontrado. Deseja cadastrar um novo paciente?</p>
          <button className="register-button" onClick={() => navigate('/cadastro')}>Cadastrar Novo Paciente</button>
        </div>
      )}
    </div>
  );
};

export default Cadastro;