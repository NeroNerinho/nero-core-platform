'use server'

import { createSafeAction } from "@/lib/actions"
import { SupplierSearchSchema } from "@/lib/validation"
import { z } from "zod"

// Define types that match the UI expectations (Legacy Core API structure)
export interface SearchResult {
    success: boolean
    message?: string
    n_pi?: string // Changed from number to string to match usage
    cliente?: string
    campanha?: string
    produto?: string
    veiculo?: string
    meio?: string
    periodo?: string
    status_checking?: string
    can_submit?: boolean
    is_complement?: boolean
}

// Internal function that simulates DB query (or connects to Supabase later)
async function searchPiLogic(data: z.infer<typeof SupplierSearchSchema>): Promise<SearchResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Here we would perform the real Supabase query:
    // const { data: pi } = await supabase.from('pis').select('*').eq('number', data.pi).single()
    // const { data: supplier } = await supabase.from('suppliers').select('*').eq('cnpj', data.cnpj).single()

    // For now, we keep the reliable mock data BUT it lives on the server
    // This means the Client Component DOES NOT know it's mock data. It just calls an API.

    // Validation Logic (Simulated)
    if (data.pi === '000000') {
        return { success: false, message: "PI não encontrada para este fornecedor." }
    }

    // Success Response (Mocking the Core API structure)
    return {
        success: true,
        n_pi: data.pi,
        cliente: "Coca-Cola Brasil",
        campanha: "Natal 2025",
        produto: "Refrigerante",
        veiculo: "Eletromidia",
        meio: "DO", // Digital Out of Home
        periodo: "01/12/2025 - 31/12/2025",
        status_checking: "Pendente",
        can_submit: true,
        is_complement: false
    }
}

// Public Server Action
export async function searchPI(data: z.infer<typeof SupplierSearchSchema>) {
    return createSafeAction(SupplierSearchSchema, searchPiLogic, data)
}
