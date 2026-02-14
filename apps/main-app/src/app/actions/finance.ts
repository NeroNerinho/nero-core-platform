'use server'

import { createSafeAction } from "@/lib/actions"
import { z } from "zod" // We might need validation later

// Define the type locally or import if shared (better to mirror DB schema)
export interface ReceivableTitle {
    id: string
    titleNumber: string
    payerName: string
    value: number
    issueDate: string
    dueDate: string
    status: 'open' | 'paid' | 'overdue'
}

// Mock Data Source (to be replaced by Supabase)
const DB_RECEIVABLES: ReceivableTitle[] = [
    {
        id: '1',
        titleNumber: 'DUP-1020',
        payerName: 'Cliente Alpha Ltda',
        value: 5400.00,
        issueDate: '2025-10-05',
        dueDate: '2025-11-05',
        status: 'open'
    },
    {
        id: '2',
        titleNumber: 'DUP-1021',
        payerName: 'Loja Beta S.A.',
        value: 1250.00,
        issueDate: '2025-10-06',
        dueDate: '2025-10-20',
        status: 'paid'
    },
    {
        id: '3',
        titleNumber: 'DUP-1025',
        payerName: 'Agência Gamma Publicidade',
        value: 8500.50,
        issueDate: '2025-09-15',
        dueDate: '2025-10-15',
        status: 'overdue'
    }
]

async function getReceivablesLogic(_: void): Promise<ReceivableTitle[]> {
    // Simulate DB Latency
    await new Promise(resolve => setTimeout(resolve, 500))

    // In a real app:
    // const { data } = await supabase.from('receivables').select('*')
    // return data

    return DB_RECEIVABLES
}

// No input schema needed for list all, but good practice to have one
const EmptySchema = z.void()

export async function getReceivables() {
    // We can skip createSafeAction if we just want data, but let's be consistent if we want error handling
    return getReceivablesLogic()
}
