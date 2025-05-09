import TopBar from './TopBar';

const Resumo = () => {
  return (
    <div className="resumo-container">
      <TopBar />
      <div className="register-container">
        <h1 className="register-title">Resumo</h1>
        <p className="register-subtitle">Veja o resumo dos acertos por prova.</p>
      </div>
    </div>
  );
};

export default Resumo;