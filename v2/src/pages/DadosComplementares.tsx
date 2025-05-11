import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { format, differenceInYears } from 'date-fns';
import './DadosComplementares.css';

const DadosComplementares: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { patient } = (location.state as any) || {};

  const [applicationDate, setApplicationDate] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [testType, setTestType] = useState('Pré-Testagem');
  const [course, setCourse] = useState('');
  const [institution, setInstitution] = useState('');
  const [applicant, setApplicant] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) setApplicant(data.user.email || '');
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (applicationDate && patient?.data_nascimento) {
      const computed = differenceInYears(new Date(applicationDate), new Date(patient.data_nascimento));
      setAge(computed);
    }
  }, [applicationDate, patient]);

  if (!patient) return <p>Dados do paciente não disponíveis.</p>;

  return (
    <div className="dados-complementares-container">
      <h1>Dados Complementares da Prova</h1>
      <div className="patient-info">
        <p><strong>Nome:</strong> {patient.nome}</p>
        <p><strong>Data de Nascimento:</strong> {format(new Date(patient.data_nascimento), 'dd/MM/yyyy')}</p>
        <p><strong>Local de Nascimento:</strong> {patient.local_nascimento}</p>
        <p><strong>Sexo:</strong> {patient.sexo}</p>
        <p><strong>Idade:</strong> {age !== null ? age : '-'}</p>
        <p><strong>Aplicador:</strong> {applicant}</p>
      </div>
      <form className="dados-form">
        <div className="form-group">
          <label>Data da Aplicação da prova:</label>
          <input type="date" value={applicationDate} onChange={e => setApplicationDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Testagem:</label>
          <label><input type="radio" name="testType" value="Pré-Testagem" checked={testType === 'Pré-Testagem'} onChange={() => setTestType('Pré-Testagem')} /> Pré-Testagem</label>
          <label><input type="radio" name="testType" value="Pós-Testagem" checked={testType === 'Pós-Testagem'} onChange={() => setTestType('Pós-Testagem')} /> Pós-Testagem</label>
        </div>
        <div className="form-group">
          <label>Curso/Série:</label>
          <input type="text" value={course} onChange={e => setCourse(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Escola/Instituição:</label>
          <input type="text" value={institution} onChange={e => setInstitution(e.target.value)} />
        </div>
        <div className="actions">
          <button type="button" onClick={() => navigate(-1)}>Voltar</button>
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
};

export default DadosComplementares;
