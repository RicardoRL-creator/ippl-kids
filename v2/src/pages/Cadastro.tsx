import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import PageLayout from './PageLayout';

// Este componente permite cadastrar novos pacientes, gerenciando estados e formulários.
const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sexo, setSexo] = useState('');
  const [localNascimentoCidade, setLocalNascimentoCidade] = useState('');
  const [localNascimentoEstado, setLocalNascimentoEstado] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const isAuthenticated = false; // Página não logada

  // Função para validar CPF
  // Verifica se o CPF contém exatamente 11 dígitos.
  const isValidCPF = (cpf: string) => {
    return /^\d{11}$/.test(cpf);
  };

  // Função para cadastrar um novo paciente no Supabase
  // Realiza validações nos campos obrigatórios e no CPF, obtém o usuário autenticado,
  // e insere os dados do paciente na tabela 'pacientes' do Supabase.
  const handleCadastro = async () => {
    try {
      if (!nome || !cpf || !dataNascimento || !sexo || !localNascimentoCidade) {
        setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      if (!isValidCPF(cpf)) {
        setErrorMessage('CPF inválido. Certifique-se de que contém 11 dígitos.');
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || !user.email) {
        setErrorMessage('Usuário não autenticado ou email não disponível.');
        return;
      }

      const { data, error } = await supabase
        .from('pacientes')
        .insert([
          {
            nome,
            cpf,
            data_nascimento: dataNascimento,
            sexo,
            local_nascimento_cidade: localNascimentoCidade,
            local_nascimento_estado: localNascimentoEstado,
            created_by: user.email, // Garantindo que o email do usuário seja usado
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        console.error('Erro ao cadastrar paciente:', error);
        setErrorMessage('Erro ao cadastrar paciente. Tente novamente mais tarde.');
        return;
      }

      console.log('Paciente cadastrado com sucesso:', data);
      alert('Paciente cadastrado com sucesso!');
      navigate('/');
    } catch (err) {
      console.error('Erro inesperado:', err);
      setErrorMessage('Ocorreu um erro inesperado. Tente novamente mais tarde.');
    }
  };

  return (
    <PageLayout isAuthenticated={isAuthenticated}>
      <div className="register-container">
        <h1 className="register-title">Cadastrar Paciente</h1>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="register-section">
          <label htmlFor="nome" className="register-label">Nome:</label>
          <input
            type="text"
            id="nome"
            className="register-input"
            placeholder="Nome do Paciente"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label htmlFor="cpf" className="register-label">CPF:</label>
          <input
            type="text"
            id="cpf"
            className="register-input"
            placeholder="Somente números"
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

          <label htmlFor="sexo" className="register-label">Sexo:</label>
          <select
            id="sexo"
            className="register-input"
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
          </select>

          <label htmlFor="localNascimentoCidade" className="register-label">Cidade de Nascimento:</label>
          <input
            type="text"
            id="localNascimentoCidade"
            className="register-input"
            placeholder="Cidade de Nascimento"
            value={localNascimentoCidade}
            onChange={(e) => setLocalNascimentoCidade(e.target.value)}
          />

          <label htmlFor="localNascimentoEstado" className="register-label">Estado de Nascimento:</label>
          <input
            type="text"
            id="localNascimentoEstado"
            className="register-input"
            placeholder="Estado de Nascimento"
            value={localNascimentoEstado}
            onChange={(e) => setLocalNascimentoEstado(e.target.value)}
          />

          <div className="button-container">
            <button className="register-button" onClick={() => navigate('/')}>Voltar</button>
            <button className="register-button" onClick={handleCadastro}>Cadastrar</button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Cadastro;