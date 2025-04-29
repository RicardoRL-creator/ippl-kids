# IPPL Kids - Aplicativo de Avaliação de Alfabetização

Este projeto é um app web para aplicação do **Protocolo de Identificação Precoce dos Problemas de Leitura (IPPL)**, destinado a **fonoaudiólogos** aplicarem testes em **crianças do 1º e 2º ano**. O objetivo é substituir as folhas físicas por um ambiente digital, mais rápido, visual e seguro.

## 🛠 Tecnologias

- **React.js** com **TypeScript**
- **Styled Components** para estilização
- **React Router** para navegação entre telas
- **Vercel** para deploy
- **GitHub Codespaces** para desenvolvimento 100% na nuvem

## 🎨 Estilo

O app utiliza um visual **infantil** e **acolhedor**, com:
- Cores suaves (pastel)
- Ícones amigáveis (lápis, livros)
- Interface simples, focada na usabilidade rápida em atendimentos.

## 📚 Estrutura de Telas

1. **Cadastro da Criança** (`/`)
2. **Aplicação das Provas** (`/provas`)
3. **Resumo dos Acertos** (`/resumo`)
4. **Classificação da Criança** (`/classificacao`)
5. **Relatório Final** (`/relatorio`)

## 📈 Funcionalidades

- Marcar acertos (1) e erros (0) em cada item do protocolo.
- Totalizar acertos automaticamente.
- Comparar os resultados com tabelas de classificação de 1º e 2º ano.
- Gerar um gráfico de desempenho.
- Permitir exportar relatórios em PDF.

## 🚀 Rodar o projeto localmente no Codespaces

```bash
npx create-react-app ippl-kids --template typescript
cd ippl-kids
npm install styled-components
npm install @types/styled-components -D
npm install react-router-dom

