import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './AplicacaoProvas.css';

interface Section {
  title: string;
  instructions: string;
  items: string[];
}

interface Responses {
  [sectionIndex: number]: {
    [itemIndex: number]: boolean;
  };
}

const AplicacaoProvas: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [responses, setResponses] = useState<Responses>({});

  const patient = location.state?.patient;

  const sections: Section[] = [
    {
      title: 'Conhecimento do Alfabeto',
      instructions: '',
      items: Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
    },
    {
      title: 'Produção de Rima',
      instructions: 'Fale uma palavra que rime com a palavra apresentada.',
      items: ['Mão', 'Pão', 'Cão'],
    },
  ];

  const handleResponseChange = (sectionIndex: number, itemIndex: number, value: boolean) => {
    setResponses((prev) => {
      const sectionResponses = prev[sectionIndex] || {};
      const updatedSection = { ...sectionResponses, [itemIndex]: value };
      return {
        ...prev,
        [sectionIndex]: updatedSection,
      };
    });
  };

  const isSectionComplete = (sectionIndex: number): boolean => {
    const sectionResponses = responses[sectionIndex] || {};
    return sections[sectionIndex].items.every((_, i) => sectionResponses[i] !== undefined);
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

  useEffect(() => {
    document.body.classList.add('aplicacao-provas');
    return () => {
      document.body.classList.remove('aplicacao-provas');
    };
  }, []);

  return (
    <div className="aplicacao-provas-container">
      <div className="aplicacao-provas">
        <h1>Aplicação de Provas</h1>
        {patient && (
          <div className="aplicacao-provas-patient-container">
            <div className="aplicacao-provas-patient-info">
              <p><strong>Nome:</strong> {patient.nome}</p>
              <p><strong>CPF:</strong> {patient.cpf}</p>
              <p><strong>DN:</strong> {format(new Date(patient.data_nascimento), 'dd/MM/yyyy', { locale: ptBR })}</p>
            </div>
          </div>
        )}

        {sections.map((section, index) => (
          currentSection === index && (
            <div key={index} className="aplicacao-provas-section">
              <div className="aplicacao-provas-section-container">
                <h2>{section.title}</h2>
                <p>{section.instructions}</p>
                <div className="aplicacao-provas-items">
                  {section.items.map((item, i) => (
                    <div key={i} className="aplicacao-provas-item">
                      <span>{item}</span>
                      <button
                        type="button"
                        className={responses[index]?.[i] === true ? 'selected-true' : ''}
                        onClick={() => handleResponseChange(index, i, true)}
                      >✔</button>
                      <button
                        type="button"
                        className={responses[index]?.[i] === false ? 'selected-false' : ''}
                        onClick={() => handleResponseChange(index, i, false)}
                      >✘</button>
                    </div>
                  ))}
                </div>
                <div className="aplicacao-provas-navigation">
                  {index > 0 && (
                    <button onClick={() => setCurrentSection(index - 1)}>Voltar</button>
                  )}
                  {index < sections.length - 1 && (
                    <button onClick={() => setCurrentSection(index + 1)} disabled={!isSectionComplete(index)}>
                      Próxima
                    </button>
                  )}
                  {index === sections.length - 1 && (
                    <button onClick={saveResults} disabled={!isSectionComplete(index)}>
                      Finalizar
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default AplicacaoProvas;
