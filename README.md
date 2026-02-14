# Nero Core Platform - Sistema de Checking e Aprovação

## Visão Geral
O Nero Core Platform é uma infraestrutura empresarial desenvolvida para o Grupo OM, projetada para gerenciar fluxos de trabalho de checking e aprovação de materiais publicitários. O sistema atua como um hub centralizado que conecta fornecedores, aprovadores e sistemas de armazenamento, eliminando processos manuais e garantindo a rastreabilidade total das operações.

### Objetivos Estratégicos
- **Centralização Operacional**: Eliminação do uso de e-mails para aprovação de materiais.
- **Auditoria e Compliance**: Registro histórico de todas as decisões (aprovações e reprovações).
- **Eficiência Logística**: Notificações automáticas e gestão de ativos digitais em tempo real.
- **Gestão de Dados**: Monitoramento de métricas de produtividade e status de materiais através de dashboards dinâmicos.

---

## 1. Visão Técnica do Sistema

### Stack Tecnológica
A plataforma utiliza as tecnologias mais recentes para garantir escalabilidade e segurança:

- **Frontend**: React 19, TypeScript, TailwindCSS 4, Radix UI, TanStack Query, Axios, Recharts, Three.js, Webpack.
- **Backend (n8n)**: Mecanismo de fluxo de trabalho para processamento de lógica de negócio.
- **Banco de Dados**: Google BigQuery para armazenamento persistente de dados estruturados.
- **Armazenamento**: Google Drive API para gestão de arquivos e comprovações.
- **Notificação**: Protocolos SMTP para envio de relatórios e notificações de status.

### Arquitetura de Alto Nível
O sistema segue um modelo cliente-servidor desacoplado:
1. **Camada de Apresentação**: Single Page Application (SPA) desenvolvida em React.
2. **Camada de Orquestração**: Workflow Engine n8n atuando como gateway de API e controlador de lógica.
3. **Camada de Dados e Serviços**: Integrações com Google Cloud Platform (BigQuery e Drive).

---

## 2. Arquitetura de Segurança

O sistema implementa quatro camadas de proteção para garantir a integridade dos dados e o controle de acesso:

### Camada de Transporte
- Utilização obrigatória de HTTPS com protocolo TLS 1.3 para criptografia de dados em trânsito.

### Camada de Autenticação
- Autenticação baseada em credenciais (e-mail e senha).
- Emissão de tokens JWT (JSON Web Tokens) gerenciados via `AuthContext`.
- Persistência segura de sessão e validação em cada requisição ao backend.

### Camada de Autorização
- Controle de acesso baseado em papéis (RBAC): Admin, Approver e Viewer.
- `ProtectedRoute` para validação de acesso em nível de rota no frontend.
- Inserção automática de headers `Bearer` via interceptores Axios.

### Camada de Resposta
- Tratamento centralizado de erros de autorização (HTTP 401).
- Encerramento automático de sessão e redirecionamento em caso de tokens expirados.

---

## 3. Integração com N8N (API Endpoints)

A comunicação entre o frontend e o motor de automação é realizada via Webhooks POST.

**URL Base**: `https://n8n.grupoom.com.br/webhook/painel-aprovacao`

### Actions Disponíveis

#### login
- **Função**: Validação de credenciais de acesso.
- **Payload**: `{ "action": "login", "email": "...", "password": "..." }`
- **Retorno**: Objeto contendo status de sucesso, perfil do usuário e metadados de sessão.

#### get_stats
- **Função**: Recuperação de métricas globais para o dashboard.
- **Payload**: `{ "action": "get_stats" }`
- **Retorno**: Contagem agregada de materiais pendentes, aprovados e reprovados.

#### get_pending
- **Função**: Listagem de checkings aguardando revisão.
- **Payload**: `{ "action": "get_pending" }`
- **Retorno**: Array de objetos contendo ID, n_pi, cliente, veículo, fornecedor e links para visualização de arquivos.

#### approve
- **Função**: Registro de aprovação de material.
- **Payload**: `{ "action": "approve", "id": "...", "approval_user": "..." }`
- **Ações de Backend**: Atualização de status no BigQuery e registro de timestamp.

#### reject
- **Função**: Registro de reprovação com justificativa técnica.
- **Payload**: `{ "action": "reject", "id": "...", "reason": "...", "approval_user": "...", "pdf_file": "..." }`
- **Ações de Backend**: Atualização no BigQuery, upload de documento de justificativa ao Drive e disparo de e-mail ao fornecedor.

#### health_check
- **Função**: Monitoramento de status dos serviços integrados.
- **Payload**: `{ "action": "health_check" }`
- **Retorno**: Status de conectividade com BigQuery, Google Drive e SMTP.

---

## 4. Estrutura de Componentes Críticos

### GlobalSearch
Localizado em `src/components/GlobalSearch.tsx`, este componente implementa uma busca em tempo real com debounce de 300ms, pesquisando por múltiplos campos (cliente, PI, veículo, fornecedor) e oferecendo navegação direta para os resultados.

### Visualização de Dados (Shaders e Gráficos)
- **WebGLShader**: Implementação em Three.js para planos de fundo dinâmicos no login.
- **ElectricWavesShader**: Visualização interativa no dashboard.
- **Recharts**: Utilizado para visualização de tendências e status operacionais no módulo de relatórios.

---

## 5. Fluxos de Operação

### Fluxo de Aprovação de Materiais
1. **Submissão**: O material é enviado via sistema externo e registrado no BigQuery.
2. **Identificação**: O aprovador visualiza a lista de pendentes no Nero Core Platform.
3. **Revisão**: Acesso aos materiais originais via integração com Google Drive.
4. **Decisão**:
   - **Aprovação**: O sistema atualiza o registro e remove o item da fila de pendentes.
   - **Reprovação**: O aprovador fornece o motivo, anexa documentação técnica opcional e o sistema notifica o fornecedor automaticamente, movendo o material para o histórico.

### Fluxo de Manutenção
- **Adição de Funcionalidades**: Novas ações devem ser registradas no "Router de Ações" do n8n e consumidas via hooks personalizados no frontend (ex: `usePending.ts`).
- **Layout**: O sistema utiliza o padrão Glassmorphism através de classes Tailwind customizadas (`bg-black/40 backdrop-blur-xl border-white/10`).

---

## 6. Troubleshooting

- **Falha de Carregamento de Dados**: Verificar conectividade com o Webhook e validade do token Bearer no Header.
- **Erros de CORS**: Garantir que as configurações de cabeçalho no nó de resposta do n8n permitam a origem do frontend.
- **Session Expire**: O sistema redirecionará para o login caso o interceptor Axios identifique um status 401.

---

## 7. Instruções de Setup

### Requisitos Mínimos
- Ambiente Node.js 18+.
- Variáveis de ambiente configuradas no arquivo `.env` para apontar para os endpoints de produção ou homologação.

### Instalação
```bash
npm install
npm run dev
```

---

© 2026 Grupo OM - Documentação Técnica Confidencial.
Desenvolvido por Nero.
