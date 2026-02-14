"use client";

import { CheckingItem } from "@/types/checking";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, MapPin, AlertTriangle, CheckCircle } from "lucide-react";

interface CheckingCardProps {
    item: CheckingItem;
    onClick: () => void;
}

export function CheckingCard({ item, onClick }: CheckingCardProps) {
    const isCommissionValid = item.validation.agencyCommission === 20;

    return (
        <Card
            onClick={onClick}
            className="cursor-pointer border-l-4 border-l-primary bg-card/50 backdrop-blur-sm transition-all hover:bg-muted/50 hover:shadow-lg hover:translate-y-[-2px]"
            style={{
                borderLeftColor: isCommissionValid ? 'var(--primary)' : 'var(--destructive)'
            }}
        >
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-bold truncate max-w-[180px]" title={item.title}>
                        {item.title}
                    </CardTitle>
                    <Badge variant={item.priority === 'high' ? 'destructive' : 'outline'} className="text-[10px] px-1 py-0 h-5">
                        {item.priority.toUpperCase()}
                    </Badge>
                </div>
                <CardDescription className="text-xs truncate">{item.supplier.name}</CardDescription>
            </CardHeader>

            <CardContent className="p-4 py-2 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    <span className={item.invoice ? "text-primary" : "text-destructive"}>
                        {item.invoice ? `NF: ${item.invoice.number}` : "Sem Nota Fiscal"}
                    </span>
                </div>

                {/* Validation Indicators */}
                <div className="flex gap-2">
                    <Badge variant="secondary" className="text-[10px] gap-1 px-1 h-5">
                        {item.validation.ocrMatch ? <CheckCircle className="h-3 w-3 text-primary" /> : <AlertTriangle className="h-3 w-3 text-yellow-500" />}
                        OCR
                    </Badge>

                    {item.supplier.category === 'OOH' && (
                        <Badge variant="secondary" className="text-[10px] gap-1 px-1 h-5">
                            {item.validation.geofenceValid ? <MapPin className="h-3 w-3 text-primary" /> : <AlertTriangle className="h-3 w-3 text-destructive" />}
                            GEO
                        </Badge>
                    )}

                    {!isCommissionValid && (
                        <Badge variant="destructive" className="text-[10px] px-1 h-5 animate-pulse">
                            CENP
                        </Badge>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-2 flex justify-between text-[10px] text-muted-foreground">
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                <span>R$ {item.invoice?.amount.toLocaleString('pt-BR') || '---'}</span>
            </CardFooter>
        </Card>
    );
}
