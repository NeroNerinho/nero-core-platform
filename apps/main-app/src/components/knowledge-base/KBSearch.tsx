'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Sparkles, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

export function KBSearch() {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [answer, setAnswer] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        setAnswer(null);

        // Simulate AI delay
        setTimeout(() => {
            setAnswer(`Aqui está o que encontrei sobre "${query}": Para realizar esse procedimento no PubliCloud, acesse o menu correspondente e siga os passos detalhados na documentação oficial. Se precisar de mais ajuda, estou à disposição!`);
            setIsSearching(false);
        }, 1500);
    };

    const handleSpeak = () => {
        if (!answer) return;
        const utterance = new SpeechSynthesisUtterance(answer);
        utterance.lang = 'pt-BR';
        window.speechSynthesis.speak(utterance);
        toast.info('Reproduzindo resposta...');
    };

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6">
            <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                    placeholder="Como faço para emitir NFS-e?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit" disabled={isSearching}>
                    {isSearching ? <Sparkles className="animate-spin mr-2 h-4 w-4" /> : <Search className="mr-2 h-4 w-4" />}
                    Perguntar à IA
                </Button>
            </form>

            {answer && (
                <Card className="bg-muted/50 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                            <Sparkles className="mr-2 h-4 w-4 text-primary" /> Resposta Inteligente
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={handleSpeak}>
                            <Volume2 className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed">{answer}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
