'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api, endpoints } from "@/lib/axios"
import { useAuth } from "@/components/providers/AuthProvider"

export function useApprove() {
    const queryClient = useQueryClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: async (id: string) => {
            await api.post(endpoints.webhook, {
                action: 'approve',
                id,
                approval_user: user?.email || 'unknown'
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pending-checkings'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
        }
    })
}

export function useReject() {
    const queryClient = useQueryClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: async ({ id, reason, file }: { id: string, reason: string, file: File | null }) => {
            const formData = new FormData()
            formData.append('action', 'reject')
            formData.append('id', id)
            formData.append('reason', reason)
            formData.append('approval_user', user?.email || 'unknown')
            if (file) {
                formData.append('pdf_file', file)
            }
            await api.post(endpoints.webhook, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pending-checkings'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
        }
    })
}
