import './Register.css';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Este componente gerencia a aplicação de provas, incluindo várias seções de avaliação e navegação entre elas.
const AplicacaoProvas = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSection, setCurrentSection] = useState(0); // Estado para controlar a seção atual
  const [responses, setResponses] = useState({
    alphabetKnowledge: Array(20).fill(null), // Respostas para o conhecimento do alfabeto
    rhymeProduction: Array(20).fill(null), // Respostas para a produção de rima
  });

  const patient = location.state?.patient;

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
        <div className="register-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2>1. Conhecimento do Alfabeto</h2>
          <div className="patient-info" style={{
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '20px',
            backgroundColor: '#f9f9f9',
            display: 'flex',
            flexDirection: 'column',
            fontSize: '0.9rem',
            gap: '10px',
            alignItems: 'center',
            maxWidth: '850px', // Ajusta a largura para ser igual à caixa de dados do paciente
            width: '100%',
            margin: '0 auto' // Centraliza a caixa na página
          }}>
            <p>Sequência de letras do alfabeto.</p>
            <div
              className="alphabet-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                width: '100%', // Garante que o grid ocupe toda a largura disponível
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
          <div className="patient-info" style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', fontSize: '0.9rem', gap: '10px' }}>
            <p>2.1. Produção de Rima</p>
            <p>2.2. Identificação de Rima</p>
            <p>2.3. Segmentação Silábica</p>
            <p>2.4. Produção de palavras a partir do fonema dado</p>
            <p>2.5. Síntese Fonêmica</p>
            <p>2.6. Análise Fonêmica</p>
            <p>2.7. Identificação de Fonema Inicial</p>
          </div>
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
          <div className="patient-info" style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', fontSize: '0.9rem', gap: '10px' }}>
            <p>Memória Operacional Fonológica</p>
          </div>
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
          <div className="patient-info" style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', fontSize: '0.9rem', gap: '10px' }}>
            <p>Nomeação Automática Rápida</p>
          </div>
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
          <div className="patient-info" style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', fontSize: '0.9rem', gap: '10px' }}>
            <p>Leitura Silenciosa</p>
          </div>
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
          <div className="patient-info" style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', fontSize: '0.9rem', gap: '10px' }}>
            <p>Leitura de palavras e pseudopalavras</p>
          </div>
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
          <div className="patient-info" style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', fontSize: '0.9rem', gap: '10px' }}>
            <p>Compreensão Auditiva de sentenças a partir de figuras</p>
          </div>
          <div className="button-container">
            {currentSection > 0 && (
              <button className="register-button" onClick={() => setCurrentSection(currentSection - 1)}>
                Voltar
              </button>
            )}
            <button
              className="register-button"
              onClick={saveResults}
              disabled={false}
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