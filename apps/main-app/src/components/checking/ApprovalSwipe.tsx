'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, MapPin, Calendar, Camera, Globe, Info, AlertTriangle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface CheckingItem {
    id: string
    n_pi: string
    cliente: string
    campanha: string
    veiculo: string
    data_envio: string
    fotos: { url: string, type: string, gps_lat?: number, gps_lng?: number }[]
    status?: string
}

interface ApprovalSwipeProps {
    items: CheckingItem[]
    onApprove: (id: string, item: CheckingItem) => Promise<void>
    onReject: (id: string, reason: string, item: CheckingItem) => Promise<void>
}

export function ApprovalSwipe({ items, onApprove, onReject }: ApprovalSwipeProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState<'left' | 'right' | null>(null)
    const [rejectModalOpen, setRejectModalOpen] = useState(false)
    const [rejectReason, setRejectReason] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)

    const currentItem = items[currentIndex]

    const handleAction = async (dir: 'left' | 'right') => {
        if (!currentItem || isProcessing) return
        setDirection(dir)
        setIsProcessing(true)

        // Determine action
        if (dir === 'right') {
            await onApprove(currentItem.id, currentItem)
            completeAction()
        } else {
            setRejectModalOpen(true)
            // Pause processing to wait for modal
            // But direction is set, showing animation? 
            // Ideally we animation AFTER reason confirm.
            setDirection(null) // Reset animation until reason confirmed
            setIsProcessing(false)
        }
    }

    const confirmReject = async () => {
        if (!currentItem) return
        setIsProcessing(true)
        setDirection('left')
        await onReject(currentItem.id, rejectReason, currentItem)
        setRejectModalOpen(false)
        setRejectReason('')
        completeAction()
    }

    const completeAction = () => {
        setTimeout(() => {
            setCurrentIndex(prev => prev + 1)
            setDirection(null)
            setIsProcessing(false)
        }, 300) // Wait for animation
    }

    if (!currentItem) {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] text-gray-500">
                <Check className="h-16 w-16 mb-4 text-primary opacity-50" />
                <h3 className="text-xl font-semibold">Tudo Limpo!</h3>
                <p>Não há mais checkings pendentes para aprovação.</p>
            </div>
        )
    }

    return (
        <div className="relative max-w-md mx-auto h-[700px]">
            {/* Card Stack Effect */}
            <div className="absolute top-4 left-4 right-4 bottom-0 bg-white/5 border border-white/10 rounded-3xl opacity-50 scale-95 -z-10 backdrop-blur-sm" />
            <div className="absolute top-8 left-8 right-8 bottom-0 bg-white/5 border border-white/10 rounded-3xl opacity-25 scale-90 -z-20 backdrop-blur-sm" />

            {/* Main Card */}
            <Card className={`h-full overflow-hidden bg-white/10 border-white/10 backdrop-blur-xl shadow-2xl transition-all duration-300 ${direction === 'right' ? 'translate-x-[150%] rotate-12 opacity-0' :
                direction === 'left' ? '-translate-x-[150%] -rotate-12 opacity-0' : ''
                }`}>
                <div className="relative h-2/5 bg-gray-900">
                    {/* Status Badge overlay */}
                    <div className="absolute top-4 left-4 z-10">
                        <Badge variant="outline" className="bg-black/50 text-white border-none backdrop-blur-md">
                            {currentItem.status || 'Pendente'}
                        </Badge>
                    </div>

                    {/* Main Photo */}
                    <img
                        src={currentItem.fotos?.[0]?.url || '/placeholder.svg'}
                        alt="Comprovante Main"
                        className="w-full h-full object-cover"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
                </div>

                <CardContent className="pt-4 space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{currentItem.cliente}</h2>
                        <p className="text-gray-400">{currentItem.campanha}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                            <MapPin className="h-4 w-4 text-secondary" />
                            <span className="truncate">{currentItem.veiculo}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <Info className="h-4 w-4 text-primary" />
                            <span>{currentItem.n_pi}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{currentItem.data_envio}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <Camera className="h-4 w-4 text-secondary" />
                            <span>{currentItem.fotos?.length || 0} fotos</span>
                        </div>
                    </div>

                    {/* Additional Photos Preview */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {currentItem.fotos?.slice(1).map((foto, idx) => (
                            <img key={idx} src={foto.url} className="h-16 w-16 rounded object-cover border border-gray-800" />
                        ))}
                    </div>
                </CardContent>

                <CardFooter className="absolute bottom-0 w-full p-6 flex justify-between gap-4 bg-gradient-to-t from-gray-950 to-transparent pt-12">
                    <Button
                        size="lg"
                        variant="outline"
                        className="h-14 w-14 rounded-full border-2 border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/50"
                        onClick={() => handleAction('left')}
                        disabled={isProcessing}
                    >
                        <X className="h-8 w-8" />
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        className="h-14 w-14 rounded-full border-2 border-primary bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all shadow-lg hover:shadow-primary/50"
                        onClick={() => handleAction('right')}
                        disabled={isProcessing}
                    >
                        <Check className="h-8 w-8" />
                    </Button>
                </CardFooter>
            </Card>

            {/* Reject Modal */}
            <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
                <DialogContent className="bg-gray-900 border-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Reprovar Checking</DialogTitle>
                        <DialogDescription>
                            Por favor, informe o motivo da reprovação. O fornecedor será notificado.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Motivo</Label>
                            <Textarea
                                placeholder="Ex: Fotos escuras, data incorreta..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="bg-gray-950 border-gray-800 text-white"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['Foto Escura', 'Ângulo Ruim', 'Data Incorreta', 'Local Errado'].map(reason => (
                                <Badge
                                    key={reason}
                                    variant="outline"
                                    className="cursor-pointer hover:bg-gray-800"
                                    onClick={() => setRejectReason(reason)}
                                >
                                    {reason}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setRejectModalOpen(false)}>Cancelar</Button>
                        <Button variant="destructive" onClick={confirmReject}>Confirmar Reprovação</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
