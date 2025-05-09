import TopBar from './TopBar';

const Classificacao = () => {
  return (
    <div className="classificacao-container">
      <TopBar />
      <div className="register-container">
        <h1 className="register-title">Classificação</h1>
        <p className="register-subtitle">Classifique automaticamente com base no ano da criança.</p>
      </div>
    </div>
  );
};

export default Classificacao;