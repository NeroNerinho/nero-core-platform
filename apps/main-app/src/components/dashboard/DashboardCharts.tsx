'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardCharts() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 bg-black/40 border-white/10">
                <CardHeader>
                    <CardTitle>Visão Geral</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                        Gráfico de Barras (Placeholder)
                    </div>
                </CardContent>
            </Card>
            <Card className="col-span-3 bg-black/40 border-white/10">
                <CardHeader>
                    <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                        Gráfico de Pizza (Placeholder)
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
