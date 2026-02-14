export interface Supplier {
    id: string;
    name: string;
    email: string;
    phone?: string;
    category: string;
}

export interface ServiceOrderAttachment {
    id: string;
    filename: string;
    url: string;
    uploadedAt: string;
}

export interface ServiceOrder {
    id: string;
    title: string;
    description: string;
    requesterId: string;
    supplierId?: string;
    status: 'draft' | 'sent' | 'approved' | 'rejected';
    createdAt: string;
    attachments: ServiceOrderAttachment[];
}
