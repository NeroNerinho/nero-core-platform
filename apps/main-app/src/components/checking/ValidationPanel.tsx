"use client";

import { CheckingItem } from "@/types/checking";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, MapPin, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ValidationPanelProps {
    item: CheckingItem | null;
    isOpen: boolean;
    onClose: () => void;
    onValidate: (itemId: string, valid: boolean) => void;
}

export function ValidationPanel({ item, isOpen, onClose, onValidate }: ValidationPanelProps) {
    if (!item) return null;

    const isCommissionValid = item.validation.agencyCommission === 20;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-primary/20">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        {item.title}
                        <Badge variant="outline">{item.status}</Badge>
                    </DialogTitle>
                    <DialogDescription>
                        Validar dados extraídos via OCR e Compliance (CENP/Geofencing)
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">

                    {/* Left Column: Document Preview */}
                    <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-sm">Visualização do Comprovante</h3>
                            <Button variant="ghost" size="sm" className="text-xs">Abrir PDF</Button>
                        </div>

                        <div className="aspect-[3/4] bg-muted flex items-center justify-center rounded-md border border-dashed">
                            <span className="text-muted-foreground text-xs">Preview do PDF/Imagem</span>
                            {/* Image placeholder */}
                        </div>

                        {item.supplier.category === 'OOH' && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> Geofencing
                                </h3>
                                <div className="h-32 bg-slate-900 rounded-md flex items-center justify-center text-xs text-slate-400">
                                    Mapa (Google Maps API Mock)
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Validation Data */}
                    <div className="space-y-6">
                        <Tabs defaultValue="ocr" className="w-full">
                            <TabsList className="w-full">
                                <TabsTrigger value="ocr" className="flex-1">OCR Data</TabsTrigger>
                                <TabsTrigger value="compliance" className="flex-1">Compliance</TabsTrigger>
                            </TabsList>

                            <TabsContent value="ocr" className="space-y-4 pt-4">
                                <div className="grid gap-2">
                                    <Label>Número da Nota</Label>
                                    <div className="flex gap-2">
                                        <Input value={item.invoice?.number || ''} readOnly className="bg-muted/50" />
                                        <Badge variant={item.validation.ocrMatch ? "secondary" : "destructive"}>
                                            {item.validation.ocrMatch ? "Match" : "Mismatch"}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Valor Total</Label>
                                    <Input value={`R$ ${item.invoice?.amount.toLocaleString('pt-BR') || ''}`} readOnly className="font-mono bg-muted/50" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>CNPJ Emissor</Label>
                                    <Input value={item.supplier.cnpj} readOnly className="bg-muted/50" />
                                </div>
                            </TabsContent>

                            <TabsContent value="compliance" className="space-y-4 pt-4">
                                <div className="border rounded-md p-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Comissão de Agência (20%)</span>
                                        {isCommissionValid ? (
                                            <CheckCircle className="h-5 w-5 text-primary" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-destructive" />
                                        )}
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Detectado: {item.validation.agencyCommission}%</span>
                                        <span>Esperado: 20%</span>
                                    </div>
                                    {!isCommissionValid && (
                                        <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                                            Alerta: A comissão está divergente do padrão CENP.
                                        </div>
                                    )}
                                </div>

                                {item.supplier.category === 'OOH' && (
                                    <div className="border rounded-md p-4 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">Geofencing Validado</span>
                                            {item.validation.geofenceValid ? (
                                                <CheckCircle className="h-5 w-5 text-primary" />
                                            ) : (
                                                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Local da foto confere com o cadastro da face no BigQuery.
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button variant="destructive" onClick={() => onValidate(item.id, false)}>Rejeitar</Button>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => onValidate(item.id, true)}>
                        Aprovar & Próxima Etapa
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
