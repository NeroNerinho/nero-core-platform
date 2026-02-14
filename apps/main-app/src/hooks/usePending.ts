'use client'

import type { CheckingItem } from "@/types/checking"
import { useQuery } from "@tanstack/react-query"
import { api, endpoints } from "@/lib/axios"

export const fetchPending = async (): Promise<CheckingItem[]> => {
    const { data } = await api.post(endpoints.webhook, { action: 'get_pending' });
    return data.checkings || [];
}

export function usePending() {
    return useQuery({
        queryKey: ['pending-checkings'],
        queryFn: fetchPending
    })
}
