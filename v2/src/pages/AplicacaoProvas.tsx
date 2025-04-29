import './Register.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Este componente gerencia a aplicação de provas, incluindo várias seções de avaliação e navegação entre elas.
const AplicacaoProvas = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0); // Estado para controlar a seção atual
  const [responses, setResponses] = useState({
    alphabetKnowledge: Array(20).fill(null), // Respostas para o conhecimento do alfabeto
    rhymeProduction: Array(20).fill(null), // Respostas para a produção de rima
  });

  // Sequência de letras do alfabeto
  const alphabetSequence = [
    'S', 'E', 'R', 'N', 'T', 'A', 'C', 'L', 'U', 'P', 'V', 'G', 'H', 'Q', 'I', 'B', 'F', 'Z', 'O', 'J', 'D', 'M', 'X'
  ];

  // Função para atualizar as respostas
  const handleInputChange = (section: keyof typeof responses, index: number, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [section]: prev[section].map((item: any, i: number) => (i === index ? value : item)),
    }));
  };

  // Função para verificar se a seção está completa
  const isSectionComplete = (section: keyof typeof responses) => {
    return responses[section].every((response: any) => response !== null);
  };

  return (
    <div className="register-container" style={{ maxWidth: '850px', margin: '0 auto', padding: '0 10px' }}>
      <h1 className="register-title">Aplicação de Provas</h1>

      {/* Seção 1: Conhecimento do Alfabeto */}
      {currentSection === 0 && (
        <div className="register-section">
          <h2>1. Conhecimento do Alfabeto</h2>
          <div
            className="alphabet-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
            }}
          >
            {responses.alphabetKnowledge.map((_, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                }}
              >
                <label style={{ whiteSpace: 'nowrap' }}>Letra {alphabetSequence[index]}:</label>
                <select
                  style={{ flex: '1', minWidth: '90px' }}
                  onChange={(e) =>
                    handleInputChange('alphabetKnowledge', index, e.target.value)
                  }
                  value={responses.alphabetKnowledge[index] || ''}
                >
                  <option value="">Selecione</option>
                  <option value="1">1 (Acerto)</option>
                  <option value="0">0 (Erro)</option>
                </select>
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

      {/* Seção 2: Habilidades Metafonológicas */}
      {currentSection === 1 && (
        <div className="register-section">
          <h2>2. Habilidades Metafonológicas</h2>
          <div className="section-grid">
            <div>
              <h3>2.1. Produção de Rima</h3>
              {responses.rhymeProduction.map((_, index) => (
                <div key={index}>
                  <label>
                    Produção {index + 1}:
                    <select
                      onChange={(e) =>
                        handleInputChange('rhymeProduction', index, e.target.value)
                      }
                      value={responses.rhymeProduction[index] || ''}
                    >
                      <option value="">Selecione</option>
                      <option value="1">1 (Acerto)</option>
                      <option value="0">0 (Erro)</option>
                    </select>
                  </label>
                  <input
                    type="text"
                    maxLength={30}
                    placeholder="Anote a resposta aqui"
                    style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
                  />
                </div>
              ))}
            </div>
            {/* Adicione outras subseções aqui, se necessário */}
          </div>
          <div className="button-container">
            {currentSection > 0 && (
              <button className="register-button" onClick={() => setCurrentSection(currentSection - 1)}>
                Voltar
              </button>
            )}
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
        <div className="register-section">
          <h2>2.2. Identificação de Rima</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          <div className="button-container">
            {currentSection > 0 && (
              <button className="register-button" onClick={() => setCurrentSection(currentSection - 1)}>
                Voltar
              </button>
            )}
            <button
              className="register-button"
              onClick={() => setCurrentSection(3)}
              disabled={false} // Atualize a lógica de desabilitação conforme necessário
            >
              Próxima Seção
            </button>
          </div>
        </div>
      )}

      {/* Seção 2.3: Segmentação Silábica */}
      {currentSection === 3 && (
        <div className="register-section">
          <h2>2.3. Segmentação Silábica</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          <div className="button-container">
            {currentSection > 0 && (
              <button className="register-button" onClick={() => setCurrentSection(currentSection - 1)}>
                Voltar
              </button>
            )}
            <button
              className="register-button"
              onClick={() => setCurrentSection(4)}
              disabled={false} // Atualize a lógica de desabilitação conforme necessário
            >
              Próxima Seção
            </button>
          </div>
        </div>
      )}

      {/* Seção 2.4: Produção de palavras a partir do fonema dado */}
      {currentSection === 4 && (
        <div className="register-section">
          <h2>2.4. Produção de palavras a partir do fonema dado</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          <div className="button-container">
            {currentSection > 0 && (
              <button className="register-button" onClick={() => setCurrentSection(currentSection - 1)}>
                Voltar
              </button>
            )}
            <button
              className="register-button"
              onClick={() => setCurrentSection(5)}
              disabled={false} // Atualize a lógica de desabilitação conforme necessário
            >
              Próxima Seção
            </button>
          </div>
        </div>
      )}

      {/* Seção 2.5: Síntese Fonêmica */}
      {currentSection === 5 && (
        <div className="register-section">
          <h2>2.5. Síntese Fonêmica</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          <div className="button-container">
            {currentSection > 0 && (
              <button className="register-button" onClick={() => setCurrentSection(currentSection - 1)}>
                Voltar
              </button>
            )}
            <button
              className="register-button"
              onClick={() => setCurrentSection(6)}
              disabled={false} // Atualize a lógica de desabilitação conforme necessário
            >
              Próxima Seção
            </button>
          </div>
        </div>
      )}

      {/* Seção 2.6: Análise Fonêmica */}
      {currentSection === 6 && (
        <div className="register-section">
          <h2>2.6. Análise Fonêmica</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          <div className="button-container">
            {currentSection > 0 && (
              <button className="register-button" onClick={() => setCurrentSection(currentSection - 1)}>
                Voltar
              </button>
            )}
            <button
              className="register-button"
              onClick={() => setCurrentSection(7)}
              disabled={false} // Atualize a lógica de desabilitação conforme necessário
            >
              Próxima Seção
            </button>
          </div>
        </div>
      )}

      {/* Seção 2.7: Identificação de Fonema Inicial */}
      {currentSection === 7 && (
        <div className="register-section">
          <h2>2.7. Identificação de Fonema Inicial</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          <div className="button-container">
            {currentSection > 0 && (
              <button className="register-button" onClick={() => setCurrentSection(currentSection - 1)}>
                Voltar
              </button>
            )}
            <button
              className="register-button"
              onClick={() => setCurrentSection(8)}
              disabled={false} // Atualize a lógica de desabilitação conforme necessário
            >
              Próxima Seção
            </button>
          </div>
        </div>
      )}

      {/* Seção 3: Memória Operacional Fonológica */}
      {currentSection === 8 && (
        <div className="register-section">
          <h2>3. Memória Operacional Fonológica</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          <div className="button-container">
            {currentSection > 0 && (
              <button className="register-button" onClick={() => setCurrentSection(currentSection - 1)}>
                Voltar
              </button>
            )}
            <button
              className="register-button"
              onClick={() => setCurrentSection(9)}
              disabled={false} // Atualize a lógica de desabilitação conforme necessário
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
          {/* Conteúdo da seção será adicionado posteriormente */}
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
        <div className="register-section">
          <h2>5. Leitura Silenciosa</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          <div className="button-container">
            {currentSection > 0 && (
              <button className="register-button" onClick={() => setCurrentSection(currentSection - 1)}>
                Voltar
              </button>
            )}
            <button
              className="register-button"
              onClick={() => setCurrentSection(11)}
              disabled={false} // Atualize a lógica de desabilitação conforme necessário
            >
              Próxima Seção
            </button>
          </div>
        </div>
      )}

      {/* Seção 6: Leitura de palavras e pseudopalavras */}
      {currentSection === 11 && (
        <div className="register-section">
          <h2>6. Leitura de palavras e pseudopalavras</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          <div className="button-container">
            {currentSection > 0 && (
              <button className="register-button" onClick={() => setCurrentSection(currentSection - 1)}>
                Voltar
              </button>
            )}
            <button
              className="register-button"
              onClick={() => setCurrentSection(12)}
              disabled={false} // Atualize a lógica de desabilitação conforme necessário
            >
              Próxima Seção
            </button>
          </div>
        </div>
      )}

      {/* Seção 7: Compreensão Auditiva de sentenças a partir de figuras */}
      {currentSection === 12 && (
        <div className="register-section">
          <h2>7. Compreensão Auditiva de sentenças a partir de figuras</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          <div className="button-container">
            {currentSection > 0 && (
              <button className="register-button" onClick={() => setCurrentSection(currentSection - 1)}>
                Voltar
              </button>
            )}
            <button
              className="register-button"
              onClick={() => alert('Provas finalizadas!')}
              disabled={false} // Atualize a lógica de desabilitação conforme necessário
            >
              Finalizar
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