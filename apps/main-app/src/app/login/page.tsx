'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/providers/AuthProvider'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Loader2, ArrowRight, Shield, Zap } from 'lucide-react'



export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const router = useRouter()
    const { login } = useAuth()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Validate Input
        if (!email || !password) {
            setError('Preencha todos os campos.')
            setLoading(false)
            return
        }

        try {
            const result = await login(email, password)

            if (!result.success) {
                console.error('Login error:', result.error)
                setError(result.error || 'Erro ao autenticar.')
                setLoading(false)
            } else {
                // Successful Login
                router.refresh() // Refresh to update server components
                router.push('/dashboard')
            }
        } catch (err) {
            setError('Erro inesperado. Contate o suporte.')
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center">

            {/* Content */}
            <div className={`relative z-10 w-full max-w-md px-6 transition-all duration-1000 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {/* Logo */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-black tracking-tighter text-white mb-2">
                        NERO<span className="text-primary">27</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium tracking-wider uppercase">
                        Centro de Comando de Mídia
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50">
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-white tracking-tight mb-1">Acessar Plataforma</h2>
                        <p className="text-sm text-gray-500">Entre com suas credenciais para continuar</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">E-mail</label>
                            <Input
                                type="email"
                                placeholder="seu@email.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 h-12 rounded-xl focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Senha</label>
                                <Link href="#" className="text-xs text-primary/70 hover:text-primary transition-colors font-medium">
                                    Esqueceu?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-black/40 border-white/10 text-white h-12 rounded-xl pr-10 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <Shield className="h-4 w-4 text-red-400 flex-shrink-0" />
                                <p className="text-red-400 text-xs font-medium">{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-black font-black text-sm rounded-xl shadow-[0_0_30px_rgba(0,255,100,0.15)] hover:shadow-[0_0_40px_rgba(0,255,100,0.25)] transition-all group"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    ENTRAR
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-xs text-gray-500">
                            Novo por aqui?{' '}
                            <Link href="/signup" className="text-primary hover:text-primary/80 font-bold transition-colors">
                                Criar conta
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 mt-6">
                    <Shield className="h-3 w-3 text-gray-600" />
                    <span className="text-[10px] text-gray-600 font-medium tracking-wider uppercase">
                        Conexão Segura • SSL 256-bit
                    </span>
                    <Zap className="h-3 w-3 text-gray-600" />
                </div>
            </div>
        </div>
    )
}
