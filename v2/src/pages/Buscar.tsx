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
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = async () => {
    setLoading(true);
    setNotFound(false);

    try {
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .or(`nome.ilike.%${search}%,cpf.ilike.%${search}%`);

      if (error) {
        console.error('Erro ao buscar pacientes:', error);
        alert('Erro ao buscar pacientes. Tente novamente.');
      } else if (data.length === 0) {
        setNotFound(true);
        setPatients([]);
      } else {
        setPatients(data);
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      alert('Erro inesperado ao buscar pacientes.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = (id: string) => {
    const selectedPatient = patients.find((patient) => patient.id === id);
    if (selectedPatient) {
      setPatients([selectedPatient]);
    }
  };

  const handleNewRegister = () => {
    navigate('/cadastro');
  };

  const handleGoToAplicacaoProvas = (patient: Patient) => {
    navigate('/aplicacao-provas', { state: { patient } });
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
          <button
            className="register-button"
            onClick={() => handleGoToAplicacaoProvas(patients[0])}
          >
            Ir para Aplicação de Provas
          </button>
        </div>
      )}

      {patients.length > 1 && (
        <div className="patient-options">
          <h2>Selecione o Paciente</h2>
          <ul>
            {patients.map((patient: Patient) => (
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