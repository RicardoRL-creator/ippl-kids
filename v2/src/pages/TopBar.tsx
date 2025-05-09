import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, signOut } from '../supabaseClient';
import './TopBar.css'; // Estilo exclusivo para o TopBar

const TopBar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Erro ao obter dados do usuário:', error);
        setLoading(false);
        return;
      }

      if (user) {
        setUserEmail(user.email || '');

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('username')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Erro ao obter o perfil do usuário:', profileError);
        } else {
          setUserName(profile?.username || 'Usuário');
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      if (!userEmail) {
        console.error('E-mail do usuário não encontrado.');
        return;
      }
      await signOut(userEmail);
      navigate('/login');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <div className="top-bar">
      <img src="../../public/logo.png" alt="Logo" className="top-bar-logo" />
      <div className="top-bar-user-info">
        {loading ? (
          <span>Carregando...</span>
        ) : (
          <span>{userName} ({userEmail})</span>
        )}
        <button className="top-bar-logout" onClick={handleSignOut}>Sair</button>
      </div>
    </div>
  );
};

export default TopBar;
