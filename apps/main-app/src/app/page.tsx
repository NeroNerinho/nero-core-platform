'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight, CheckCircle2, Shield, BarChart3, Zap, Users, FileCheck,
  Monitor, Camera, Globe, ChevronDown, Sparkles, TrendingUp, Clock,
  Building2
} from 'lucide-react'

// Animated counter hook
function useCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [started, target, duration])

  return { count, ref }
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const stat1 = useCounter(12847)
  const stat2 = useCounter(98)
  const stat3 = useCounter(247)
  const stat4 = useCounter(45)

  return (

    <div className="min-h-screen bg-transparent text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tighter">
            NERO<span className="text-primary">27</span>
          </h1>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-wider">Funcionalidades</a>
            <a href="#how-it-works" className="text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-wider">Como Funciona</a>
            <a href="#stats" className="text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-wider">Números</a>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="text-gray-400 hover:text-white text-xs font-bold">
              <Link href="/portal">Portal Fornecedor</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 text-black font-black text-xs px-6 shadow-[0_0_20px_rgba(0,255,100,0.15)]">
              <Link href="/login">ACESSAR PAINEL <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className={`relative z-10 max-w-5xl mx-auto px-6 text-center transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold mb-8">
            <Sparkles className="h-3 w-3" /> CHECKING 2.0 — PLATAFORMA UNIFICADA
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
            O CENTRO DE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-primary">COMANDO</span><br />
            DA SUA MÍDIA
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Automatize o checking de mídia, gerencie fornecedores e aprove comprovantes em tempo real.
            Tudo em uma plataforma premium.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-14 px-10 bg-primary hover:bg-primary/90 text-black font-black text-sm rounded-xl shadow-[0_0_40px_rgba(0,255,100,0.2)] hover:shadow-[0_0_60px_rgba(0,255,100,0.3)] transition-all group">
              <Link href="/login">
                ACESSAR PAINEL
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-xl backdrop-blur-md">
              <Link href="/portal">
                <Building2 className="mr-2 h-4 w-4" /> PORTAL DO FORNECEDOR
              </Link>
            </Button>
          </div>

          <a href="#how-it-works" className="inline-flex items-center gap-1 mt-16 text-gray-500 hover:text-white transition-colors animate-bounce">
            <ChevronDown className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              COMO <span className="text-primary">FUNCIONA</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Do envio à aprovação em 3 passos simples
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Fornecedor Envia', desc: 'O fornecedor acessa o portal, busca pelo PI e envia os comprovantes de veiculação.', icon: Camera, color: 'from-primary/20 to-emerald-500/20' },
              { step: '02', title: 'Análise Inteligente', desc: 'A plataforma valida automaticamente os arquivos e notifica a equipe de checking.', icon: Zap, color: 'from-secondary/20 to-purple-500/20' },
              { step: '03', title: 'Aprovação Rápida', desc: 'O analista revisa, aprova ou reprova com um clique. Fornecedor é notificado.', icon: CheckCircle2, color: 'from-blue-500/20 to-cyan-500/20' },
            ].map((item, i) => (
              <div key={i} className="group">
                <div className={`p-8 rounded-2xl bg-gradient-to-br ${item.color} border border-white/5 backdrop-blur-xl hover:border-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-5xl font-black text-white/10 group-hover:text-white/20 transition-colors">{item.step}</span>
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              FUNCIONALIDADES <span className="text-secondary">PREMIUM</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Tudo que sua agência precisa para gerenciar checking de mídia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FileCheck, title: 'Aprovações em Tempo Real', desc: 'Aprove ou reprove cheking materiais com um clique. Fluxo de trabalho intuitivo.' },
              { icon: Globe, title: 'Portal do Fornecedor', desc: 'Fornecedores enviam comprovantes diretamente, sem intermediários.' },
              { icon: BarChart3, title: 'Dashboard Analítico', desc: 'Métricas em tempo real, gráficos e insights sobre sua operação.' },
              { icon: Shield, title: 'Segurança Multi-Tenant', desc: 'Cada agência com dados isolados e personalização de marca.' },
              { icon: Monitor, title: 'Interface Premium', desc: 'Design dark mode com glassmorphism e micro-animações de alta qualidade.' },
              { icon: Users, title: 'Gestão de Equipe', desc: 'Múltiplos usuários com diferentes níveis de permissão por agência.' },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-base font-black text-white mb-2">{feature.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { ref: stat1.ref, count: stat1.count, suffix: '+', label: 'Checkings Processados', icon: FileCheck },
              { ref: stat2.ref, count: stat2.count, suffix: '%', label: 'Taxa de Aprovação', icon: TrendingUp },
              { ref: stat3.ref, count: stat3.count, suffix: '', label: 'Agências Ativas', icon: Building2 },
              { ref: stat4.ref, count: stat4.count, suffix: 'min', label: 'Tempo Médio de Resposta', icon: Clock },
            ].map((stat, i) => (
              <div key={i} ref={stat.ref} className="space-y-2">
                <stat.icon className="h-6 w-6 text-primary/50 mx-auto mb-2" />
                <div className="text-4xl md:text-5xl font-black text-white">
                  {stat.count.toLocaleString()}<span className="text-primary">{stat.suffix}</span>
                </div>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
            PRONTO PARA <span className="text-primary">COMEÇAR</span>?
          </h2>
          <p className="text-gray-400 mb-10 max-w-lg mx-auto">
            Junte-se a centenas de agências que já revolucionaram seu processo de checking com o NERO27.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-14 px-10 bg-primary hover:bg-primary/90 text-black font-black text-sm rounded-xl shadow-[0_0_40px_rgba(0,255,100,0.2)]">
              <Link href="/signup">CRIAR CONTA GRÁTIS <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 border-white/10 bg-white/5 text-white font-bold text-sm rounded-xl">
              <Link href="/login">FAZER LOGIN</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black tracking-tighter text-gray-500">NERO<span className="text-gray-400">27</span></h2>
            <span className="text-xs text-gray-600">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-600">
            <span>Centro de Comando de Mídia</span>
            <span className="hidden md:block">•</span>
            <span className="hidden md:block">Checking 2.0 Platform</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
