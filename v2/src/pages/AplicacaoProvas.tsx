import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Adicionando tipagem para o tema
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      text: string;
      primary: string;
      secondary: string;
    };
    fonts: {
      primary: string;
    };
  }
}

// Estilização do container principal
const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.primary};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

// Estilização do título
const Title = styled.h1`
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
`;

// Estilização das seções
const Section = styled.div`
  margin-bottom: 20px;
`;

// Estilização dos botões
const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

// Estilização do botão de voltar
const BackButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.secondary};
  margin-right: 10px;
`;

// Estilização do grid para o alfabeto
const AlphabetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
`;

// Estilização do grid para as seções
const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

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
    <Container>
      <Title>Aplicação de Provas</Title>

      {/* Seção 1: Conhecimento do Alfabeto */}
      {currentSection === 0 && (
        <Section>
          <h2>1. Conhecimento do Alfabeto</h2>
          <AlphabetGrid>
            {responses.alphabetKnowledge.map((_, index) => (
              <div key={index}>
                <label>
                  Letra {alphabetSequence[index]}:
                  <select
                    onChange={(e) =>
                      handleInputChange('alphabetKnowledge', index, e.target.value)
                    }
                    value={responses.alphabetKnowledge[index] || ''}
                  >
                    <option value="">Selecione</option>
                    <option value="1">1 (Acerto)</option>
                    <option value="0">0 (Erro)</option>
                  </select>
                </label>
              </div>
            ))}
          </AlphabetGrid>
          <BackButton onClick={() => navigate('/')}>
            Voltar
          </BackButton>
          <Button
            onClick={() => setCurrentSection(1)}
            disabled={!isSectionComplete('alphabetKnowledge')}
          >
            Próxima Seção
          </Button>
        </Section>
      )}

      {/* Seção 2: Habilidades Metafonológicas */}
      {currentSection === 1 && (
        <Section>
          <h2>2. Habilidades Metafonológicas</h2>
          <SectionGrid>
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
          </SectionGrid>
          {currentSection > 0 && (
            <BackButton onClick={() => setCurrentSection(currentSection - 1)}>
              Voltar
            </BackButton>
          )}
          <Button
            onClick={() => setCurrentSection(2)}
            disabled={!isSectionComplete('rhymeProduction')}
          >
            Próxima Seção
          </Button>
        </Section>
      )}

      {/* Seção 2.2: Identificação de Rima */}
      {currentSection === 2 && (
        <Section>
          <h2>2.2. Identificação de Rima</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          {currentSection > 0 && (
            <BackButton onClick={() => setCurrentSection(currentSection - 1)}>
              Voltar
            </BackButton>
          )}
          <Button
            onClick={() => setCurrentSection(3)}
            disabled={false} // Atualize a lógica de desabilitação conforme necessário
          >
            Próxima Seção
          </Button>
        </Section>
      )}

      {/* Seção 2.3: Segmentação Silábica */}
      {currentSection === 3 && (
        <Section>
          <h2>2.3. Segmentação Silábica</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          {currentSection > 0 && (
            <BackButton onClick={() => setCurrentSection(currentSection - 1)}>
              Voltar
            </BackButton>
          )}
          <Button
            onClick={() => setCurrentSection(4)}
            disabled={false} // Atualize a lógica de desabilitação conforme necessário
          >
            Próxima Seção
          </Button>
        </Section>
      )}

      {/* Seção 2.4: Produção de palavras a partir do fonema dado */}
      {currentSection === 4 && (
        <Section>
          <h2>2.4. Produção de palavras a partir do fonema dado</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          {currentSection > 0 && (
            <BackButton onClick={() => setCurrentSection(currentSection - 1)}>
              Voltar
            </BackButton>
          )}
          <Button
            onClick={() => setCurrentSection(5)}
            disabled={false} // Atualize a lógica de desabilitação conforme necessário
          >
            Próxima Seção
          </Button>
        </Section>
      )}

      {/* Seção 2.5: Síntese Fonêmica */}
      {currentSection === 5 && (
        <Section>
          <h2>2.5. Síntese Fonêmica</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          {currentSection > 0 && (
            <BackButton onClick={() => setCurrentSection(currentSection - 1)}>
              Voltar
            </BackButton>
          )}
          <Button
            onClick={() => setCurrentSection(6)}
            disabled={false} // Atualize a lógica de desabilitação conforme necessário
          >
            Próxima Seção
          </Button>
        </Section>
      )}

      {/* Seção 2.6: Análise Fonêmica */}
      {currentSection === 6 && (
        <Section>
          <h2>2.6. Análise Fonêmica</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          {currentSection > 0 && (
            <BackButton onClick={() => setCurrentSection(currentSection - 1)}>
              Voltar
            </BackButton>
          )}
          <Button
            onClick={() => setCurrentSection(7)}
            disabled={false} // Atualize a lógica de desabilitação conforme necessário
          >
            Próxima Seção
          </Button>
        </Section>
      )}

      {/* Seção 2.7: Identificação de Fonema Inicial */}
      {currentSection === 7 && (
        <Section>
          <h2>2.7. Identificação de Fonema Inicial</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          {currentSection > 0 && (
            <BackButton onClick={() => setCurrentSection(currentSection - 1)}>
              Voltar
            </BackButton>
          )}
          <Button
            onClick={() => setCurrentSection(8)}
            disabled={false} // Atualize a lógica de desabilitação conforme necessário
          >
            Próxima Seção
          </Button>
        </Section>
      )}

      {/* Seção 3: Memória Operacional Fonológica */}
      {currentSection === 8 && (
        <Section>
          <h2>3. Memória Operacional Fonológica</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          {currentSection > 0 && (
            <BackButton onClick={() => setCurrentSection(currentSection - 1)}>
              Voltar
            </BackButton>
          )}
          <Button
            onClick={() => setCurrentSection(9)}
            disabled={false} // Atualize a lógica de desabilitação conforme necessário
          >
            Próxima Seção
          </Button>
        </Section>
      )}

      {/* Seção 4: Nomeação Automática Rápida */}
      {currentSection === 9 && (
        <Section>
          <h2>4. Nomeação Automática Rápida</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          {currentSection > 0 && (
            <BackButton onClick={() => setCurrentSection(currentSection - 1)}>
              Voltar
            </BackButton>
          )}
          <Button
            onClick={() => setCurrentSection(10)}
            disabled={false} // Atualize a lógica de desabilitação conforme necessário
          >
            Próxima Seção
          </Button>
        </Section>
      )}

      {/* Seção 5: Leitura Silenciosa */}
      {currentSection === 10 && (
        <Section>
          <h2>5. Leitura Silenciosa</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          {currentSection > 0 && (
            <BackButton onClick={() => setCurrentSection(currentSection - 1)}>
              Voltar
            </BackButton>
          )}
          <Button
            onClick={() => setCurrentSection(11)}
            disabled={false} // Atualize a lógica de desabilitação conforme necessário
          >
            Próxima Seção
          </Button>
        </Section>
      )}

      {/* Seção 6: Leitura de palavras e pseudopalavras */}
      {currentSection === 11 && (
        <Section>
          <h2>6. Leitura de palavras e pseudopalavras</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          {currentSection > 0 && (
            <BackButton onClick={() => setCurrentSection(currentSection - 1)}>
              Voltar
            </BackButton>
          )}
          <Button
            onClick={() => setCurrentSection(12)}
            disabled={false} // Atualize a lógica de desabilitação conforme necessário
          >
            Próxima Seção
          </Button>
        </Section>
      )}

      {/* Seção 7: Compreensão Auditiva de sentenças a partir de figuras */}
      {currentSection === 12 && (
        <Section>
          <h2>7. Compreensão Auditiva de sentenças a partir de figuras</h2>
          {/* Conteúdo da seção será adicionado posteriormente */}
          {currentSection > 0 && (
            <BackButton onClick={() => setCurrentSection(currentSection - 1)}>
              Voltar
            </BackButton>
          )}
          <Button
            onClick={() => alert('Provas finalizadas!')}
            disabled={false} // Atualize a lógica de desabilitação conforme necessário
          >
            Finalizar
          </Button>
        </Section>
      )}

      <p style={{ marginTop: '20px', fontStyle: 'italic' }}>
        * Lembrete: As respostas devem ser marcadas como "0" (Erro) ou "1" (Acerto).
      </p>
    </Container>
  );
};

export default AplicacaoProvas;