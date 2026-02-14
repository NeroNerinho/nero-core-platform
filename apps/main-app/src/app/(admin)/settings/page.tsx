'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useTenant } from '@/components/providers/TenantProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Palette, Bell, Shield, User, Building2, Monitor, Moon, Sun, Save, Loader2, LayoutDashboard } from 'lucide-react'
import { LayoutEditor } from '@/components/settings/LayoutEditor'

export default function SettingsPage() {
    const { tenant, setTenant } = useTenant()
    const { theme, setTheme } = useTheme()
    const [saving, setSaving] = useState(false)

    const handleSave = () => {
        setSaving(true)
        setTimeout(() => setSaving(false), 1000)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header>
                <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Configurações</h1>
                <p className="text-primary font-medium tracking-tight">Personalize sua experiência e gerencie sua agência</p>
            </header>

            <Tabs defaultValue="appearance" className="space-y-6">
                <TabsList className="bg-white/5 border border-white/10 backdrop-blur-xl p-1 rounded-xl flex-wrap h-auto">
                    <TabsTrigger value="appearance" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold text-xs">
                        <Palette className="h-3.5 w-3.5 mr-1.5" /> Aparência
                    </TabsTrigger>
                    <TabsTrigger value="layout" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold text-xs">
                        <LayoutDashboard className="h-3.5 w-3.5 mr-1.5" /> Editor de Layout
                    </TabsTrigger>
                    <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold text-xs">
                        <User className="h-3.5 w-3.5 mr-1.5" /> Perfil
                    </TabsTrigger>
                    <TabsTrigger value="agency" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold text-xs">
                        <Building2 className="h-3.5 w-3.5 mr-1.5" /> Agência
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold text-xs">
                        <Bell className="h-3.5 w-3.5 mr-1.5" /> Notificações
                    </TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-black font-bold text-xs">
                        <Shield className="h-3.5 w-3.5 mr-1.5" /> Segurança
                    </TabsTrigger>
                </TabsList>

                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-6">
                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                                <Monitor className="h-5 w-5 text-primary" /> Tema do Sistema
                            </CardTitle>
                            <CardDescription className="text-gray-400">Escolha como a interface é exibida</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { value: 'dark' as const, label: 'Escuro', icon: Moon, desc: 'Interface escura premium' },
                                    { value: 'light' as const, label: 'Claro', icon: Sun, desc: 'Interface clara' },
                                    { value: 'system' as const, label: 'Sistema', icon: Monitor, desc: 'Segue o SO' },
                                ].map((t) => (
                                    <button
                                        key={t.value}
                                        onClick={() => setTheme(t.value)}
                                        className={`p-4 rounded-xl border transition-all text-left ${theme === t.value
                                                ? 'bg-primary/10 border-primary/50 shadow-lg shadow-primary/10'
                                                : 'bg-white/5 border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <t.icon className={`h-6 w-6 mb-2 ${theme === t.value ? 'text-primary' : 'text-gray-400'}`} />
                                        <div className="text-sm font-bold text-white">{t.label}</div>
                                        <div className="text-[10px] text-gray-500">{t.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                                <Palette className="h-5 w-5 text-secondary" /> Cores da Agência
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Personalize as cores da plataforma para sua agência
                                <Badge className="ml-2 bg-secondary/20 text-secondary border-secondary/30 text-[9px] font-black">MULTI-TENANT</Badge>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cor Primária</Label>
                                    <div className="flex gap-3">
                                        <input
                                            type="color"
                                            defaultValue="#7aff64"
                                            onChange={(e) => {
                                                const hex = e.target.value
                                                const r = parseInt(hex.slice(1, 3), 16)
                                                const g = parseInt(hex.slice(3, 5), 16)
                                                const b = parseInt(hex.slice(5, 7), 16)
                                                setTenant({ primaryColor: `${r} ${g} ${b}` })
                                            }}
                                            className="w-12 h-12 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                                        />
                                        <div className="flex-1">
                                            <div className="text-xs text-gray-300 font-bold">Primary</div>
                                            <div className="text-[10px] text-gray-500 font-mono">hsl({tenant.primaryColor})</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cor Secundária</Label>
                                    <div className="flex gap-3">
                                        <input
                                            type="color"
                                            defaultValue="#8b5cf6"
                                            onChange={(e) => {
                                                const hex = e.target.value
                                                const r = parseInt(hex.slice(1, 3), 16)
                                                const g = parseInt(hex.slice(3, 5), 16)
                                                const b = parseInt(hex.slice(5, 7), 16)
                                                setTenant({ secondaryColor: `${r} ${g} ${b}` })
                                            }}
                                            className="w-12 h-12 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                                        />
                                        <div className="flex-1">
                                            <div className="text-xs text-gray-300 font-bold">Secondary</div>
                                            <div className="text-[10px] text-gray-500 font-mono">hsl({tenant.secondaryColor})</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cor de Destaque</Label>
                                    <div className="flex gap-3">
                                        <input
                                            type="color"
                                            defaultValue="#ccff00"
                                            onChange={(e) => {
                                                const hex = e.target.value
                                                const r = parseInt(hex.slice(1, 3), 16)
                                                const g = parseInt(hex.slice(3, 5), 16)
                                                const b = parseInt(hex.slice(5, 7), 16)
                                                setTenant({ accentColor: `${r} ${g} ${b}` })
                                            }}
                                            className="w-12 h-12 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                                        />
                                        <div className="flex-1">
                                            <div className="text-xs text-gray-300 font-bold">Accent</div>
                                            <div className="text-[10px] text-gray-500 font-mono">hsl({tenant.accentColor})</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Live Preview */}
                            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Preview ao Vivo</div>
                                <div className="flex gap-3">
                                    <div className="h-10 flex-1 rounded-lg bg-primary flex items-center justify-center text-black font-black text-xs">PRIMARY</div>
                                    <div className="h-10 flex-1 rounded-lg bg-secondary flex items-center justify-center text-white font-black text-xs">SECONDARY</div>
                                    <div className="h-10 flex-1 rounded-lg bg-accent flex items-center justify-center text-black font-black text-xs">ACCENT</div>
                                </div>
                            </div>

                            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-black font-black shadow-lg shadow-primary/20">
                                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                {saving ? 'SALVANDO...' : 'SALVAR PERSONALIZAÇÃO'}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Layout Editor Tab */}
                <TabsContent value="layout">
                    <LayoutEditor />
                </TabsContent>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-xl font-black text-white">Informações Pessoais</CardTitle>
                            <CardDescription className="text-gray-400">Atualize seus dados de perfil</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nome</Label>
                                    <Input defaultValue="Admin" className="bg-black/40 border-white/10 text-white h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sobrenome</Label>
                                    <Input defaultValue="NERO27" className="bg-black/40 border-white/10 text-white h-11 rounded-xl" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</Label>
                                <Input defaultValue="admin@nero27.com" className="bg-black/40 border-white/10 text-white h-11 rounded-xl" />
                            </div>
                            <Button className="bg-primary hover:bg-primary/90 text-black font-black mt-4">
                                <Save className="h-4 w-4 mr-2" /> SALVAR PERFIL
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Agency Tab */}
                <TabsContent value="agency" className="space-y-6">
                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" /> Dados da Agência
                            </CardTitle>
                            <CardDescription className="text-gray-400">Configurações do tenant multi-agência</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nome da Agência</Label>
                                <Input
                                    value={tenant.tenantName}
                                    onChange={(e) => setTenant({ tenantName: e.target.value })}
                                    className="bg-black/40 border-white/10 text-white h-11 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">URL do Logo</Label>
                                <Input
                                    value={tenant.logoUrl}
                                    onChange={(e) => setTenant({ logoUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="bg-black/40 border-white/10 text-white h-11 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">ID do Tenant</Label>
                                <Input value={tenant.tenantId} disabled className="bg-black/20 border-white/5 text-gray-500 h-11 rounded-xl" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-xl font-black text-white">Preferências de Notificação</CardTitle>
                            <CardDescription className="text-gray-400">Escolha o que deseja ser notificado</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { id: 'new-checking', label: 'Novos Checkings', desc: 'Receber quando um fornecedor enviar materiais', default: true },
                                { id: 'daily-digest', label: 'Resumo Diário', desc: 'Resumo de aprovações e reprovações do dia', default: true },
                                { id: 'rejection-alert', label: 'Alertas de Rejeição', desc: 'Notificar quando houver reprovações', default: false },
                                { id: 'system-status', label: 'Status do Sistema', desc: 'Alertas sobre manutenção e atualizações', default: false },
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                    <div>
                                        <div className="text-sm font-bold text-white">{item.label}</div>
                                        <div className="text-xs text-gray-500">{item.desc}</div>
                                    </div>
                                    <Switch id={item.id} defaultChecked={item.default} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6">
                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                                <Shield className="h-5 w-5 text-red-400" /> Segurança da Conta
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Senha Atual</Label>
                                <Input type="password" className="bg-black/40 border-white/10 text-white h-11 rounded-xl" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nova Senha</Label>
                                    <Input type="password" className="bg-black/40 border-white/10 text-white h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Confirmar Senha</Label>
                                    <Input type="password" className="bg-black/40 border-white/10 text-white h-11 rounded-xl" />
                                </div>
                            </div>
                            <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                                ALTERAR SENHA
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-2xl">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-xl font-black text-white">Plano Atual</CardTitle>
                                    <CardDescription className="text-gray-400">Gerencie sua assinatura</CardDescription>
                                </div>
                                <Badge className="bg-primary/20 text-primary border-primary/30 font-black">PROFESSIONAL</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white mb-1">R$ 399<span className="text-sm font-normal text-gray-500">/mês</span></div>
                            <p className="text-xs text-gray-500">Próximo vencimento: 01/03/2026</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
