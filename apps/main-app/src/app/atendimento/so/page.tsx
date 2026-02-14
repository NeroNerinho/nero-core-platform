'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Paperclip, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function SOPage() {
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Solicitação de Orçamento enviada com sucesso!');
    };

    return (
        <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Solicitação de Orçamento (SO)</h1>
                <p className="text-muted-foreground">
                    Envie pedidos de cotação diretamente para os fornecedores.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Nova Solicitação</CardTitle>
                    <CardDescription>Preencha os detalhes da demanda para iniciar o processo de compras.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título da SO</Label>
                                <Input id="title" placeholder="Ex: Aquisição de Notebooks" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Categoria</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="equipamentos">Equipamentos TI</SelectItem>
                                        <SelectItem value="servicos">Serviços Gerais</SelectItem>
                                        <SelectItem value="software">Software</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição Detalhada</Label>
                            <Textarea
                                id="description"
                                placeholder="Descreva as especificações, quantidades e prazos desejados..."
                                className="min-h-[120px]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Anexos (Opcional)</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors">
                                <Paperclip className="h-8 w-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Clique para anexar arquivos (PDF, DOCX, IMG)</span>
                                <Input
                                    type="file"
                                    className="hidden"
                                    id="file-upload"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                                <Label htmlFor="file-upload" className="cursor-pointer inset-0 absolute opacity-0" />
                            </div>
                            {file && (
                                <div className="text-sm flex items-center gap-2 bg-secondary/20 p-2 rounded">
                                    <span className="font-medium">{file.name}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button type="submit" className="w-full sm:w-auto">
                            <Send className="mr-2 h-4 w-4" /> Enviar Solicitação
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
