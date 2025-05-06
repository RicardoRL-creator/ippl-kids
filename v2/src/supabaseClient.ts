// Este arquivo contém a configuração do cliente Supabase e funções auxiliares para autenticação e manipulação de perfis.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rreydxwtutynruzklpex.supabase.co'; // Substitua pela URL do seu projeto
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyZXlkeHd0dXR5bnJ1emtscGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5Mzg0NTQsImV4cCI6MjA2MTUxNDQ1NH0.ULBsMUjaBWCltbNAijfnSwn2cq8LZ1DMnat842cY3Mo'; // Substitua pela chave de API do seu projeto

export const supabase = createClient(supabaseUrl, supabaseKey);

// Função para registrar um novo usuário
// Esta função utiliza o método signUp do Supabase Auth para criar um novo usuário com email e senha fornecidos.
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

// Função para autenticar um usuário
// Esta função utiliza o método signInWithPassword do Supabase Auth para autenticar um usuário com email e senha fornecidos.
// Além disso, registra a sessão ativa do usuário no sistema.
export async function signIn(email: string, password: string, deviceId: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  // Registrar a sessão ativa
  await registerActiveSession(email, deviceId);

  return data;
}

// Função para sair do sistema
// Esta função utiliza o método signOut do Supabase Auth para encerrar a sessão do usuário.
// Além disso, remove a sessão ativa do usuário no sistema.
export async function signOut(email: string): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;

  // Remover a sessão ativa
  await removeSession(email);
}

// Função para registrar um novo usuário e salvar dados adicionais na tabela `profiles`
// Esta função cria um novo usuário no Supabase Auth e insere informações adicionais na tabela `profiles`.
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
// Esta função insere um novo registro na tabela `profiles` com os dados fornecidos.
export async function createProfile(userId: string, username: string, bio: string) {
  const { error } = await supabase.from('profiles').insert({
    user_id: userId,
    username,
    bio,
  });
  if (error) throw error;
}

// Função para buscar o perfil do usuário autenticado
// Esta função consulta a tabela `profiles` para obter os dados do perfil do usuário atualmente autenticado.
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
// Esta função atualiza os dados do perfil do usuário atualmente autenticado na tabela `profiles`.
export async function updateProfile(username: string, bio: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ username, bio })
    .eq('user_id', (await supabase.auth.getUser()).data?.user?.id);

  if (error) throw error;
}

// Função para verificar se o e-mail já está cadastrado
// Esta função consulta a tabela `profiles` para verificar se o e-mail fornecido já está registrado.
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
// Esta função consulta a tabela `active_sessions` para verificar se o e-mail fornecido está associado a uma sessão ativa.
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
// Esta função exclui o registro da tabela `active_sessions` associado ao e-mail fornecido.
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
// Esta função insere ou atualiza um registro na tabela `active_sessions` com o e-mail e ID do dispositivo fornecidos.
export async function registerActiveSession(email: string, deviceId: string): Promise<void> {
  const { error } = await supabase.from('active_sessions').upsert({
    email,
    device_id: deviceId,
  });

  if (error) throw error;
}