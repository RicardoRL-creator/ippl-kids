# Sistema de Cadastro e Aplicação de Provas

Este projeto é uma aplicação React com TypeScript e Vite, projetada para gerenciar o cadastro de pacientes e a aplicação de provas relacionadas a habilidades de leitura e alfabetização.

## Funcionalidades

- **Cadastro de Pacientes**: Permite buscar pacientes existentes ou cadastrar novos.
- **Aplicação de Provas**: Inclui seções para avaliar habilidades como conhecimento do alfabeto, produção de rimas, segmentação silábica, e outras habilidades metafonológicas.
- **Relatórios**: Geração de relatórios com os resultados das provas.
- **Autenticação**: Sistema de login e registro de usuários com integração ao Supabase.
- **Gerenciamento de Sessões**: Verifica se a conta está em uso em outro dispositivo e gerencia sessões ativas.

## Tecnologias Utilizadas

- React
- TypeScript
- Vite
- Styled-components
- Supabase

## Como Executar o Projeto

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env` com as credenciais do Supabase:
   ```env
   VITE_SUPABASE_URL=<sua_url_supabase>
   VITE_SUPABASE_KEY=<sua_chave_supabase>
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse a aplicação em `http://localhost:5173`.

## Estrutura do Projeto

- `src/pages`: Contém as páginas principais da aplicação, como Cadastro, Login, e Aplicação de Provas.
- `src/supabaseClient.ts`: Configuração e funções auxiliares para integração com o Supabase.
- `src/App.tsx`: Configuração das rotas da aplicação.
- `src/main.tsx`: Ponto de entrada principal do React, configurando o tema e o roteamento.

### Cadastro de Pacientes

O componente de Cadastro de Pacientes permite:

1. **Buscar Pacientes Existentes**:
   - O usuário pode buscar pacientes pelo ID, nome ou CPF.
   - Se o paciente for encontrado, seus dados são exibidos na tela.

2. **Cadastrar Novos Pacientes**:
   - Caso o paciente não seja encontrado, o sistema permite criar um novo cadastro.
   - O formulário de cadastro inclui campos como nome, CPF, data de nascimento, sexo e local de nascimento.
   - Após o preenchimento, os dados são salvos e o usuário é redirecionado para a página de aplicação de provas.

#### Estrutura do Componente

- **Estados**:
  - `search`: Armazena o valor da busca digitada pelo usuário.
  - `patientData`: Contém os dados do paciente encontrado ou `null` se não encontrado.
  - `isNew`: Indica se um novo cadastro está sendo criado.
  - `formData`: Armazena os dados do formulário de cadastro.

- **Funções**:
  - `handleSearchChange`: Atualiza o estado de busca com o valor digitado.
  - `handleSearch`: Busca pacientes em um banco de dados mockado.
  - `handleInputChange`: Atualiza os dados do formulário com os valores digitados.
  - `handleSubmit`: Salva os dados do novo cadastro e redireciona para a próxima página.

- **Navegação**:
  - Utiliza o hook `useNavigate` do React Router para redirecionar o usuário após o cadastro.

#### Estilo

O componente utiliza o arquivo `Register.css` para estilização, garantindo uma interface amigável e responsiva.

### Aplicação de Provas

O componente de Aplicação de Provas gerencia várias seções de avaliação, incluindo:

- **Conhecimento do Alfabeto**: Avalia o reconhecimento de letras.
- **Habilidades Metafonológicas**: Inclui produção de rimas, segmentação silábica, e outras habilidades.
- **Memória Operacional Fonológica**: Testa a capacidade de memória fonológica.
- **Leitura e Compreensão**: Avalia leitura silenciosa, leitura de palavras e pseudopalavras, e compreensão auditiva.

#### Estrutura do Componente

- **Estados**:
  - `currentSection`: Controla a seção atual da prova.
  - `responses`: Armazena as respostas do usuário para cada seção.

- **Funções**:
  - `handleInputChange`: Atualiza as respostas do usuário.
  - `isSectionComplete`: Verifica se todas as respostas de uma seção foram preenchidas.

- **Navegação**:
  - Utiliza botões para avançar ou voltar entre as seções.

## Atualizações Recentes

### Melhorias no Código

- Corrigido um problema no componente `Login.tsx` onde o componente `Header` foi declarado, mas nunca utilizado. A declaração foi removida para evitar confusão e melhorar a legibilidade do código.

### Atualizações na Documentação

- Adicionada uma seção de "Atualizações Recentes" para destacar melhorias e correções no projeto.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está licenciado sob a licença MIT.
