"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText, Search, Upload, AlertCircle, Info } from "lucide-react";

export function RulesGuide() {
    return (
        <Accordion type="single" collapsible className="w-full bg-white/5 border-white/10 rounded-lg backdrop-blur-md shadow-xl">
            <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-white/5 rounded-lg transition-colors">
                    <div className="flex items-center gap-2 text-primary">
                        <Info className="h-5 w-5" />
                        <span className="font-semibold">Regras de Envio</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-1">
                    <div className="space-y-4 text-gray-300">
                        <ul className="space-y-3">
                            <li className="flex gap-3">
                                <FileText className="h-5 w-5 text-blue-400 shrink-0" />
                                <span>
                                    <strong>Formatos aceitos:</strong> PDF, JPG, PNG ou HEIC.
                                    Tamanho máximo de 10MB por arquivo.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <Search className="h-5 w-5 text-purple-400 shrink-0" />
                                <span>
                                    <strong>Busca por PI:</strong> Digite o número do PI para
                                    localizar automaticamente os dados do pedido.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <Upload className="h-5 w-5 text-green-400 shrink-0" />
                                <span>
                                    <strong>Upload:</strong> Os campos de comprovante mudam
                                    automaticamente de acordo com o meio de comunicação da PI.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                                <span>
                                    <strong>PIs finalizadas:</strong> Pedidos com status "OK" ou "Falha"
                                    não aceitam novo envio sem autorização do NERO27.
                                </span>
                            </li>
                        </ul>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-800">
                            {/* Simplified Media Rules Grid */}
                            {[
                                { code: 'TV', label: 'TV', desc: 'Mapa de veiculação com datas e emissoras.' },
                                { code: 'RD', label: 'Rádio', desc: 'Mapa de veiculação com horários.' },
                                { code: 'OD', label: 'Outdoor', desc: 'Foto do outdoor instalado com entorno visível.' },
                                { code: 'IN', label: 'Internet', desc: 'Relatório de mídia com impressões e cliques.' },
                            ].map((rule) => (
                                <div key={rule.code} className="flex gap-3 p-2 rounded bg-gray-950/50">
                                    <span className="font-mono font-bold text-emerald-500">{rule.code}</span>
                                    <div>
                                        <div className="font-bold text-sm text-gray-200">{rule.label}</div>
                                        <div className="text-xs text-gray-400">{rule.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-2">... e outros meios conforme tabela completa.</p>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
