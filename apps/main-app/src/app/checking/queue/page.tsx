'use client'

import { useState, useEffect } from 'react'
import { ApprovalSwipe } from '@/components/checking/ApprovalSwipe'
import { Button } from '@/components/ui/button'
import { RefreshCw, LayoutGrid, List } from 'lucide-react'
import { toast } from 'sonner'

export default function CheckingQueuePage() {
    const [viewMode, setViewMode] = useState<'swipe' | 'list'>('swipe')
    const [checkings, setCheckings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchCheckings = async () => {
        setLoading(true)
        try {
            const res = await fetch('https://n8n.grupoom.com.br/webhook/CheckingCentral', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'get_pending' })
            })
            const data = await res.json()
            if (data.success && Array.isArray(data.checkings)) {
                setCheckings(data.checkings)
            } else {
                // Fallback if API fails or returns distinct structure, or empty.
                // console.error("Failed to load checkings", data)
                setCheckings([])
                toast.error("Erro ao carregar checkings.")
            }
        } catch (error) {
            console.error("Error fetching checkings", error)
            toast.error("Erro de conexão.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCheckings()
        // Optional: Polling
        const interval = setInterval(fetchCheckings, 30000)
        return () => clearInterval(interval)
    }, [])

    const handleApprove = async (id: string, item: any) => {
        try {
            // Optimistic update
            setCheckings(prev => prev.filter(c => c.id !== id))

            await fetch('https://n8n.grupoom.com.br/webhook/CheckingCentral', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'approve', id, approval_user: 'admin@nero27.com' }) // Hardcoded user for now
            })
            toast.success(`Checking ${item.n_pi} Aprovado!`)
        } catch (error) {
            toast.error("Erro ao aprovar.")
            fetchCheckings() // Revert/Refresh
        }
    }

    const handleReject = async (id: string, reason: string, item: any) => {
        try {
            setCheckings(prev => prev.filter(c => c.id !== id))

            await fetch('https://n8n.grupoom.com.br/webhook/CheckingCentral', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reject', id, reason, approval_user: 'admin@nero27.com' })
            })
            toast.success(`Checking ${item.n_pi} Reprovado.`)
        } catch (error) {
            toast.error("Erro ao reprovar.")
            fetchCheckings()
        }
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Central de Aprovação</h2>
                    <p className="text-gray-400">Analise os comprovantes enviados pelos fornecedores</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchCheckings} disabled={loading} className="border-gray-800 text-gray-300">
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Atualizar
                    </Button>
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-1 flex">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`px-3 py-1 h-8 ${viewMode === 'swipe' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
                            onClick={() => setViewMode('swipe')}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`px-3 py-1 h-8 ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
                            onClick={() => setViewMode('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-[600px] relative">
                {loading && checkings.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Carregando...
                    </div>
                ) : (
                    <>
                        {viewMode === 'swipe' ? (
                            <ApprovalSwipe
                                items={checkings}
                                onApprove={handleApprove}
                                onReject={handleReject}
                            />
                        ) : (
                            <div className="text-center text-gray-500 mt-20">
                                Lista detalhada em breve... (Use o modo Swipe)
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
