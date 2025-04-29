import { useNavigate } from 'react-router-dom';
import './Register.css';

// Este componente é a página inicial do sistema

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="register-container">
      <h1 className="register-title">Bem-vindo ao SIPPLe</h1>
      <p className="register-subtitle">Sistema de Identificação Precoce dos Problemas de Leitura</p>
      <button className="register-button" onClick={() => navigate('/buscar')}>Localizar Paciente</button>
      <button className="register-button" onClick={() => navigate('/cadastro')}>Cadastrar novo Paciente</button>
      <button className="register-button" onClick={() => navigate('/relatorio')}>Relatório</button>
    </div>
  );
};

export default Home;