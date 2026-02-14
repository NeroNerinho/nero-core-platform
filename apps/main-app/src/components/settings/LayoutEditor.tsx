'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { LayoutDashboard, Palette, Type, Moon, Sun } from 'lucide-react'
import { toast } from "sonner"
import { useTheme } from "@/components/providers/ThemeProvider"

export function LayoutEditor() {
    const { setTheme, theme } = useTheme()
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [primaryColor, setPrimaryColor] = useState(50)
    const [fontSize, setFontSize] = useState(16)

    const handleSave = () => {
        // Here we would persist these settings to user profile or local storage
        toast.success("Configurações de layout salvas com sucesso!")
    }

    return (
        <div className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                        <Palette className="h-5 w-5 text-primary" />
                        Aparência Geral
                    </CardTitle>
                    <CardDescription className="text-gray-400">Tema e cores do sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base text-gray-200">Modo Escuro</Label>
                            <p className="text-sm text-muted-foreground">Ativar/desativar tema escuro</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4 text-muted-foreground" />
                            <Switch
                                checked={theme === 'dark'}
                                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                            />
                            <Moon className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-base text-gray-200">Intensidade da Cor Primária</Label>
                        <Slider
                            defaultValue={[50]}
                            max={100}
                            step={1}
                            value={[primaryColor]}
                            onValueChange={(val: number[]) => setPrimaryColor(val[0])}
                        />
                        <div className="h-4 w-full rounded-full bg-primary" style={{ opacity: primaryColor / 100 }} />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                        <LayoutDashboard className="h-5 w-5 text-primary" />
                        Estrutura
                    </CardTitle>
                    <CardDescription className="text-gray-400">Disposição dos elementos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base text-gray-200">Sidebar Colapsada</Label>
                            <p className="text-sm text-muted-foreground">Iniciar com menu recolhido</p>
                        </div>
                        <Switch
                            checked={sidebarCollapsed}
                            onCheckedChange={setSidebarCollapsed}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                        <Type className="h-5 w-5 text-primary" />
                        Tipografia
                    </CardTitle>
                    <CardDescription className="text-gray-400">Tamanho e estilo de fonte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <Label className="text-base text-gray-200">Tamanho da Fonte</Label>
                            <span className="text-sm text-muted-foreground">{fontSize}px</span>
                        </div>
                        <Slider
                            defaultValue={[16]}
                            min={12}
                            max={24}
                            step={1}
                            value={[fontSize]}
                            onValueChange={(val: number[]) => setFontSize(val[0])}
                        />
                        <p style={{ fontSize: `${fontSize}px` }} className="text-white transition-all">
                            O rápido raposa marrom pula sobre o cão preguiçoso.
                        </p>
                    </div>
                </CardContent>
            </Card>


            <div className="flex justify-end">
                <Button onClick={handleSave} className="bg-primary text-black font-bold hover:bg-primary/90 px-8">
                    SALVAR ALTERAÇÕES
                </Button>
            </div>
        </div>
    )
}
