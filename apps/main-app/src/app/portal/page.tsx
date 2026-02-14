'use client'

import React, { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Upload, FileText, Check, AlertCircle, Loader2 } from 'lucide-react'
import { api } from '@/services/api'
import { toast } from 'sonner'

export default function PortalPage() {
    const { user } = useAuth()
    const [piNumber, setPiNumber] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [piData, setPiData] = useState<any>(null)
    const [files, setFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)

    const handleSearch = async () => {
        if (!piNumber) return
        setIsLoading(true)
        try {
            // Mock or Real API call to search PI
            // In approvals-panel logic, this might be another action
            const response = await api.post('', {
                action: 'search_pi',
                pi: piNumber
            })

            if (response.data.success) {
                setPiData(response.data.data)
                toast.success('PI Encontrada!')
            } else {
                // Fallback for demo/mock if API is strict
                setPiData({
                    id: '12345',
                    client: 'Cliente Exemplo',
                    campaign: 'Campanha Verão 2026',
                    items: [
                        { id: 1, type: 'OOH', location: 'Av. Paulista, 1000' },
                        { id: 2, type: 'Digital', location: 'Instagram Stories' }
                    ]
                })
                toast.success('PI Encontrada (Modo Demo)')
            }
        } catch (error) {
            toast.error('Erro ao buscar PI')
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files))
        }
    }

    const handleSubmitChecking = async () => {
        if (!files.length) {
            toast.error('Selecione arquivos para enviar')
            return
        }
        setUploading(true)
        try {
            // Here implementation would send FormData to n8n webhook
            // n8n handles binary data via multipart/form-data
            const formData = new FormData()
            formData.append('action', 'submit_checking')
            formData.append('pi_id', piData.id)
            formData.append('user_email', user?.email || '')
            files.forEach(file => {
                formData.append('files', file)
            })

            await api.post('', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            toast.success('Comprovantes enviados com sucesso!')
            setFiles([])
            setPiData(null)
            setPiNumber('')
        } catch (error) {
            toast.error('Erro ao enviar comprovantes')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-white">Portal do Fornecedor</h1>
                <p className="text-muted-foreground">Envie seus comprovantes de veiculação de forma rápida e segura.</p>
            </div>

            <Card className="bg-black/40 border-white/10">
                <CardHeader>
                    <CardTitle>Buscar PI (Pedido de Inserção)</CardTitle>
                    <CardDescription>Digite o número da PI para iniciar o processo de checking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        <Input
                            placeholder="Ex: 2024-5501"
                            value={piNumber}
                            onChange={(e) => setPiNumber(e.target.value)}
                            className="bg-black/20 border-white/10 text-white h-12"
                        />
                        <Button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="h-12 px-8 bg-primary text-black font-bold hover:bg-primary/90"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                            BUSCAR
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {piData && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-primary">Dados da PI</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Cliente</p>
                                <p className="text-lg font-medium text-white">{piData.client}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Campanha</p>
                                <p className="text-lg font-medium text-white">{piData.campaign}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-black/40 border-white/10">
                        <CardHeader>
                            <CardTitle>Upload de Comprovantes</CardTitle>
                            <CardDescription>Formatos aceitos: JPG, PNG, PDF, MP4 (Máx 50MB)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="border-2 border-dashed border-white/10 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-white/5 transition-all cursor-pointer relative">
                                <input
                                    type="file"
                                    multiple
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleFileUpload}
                                />
                                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                                <p className="text-sm font-medium text-white">Clique ou arraste arquivos aqui</p>
                                <p className="text-xs text-muted-foreground mt-2">Suporte a múltiplos arquivos</p>
                            </div>

                            {files.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-white">Arquivos Selecionados ({files.length})</h4>
                                    <div className="space-y-2">
                                        {files.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-4 w-4 text-primary" />
                                                    <span className="text-sm text-gray-300">{file.name}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={handleSubmitChecking}
                                    disabled={uploading || files.length === 0}
                                    className="h-12 px-8 bg-green-500 hover:bg-green-400 text-black font-bold w-full md:w-auto"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviaando...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="mr-2 h-4 w-4" /> CONFIRMAR ENVIO
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
