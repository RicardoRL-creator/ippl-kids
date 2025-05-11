import React, { useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

  // Acrônimos e descrições das seções
  const acronyms = ['CA','PR','IR','SS','PPf','SF','AF','IFI','MOF','RAN','LS','LPPP','CAF'];
  const descriptions = [
    'Conhecimento do alfabeto',
    'Produção de rima',
    'Identificação de rima',
    'Segmentação silábica',
    'Produção de palavras a partir do fonema',
    'Síntese fonêmica',
    'Análise fonêmica',
    'Identificação de fonema inicial',
    'Memória operacional fonológica',
    'Nomeação automática rápida',
    'Leitura silenciosa',
    'Leitura de palavras e não palavras',
    'Compreensão auditiva de sentenças a partir de figuras'
  ];

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
      <div className="resumo-content">
        <h1>Resumo da Prova</h1>
        <button className="pdf-button" onClick={() => window.print()}>Gerar PDF</button>
        <div className="info-block">
          <h2>Dados do Paciente</h2>
          <p><strong>Nome:</strong> {patient?.nome}</p>
          <p><strong>Data de Nascimento:</strong> {patient?.data_nascimento && format(new Date(patient.data_nascimento), 'dd/MM/yyyy', { locale: ptBR })}</p>
          <p><strong>Idade:</strong> {ageString}</p>
          <p><strong>Aplicador:</strong> {applicant}</p>
        </div>
        <div className="info-block">
          <h2>Dados da Aplicação</h2>
          <p><strong>Data:</strong> {applicationDate && format(new Date(applicationDate), 'dd/MM/yyyy', { locale: ptBR })}</p>
          <p><strong>Testagem:</strong> {testType}</p>
          <p><strong>Curso/Série:</strong> {course}</p>
          <p><strong>Instituição:</strong> {institution}</p>
        </div>
        <div className="chart-container">
          <Bar data={data} options={options} />
        </div>
        <div className="legend">
          <span className="tooltip-icon" tabIndex={0}>
            ℹ
            <span className="tooltip-text">
              {acronyms.map((ac, i) => (
                <React.Fragment key={i}>
                  <strong>{ac}</strong> = {descriptions[i]}<br />
                </React.Fragment>
              ))}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Resumo;