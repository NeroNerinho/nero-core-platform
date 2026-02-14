'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentLogs() {
    const logs = [
        { user: "Ana Silva", action: "Aprovou PI 2024-501", time: "2 min atrás" },
        { user: "Carlos Souza", action: "Rejeitou PI 2024-498", time: "15 min atrás" },
        { user: "Sistema", action: "Backup automático concluído", time: "1 hora atrás" },
    ]

    return (
        <Card className="bg-black/40 border-white/10 col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {logs.map((log, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                    {log.user.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium text-white">{log.user}</p>
                                <p className="text-xs text-muted-foreground">{log.action}</p>
                            </div>
                            <div className="text-xs text-gray-500">{log.time}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
