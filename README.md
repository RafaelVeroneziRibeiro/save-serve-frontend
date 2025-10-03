# 📊 Save & Serve IA - Frontend

## Descrição

Este projeto foi desenvolvido para o **Hackathon AI Challenge**, proposto na **SECOM 2025 - UFSC**.  
Trata-se do **frontend do Save & Serve IA**, uma plataforma inteligente para análise de dados e prevenção de perdas de alimentos.  
A solução é focada em otimizar a gestão de **mercados, hortifrutis e varejistas do setor alimentício**.

## Equipe de Desenvolvimento

Este projeto foi concebido e desenvolvido pela seguinte equipe:

- Gabriel Baggio  
- Rafael Ribeiro  
- Rogério Batisti  
- Tiago Raimundi  
- Vinicius Miranda  

## Tecnologias Utilizadas

* **Framework Principal:** React  
* **Linguagem:** TypeScript  
* **Build Tool:** Vite  
* **Estilização:** Tailwind CSS  
* **Ícones:** Lucide React  
* **Arquitetura:**  
  * Component-Based Architecture  
  * Gerenciamento de estado com Hooks customizados (State Encapsulation)  

## Pré-requisitos

Para executar o projeto, você precisa ter instalado em sua máquina:

* **Node.js** (versão 18.x ou superior)  
* **npm** ou **Yarn**  

## Como Executar o Projeto Localmente

1. Clone este repositório:
    ```bash
    git clone https://github.com/RafaelVeroneziRibeiro/save-serve-frontend.git
    ```
2. Navegue até o diretório do projeto:
    ```bash
    cd save-serve-frontend
    ```
3. Instale as dependências:
    ```bash
    npm install
    ```
    ou, se estiver usando Yarn:
    ```bash
    yarn
    ```
4. Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
    ou, com Yarn:
    ```bash
    yarn dev
    ```
5. Abra seu navegador e acesse:  
   [http://localhost:5173](http://localhost:5173) (ou a porta indicada no seu terminal).  

## Testes

Para acessar a aplicação com dados mockados, utilize as seguintes credenciais:

* **Email:** admin@mercado.com  
* **Senha:** 123  

## Estrutura do Projeto

A estrutura de pastas foi organizada para garantir escalabilidade e fácil manutenção:

src/
├── components/ # Componentes de UI reutilizáveis (botões, cards, etc.)
│ ├── layout/ # Componentes estruturais (Header, Navigation)
│ └── tabs/ # Componentes que representam cada aba da aplicação
│
├── hooks/ # Hooks customizados para encapsular lógicas de negócio
│
├── pages/ # Componentes que representam páginas completas (Login, etc.)
│
├── types/ # Definições de tipos e interfaces do TypeScript
│
├── App.tsx # Componente raiz que controla a renderização
└── main.tsx # Ponto de entrada da aplicação React


---

**Hackathon AI Challenge - SECOM 2025 UFSC**
