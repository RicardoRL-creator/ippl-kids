import React, { useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import TopBar from './TopBar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './Resumo.css';

// Registrar componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Resumo: React.FC = () => {
  // Adiciona classe ao body para CSS de fundo e espaçamento
  useEffect(() => {
    document.body.classList.add('resumo');
    return () => document.body.classList.remove('resumo');
  }, []);

  const navigate = useNavigate();

  const location = useLocation();
  const {
    patient,
    responses = {},
    applicationDate,
    testType,
    course,
    institution,
    ageString,
    applicant
  } = (location.state as any) || {};

  // Acrônimos das seções
  const acronyms = ['CA','PR','IR','SS','PPf','SF','AF','IFI','MOF','RAN','LS','LPPP','CAF'];

  // Cálculo das pontuações
  const scores = acronyms.map((_, idx) => {
    const resp = (responses as any)[idx] || {};
    return Object.values(resp).filter(v => v === true).length;
  });

  // Dados e opções do gráfico
  const data = useMemo(() => ({
    labels: acronyms,
    datasets: [
      {
        label: 'Pontuação',
        data: scores,
        backgroundColor: acronyms.map((_, i) => `hsl(${(i * 360) / acronyms.length}, 70%, 50%)`)
      }
    ]
  }), [scores]);

  const options = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Pontuação por seção' }
    },
    scales: {
      y: { beginAtZero: true, min: 0, max: 50, ticks: { stepSize: 5 } }
    }
  }), []);

  return (
    <div className="resumo-container">
      <TopBar />
      <div className="resumo-actions">
        <button className="pdf-button" onClick={() => window.print()}>Gerar PDF</button>
        <button className="voltar-home-button" onClick={() => navigate('/')}>Voltar para Home</button>
      </div>
      <div className="resumo-content">
        <h1>Resumo da Prova</h1>
        <div className="info-block">
          <h2>Dados do Paciente</h2>
          <p><strong>Nome:</strong> {patient?.nome}</p>
          <p><strong>Data de Nascimento:</strong> {patient?.data_nascimento && format(new Date(patient.data_nascimento), 'dd/MM/yyyy', { locale: ptBR })}</p>
        </div>
        <div className="info-block">
          <h2>Dados da Aplicação</h2>
          <p><strong>Data:</strong> {applicationDate && format(new Date(applicationDate), 'dd/MM/yyyy', { locale: ptBR })}</p>
          <p><strong>Testagem:</strong> {testType}</p>
          <p><strong>Curso/Série:</strong> {course}</p>
          <p><strong>Instituição:</strong> {institution}</p>
          <p><strong>Idade:</strong> {ageString}</p>
          <p><strong>Aplicador:</strong> {applicant}</p>
        </div>
        <div className="chart-container">
          {/* Tabela de resumo antes do gráfico */}
          <div className="table-container">
            <table className="summary-table">
              <thead>
                <tr>
                  <th>Nº</th>
                  <th>PROVAS</th>
                  <th>TOTAL DE ACERTOS</th>
                  <th>CLASSIFICAÇÃO</th>
                </tr>
              </thead>
              <tbody>
                {acronyms.map((ac, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{ac}</td>
                    <td>{scores[i]}</td>
                    <td>{/* classificação */}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Ícone de informação acima do gráfico, alinhado à direita */}
          <span className="tooltip-icon chart-info-icon" tabIndex={0}>
            ℹ
            <span className="tooltip-text">
              CA (Conhecimento do alfabeto)<br />
              PR (Produção de rima)<br />
              IR (Identificação de rima)<br />
              SS (Segmentação silábica)<br />
              PPf (Produção de palavras a partir do fonema dado)<br />
              SF (Síntese fonêmica)<br />
              AF (Análise fonêmica)<br />
              IFI (Identificação de fonema inicial)<br />
              MOF (Memória operacional fonológica)<br />
              RAN (Nomeação automática rápida)<br />
              LS (Leitura Silenciosa)<br />
              LPPP (Leitura de palavras e não palavras)<br />
              CAF (Compreensão auditiva de sentenças a partir de figuras)
            </span>
          </span>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Resumo;