export type InvoiceStatus = 'pending' | 'paid' | 'cancelled' | 'overdue';

export interface Invoice {
    id: string;
    number: string;
    sacadoEmail: string;
    value: number;
    issueDate: string; // ISO Date
    dueDate: string; // ISO Date
    status: InvoiceStatus;
    xmlUrl?: string;
    pdfUrl?: string;
    lastUpdate: string; // ISO Date
}

export interface ReceivableTitle {
    id: string;
    titleNumber: string;
    payerName: string;
    value: number;
    dueDate: string;
    issueDate: string;
    status: 'open' | 'paid' | 'renegotiated';
    bankSlipUrl?: string;
}

export interface CashFlowEntry {
    id: string;
    date: string;
    description: string;
    category: string;
    type: 'income' | 'expense';
    value: number;
    status: 'projected' | 'realized';
}
