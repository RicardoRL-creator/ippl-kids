import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { format, differenceInYears, differenceInMonths, differenceInDays, addYears, addMonths } from 'date-fns';
import './DadosComplementares.css';

const DadosComplementares: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { patient, responses, userAnswers, fromSection } = (location.state as any) || {};

  const [applicationDate, setApplicationDate] = useState('');
  const [ageString, setAgeString] = useState<string>('');
  const [testType, setTestType] = useState('Pré-Testagem');
  const [course, setCourse] = useState('');
  const [institution, setInstitution] = useState('');
  const [applicant, setApplicant] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        const email = authData.user.email || '';
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('user_id', authData.user.id)
          .single();
        const name = profile?.username;
        setApplicant(name ? `${name} (${email})` : email);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (applicationDate && patient?.data_nascimento) {
      const birth = new Date(patient.data_nascimento);
      const appDate = new Date(applicationDate);
      const years = differenceInYears(appDate, birth);
      const afterYears = addYears(birth, years);
      const months = differenceInMonths(appDate, afterYears);
      const afterMonths = addMonths(afterYears, months);
      const days = differenceInDays(appDate, afterMonths);
      setAgeString(`${years} anos, ${months} meses, ${days} dias`);
    }
  }, [applicationDate, patient]);

  useEffect(() => {
    document.body.classList.add('dados-complementares');
    return () => {
      document.body.classList.remove('dados-complementares');
    };
  }, []);

  // Submissão do formulário: salvar no Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;
    // Inserir na tabela 'provas'
    const payload = {
      patient_id: patient.id || patient.cpf,
      application_date: applicationDate,
      test_type: testType,
      course,
      institution,
      responses,
      user_answers: userAnswers,
    };
    const { error } = await supabase.from('provas').insert([payload]);
    if (error) {
      console.error('Erro ao salvar prova:', error);
      alert('Erro ao salvar os dados.');
    } else {
      alert('Dados salvos com sucesso.');
      // opcional: navegar para outra página
      navigate('/');
    }
  };

  if (!patient) return <p>Dados do paciente não disponíveis.</p>;

  return (
    <div className="dados-complementares-container">
      <h1>Dados complementares da prova</h1>
      <div className="patient-info">
        <p><strong>Nome do Paciente:</strong> {patient.nome}</p>
        <p><strong>Data de Nascimento:</strong> {format(new Date(patient.data_nascimento), 'dd/MM/yyyy')}</p>
        <p><strong>Local de Nascimento:</strong> {`${patient.local_nascimento_cidade}, ${patient.local_nascimento_estado}`}</p>
        <p><strong>Sexo:</strong> {patient.sexo}</p>
        <p><strong>Idade:</strong> {ageString || '-'}</p>
        <p><strong>Aplicador:</strong> {applicant}</p>
      </div>
      <form className="dados-form" onSubmit={handleSubmit}>
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
          <button
            type="button"
            onClick={() => navigate('/aplicacao-provas', { state: { patient, responses, userAnswers, initialSection: fromSection } })}
          >
            Voltar
          </button>
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
};

export default DadosComplementares;
