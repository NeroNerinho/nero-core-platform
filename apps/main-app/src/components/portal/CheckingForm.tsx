'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Search, UploadCloud, CheckCircle, AlertCircle, Loader2, FileText, MapPin, Info } from 'lucide-react'
import { searchPI } from '@/app/actions/portal'
import { toast } from 'sonner' // Assuming sonner is installed, if not will use standard alert or similar.

// --- Types & Config ---

type SearchMode = 'pi' | 'cnpj'

interface MediaConfig {
    label: string
    fields: number // default number of upload fields?
    aliases: string[]
    hasInsertions?: boolean
    hasMarking?: boolean
    fileLabels?: string[] // Custom labels for the upload fields if needed
}

const MEDIA_TYPE_CONFIG: Record<string, MediaConfig> = {
    "AT": { label: "Ativação", fields: 1, aliases: ['PY', 'EV', 'MA'], fileLabels: ['Relatório Fotográfico / Vídeos / Detalhamento'] },
    "BD": { label: "Busdoor/Taxidoor", fields: 1, aliases: ['BP'], fileLabels: ['Relatório Fotográfico de Todos os Veículos'] },
    "CI": { label: "Cinema", fields: 1, aliases: ['CN', 'CP'], fileLabels: ['Relatório de Exibição (Complexo/Salas/Praça)'] },
    "DO": { label: "Digital Out of Home", fields: 3, hasInsertions: true, aliases: ['PH'], fileLabels: ['Relatório Fotográfico', 'Relatório de Exibições Automatizado', 'Vídeo Diurno'] },
    "FL": { label: "Frontlight", fields: 1, aliases: ['PF', 'GD'], fileLabels: ['Relatório Fotográfico com Endereço'] },
    "IN": { label: "Internet", fields: 1, aliases: ['PN', 'PW', 'IA', 'IB', 'ID', 'IS', 'IV', 'MS'], fileLabels: ['Relatório de Veiculação + Prints'] },
    "JO": { label: "Jornal", fields: 1, aliases: ['JN', 'PJ', 'GS', 'GO', 'FT'], fileLabels: ['Material Físico / PDF / Foto do Título'] },
    "MO": { label: "Metrô", fields: 2, hasMarking: true, aliases: ['MT', 'PM'], fileLabels: ['Listagem das Estações/Linhas', 'Fotos ou Vídeos Amostrais'] },
    "ME": { label: "Mídia Externa", fields: 2, hasMarking: true, aliases: ['EP'], fileLabels: ['Relatório com Endereços', 'Fotos Diurnas Amostrais'] },
    "MI": { label: "Mídia Interna", fields: 1, aliases: ['PI', 'MN'], fileLabels: ['Relatório Fotográfico + Relação de Locais'] },
    "OD": { label: "Outdoor", fields: 1, aliases: ['PO'], fileLabels: ['1 Foto Longe + 1 Perto de TODOS os Pontos'] },
    "TP": { label: "Patrocínios", fields: 1, aliases: [], fileLabels: ['Relatório de Veiculação / Gravação'] },
    "RD": { label: "Rádio", fields: 1, aliases: ['PD', 'RA', 'RF', 'PA'], fileLabels: ['Relatório de Veiculação / Gravação'] },
    "RV": { label: "Revista", fields: 1, aliases: ['RE', 'PS'], fileLabels: ['Material Físico / PDF / Foto do Título'] },
    "TV": { label: "TV", fields: 1, aliases: ['PT', 'PV', 'TA'], fileLabels: ['Relatório de Veiculação Automatizado'] },
    "DEFAULT": { label: "Outros Serviços", fields: 1, aliases: [], fileLabels: ['Comprovante de Veiculação / Checking'] }
}

const resolveMeioCode = (code: string) => {
    if (!code) return 'DEFAULT'
    const upper = code.trim().toUpperCase()
    if (MEDIA_TYPE_CONFIG[upper]) return upper
    for (const [key, config] of Object.entries(MEDIA_TYPE_CONFIG)) {
        if (config.aliases && config.aliases.includes(upper)) return key
    }
    return 'DEFAULT'
}

export function CheckingForm() {
    // State
    const [sender, setSender] = useState({ nome: '', cnpj: '', email: '', telefone: '' })
    const [searchMode, setSearchMode] = useState<SearchMode>('pi')
    const [searchQuery, setSearchQuery] = useState('')
    const [searchStatus, setSearchStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' })

    // Order Data
    const [orderData, setOrderData] = useState<any>(null)
    const [piList, setPiList] = useState<any[]>([]) // For CNPJ search results

    // Upload State
    const [files, setFiles] = useState<Record<string, File | null>>({})
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submissionResult, setSubmissionResult] = useState<{ success: boolean, message: string } | null>(null)
    const [isComplement, setIsComplement] = useState(false)
    const [extraFields, setExtraFields] = useState({ num_insercoes: '', marcacao_veiculo: false })

    // Mask CNPJ
    const maskCNPJ = (val: string) => {
        return val.replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    }

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value
        if (searchMode === 'cnpj') val = maskCNPJ(val)
        setSearchQuery(val)
    }

    // Debounced Search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= 3) {
                performSearch(searchQuery)
            } else {
                setOrderData(null)
                setPiList([])
                setSearchStatus({ type: 'idle', message: '' })
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [searchQuery, searchMode])

    const performSearch = async (query: string) => {
        setSearchStatus({ type: 'loading', message: 'Buscando...' })
        const cleanQuery = searchMode === 'cnpj' ? query.replace(/\D/g, '') : query.trim()

        try {
            // New Server Action Logic (replacing external n8n webhook)
            if (searchMode === 'pi') {
                const result = await searchPI({ pi: cleanQuery, cnpj: '00000000000000' }) // CNPJ mock for PI search

                if (result.success) {
                    // Server action call succeeded
                    if (result.data.success && result.data.n_pi) {
                        // Business logic succeeded (PI found)
                        handlePiFound(result.data)
                        setSearchStatus({ type: 'success', message: 'PI Encontrada!' })
                    } else {
                        // Business logic failed (PI not found)
                        setSearchStatus({ type: 'error', message: result.data.message || 'Não encontrado' })
                        setOrderData(null)
                    }
                } else {
                    // Server action call failed (Network/System error)
                    setSearchStatus({ type: 'error', message: result.error })
                    setOrderData(null)
                }
            } else {
                // Keep CNPJ search logic mocked or implement action later if needed
                // For now, let's allow the 'PI' search to be the star feature
                setSearchStatus({ type: 'error', message: 'Busca por CNPJ em manutenção. Tente por PI.' })
            }

        } catch (error) {
            setSearchStatus({ type: 'error', message: 'Erro de conexão.' })
        }
    }

    const handlePiFound = (data: any) => {
        // Status checks
        const canSubmit = data.can_submit !== false
        const isComplementBackend = data.is_complement === true

        const meioCode = resolveMeioCode(data.meio)
        const meioConfig = MEDIA_TYPE_CONFIG[meioCode]

        setOrderData({
            ...data,
            canSubmit,
            isComplementBackend,
            meioCode,
            meioConfig,
            displayStatus: data.status_checking || 'Não recebido'
        })
        setIsComplement(isComplementBackend)
        setFiles({}) // Reset files
        setSubmissionResult(null)
    }

    const handleFileChange = (key: string, file: File | null) => {
        setFiles(prev => ({ ...prev, [key]: file }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!orderData || !orderData.canSubmit) return

        setIsSubmitting(true)
        setUploadProgress(0)
        const formData = new FormData()
        formData.append('action', 'enviar_checking')
        formData.append('nome', sender.nome)
        formData.append('email', sender.email)
        formData.append('telefone', sender.telefone)
        formData.append('n_pi', orderData.n_pi)
        formData.append('cliente', orderData.cliente || '')
        formData.append('campanha', orderData.campanha || '')
        formData.append('produto', orderData.produto || '')
        formData.append('veiculo', orderData.veiculo || '')
        formData.append('meio', orderData.meio || '')
        formData.append('is_complemento', String(isComplement))

        if (orderData.meioConfig?.hasInsertions) {
            formData.append('num_insercoes', extraFields.num_insercoes)
        }
        if (orderData.meioConfig?.hasMarking && extraFields.marcacao_veiculo) {
            formData.append('marcacao_veiculo', 'X')
        }

        // Append files
        Object.entries(files).forEach(([key, file]) => {
            if (file) formData.append(key, file)
        })

        try {
            const xhr = new XMLHttpRequest()
            xhr.open('POST', 'https://n8n.grupoom.com.br/webhook/CheckingCentral', true)

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100)
                    setUploadProgress(percent)
                }
            }

            xhr.onload = function () {
                if (xhr.status === 200) {
                    const resp = JSON.parse(xhr.responseText)
                    setSubmissionResult({ success: true, message: resp.message || 'Checking enviado com sucesso!' })
                    // Reset form after 2 seconds
                    setTimeout(() => {
                        setOrderData(null)
                        setSearchQuery('')
                        setFiles({})
                        setSubmissionResult(null)
                        setUploadProgress(0)
                    }, 3000)
                } else {
                    setSubmissionResult({ success: false, message: 'Erro ao enviar. Tente novamente.' })
                }
                setIsSubmitting(false)
            }
            xhr.onerror = function () {
                setSubmissionResult({ success: false, message: 'Erro de conexão/rede.' })
                setIsSubmitting(false)
            }
            xhr.send(formData)
        } catch (e) {
            setSubmissionResult({ success: false, message: 'Erro inesperado.' })
            setIsSubmitting(false)
        }
    }

    const renderFileUploads = () => {
        if (!orderData || !orderData.canSubmit) return null

        const config = orderData.meioConfig || MEDIA_TYPE_CONFIG['DEFAULT']
        const labels = config.fileLabels || Array(config.fields).fill('Comprovante')

        return (
            <div className="space-y-6">
                {/* Extra Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {config.hasInsertions && (
                        <div className="space-y-2">
                            <Label>Número de Inserções Totais *</Label>
                            <Input
                                type="number"
                                required
                                value={extraFields.num_insercoes}
                                onChange={e => setExtraFields({ ...extraFields, num_insercoes: e.target.value })}
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                    )}
                    {config.hasMarking && (
                        <div className="flex items-center space-x-2 pt-8">
                            <input
                                type="checkbox"
                                id="marking"
                                checked={extraFields.marcacao_veiculo}
                                onChange={e => setExtraFields({ ...extraFields, marcacao_veiculo: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 bg-gray-900"
                            />
                            <Label htmlFor="marking" className="text-sm">Marcação do Veículo (Fotos Amostrais)</Label>
                        </div>
                    )}
                </div>

                {/* Subtitle for Complement */}
                {orderData.isComplementBackend && (
                    <div className="p-3 bg-amber-900/20 border border-amber-900 rounded-lg">
                        <p className="text-sm text-amber-400 font-semibold">
                            ! Este envio será registrado como <span className="underline uppercase tracking-widest">Complemento</span> de veiculação.
                        </p>
                    </div>
                )}

                {/* File Inputs */}
                {labels.map((label: string, index: number) => (
                    <div key={index} className="space-y-2 group">
                        <Label className="text-gray-300 group-hover:text-primary transition-colors">{label} *</Label>
                        <div className="relative">
                            <Input
                                type="file"
                                required
                                className="bg-white/5 border-white/10 file:bg-primary file:text-black file:border-0 file:rounded file:px-2 file:mr-4 file:font-bold hover:border-primary/50 transition-all cursor-pointer"
                                onChange={(e) => handleFileChange(getNameForMedia(orderData.meioCode, index), e.target.files?.[0] || null)}
                            />
                            {files[getNameForMedia(orderData.meioCode, index)] && (
                                <div className="absolute right-3 top-2 text-primary">
                                    <CheckCircle className="h-5 w-5" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const getNameForMedia = (code: string, index: number) => {
        const c = code.toUpperCase()
        if (c === 'JO' || c === 'RV') return 'material_impresso'
        if (c === 'RD') return 'relatorio_radio'
        if (c === 'TV') return 'relatorio_tv'
        if (c === 'IN') return 'relatorio_internet'
        if (c === 'CI') return 'relatorio_cinema'
        if (c === 'AT') return 'relatorio_ativacao'
        if (c === 'BD') return 'relatorio_busdoor'
        if (c === 'OD') return 'relatorio_outdoor'
        if (c === 'FL') return 'relatorio_frontlight'
        if (c === 'MN') return 'relatorio_midia_interna'
        if (c === 'DO') return `do_anexo_${index + 1}`
        if (c === 'ME') return `me_anexo_${index + 1}`
        if (c === 'MT') return `mo_anexo_${index + 1}`
        return `anexo_geral`
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">

            {/* 1. SEUS DADOS */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-md shadow-xl">
                <CardHeader className="border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-lg text-primary">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl text-white">Seus Dados</CardTitle>
                            <CardDescription className="text-gray-400">Informações de quem está enviando</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input id="nome" required value={sender.nome} onChange={e => setSender({ ...sender, nome: e.target.value })} className="bg-gray-900 border-gray-800 text-white" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input id="cnpj" value={sender.cnpj} onChange={e => setSender({ ...sender, cnpj: maskCNPJ(e.target.value) })} placeholder="00.000.000/0000-00" className="bg-gray-900 border-gray-800 text-white" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input id="email" type="email" required value={sender.email} onChange={e => setSender({ ...sender, email: e.target.value })} className="bg-gray-900 border-gray-800 text-white" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input id="telefone" value={sender.telefone} onChange={e => setSender({ ...sender, telefone: e.target.value })} className="bg-white/5 border-white/10 text-white focus:border-primary/50 transition-colors" />
                    </div>
                </CardContent>
            </Card>

            {/* 2. IDENTIFICAÇÃO DO PEDIDO */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-md shadow-xl">
                <CardHeader className="border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-secondary/20 p-2 rounded-lg text-secondary">
                            <Search className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl text-white">Identificação do Pedido</CardTitle>
                            <CardDescription className="text-gray-400">Busque pela PI ou CNPJ do veículo</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="flex gap-2 p-1 bg-white/5 rounded-lg w-fit border border-white/10">
                        <Button
                            type="button"
                            variant={searchMode === 'pi' ? 'default' : 'ghost'}
                            onClick={() => { setSearchMode('pi'); setSearchQuery(''); setOrderData(null); }}
                            className={searchMode === 'pi' ? 'bg-primary text-black hover:bg-primary/90 font-bold' : 'text-gray-400 hover:text-white'}
                        >
                            Busca por PI
                        </Button>
                        <Button
                            type="button"
                            variant={searchMode === 'cnpj' ? 'default' : 'ghost'}
                            onClick={() => { setSearchMode('cnpj'); setSearchQuery(''); setOrderData(null); }}
                            className={searchMode === 'cnpj' ? 'bg-primary text-black hover:bg-primary/90 font-bold' : 'text-gray-400 hover:text-white'}
                        >
                            Busca por CNPJ
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-500">
                            <Search className="h-4 w-4" />
                        </div>
                        <Input
                            placeholder={searchMode === 'pi' ? 'Digite o número do PI (ex: 12345/24)' : '00.000.000/0000-00'}
                            className="pl-10 bg-white/5 border-white/10 text-white h-12 text-lg focus:border-primary/50 transition-colors"
                            value={searchQuery}
                            onChange={handleSearchInput}
                        />
                        <div className="absolute right-3 top-3">
                            {searchStatus.type === 'loading' && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                            {searchStatus.type === 'success' && <CheckCircle className="h-5 w-5 text-primary" />}
                            {searchStatus.type === 'error' && <AlertCircle className="h-5 w-5 text-destructive" />}
                        </div>
                    </div>
                    {searchStatus.message && <p className={`text-sm ${searchStatus.type === 'error' ? 'text-red-400' : 'text-gray-400'}`}>{searchStatus.message}</p>}

                    {/* CNPJ Results List */}
                    {searchMode === 'cnpj' && piList.length > 0 && (
                        <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {piList.map((pi) => (
                                <div
                                    key={pi.n_pi || pi.id}
                                    onClick={() => handlePiFound(pi)}
                                    className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 cursor-pointer transition-all group flex items-center justify-between"
                                >
                                    <div>
                                        <div className="font-bold text-primary group-hover:translate-x-1 transition-transform">PI: {pi.n_pi}</div>
                                        <div className="text-xs text-gray-400">{pi.campanha || 'Campanha'} • {pi.cliente || 'Cliente'}</div>
                                    </div>
                                    <div className={`text-[10px] px-2 py-1 rounded font-bold ${(pi.status_checking || '').toLowerCase() === 'ok' ? 'bg-emerald-900/30 text-emerald-400' :
                                        'bg-amber-900/30 text-amber-400'
                                        }`}>
                                        {pi.status_checking || 'Não recebido'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 3. DADOS DO PEDIDO */}
            {orderData && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-white/5 border-white/10 backdrop-blur-md shadow-xl">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/20 p-2 rounded-lg text-primary">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-white">Dados do Pedido</CardTitle>
                                    <CardDescription className="text-gray-400">Preenchido automaticamente</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500 uppercase">Cliente</Label>
                                <div className="p-3 bg-gray-900/50 rounded border border-gray-800 text-gray-200">{orderData.cliente || '-'}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500 uppercase">Campanha</Label>
                                <div className="p-3 bg-gray-900/50 rounded border border-gray-800 text-gray-200">{orderData.campanha || '-'}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500 uppercase">Produto</Label>
                                <div className="p-3 bg-gray-900/50 rounded border border-gray-800 text-gray-200">{orderData.produto || '-'}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500 uppercase">Período</Label>
                                <div className="p-3 bg-gray-900/50 rounded border border-gray-800 text-gray-200">{orderData.periodo || '-'}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500 uppercase">Veículo</Label>
                                <div className="p-3 bg-gray-900/50 rounded border border-gray-800 text-gray-200">{orderData.veiculo || '-'}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500 uppercase">Status</Label>
                                <div className={`p-3 rounded border border-gray-800 font-bold ${orderData.displayStatus.toLowerCase() === 'ok' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-900' :
                                    orderData.displayStatus.toLowerCase() === 'falha' ? 'bg-red-900/20 text-red-400 border-red-900' :
                                        'bg-gray-900 text-gray-400'
                                    }`}>
                                    {orderData.displayStatus}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 4. COMPROVANTES */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-md shadow-xl">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-secondary/20 p-2 rounded-lg text-secondary">
                                    <UploadCloud className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-white">Comprovantes</CardTitle>
                                    <CardDescription className="text-gray-400">Envie os documentos de comprovação</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {!orderData.canSubmit ? (
                                <Alert variant="destructive" className="bg-red-900/40 border-red-500/50 text-red-200 backdrop-blur-md">
                                    <AlertCircle className="h-5 w-5" />
                                    <AlertTitle className="font-bold">LIMITE ATINGIDO</AlertTitle>
                                    <AlertDescription className="text-sm opacity-90">
                                        {orderData.message || 'Esta PI já atingiu o limite máximo de envios permitidos.'}
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <div className="space-y-6">
                                    <Alert className="bg-blue-900/20 border-blue-900 text-blue-200">
                                        <Info className="h-4 w-4" />
                                        <AlertDescription>
                                            Envie apenas arquivos PDF, JPG, PNG ou HEIC.
                                        </AlertDescription>
                                    </Alert>

                                    {renderFileUploads()}

                                    {renderFileUploads()}

                                    {/* Progress Bar */}
                                    {isSubmitting && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-gray-400">
                                                <span>Fazendo upload...</span>
                                                <span>{uploadProgress}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                                                <div
                                                    className="h-full bg-primary transition-all duration-300 shadow-[0_0_10px_rgba(0,255,100,0.5)]"
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !orderData.canSubmit}
                                        className="w-full bg-primary hover:bg-primary/90 text-black h-14 text-lg font-black shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                ENVIANDO...
                                            </>
                                        ) : (
                                            'ENVIAR CHECKING'
                                        )}
                                    </Button>

                                    {submissionResult && (
                                        <Alert className={submissionResult.success ? "bg-emerald-900/20 border-emerald-900 text-emerald-200" : "bg-red-900/20 border-red-900 text-red-200"}>
                                            <AlertTitle>{submissionResult.success ? "Sucesso!" : "Erro"}</AlertTitle>
                                            <AlertDescription>{submissionResult.message}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </form>
    )
}
