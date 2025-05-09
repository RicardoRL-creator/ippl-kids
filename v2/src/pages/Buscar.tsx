import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../index.css'; // Importando o CSS global para aplicar o estilo de fundo

interface Patient {
  id: string;
  nome: string;
  cpf: string;
  data_nascimento: string;
}

// Formata uma data no formato ISO para o formato brasileiro (DD/MM/AAAA).
const formatDateToBrazilian = (date: string): string => {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};

const Buscar = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  // Atualiza o estado de busca com o valor inserido pelo usuário.
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Realiza a busca de pacientes no banco de dados com base no nome ou CPF.
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

  // Filtra e seleciona um paciente específico com base no ID.
  const handleSelectPatient = (id: string) => {
    const selectedPatient = patients.find((patient) => patient.id === id);
    if (selectedPatient) {
      setPatients([selectedPatient]);
    }
  };

  // Navega para a página de cadastro de novo paciente.
  const handleNewRegister = () => {
    navigate('/cadastro');
  };

  // Navega para a página de aplicação de provas com os dados do paciente selecionado.
  const handleGoToAplicacaoProvas = (patient: Patient) => {
    navigate('/aplicacao-provas', { state: { patient } });
  };

  return (
    <>
      <div className="home-background"></div>
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
            <p><strong>Data de Nascimento:</strong> {formatDateToBrazilian(patients[0].data_nascimento)}</p>
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
    </>
  );
};

export default Buscar;