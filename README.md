# Nero Core Platform

## Visão Geral
O Nero Core Platform é uma solução empresarial desenvolvida para centralizar e otimizar processos de gestão, aprovação e monitoramento de ativos digitais e fluxos operacionais. O sistema integra tecnologias modernas de frontend com automações robustas de backend para fornecer uma interface intuitiva, segura e de alto desempenho.

## Objetivos do Projeto
- Centralização de fluxos de trabalho distribuídos.
- Automação de processos de aprovação de materiais publicitários.
- Rastreabilidade total de decisões e ações administrativas.
- Fornecimento de métricas e analytics em tempo real para tomada de decisão.

## Stack Tecnológica

### Frontend
- **React 19**: Framework principal para construção de interfaces.
- **TypeScript**: Garantia de tipagem estática e segurança de código.
- **TailwindCSS 4**: Sistema de estilização utilitário para design responsivo.
- **Radix UI**: Primitivos de componentes acessíveis e customizáveis.
- **TanStack Query**: Gerenciamento eficiente de estado assíncrono e cache de API.
- **Three.js**: Implementação de elementos visuais avançados e shaders via WebGL.

### Backend e Integrações
- **n8n**: Plataforma de automação de fluxo de trabalho (Workflow Engine).
- **Google BigQuery**: Armazenamento e análise de grandes volumes de dados.
- **Google Drive API**: Gestão e persistência de arquivos digitais.
- **SMTP**: Protocolo para comunicações e notificações automatizadas.

## Arquitetura do Sistema
O sistema opera em uma arquitetura desacoplada onde o frontend (React) comunica-se com o backend (n8n Webhook) através de requisições HTTPS protegidas.

### Fluxo de Dados
1. O usuário interage com a interface do Nero Core Platform.
2. O frontend despacha ações específicas para o roteador de webhooks do n8n.
3. O n8n processa a lógica de negócio, interage com o BigQuery para persistência e devolve uma resposta estruturada.
4. O frontend atualiza o estado da aplicação de forma otimista ou via invalidação de cache.

## Estrutura de Diretórios
```text
nero-core-platform/
├── src/
│   ├── components/       # Componentes de interface reutilizáveis
│   ├── contexts/         # Gerenciamento de estado global (Auth, Theme)
│   ├── features/         # Módulos específicos por funcionalidade
│   ├── layouts/          # Estruturas de página (Sidebar, AppShell)
│   ├── lib/              # Configurações de bibliotecas externas (Axios, Utils)
│   ├── pages/            # Componentes de página de alto nível
│   └── types/            # Definições de tipos TypeScript globais
├── public/               # Ativos estáticos públicos
└── documentation/        # Documentação técnica suplementar
```

## Guia de Instalação e Configuração

### Pré-requisitos
- Node.js (Versão 18 ou superior)
- npm ou yarn
- Acesso ao servidor n8n configurado

### Instruçoes de Setup
1. Clone o repositório:
   ```bash
   git clone https://github.com/nero/nero-core-platform.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente em um arquivo `.env`:
   ```env
   VITE_API_URL=https://n8n.exemplo.com.br/webhook/seu-endpoint
   VITE_AUTH_TOKEN=seu-token-de-seguranca
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Padrões de Desenvolvimento
- **Commits Scoped**: Seguir o padrão de Conventional Commits (ex: `feat(approvals): add filter by date`).
- **Clean Code**: Funções pequenas, nomes descritivos e responsabilidade única.
- **Acessibilidade**: Garantir conformidade com as diretrizes WCAG ao utilizar componentes Radix.
- **Performance**: Minimizar re-renders e otimizar o carregamento de imagens e assets pesados.

## Segurança
O sistema implementa múltiplas camadas de segurança:
- Comunicação via HTTPS com TLS 1.3.
- Autenticação baseada em JWT (JSON Web Tokens).
- Proteção de rotas via interceptores de nível de aplicação.
- Validação rigorosa de inputs no frontend e no backend.

---

Este projeto é de propriedade exclusiva e confidencial.
Desenvolvido por **Nero - Grupo OM**.
Última modificação: Fevereiro de 2026.
