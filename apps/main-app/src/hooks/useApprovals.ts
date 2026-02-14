import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'

export interface ApprovalItem {
    id: string
    n_pi: string
    cliente: string
    veiculo?: string
    data_envio: string
    fornecedor?: string
    webViewLink?: string
    status: 'pending' | 'approved' | 'rejected'
    rejection_reason?: string
}

export function usePending() {
    return useQuery({
        queryKey: ['approvals', 'pending'],
        queryFn: async () => {
            const response = await api.post('', { action: 'get_pending_approvals' })
            if (response.data.success) {
                return response.data.data as ApprovalItem[]
            }
            // Mock data if API fails or returns nothing
            return [
                {
                    id: '1',
                    n_pi: '2024-5001',
                    cliente: 'Coca-Cola',
                    veiculo: 'Jovem Pan',
                    data_envio: '12/02/2026',
                    fornecedor: 'Jovem Pan Ltda',
                    webViewLink: 'https://drive.google.com',
                    status: 'pending'
                },
                {
                    id: '2',
                    n_pi: '2024-5002',
                    cliente: 'McDonalds',
                    veiculo: 'Elemidia',
                    data_envio: '12/02/2026',
                    fornecedor: 'Elemidia S.A.',
                    webViewLink: 'https://drive.google.com',
                    status: 'pending'
                }
            ] as ApprovalItem[]
        }
    })
}

export function useApprove() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            return await api.post('', { action: 'approve_checking', id })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['approvals'] })
        }
    })
}

export function useReject() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, reason, file }: { id: string, reason: string, file: File | null }) => {
            const formData = new FormData()
            formData.append('action', 'reject_checking')
            formData.append('id', id)
            formData.append('reason', reason)
            if (file) formData.append('file', file)

            return await api.post('', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['approvals'] })
        }
    })
}
