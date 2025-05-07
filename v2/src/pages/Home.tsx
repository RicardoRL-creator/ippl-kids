import { useNavigate } from 'react-router-dom';
import './Register.css';
import '../index.css'; // Importando o CSS global para aplicar o estilo de fundo
import logo from '../../public/logo.png';

// Este componente é a página inicial do sistema

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-background">
      <div className="register-container">
        <img src={logo} alt="Logo do SIPPLe" className="register-logo" />
        <button className="register-button" onClick={() => navigate('/buscar')}>Localizar Paciente</button>
        <button className="register-button" onClick={() => navigate('/cadastro')}>Cadastrar novo Paciente</button>
        <button className="register-button" onClick={() => navigate('/relatorio')}>Relatório</button>
      </div>
    </div>
  );
};

export default Home;