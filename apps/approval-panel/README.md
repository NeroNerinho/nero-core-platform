# Painel de Aprovação de Checking - Grupo OM

Sistema de aprovação de checkings integrado com N8N e BigQuery para gerenciamento do fluxo de mídia.

## Índice

- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Integração N8N](#integração-n8n)
- [Funcionalidades](#funcionalidades)
- [Estrutura de Diretórios](#estrutura-de-diretórios)
- [API e Endpoints](#api-e-endpoints)
- [Troubleshooting](#troubleshooting)
- [Desenvolvimento](#desenvolvimento)

---

## Arquitetura do Sistema

```
┌─────────────────┐    HTTPS     ┌─────────────────┐    BigQuery/Drive/SMTP
│                 │◄────────────►│                 │◄────────────────────────►
│  Frontend React │              │    N8N Server   │       Serviços Google
│  (Este Projeto) │              │   (Webhook)     │
│                 │              │                 │
└─────────────────┘              └─────────────────┘
        │                                │
        │                                │
        ▼                                ▼
   Navegador Web                 https://n8n.grupoom.com.br
```

### Fluxo de Dados

1. **Frontend** envia requisições HTTP para o webhook N8N
2. **N8N** processa a action (get_pending, approve, reject, etc.)
3. **BigQuery** armazena/retorna dados de checkings
4. **Google Drive** gerencia pastas de histórico de reprovação
5. **SMTP** envia notificações por email

---

## Requisitos

- Node.js 18+ 
- npm 9+
- Acesso ao servidor N8N (https://n8n.grupoom.com.br)
- Credenciais de autenticação (email/senha)

---

## Instalação

```bash
# Clonar ou navegar para o diretório
cd approval-panel

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start
```

O servidor inicia em `http://localhost:8080`

---

## Configuração

### Variáveis de Ambiente

Criar arquivo `.env` na raiz:

```env
API_URL=https://n8n.grupoom.com.br/webhook/painel-aprovacao
```

### Configuração de Build

O projeto usa Webpack com TypeScript:

- **webpack.config.js** - Configuração do bundler
- **tsconfig.json** - Configuração do TypeScript
- **tailwind.config.js** - Customização do Tailwind CSS

---

## Integração N8N

### Actions Disponíveis

O webhook aceita as seguintes actions via POST:

| Action | Descrição | Parâmetros |
|--------|-----------|------------|
| `login` | Autenticação de usuário | `email`, `password` |
| `get_stats` | Estatísticas do dashboard | - |
| `get_pending` | Lista checkings pendentes | - |
| `approve` | Aprovar checking | `id`, `approval_user` |
| `reject` | Reprovar checking | `id`, `reason`, `approval_user`, `pdf_file` (opcional) |
| `health_check` | Status de saúde do sistema | - |
| `get_logs` | Histórico de aprovações | `status`, `dateFrom`, `dateTo`, `cliente` |
| `get_all_checkings` | Todos os checkings | - |

### Exemplo de Requisição

```javascript
// Aprovar um checking
const response = await fetch('https://n8n.grupoom.com.br/webhook/painel-aprovacao', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer <JWT_TOKEN>'
    },
    body: JSON.stringify({
        action: 'approve',
        id: 'checking_id_aqui',
        approval_user: 'usuario@email.com'
    })
});
```

### Modificações Necessárias no N8N

Para funcionamento completo, adicionar ao fluxo N8N:

#### 1. Nova Action `login`

```javascript
// No Router de Ações, adicionar branch para "login"
// Query BigQuery para validar credenciais
// Retornar: { success: true, token: "jwt...", user: { name, email, role } }
```

#### 2. Nova Action `health_check`

```javascript
// Retornar status de conexão com serviços:
{
  "status": "healthy",
  "bigquery": { "connected": true, "latency": 150 },
  "drive": { "connected": true },
  "email": { "connected": true },
  "timestamp": "2026-02-04T12:00:00-03:00"
}
```

#### 3. Modificar `approve` e `reject`

```javascript
// Adicionar campo approval_user ao UPDATE no BigQuery:
UPDATE checking_logs 
SET approval_status = 'APROVADO',
    approval_date = CURRENT_TIMESTAMP(),
    approval_user = @approval_user
WHERE CAST(timestamp AS STRING) = @id
```

---

## Funcionalidades

### Autenticação

- Login com email/senha
- JWT token armazenado no localStorage
- Logout via menu do usuário
- Redirecionamento automático se não autenticado

### Dashboard

- Estatísticas em tempo real (pendentes, aprovados, reprovados)
- Gráficos de fluxo de mídia (Area Chart)
- Radar de eficiência por cliente
- Tabela de logs recentes
- Monitor de saúde do sistema

### Aprovações

- Lista de checkings pendentes em cards
- Botão de aprovar (verde)
- Modal de reprovação com campo de motivo e upload de PDF
- Badge de reenvio (quando checking foi reprovado antes)
- Link direto para pasta no Google Drive

### Relatórios

- Filtros por status, data e cliente
- Exportar para Excel (.xlsx)
- Exportar para PDF
- Imprimir relatório
- Preview dos dados antes de exportar

### Monitoramento

- Status de conexão BigQuery, Drive e SMTP
- Latência da API em tempo real
- Gráficos de CPU e memória (simulados)
- Atualização automática a cada 30 segundos

---

## Estrutura de Diretórios

```
public/               # Arquivos estáticos
├── favicon.png       # Favicon
├── logo-grupoom.png  # Logo principal
├── company-signatures.png # Assinaturas
├── logo-opus.png     # Logo Opus
├── logo-dom.png      # Logo D'OM
├── logo-senso.png    # Logo Senso
├── logo-americas.png # Logo Américas
└── logo-pixel.png    # Logo Pixel

src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (Button, Card, Dialog, etc.)
│   ├── GlobalSearch.tsx
│   ├── LiveSystemStatus.tsx
│   ├── ProtectedRoute.tsx
│   └── UserMenu.tsx
├── contexts/           # React Contexts
│   └── AuthContext.tsx # Autenticação e gerenciamento de sessão
├── features/           # Módulos de funcionalidade
│   ├── approvals/      # Aprovações
│   │   ├── hooks/      # usePending, useMutations
│   │   └── types.ts    # Tipos TypeScript
│   └── dashboard/      # Dashboard
│       ├── api.ts      # useStats hook
│       └── components/ # StatsGrid, AreaChart, RadarChart
├── layouts/            # Layouts da aplicação
│   ├── AppShell.tsx    # Layout principal
│   └── Sidebar.tsx     # Barra lateral
├── lib/                # Utilitários
│   ├── axios.ts        # Configuração do Axios com interceptors
│   ├── exportUtils.ts  # Funções de exportação Excel/PDF
│   └── utils.ts        # Utilitários gerais (cn)
├── pages/              # Páginas da aplicação
│   ├── Approvals.tsx   # Página de aprovações
│   ├── Dashboard.tsx   # Página inicial
│   ├── Login.tsx       # Página de login
│   ├── Reports.tsx     # Página de relatórios
│   └── Settings.tsx    # Configurações
└── App.tsx             # Rotas da aplicação
```

---

## API e Endpoints

### Axios Configuration

```typescript
// src/lib/axios.ts
// Base URL: process.env.API_URL
// Interceptors:
// - Request: Adiciona Authorization header com JWT
// - Response: Redireciona para /login se 401
```

### Tipos de Dados

```typescript
// Checking Item
interface CheckingItem {
    id: string
    data_envio: string
    n_pi: string
    cliente: string
    veiculo: string
    fornecedor: string
    email: string
    webViewLink: string
    totalArquivos: number
    approval_status: "PENDENTE" | "APROVADO" | "REPROVADO"
    rejection_count: number
    rejection_reason?: string
    is_resubmission: boolean
    display_status: string
    button_type: "standard" | "confirm"
}

// User
interface User {
    id: string
    name: string
    email: string
    role: "admin" | "approver" | "viewer"
}
```

---

## Troubleshooting

### Erro: "Não foi possível conectar ao servidor"

**Causa**: Webhook N8N inativo ou URL incorreta.

**Solução**:
1. Verificar se o workflow está ativo no N8N
2. Confirmar URL no arquivo `.env`
3. Checar CORS headers no webhook N8N

### Erro: "Token inválido ou expirado"

**Causa**: JWT expirou ou foi invalidado.

**Solução**:
1. Fazer logout e login novamente
2. Limpar localStorage: `localStorage.clear()`

### Erro: "Falha ao exportar Excel/PDF"

**Causa**: Dados inválidos ou biblioteca não carregada.

**Solução**:
1. Verificar se há dados na tabela
2. Reinstalar dependências: `npm install xlsx file-saver jspdf`

### Sistema de Saúde mostra "Offline"

**Causa**: Action `health_check` não implementada no N8N.

**Solução**:
1. Adicionar action `health_check` no fluxo N8N
2. Retornar status de conexão dos serviços

### Cards não estão alinhados

**Causa**: CSS do grid não aplicado corretamente.

**Solução**:
1. Verificar classe `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
2. Limpar cache do navegador

---

## Desenvolvimento

### Comandos Disponíveis

```bash
npm start      # Servidor de desenvolvimento (port 8080)
npm run build  # Build de produção
npm run lint   # Verificar erros de linting
```

### Adicionando Novos Componentes UI

Os componentes base seguem o padrão shadcn/ui com Radix primitives:

```bash
# Exemplo: criar novo componente
# 1. Criar arquivo em src/components/ui/
# 2. Usar padrão de forwardRef
# 3. Aplicar cn() para classes condicionais
```

### Stack Tecnológica

- **React 19** - Framework UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **Radix UI** - Primitivos acessíveis
- **TanStack Query** - Gerenciamento de estado assíncrono
- **Recharts** - Gráficos
- **xlsx + jspdf** - Exportação de dados
- **Axios** - Requisições HTTP
- **Webpack** - Bundler

---

## Creditos

Desenvolvido por **Nero** - Grupo OM

© 2026 Grupo OM. Todos os direitos reservados.
