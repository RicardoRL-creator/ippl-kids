// Este arquivo contém a configuração do cliente Supabase e funções auxiliares para autenticação e manipulação de perfis.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rreydxwtutynruzklpex.supabase.co'; // Substitua pela URL do seu projeto
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyZXlkeHd0dXR5bnJ1emtscGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5Mzg0NTQsImV4cCI6MjA2MTUxNDQ1NH0.ULBsMUjaBWCltbNAijfnSwn2cq8LZ1DMnat842cY3Mo'; // Substitua pela chave de API do seu projeto

export const supabase = createClient(supabaseUrl, supabaseKey);

// Função para registrar um novo usuário
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

// Função para autenticar um usuário
export async function signIn(email: string, password: string, deviceId: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  // Registrar a sessão ativa
  await registerActiveSession(email, deviceId);

  return data;
}

// Função para sair do sistema
export async function signOut(email: string): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;

  // Remover a sessão ativa
  await removeSession(email);
}

// Função para registrar um novo usuário e salvar dados adicionais na tabela `profiles`
export async function signUpWithDetails(email: string, password: string, details: { name: string; phone: string; birth_date: string }) {
  // Registrar o usuário no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

  if (authError) throw authError;

  console.log('Auth Data:', authData); // Log para verificar os dados retornados pelo Supabase Auth

  // Garantir que o campo id seja preenchido corretamente
  const userId = authData.user?.id; // Obter o ID do usuário autenticado
  console.log('User ID:', userId); // Log para verificar o ID do usuário

  // Inserir os dados na tabela `profiles`
  if (userId) {
    const { error: profileError } = await supabase.from('profiles').insert({
      user_id: userId, // Relacionar o perfil ao ID do usuário autenticado
      username: details.name, // Usar o nome como username inicial
      email: email, // Adicionar o email
      phone: details.phone, // Adicionar o telefone
      birth_date: details.birth_date, // Adicionar a data de nascimento
      bio: '', // Bio inicial vazia
    });

    if (profileError) throw profileError;
  } else {
    throw new Error('ID do usuário não encontrado após o registro.');
  }

  return authData;
}

// Função para criar um perfil na tabela `profiles`
export async function createProfile(userId: string, username: string, bio: string) {
  const { error } = await supabase.from('profiles').insert({
    user_id: userId,
    username,
    bio,
  });
  if (error) throw error;
}

// Função para buscar o perfil do usuário autenticado
export async function getProfile() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', (await supabase.auth.getUser()).data?.user?.id)
    .single();

  if (error) throw error;
  return data;
}

// Função para atualizar o perfil do usuário autenticado
export async function updateProfile(username: string, bio: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ username, bio })
    .eq('user_id', (await supabase.auth.getUser()).data?.user?.id);

  if (error) throw error;
}

// Função para verificar se o e-mail já está cadastrado
export async function checkIfEmailExists(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('email')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') { // Ignorar erro de "não encontrado"
    throw error;
  }

  return !!data; // Retorna true se o e-mail existir, caso contrário false
}

// Função para verificar se a conta está em uso em outro dispositivo
export async function checkIfAccountInUse(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('active_sessions') // Supondo que exista uma tabela chamada `active_sessions`
    .select('email')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') { // Ignorar erro de "não encontrado"
    throw error;
  }

  return !!data; // Retorna true se a conta estiver em uso, caso contrário false
}

// Função para remover a sessão ativa
export async function removeSession(email: string): Promise<void> {
  console.log(`Tentando remover sessão para o email: ${email}`);
  const { error } = await supabase
    .from('active_sessions')
    .delete()
    .eq('email', email);

  if (error) {
    console.error('Erro ao remover sessão:', error);
    throw error;
  }

  console.log('Sessão removida com sucesso.');
}

// Função para registrar uma sessão ativa
export async function registerActiveSession(email: string, deviceId: string): Promise<void> {
  const { error } = await supabase.from('active_sessions').upsert({
    email,
    device_id: deviceId,
  });

  if (error) throw error;
}