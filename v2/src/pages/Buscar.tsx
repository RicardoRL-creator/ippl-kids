import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Register.css';

const Buscar = () => {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = async () => {
    if (search.trim().length < 3) {
      alert('Por favor, insira ao menos 3 caracteres para realizar a busca.');
      return;
    }

    setLoading(true);
    setNotFound(false);
    setPatients([]);

    try {
      const { data, error } = await supabase
        .from('pacientes')
        .select('id, nome, cpf, data_nascimento')
        .or(`cpf.eq.${search},nome.ilike.%${search}%`);

      if (error) {
        console.error('Erro ao buscar paciente:', error);
        setNotFound(true);
      } else if (data && data.length > 0) {
        const formattedData = data.map((patient) => ({
          ...patient,
          data_nascimento: new Date(patient.data_nascimento).toLocaleDateString('pt-BR'),
        }));
        setPatients(formattedData);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = (patientId: string) => {
    const selectedPatient = patients.find((p) => p.id === patientId);
    if (selectedPatient) {
      setPatients([selectedPatient]);
    }
  };

  const handleNewRegister = () => {
    navigate('/cadastro');
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