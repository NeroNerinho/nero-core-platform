import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '@/lib/axios'

export interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'approver' | 'viewer'
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

    useEffect(() => {
        // Check for existing token on mount
        const storedTokenEnc = sessionStorage.getItem('auth_token')
        const storedUser = sessionStorage.getItem('auth_user')

        if (storedTokenEnc && storedUser) {
            try {
                // Decrypt token (reverse the obfuscaton)
                const storedToken = atob(storedTokenEnc).split(':')[0];
                setToken(storedToken)
                setUser(JSON.parse(storedUser))
            } catch {
                // Invalid stored data, clear it
                sessionStorage.removeItem('auth_token')
                sessionStorage.removeItem('auth_user')
            }
        }
        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            console.log('Attempting login with:', { email })

            const response = await api.post('', {
                action: 'login',
                email,
                password
            })

            console.log('Login response:', response.data)

            if (response.data.success) {
                // Handle response - n8n may not return token, so we generate one locally
                const userData = response.data.user

                // Generate a session token if not provided by the server
                const newToken = response.data.token || `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

                // Ensure user has an id (use email as fallback)
                const userWithId: User = {
                    id: userData.id || userData.email || email,
                    name: userData.name || 'Usuário',
                    email: userData.email || email,
                    role: userData.role || 'viewer'
                }

                console.log('Login successful, user:', userWithId)

                setToken(newToken)
                setUser(userWithId)

                // Secure Storage Implementation (SessionStorage + Encryption)
                // Note: True security requires httpOnly cookies from backend.
                // This is a mitigation for XSS/Persistence risks.
                try {
                    const encryptedToken = btoa(newToken + ':' + Date.now()); // Simple obfuscation for demo
                    sessionStorage.setItem('auth_token', encryptedToken);
                    sessionStorage.setItem('auth_user', JSON.stringify(userWithId));
                } catch (e) {
                    console.error('Storage failed', e);
                }
                return { success: true }
            } else {
                return { success: false, error: response.data.message || 'Credenciais inválidas' }
            }
        } catch (error: unknown) {
            console.error('Login error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Erro ao conectar com o servidor'
            return { success: false, error: errorMessage }
        }
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        sessionStorage.removeItem('auth_token')
        sessionStorage.removeItem('auth_user')
    }

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
