import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Register.css';

interface Patient {
  id: string;
  nome: string;
  cpf: string;
  data_nascimento: string;
}

const Buscar = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    console.log('Buscar paciente:', search);
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Localizar Paciente</h1>

      <div className="register-section">
        <label htmlFor="search" className="register-label">Insira:</label>
        <input
          type="text"
          id="search"
          className="register-input search-input"
          placeholder="Nome ou CPF completo"
          value={search}
          onChange={handleSearchChange}
        />
        <div className="button-container">
          <button className="register-button" onClick={() => navigate('/')}>Voltar</button>
          <button className="register-button" onClick={handleSearch} disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {patients.length === 1 && (
        <div className="patient-info">
          <h2>Dados do Paciente</h2>
          <p><strong>Nome:</strong> {patients[0].nome}</p>
          <p><strong>CPF:</strong> {patients[0].cpf}</p>
          <p><strong>Data de Nascimento:</strong> {patients[0].data_nascimento}</p>
        </div>
      )}

      {patients.length > 1 && (
        <div className="patient-options">
          <h2>Selecione o Paciente</h2>
          <ul>
            {patients.map((patient) => (
              <li key={patient.id}>
                <button
                  className="register-button"
                  onClick={() => handleSelectPatient(patient.id)}
                >
                  {patient.nome} - {patient.cpf}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {notFound && (
        <div className="not-found">
          <p>Paciente não encontrado.</p>
          <button className="register-button" onClick={handleNewRegister}>Cadastrar Novo Paciente</button>
        </div>
      )}
    </div>
  );
};

export default Buscar;