// ==========================
// Approval Panel Types (from approval-panel port)
// ==========================
export type ApprovalStatus = "PENDENTE" | "APROVADO" | "REPROVADO"

export interface ApprovalCheckingItem {
    id: string
    data_envio: string
    n_pi: string
    cliente: string
    veiculo: string
    fornecedor: string
    email: string
    webViewLink: string
    totalArquivos: number
    approval_status: ApprovalStatus
    rejection_count: number
    rejection_reason?: string
    rejection_pdf_link?: string
    is_resubmission: boolean
    display_status: string
    button_type: "standard" | "confirm"
}

// ==========================
// Kanban / Checking Pipeline Types
// ==========================
export type CheckingStatus =
    | 'pending_docs'
    | 'ocr_processing'
    | 'compliance_check'
    | 'payment_ready'
    | 'completed'

export interface CheckingSupplier {
    name: string
    cnpj: string
    category: string
}

export interface CheckingInvoice {
    number: string
    amount: number
    issueDate: string
    dueDate: string
}

export interface CheckingValidation {
    ocrMatch: boolean
    agencyCommission: number
    cenpCompliance: boolean
    geofenceValid?: boolean
}

export interface CheckingItem {
    id: string
    title: string
    description: string
    status: CheckingStatus
    priority: 'high' | 'medium' | 'low'
    supplier: CheckingSupplier
    invoice?: CheckingInvoice
    validation: CheckingValidation
    createdAt: string
    updatedAt: string
}

export const CHECKING_COLUMNS: { id: CheckingStatus; title: string }[] = [
    { id: 'pending_docs', title: 'Documentos Pendentes' },
    { id: 'ocr_processing', title: 'Processamento OCR' },
    { id: 'compliance_check', title: 'Verificação CENP' },
    { id: 'payment_ready', title: 'Pronto p/ Pagamento' },
    { id: 'completed', title: 'Concluído' },
]

// ==========================
// Auth & Tenant Types
// ==========================
export interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'approver' | 'viewer'
}

export interface TenantConfig {
    tenantId: string
    tenantName: string
    primaryColor: string
    secondaryColor: string
    accentColor: string
    logoUrl: string
}
