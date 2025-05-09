import { useNavigate } from 'react-router-dom';
import './Home.css'; // Usando o estilo exclusivo de Home.css

const Home = () => {
  const navigate = useNavigate();

  // Adicionando a classe home-page ao body
  document.body.className = "home-page";

  return (
    <div className="home-container">
      <img src="../../public/logo.png" alt="Logo do SIPPLe" className="home-logo" />
      <div className="home-form">
        <button className="home-button" onClick={() => navigate('/buscar')}>Localizar Paciente</button>
        <button className="home-button" onClick={() => navigate('/cadastro')}>Cadastrar novo Paciente</button>
        <button className="home-button" onClick={() => navigate('/relatorio')}>Relatório</button>
      </div>
    </div>
  );
};

export default Home;