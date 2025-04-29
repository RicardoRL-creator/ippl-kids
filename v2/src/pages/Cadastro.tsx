import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Register.css';

interface Patient {
  id: string;
  nome: string;
  cpf: string;
  data_nascimento?: string;
}

const Cadastro = () => {
  const [search, setSearch] = useState('');
  const [patientData, setPatientData] = useState<Patient | Patient[] | null>(null);
  const [isNew, setIsNew] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const sanitizedSearch = search.replace(/\D/g, '');
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .or(`cpf.eq.${sanitizedSearch},nome.ilike.%${search}%`);

      if (error) {
        console.error('Erro ao buscar paciente:', error);
        return;
      }

      if (!data || data.length === 0) {
        setPatientData(null);
        setIsNew(true);
      } else if (data.length === 1) {
        setPatientData(data[0]);
        setIsNew(false);
      } else {
        setPatientData(data);
        setIsNew(false);
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    setPatientData(patient);
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Localizar Paciente</h1>

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

      {patientData && !Array.isArray(patientData) && (
        <div className="register-section">
          <h2 className="register-subtitle">Dados do Paciente</h2>
          <p>Nome: {patientData.nome}</p>
          <p>CPF: {patientData.cpf}</p>
          <p>Data de Nascimento: {patientData.data_nascimento ? new Date(patientData.data_nascimento).toLocaleDateString('pt-BR') : 'Data não disponível'}</p>
        </div>
      )}

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