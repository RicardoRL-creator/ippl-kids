import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';

const Relatorio = () => {
  const navigate = useNavigate();

  return (
    <div className="relatorio-container">
      <TopBar />
      <div className="register-container">
        <h1 className="register-title">Relatório</h1>
        <p className="register-subtitle">Gere e exporte o relatório final em PDF.</p>
        <button className="register-button" onClick={() => navigate('/')}>Voltar para Home</button>
      </div>
    </div>
  );
};

export default Relatorio;