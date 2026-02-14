'use client'

import { usePending, useApprove, useReject } from "@/hooks/useApprovals"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CheckCircle2, XCircle, Calendar, FileText, Upload, Loader2, FolderOpen, ExternalLink, Clock, User } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function ApprovalsPage() {
    const { data: pendingItems, isLoading } = usePending()
    const approveMutation = useApprove()
    const rejectMutation = useReject()

    const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
    const [currentItem, setCurrentItem] = useState<string | null>(null)
    const [rejectReason, setRejectReason] = useState('')
    const [rejectFile, setRejectFile] = useState<File | null>(null)

    const handleApprove = async (id: string) => {
        try {
            await approveMutation.mutateAsync(id)
            toast.success("Checking aprovado com sucesso!")
        } catch (e) {
            toast.error("Erro ao aprovar checking.")
        }
    }

    const handleRejectClick = (id: string) => {
        setCurrentItem(id)
        setRejectDialogOpen(true)
    }

    const handleRejectConfirm = async () => {
        if (currentItem && rejectReason) {
            try {
                await rejectMutation.mutateAsync({
                    id: currentItem,
                    reason: rejectReason,
                    file: rejectFile
                })
                toast.success("Checking reprovado com sucesso.")
                setRejectDialogOpen(false)
                setRejectReason('')
                setRejectFile(null)
                setCurrentItem(null)
            } catch (e) {
                toast.error("Erro ao reprovar checking.")
            }
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-8 animate-in fade-in duration-700">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Aprovações</h1>
                    <div className="h-4 w-48 bg-white/5 animate-pulse rounded" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-80 bg-white/5 animate-pulse rounded-2xl border border-white/10" />
                    ))}
                </div>
            </div>
        )
    }

    if (!pendingItems || pendingItems.length === 0) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center space-y-6 animate-in zoom-in duration-700">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                    <CheckCircle2 className="h-24 w-24 text-primary relative z-10" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">TUDO EM DIA</h3>
                    <p className="text-gray-400 font-medium">Não há materiais aguardando aprovação no momento.</p>
                </div>
                <Button variant="outline" className="border-white/10 hover:bg-white/5 text-gray-400" onClick={() => window.location.reload()}>
                    ATUALIZAR LISTA
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-1000">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Aprovações</h1>
                    <p className="text-primary font-medium tracking-tight">
                        {pendingItems.length} checking{pendingItems.length !== 1 ? 's' : ''} aguardando sua análise técnica
                    </p>
                </div>
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 py-2 px-4 shadow-lg shadow-amber-500/5 text-sm font-black">
                    {pendingItems.length} PENDENTE{pendingItems.length !== 1 ? 'S' : ''}
                </Badge>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingItems.map((item) => (
                    <Card key={item.id} className="bg-white/5 border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden hover:border-primary/30 transition-all group duration-500 hover:shadow-2xl hover:shadow-primary/5">
                        <CardHeader className="bg-gradient-to-br from-white/5 to-transparent border-b border-white/5 pb-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl font-black text-white group-hover:text-primary transition-colors line-clamp-1">{item.cliente}</CardTitle>
                                    <Badge variant="secondary" className="text-[10px] font-mono bg-white/10 text-gray-400 border-white/10">
                                        PI: {item.n_pi}
                                    </Badge>
                                </div>
                                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                    <Clock className="h-4 w-4" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                        <User className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">FORNECEDOR</p>
                                        <p className="font-bold">{item.fornecedor || 'Desconhecido'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">ENVIADO EM</p>
                                        <p className="font-bold">{item.data_envio || 'N/A'}</p>
                                    </div>
                                </div>

                                {item.veiculo && (
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                            <FileText className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">VEÍCULO</p>
                                            <p className="font-bold truncate max-w-[180px]">{item.veiculo}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {item.webViewLink && (
                                <a
                                    href={item.webViewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all group/btn"
                                >
                                    <FolderOpen className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                                    ANALISAR ARQUIVOS
                                    <ExternalLink className="h-3 w-3 opacity-50" />
                                </a>
                            )}

                            <div className="flex gap-3 pt-2">
                                <Button
                                    onClick={() => handleApprove(item.id)}
                                    disabled={approveMutation.isPending}
                                    className="flex-1 bg-primary hover:bg-primary/90 text-black font-black text-xs shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 h-12"
                                >
                                    {approveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                                    APROVAR
                                </Button>

                                <Dialog open={rejectDialogOpen && currentItem === item.id} onOpenChange={(open) => {
                                    setRejectDialogOpen(open)
                                    if (!open) {
                                        setCurrentItem(null)
                                        setRejectReason('')
                                        setRejectFile(null)
                                    }
                                }}>
                                    <DialogTrigger asChild>
                                        <Button
                                            onClick={() => handleRejectClick(item.id)}
                                            variant="outline"
                                            className="flex-1 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white font-black text-xs transition-all h-12"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            REPROVAR
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-gray-950 border-white/10 text-white max-w-lg">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-black tracking-tighter uppercase underline decoration-red-500 underline-offset-8">Reprovar Checking</DialogTitle>
                                            <DialogDescription className="text-gray-400 font-medium pt-2">
                                                Informe detalhadamente o motivo da reprovação para o fornecedor.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-6 py-4">
                                            <div className="space-y-3">
                                                <Label htmlFor="reason" className="text-[10px] font-black uppercase tracking-widest text-gray-500">Motivo da Reprovação *</Label>
                                                <Textarea
                                                    id="reason"
                                                    placeholder="Ex: Foto com baixa qualidade ou endereço divergente do PI..."
                                                    value={rejectReason}
                                                    onChange={(e) => setRejectReason(e.target.value)}
                                                    rows={4}
                                                    className="bg-white/5 border-white/10 text-white focus:border-red-500 transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="file" className="text-[10px] font-black uppercase tracking-widest text-gray-500">Anexar PDF de Análise (Opcional)</Label>
                                                <div className="flex flex-col gap-3">
                                                    <Input
                                                        id="file"
                                                        type="file"
                                                        accept=".pdf"
                                                        onChange={(e) => setRejectFile(e.target.files?.[0] || null)}
                                                        className="bg-white/5 border-white/10 text-white file:bg-white/10 file:text-white file:border-0 file:rounded file:px-2"
                                                    />
                                                    {rejectFile && (
                                                        <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-lg text-xs text-primary font-bold">
                                                            <Upload className="h-3 w-3" />
                                                            {rejectFile.name}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter className="gap-3">
                                            <Button
                                                variant="ghost"
                                                className="text-gray-400 hover:text-white"
                                                onClick={() => setRejectDialogOpen(false)}
                                            >
                                                CANCELAR
                                            </Button>
                                            <Button
                                                className="bg-red-600 hover:bg-red-700 text-white font-black px-8 shadow-lg shadow-red-500/20"
                                                onClick={handleRejectConfirm}
                                                disabled={!rejectReason || rejectMutation.isPending}
                                            >
                                                {rejectMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "CONFIRMAR REPROVAÇÃO"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
