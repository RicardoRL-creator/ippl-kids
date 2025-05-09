import TopBar from './TopBar';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <TopBar />
      <div className="register-container">
        <h1 className="register-title">Bem-vindo ao Dashboard</h1>
        <p className="register-subtitle">Esta é uma página protegida.</p>
      </div>
    </div>
  );
};

export default Dashboard;