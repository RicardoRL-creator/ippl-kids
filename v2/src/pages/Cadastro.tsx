import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Cadastro.css';

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

  useEffect(() => {
    document.body.classList.add('cadastro-page');
    return () => {
      document.body.classList.remove('cadastro-page');
    };
  }, []);

  // Função para validar CPF
  // Verifica se o CPF contém exatamente 11 dígitos.
  const isValidCPF = (cpf: string) => {
    return /^\d{11}$/.test(cpf);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    setCpf(value.slice(0, 11)); // Limita a entrada a 11 dígitos
  };

  const handleDataNascimentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d/]/g, ''); // Remove caracteres não numéricos e não barras
    if (value.length > 2 && value[2] !== '/') value = value.slice(0, 2) + '/' + value.slice(2);
    if (value.length > 5 && value[5] !== '/') value = value.slice(0, 5) + '/' + value.slice(5, 9); // Limita o ano a 4 dígitos
    setDataNascimento(value.slice(0, 10)); // Garante que o total não exceda 10 caracteres
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
    <div className="cadastro-page">
      <div className="cadastro-container">
        <div className="cadastro-top-bar">
          {/* Botão 'Sair' removido */}
        </div>
        <div className="cadastro-register-container">
          <h1 className="cadastro-title">Cadastrar Paciente</h1>

          {errorMessage && <p className="cadastro-error-message">{errorMessage}</p>}

          <div className="cadastro-register-section">
            <input
              type="text"
              id="nome"
              className="cadastro-input"
              placeholder="Nome do Paciente"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <input
              type="text"
              id="cpf"
              className="cadastro-input"
              placeholder="CPF (Somente números)"
              value={cpf}
              onChange={handleCpfChange}
            />

            <input
              type="text"
              id="dataNascimento"
              className="cadastro-input"
              value={dataNascimento}
              onChange={handleDataNascimentoChange}
              placeholder="Data de nascimento (dd/mm/aaaa)"
              pattern="\d{2}/\d{2}/\d{4}"
              title="Digite a data no formato dd/mm/aaaa"
            />

            <select
              id="sexo"
              className="cadastro-input"
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
            >
              <option value="">Sexo (selecione)</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>

            <input
              type="text"
              id="localNascimentoCidade"
              className="cadastro-input"
              placeholder="Cidade de Nascimento"
              value={localNascimentoCidade}
              onChange={(e) => setLocalNascimentoCidade(e.target.value)}
            />

            <input
              type="text"
              id="localNascimentoEstado"
              className="cadastro-input"
              placeholder="Estado de Nascimento"
              value={localNascimentoEstado}
              onChange={(e) => setLocalNascimentoEstado(e.target.value)}
            />

            <div className="cadastro-button-container">
              <button className="cadastro-button" onClick={() => navigate('/')}>Voltar</button>
              <button className="cadastro-button" onClick={handleCadastro}>Cadastrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;