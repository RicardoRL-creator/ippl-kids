import './Register.css';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

// Este componente gerencia a aplicação de provas, incluindo várias seções de avaliação e navegação entre elas.
const AplicacaoProvas = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSection, setCurrentSection] = useState(0); // Estado para controlar a seção atual
  const [responses, setResponses] = useState({
    alphabetKnowledge: Array(26).fill(null), // Respostas para o conhecimento do alfabeto
    rhymeProduction: Array(20).fill(null), // Respostas para a produção de rima
  });

  const patient = location.state?.patient;

  // Sequência de letras do alfabeto
  const alphabetSequence = [
    'S', 'E', 'R', 'N', 'T', 'A', 'C', 'L', 'U', 'P', 'V', 'G', 'H', 'Q', 'I', 'B', 'F', 'Z', 'O', 'J', 'D', 'M', 'X', 'Y', 'W', 'K'
  ];

  // Função para atualizar as respostas
  // Atualiza o estado de respostas com base na seção, índice e valor fornecidos.
  const handleInputChange = (section: keyof typeof responses, index: number, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [section]: prev[section].map((item: any, i: number) => (i === index ? value : item)),
    }));
  };

  // Função para verificar se a seção está completa
  // Retorna verdadeiro se todas as respostas da seção estiverem preenchidas.
  const isSectionComplete = (section: keyof typeof responses) => {
    return responses[section].every((response: any) => response !== null);
  };

  // Função para salvar os resultados no banco de dados
  // Insere os resultados no banco de dados Supabase e navega para a página inicial em caso de sucesso.
  const saveResults = async () => {
    if (!patient) return;

    try {
      const { error } = await supabase.from('provas').insert({
        patient_id: patient.id,
        results: responses,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Erro ao salvar resultados:', error);
        alert('Erro ao salvar resultados. Tente novamente.');
      } else {
        alert('Resultados salvos com sucesso!');
        navigate('/');
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      alert('Erro inesperado ao salvar resultados.');
    }
  };

  return (
    <div className="register-container" style={{ maxWidth: '850px', margin: '0 auto', padding: '0 10px' }}>
      <h1 className="register-title">Aplicação de Provas</h1>

      {patient && (
        <div className="patient-info" style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', fontSize: '0.9rem', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <p><strong>Nome:</strong> {patient.nome}</p>
            <p><strong>CPF:</strong> {patient.cpf}</p>
            <p><strong>DN:</strong> {format(new Date(patient.data_nascimento), 'dd/MM/yyyy', { locale: ptBR })}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label>
              <strong>Data da Aplicação:</strong>
              <input
                type="date"
                required
                onChange={(e) => {
                  const applicationDate = new Date(e.target.value);
                  const birthDate = new Date(patient.data_nascimento);
                  const diffTime = Math.abs(applicationDate.getTime() - birthDate.getTime());
                  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
                  const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
                  const diffDays = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
                  document.getElementById('age-display')!.textContent = `Idade: ${diffYears} anos, ${diffMonths} meses, ${diffDays} dias`;
                }}
                style={{ marginLeft: '10px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </label>
            <p id="age-display" style={{ margin: 0, fontWeight: 'bold' }}><strong>Idade:</strong> </p>
          </div>
        </div>
      )}

      {/* Seção 1: Conhecimento do Alfabeto */}
      {currentSection === 0 && (
        <div className="register-section" style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', fontSize: '0.9rem', gap: '10px' }}>
          <h2>1. Conhecimento do Alfabeto</h2>
             <div className="alfabeto-box">
              {responses.alphabetKnowledge.map((_, index) => (
                <div key={index} className="letra-item">
                  <label>Letra {alphabetSequence[index]}:</label>
                  <div className="thumb-group">
                    <button
                      type="button"
                      className={`thumb-button ${responses.alphabetKnowledge[index] === '1' ? 'selected' : ''}`}
                      onClick={() => handleInputChange('alphabetKnowledge', index, '1')}
                    >
                      <FaThumbsUp />
                    </button>
                    <button
                      type="button"
                      className={`thumb-button ${responses.alphabetKnowledge[index] === '0' ? 'selected' : ''}`}
                      onClick={() => handleInputChange('alphabetKnowledge', index, '0')}
                    >
                      <FaThumbsDown />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          <div className="button-container">
            <button className="register-button" onClick={() => navigate('/')}>Voltar</button>
            <button
              className="register-button"
              onClick={() => setCurrentSection(1)}
              disabled={!isSectionComplete('alphabetKnowledge')}
            >
              Próxima Seção
            </button>
          </div>
        </div>
      )}

      {/* Seção 2.1: Produção de Rima */}
      {currentSection === 1 && (
        <div className="register-section" style={{ border: '1px solid #ccc', padding: '50px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', fontSize: '0.9rem', gap: '5px' }}>
          <h2 style={{ marginBottom: '1px', marginTop: '1px' }}>2. Habilidades Metafonológicas</h2>
          <p style={{ marginBottom: '1px' }}>2.1. Produção de Rima</p>
          <p style={{ marginBottom: '10px', fontSize: '0.7rem', color: '#555', fontStyle: 'italic', textAlign: 'justify', marginTop: '1px',  }}>
            Instrução: Fale uma palavra que termine com o mesmo fonema. Eu vou dizer uma palavra (mão) e quero que você diga outra palavra que termine igual a palavra mão. Exemplo: pão, cão.
          </p>
          <div className="alfabeto-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', columnGap: '30px', rowGap: '10px' }}>
            {responses.rhymeProduction.map((_, index) => (
              <div key={index} className="letra-item">
                <label>{index + 1}:</label>
                <div className="thumb-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '1' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '1')}
                  >
                    <FaThumbsUp />
                  </button>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '0' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '0')}
                  >
                    <FaThumbsDown />
                  </button>
                  <span style={{ marginLeft: '10px', width: '8ch', display: 'inline-block' }}>
                    {[
                      'Cola', 'Bala', 'Papel', 'Foguete', 'Sapo', 'Minhoca', 'Sabão', 'Gato', 'Cor', 'Dente',
                      'Pé', 'Castelo', 'Palha', 'Uva', 'Mamão', 'Mel', 'Pijama', 'Caneta', 'Vela', 'Chave'
                    ][index]}
                  </span>
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="Digite aqui"
                    style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px', width: '150px', marginLeft: '10px' }}
                    onChange={(e) => handleInputChange('rhymeProduction', index, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="button-container">
            <button className="register-button" onClick={() => setCurrentSection(0)}>Voltar</button>
            <button
              className="register-button"
              onClick={() => setCurrentSection(2)}
              disabled={!isSectionComplete('rhymeProduction')}
            >
              Próxima Seção
            </button>
          </div>
        </div>
      )}

      {/* Seção 2.2: Identificação de Rima */}
      {currentSection === 2 && (
        <div className="register-section" style={{ border: '1px solid #ccc', padding: '50px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', fontSize: '0.9rem', gap: '5px' }}>
          <h2>2. Habilidades Metafonológicas</h2>
          <p>2.2. Identificação de Rima</p>
          <div className="alfabeto-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: '40px', rowGap: '10px' }}>
            {responses.rhymeProduction.map((_, index) => (
              <div key={index} className="letra-item">
                <label>{index + 1}:</label>
                <div className="thumb-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '1' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '1')}
                  >
                    <FaThumbsUp />
                  </button>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '0' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '0')}
                  >
                    <FaThumbsDown />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="button-container">
            <button className="register-button" onClick={() => setCurrentSection(1)}>Voltar</button>
            <button
              className="register-button"
              onClick={() => setCurrentSection(3)}
              disabled={!isSectionComplete('rhymeProduction')}
            >
              Próxima Seção
            </button>
          </div>
        </div>
      )}

      {/* Seção 2.3: Segmentação Silábica */}
      {currentSection === 3 && (
        <div className="register-section" style={{ border: '1px solid #ccc', padding: '50px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', fontSize: '0.9rem', gap: '5px' }}>
          <h2>2. Habilidades Metafonológicas</h2>
          <p>2.3. Segmentação Silábica</p>
          <div className="alfabeto-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: '30px', rowGap: '10px' }}>
            {responses.rhymeProduction.map((_, index) => (
              <div key={index} className="letra-item">
                <label>{index + 1}:</label>
                <div className="thumb-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '1' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '1')}
                  >
                    <FaThumbsUp />
                  </button>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '0' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '0')}
                  >
                    <FaThumbsDown />
                  </button>
                  <input
                    type="number"
                    maxLength={2}
                    placeholder="Digite"
                    style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px', width: '60px' }}
                    onChange={(e) => handleInputChange('rhymeProduction', index, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="button-container">
            <button className="register-button" onClick={() => setCurrentSection(2)}>Voltar</button>
            <button
              className="register-button"
              onClick={() => setCurrentSection(4)}
              disabled={!isSectionComplete('rhymeProduction')}
            >
              Próxima Seção
            </button>
          </div>
        </div>
      )}

      {/* Seção 2.4: Produção de palavras a partir do fonema dado */}
      {currentSection === 4 && (
        <div className="register-section" style={{ border: '1px solid #ccc', padding: '50px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', fontSize: '0.9rem', gap: '5px' }}>
          <h2>2. Habilidades Metafonológicas</h2>
          <p>2.4. Produção de palavras a partir do fonema dado</p>
          <div className="alfabeto-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', columnGap: '30px', rowGap: '10px' }}>
            {responses.rhymeProduction.map((_, index) => (
              <div key={index} className="letra-item">
                <label>{index + 1}:</label>
                <div className="thumb-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '1' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '1')}
                  >
                    <FaThumbsUp />
                  </button>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '0' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '0')}
                  >
                    <FaThumbsDown />
                  </button>
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="Digite aqui"
                    style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px', width: '150px' }}
                    onChange={(e) => handleInputChange('rhymeProduction', index, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="button-container">
            <button className="register-button" onClick={() => setCurrentSection(3)}>Voltar</button>
            <button
              className="register-button"
              onClick={() => setCurrentSection(5)}
              disabled={!isSectionComplete('rhymeProduction')}
            >
              Próxima Seção
            </button>
          </div>
        </div>
      )}

      {/* Seção 2.5: Síntese Fonêmica */}
      {currentSection === 5 && (
        <div className="register-section" style={{ border: '1px solid #ccc', padding: '50px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', fontSize: '0.9rem', gap: '5px' }}>
          <h2>2. Habilidades Metafonológicas</h2>
          <p>2.5. Síntese Fonêmica</p>
          <div className="alfabeto-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', columnGap: '30px', rowGap: '10px' }}>
            {responses.rhymeProduction.map((_, index) => (
              <div key={index} className="letra-item">
                <label>{index + 1}:</label>
                <div className="thumb-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '1' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '1')}
                  >
                    <FaThumbsUp />
                  </button>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '0' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '0')}
                  >
                    <FaThumbsDown />
                  </button>
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="Digite aqui"
                    style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px', width: '150px' }}
                    onChange={(e) => handleInputChange('rhymeProduction', index, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="button-container">
            <button className="register-button" onClick={() => setCurrentSection(4)}>Voltar</button>
            <button
              className="register-button"
              onClick={() => setCurrentSection(6)}
              disabled={!isSectionComplete('rhymeProduction')}
            >
              Próxima Seção
            </button>
          </div>
        </div>
      )}

      {/* Seção 2.6: Análise Fonêmica */}
      {currentSection === 6 && (
        <div className="register-section" style={{ border: '1px solid #ccc', padding: '50px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', fontSize: '0.9rem', gap: '5px' }}>
          <h2>2. Habilidades Metafonológicas</h2>
          <p>2.6. Análise Fonêmica</p>
          <div className="alfabeto-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', columnGap: '30px', rowGap: '10px' }}>
            {responses.rhymeProduction.map((_, index) => (
              <div key={index} className="letra-item">
                <label>{index + 1}:</label>
                <div className="thumb-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '1' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '1')}
                  >
                    <FaThumbsUp />
                  </button>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '0' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '0')}
                  >
                    <FaThumbsDown />
                  </button>
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="Digite aqui"
                    style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px', width: '150px' }}
                    onChange={(e) => handleInputChange('rhymeProduction', index, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="button-container">
            <button className="register-button" onClick={() => setCurrentSection(5)}>Voltar</button>
            <button
              className="register-button"
              onClick={() => setCurrentSection(7)}
              disabled={!isSectionComplete('rhymeProduction')}
            >
              Próxima Seção
            </button>
          </div>
        </div>
      )}

      {/* Seção 2.7: Identificação de Fonema Inicial */}
      {currentSection === 7 && (
        <div className="register-section" style={{ border: '1px solid #ccc', padding: '50px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', fontSize: '0.9rem', gap: '5px' }}>
          <h2>2. Habilidades Metafonológicas</h2>
          <p>2.7. Identificação de Fonema Inicial</p>
          <div className="alfabeto-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', columnGap: '30px', rowGap: '10px' }}>
            {responses.rhymeProduction.map((_, index) => (
              <div key={index} className="letra-item">
                <label>{index + 1}:</label>
                <div className="thumb-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '1' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '1')}
                  >
                    <FaThumbsUp />
                  </button>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '0' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '0')}
                  >
                    <FaThumbsDown />
                  </button>
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="Digite aqui"
                    style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px', width: '150px' }}
                    onChange={(e) => handleInputChange('rhymeProduction', index, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="button-container">
            <button className="register-button" onClick={() => setCurrentSection(6)}>Voltar</button>
            <button
              className="register-button"
              onClick={() => setCurrentSection(8)}
              disabled={!isSectionComplete('rhymeProduction')}
            >
              Próxima Seção
            </button>
          </div>
        </div>
      )}

      {/* Seção 3: Memória Operacional Fonológica */}
      {currentSection === 8 && (
        <div className="register-section" style={{ border: '1px solid #ccc', padding: '50px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', fontSize: '0.9rem', gap: '5px' }}>
          <h2>3. Memória Operacional Fonológica</h2>
            <div className="alfabeto-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', columnGap: '30px', rowGap: '10px' }}>
            {responses.rhymeProduction.map((_, index) => (
              <div key={index} className="letra-item">
                <label>{index + 1}:</label>
                <div className="thumb-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '1' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '1')}
                  >
                    <FaThumbsUp />
                  </button>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '0' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '0')}
                  >
                    <FaThumbsDown />
                  </button>
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="Digite aqui"
                    style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px', width: '150px' }}
                    onChange={(e) => handleInputChange('rhymeProduction', index, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="button-container">
            <button className="register-button" onClick={() => setCurrentSection(7)}>Voltar</button>
            <button
              className="register-button"
              onClick={() => setCurrentSection(9)}
              disabled={!isSectionComplete('rhymeProduction')}
            >
              Próxima Seção
            </button>
          </div>
        </div>
      )}

      {/* Seção 4: Nomeação Automática Rápida */}
      {currentSection === 9 && (
        <div className="register-section">
          <h2>4. Nomeação Automática Rápida</h2>
          <div className="button-container">
            {currentSection > 0 && (
              <button className="register-button" onClick={() => setCurrentSection(currentSection - 1)}>
                Voltar
              </button>
            )}
            <button
              className="register-button"
              onClick={() => setCurrentSection(10)}
              disabled={false} // Atualize a lógica de desabilitação conforme necessário
            >
              Próxima Seção
            </button>
          </div>
        </div>
      )}

      {/* Seção 5: Leitura Silenciosa */}
      {currentSection === 10 && (
        <div className="register-section" style={{ border: '1px solid #ccc', padding: '50px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', fontSize: '0.9rem', gap: '5px' }}>
          <h2>5. Leitura Silenciosa</h2>
          <div className="alfabeto-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', columnGap: '30px', rowGap: '10px' }}>
            {responses.rhymeProduction.map((_, index) => (
              <div key={index} className="letra-item">
                <label>{index + 1}:</label>
                <div className="thumb-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '1' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '1')}
                  >
                    <FaThumbsUp />
                  </button>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '0' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '0')}
                  >
                    <FaThumbsDown />
                  </button>
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="Digite aqui"
                    style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px', width: '150px' }}
                    onChange={(e) => handleInputChange('rhymeProduction', index, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="button-container">
            <button className="register-button" onClick={() => setCurrentSection(9)}>Voltar</button>
            <button
              className="register-button"
              onClick={() => setCurrentSection(11)}
              disabled={!isSectionComplete('rhymeProduction')}
            >
              Próxima Seção
            </button>
          </div>
        </div>
      )}

      {/* Seção 6: Leitura de palavras e pseudopalavras */}
      {currentSection === 11 && (
        <div className="register-section" style={{ border: '1px solid #ccc', padding: '50px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', fontSize: '0.9rem', gap: '5px' }}>
          <h2>6. Leitura de palavras e pseudopalavras</h2>
          <div className="alfabeto-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', columnGap: '30px', rowGap: '10px' }}>
            {responses.rhymeProduction.map((_, index) => (
              <div key={index} className="letra-item">
                <label>{index + 1}:</label>
                <div className="thumb-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '1' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '1')}
                  >
                    <FaThumbsUp />
                  </button>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '0' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '0')}
                  >
                    <FaThumbsDown />
                  </button>
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="Digite aqui"
                    style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px', width: '150px' }}
                    onChange={(e) => handleInputChange('rhymeProduction', index, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="button-container">
            <button className="register-button" onClick={() => setCurrentSection(10)}>Voltar</button>
            <button
              className="register-button"
              onClick={() => setCurrentSection(12)}
              disabled={!isSectionComplete('rhymeProduction')}
            >
              Próxima Seção
            </button>
          </div>
        </div>
      )}

      {/* Seção 7: Compreensão Auditiva de sentenças a partir de figuras */}
      {currentSection === 12 && (
        <div className="register-section" style={{ border: '1px solid #ccc', padding: '50px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', fontSize: '0.9rem', gap: '5px' }}>
          <h2>7. Compreensão Auditiva de sentenças a partir de figuras</h2>
            <div className="alfabeto-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', columnGap: '30px', rowGap: '10px' }}>
            {responses.rhymeProduction.map((_, index) => (
              <div key={index} className="letra-item">
                <label>{index + 1}:</label>
                <div className="thumb-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '1' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '1')}
                  >
                    <FaThumbsUp />
                  </button>
                  <button
                    type="button"
                    className={`thumb-button ${responses.rhymeProduction[index] === '0' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('rhymeProduction', index, '0')}
                  >
                    <FaThumbsDown />
                  </button>
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="Digite aqui"
                    style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px', width: '150px' }}
                    onChange={(e) => handleInputChange('rhymeProduction', index, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="button-container">
            <button className="register-button" onClick={() => setCurrentSection(11)}>Voltar</button>
            <button
              className="register-button"
              onClick={saveResults}
              disabled={!isSectionComplete('rhymeProduction')}
            >
              Finalizar e Salvar
            </button>
          </div>
        </div>
      )}

      <p style={{ marginTop: '20px', fontStyle: 'italic' }}>
        * Lembrete: As respostas devem ser marcadas como "0" (Erro) ou "1" (Acerto).
      </p>
    </div>
  );
};

export default AplicacaoProvas;