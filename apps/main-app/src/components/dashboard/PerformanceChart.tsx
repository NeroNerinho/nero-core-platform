'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const data = [
    { name: 'Jan', checkings: 400, approved: 240 },
    { name: 'Feb', checkings: 300, approved: 139 },
    { name: 'Mar', checkings: 200, approved: 98 },
    { name: 'Apr', checkings: 278, approved: 390 },
    { name: 'May', checkings: 189, approved: 480 },
    { name: 'Jun', checkings: 239, approved: 380 },
    { name: 'Jul', checkings: 349, approved: 430 },
]

export function PerformanceChart() {
    return (
        <Card className="col-span-4 bg-gray-900 border-gray-800 text-gray-100">
            <CardHeader>
                <CardTitle className="text-white">Performance Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F3F4F6' }}
                            />
                            <Line type="monotone" dataKey="checkings" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="approved" stroke="#10B981" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
