'use client'

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { TenantConfig } from '@/types/checking'

interface TenantContextType {
    tenant: TenantConfig
    setTenant: (config: Partial<TenantConfig>) => void
    applyTheme: () => void
}

const defaultTenant: TenantConfig = {
    tenantId: 'default',
    tenantName: 'NERO27',
    primaryColor: '110 100% 60%',
    secondaryColor: '262 83% 58%',
    accentColor: '78 100% 50%',
    logoUrl: '',
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: ReactNode }) {
    const [tenant, setTenantState] = useState<TenantConfig>(defaultTenant)

    useEffect(() => {
        const stored = localStorage.getItem('nero27-tenant')
        if (stored) {
            try {
                setTenantState({ ...defaultTenant, ...JSON.parse(stored) })
            } catch { /* ignore */ }
        }
    }, [])

    useEffect(() => {
        applyTheme()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tenant])

    const setTenant = (config: Partial<TenantConfig>) => {
        const updated = { ...tenant, ...config }
        setTenantState(updated)
        localStorage.setItem('nero27-tenant', JSON.stringify(updated))
    }

    const applyTheme = () => {
        if (typeof window === 'undefined') return
        const root = document.documentElement
        root.style.setProperty('--primary', tenant.primaryColor)
        root.style.setProperty('--secondary', tenant.secondaryColor)
        root.style.setProperty('--accent', tenant.accentColor)
    }

    return (
        <TenantContext.Provider value={{ tenant, setTenant, applyTheme }}>
            {children}
        </TenantContext.Provider>
    )
}

export function useTenant() {
    const context = useContext(TenantContext)
    if (context === undefined) {
        throw new Error('useTenant must be used within a TenantProvider')
    }
    return context
}
