'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '@/services/api'
import { useRouter, usePathname } from 'next/navigation'

export interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'approver' | 'viewer' | 'supplier'
    avatar?: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Check for existing token on mount
        const storedTokenEnc = typeof window !== 'undefined' ? sessionStorage.getItem('auth_token') : null
        const storedUser = typeof window !== 'undefined' ? sessionStorage.getItem('auth_user') : null

        if (storedTokenEnc && storedUser) {
            try {
                // Decrypt token (reverse the obfuscation)
                const storedToken = atob(storedTokenEnc).split(':')[0]
                setToken(storedToken)
                setUser(JSON.parse(storedUser))
            } catch {
                if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('auth_token')
                    sessionStorage.removeItem('auth_user')
                }
            }
        }
        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            console.log('Attempting login with:', { email })

            // MASTER USER BYPASS (Bypass para acesso de desenvolvimento)
            if (email === 'master@nero27.com.br' && password === 'master2026') {
                const masterUser: User = {
                    id: 'master-id',
                    name: 'Nero Master',
                    email: 'master@nero27.com.br',
                    role: 'admin',
                    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH-pcW03nJS4eux-9Io0_7jEUjzjGSTq1NGTAAiSxP0MOOf7BEiHGuak9gl35hfsBouXvUneqAQhNi-bbUCuGPy-EnHHrpVow7ZEGRZUqbbrwgWxKukwXA68Ou-qAANtgUV1SYQL9-azryIEpB7NJ_k-sVJrsf55fgP1bJJRH0LCEv59BLDIcBegfr0vzzEBBkG_99s6oXCZHpbVtIV9brlkf7WgXQiqsK_lp0BhDAQnLzP7F-MxIb-UujE8Hixj3Defr27Xhb-ss'
                }
                const masterToken = `master_session_${Date.now()}`

                setToken(masterToken)
                setUser(masterUser)

                const encryptedToken = btoa(masterToken + ':' + Date.now())
                sessionStorage.setItem('auth_token', encryptedToken)
                sessionStorage.setItem('auth_user', JSON.stringify(masterUser))

                return { success: true }
            }

            // Call Core API API
            const response = await api.post('', {
                action: 'login',
                email,
                password
            })

            console.log('Login response:', response.data)

            if (response.data.success) {
                const userData = response.data.user || {}

                // Generate a session token
                const newToken = response.data.token || `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

                const userWithId: User = {
                    id: userData.id || userData.email || email,
                    name: userData.name || 'Usuário',
                    email: userData.email || email,
                    role: userData.role || 'viewer',
                    avatar: userData.avatar
                }

                setToken(newToken)
                setUser(userWithId)

                try {
                    const encryptedToken = btoa(newToken + ':' + Date.now())
                    sessionStorage.setItem('auth_token', encryptedToken)
                    sessionStorage.setItem('auth_user', JSON.stringify(userWithId))
                } catch (e) {
                    console.error('Storage failed', e)
                }
                return { success: true }
            } else {
                return { success: false, error: response.data.message || 'Credenciais inválidas' }
            }
        } catch (error: any) {
            console.error('Login error:', error)
            const errorMessage = error.response?.data?.message || error.message || 'Erro ao conectar com o servidor'
            return { success: false, error: errorMessage }
        }
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        sessionStorage.removeItem('auth_token')
        sessionStorage.removeItem('auth_user')
        router.push('/login')
    }

    // Protected Route Logic (Client-side)
    useEffect(() => {
        if (!isLoading) {
            const publicPaths = ['/login', '/signup', '/portal', '/', '/logo.png']
            const isPublic = publicPaths.some(p => pathname === p || pathname.startsWith('/portal/'))

            if (!token && !isPublic) {
                router.push('/login')
            }
        }
    }, [isLoading, token, pathname, router])


    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token && !!user,
                isLoading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
