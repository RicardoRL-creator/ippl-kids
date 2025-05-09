import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './Home.css'; // Usando o estilo exclusivo de Home.css
import TopBar from './TopBar';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = 'home-page';
    return () => {
      document.body.className = ''; // Remove a classe ao sair da página
    };
  }, []);

  return (
    <>
      <TopBar />
      <div className="home-container">
        <img src="../../public/logo.png" alt="Logo do SIPPLe" className="home-logo" />
        <div className="home-form">
          <button className="home-button" onClick={() => navigate('/buscar')}>Localizar Paciente</button>
          <button className="home-button" onClick={() => navigate('/cadastro')}>Cadastrar novo Paciente</button>
          <button className="home-button" onClick={() => navigate('/relatorio')}>Relatório</button>
        </div>
      </div>
    </>
  );
};

export default Home;