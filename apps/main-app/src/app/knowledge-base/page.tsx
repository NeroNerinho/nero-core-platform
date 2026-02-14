import { KBSearch } from '@/components/knowledge-base/KBSearch';
import { BookOpen, Info } from 'lucide-react';

export default function KnowledgeBasePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 p-6">
            <div className="text-center space-y-4 max-w-2xl">
                <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto">
                    <BookOpen className="h-12 w-12 text-primary" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Como podemos ajudar?</h1>
                <p className="text-xl text-muted-foreground">
                    Explore nossa Base de Conhecimento com Inteligência Artificial. Digite sua dúvida abaixo e receba respostas instantâneas.
                </p>
            </div>

            <KBSearch />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-4xl">
                {['Contas a Pagar', 'Emissão de Notas', 'Gestão de Mídia'].map((topic) => (
                    <div key={topic} className="flex flex-col items-center p-6 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors text-center">
                        <Info className="h-8 w-8 mb-4 text-muted-foreground" />
                        <h3 className="font-semibold">{topic}</h3>
                        <p className="text-sm text-muted-foreground mt-2">Dúvidas frequentes e tutoriais.</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
