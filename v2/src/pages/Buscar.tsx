import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Buscar = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    console.log('Buscar paciente:', search);
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Localizar Paciente</h1>

      <div className="register-section">
        <label htmlFor="search" className="register-label">Buscar Paciente:</label>
        <input
          type="text"
          id="search"
          className="register-input search-input"
          placeholder="CPF ou Nome"
          value={search}
          onChange={handleSearchChange}
        />
        <div className="button-container">
          <button className="register-button" onClick={() => navigate('/')}>Voltar</button>
          <button className="register-button" onClick={handleSearch}>Buscar</button>
        </div>
      </div>
    </div>
  );
};

export default Buscar;