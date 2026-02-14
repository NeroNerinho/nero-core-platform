import { usePending } from "@/features/approvals/hooks/usePending"
import { useApprove, useReject } from "@/features/approvals/hooks/useMutations"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CheckCircle2, XCircle, Calendar, FileText, Upload } from "lucide-react"
import { useState } from "react"

export default function Approvals() {
    const { data: pendingItems, isLoading } = usePending()
    const approveMutation = useApprove()
    const rejectMutation = useReject()

    const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
    const [currentItem, setCurrentItem] = useState<string | null>(null)
    const [rejectReason, setRejectReason] = useState('')
    const [rejectFile, setRejectFile] = useState<File | null>(null)

    const handleApprove = (id: string) => {
        approveMutation.mutate(id)
    }

    const handleRejectClick = (id: string) => {
        setCurrentItem(id)
        setRejectDialogOpen(true)
    }

    const handleRejectConfirm = () => {
        if (currentItem && rejectReason) {
            rejectMutation.mutate({
                id: currentItem,
                reason: rejectReason,
                file: rejectFile
            })
            setRejectDialogOpen(false)
            setRejectReason('')
            setRejectFile(null)
            setCurrentItem(null)
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">Aprovações</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-muted/20 animate-pulse rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    if (!pendingItems || pendingItems.length === 0) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Aprovações</h1>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center h-64">
                        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Tudo em dia!</h3>
                        <p className="text-muted-foreground">Não há checkings pendentes no momento.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Aprovações</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {pendingItems.length} checking{pendingItems.length !== 1 ? 's' : ''} aguardando análise
                    </p>
                </div>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800 text-sm py-1 px-3">
                    {pendingItems.length} Pendente{pendingItems.length !== 1 ? 's' : ''}
                </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-card pb-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-lg mb-1">{item.cliente}</CardTitle>
                                    <Badge variant="outline" className="text-xs font-mono">
                                        {item.n_pi}
                                    </Badge>
                                </div>
                                <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300">
                                    Pendente
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>{item.data_envio}</span>
                                </div>
                                {item.veiculo && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <FileText className="h-4 w-4" />
                                        <span className="truncate">{item.veiculo}</span>
                                    </div>
                                )}
                            </div>

                            {item.rejection_reason && (
                                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                                    <p className="text-muted-foreground">{item.rejection_reason}</p>
                                </div>
                            )}

                            {item.webViewLink && (
                                <a
                                    href={item.webViewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-primary hover:underline text-sm"
                                >
                                    <FileText className="h-4 w-4" />
                                    Ver arquivos no Drive
                                </a>
                            )}

                            <div className="flex gap-2 pt-2">
                                <Button
                                    onClick={() => handleApprove(item.id)}
                                    disabled={approveMutation.isPending}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Aprovar
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
                                            variant="destructive"
                                            className="flex-1"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Reprovar
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Reprovar Checking</DialogTitle>
                                            <DialogDescription>
                                                Informe o motivo da reprovação. Você pode anexar um PDF com detalhes.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="reason">Motivo da Reprovação</Label>
                                                <Textarea
                                                    id="reason"
                                                    placeholder="Descreva o motivo da reprovação..."
                                                    value={rejectReason}
                                                    onChange={(e) => setRejectReason(e.target.value)}
                                                    rows={4}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="file">Anexar PDF (Opcional)</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        id="file"
                                                        type="file"
                                                        accept=".pdf"
                                                        onChange={(e) => setRejectFile(e.target.files?.[0] || null)}
                                                        className="flex-1"
                                                    />
                                                    {rejectFile && (
                                                        <Badge variant="secondary" className="whitespace-nowrap">
                                                            <Upload className="h-3 w-3 mr-1" />
                                                            {rejectFile.name}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setRejectDialogOpen(false)
                                                    setRejectReason('')
                                                    setRejectFile(null)
                                                }}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={handleRejectConfirm}
                                                disabled={!rejectReason || rejectMutation.isPending}
                                            >
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Confirmar Reprovação
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
