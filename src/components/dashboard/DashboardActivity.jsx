import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export default function DashboardActivity() {
    // Mock Activity Data for Chart
    const activityData = [
        { name: 'Mon', count: 4 },
        { name: 'Tue', count: 7 },
        { name: 'Wed', count: 3 },
        { name: 'Thu', count: 8 },
        { name: 'Fri', count: 12 },
        { name: 'Sat', count: 5 },
        { name: 'Sun', count: 6 },
    ];

    return (
        <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="p-8 pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-black uppercase tracking-tight font-heading">Weekly Activity</CardTitle>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Interactions per day</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-4 md:px-6 pb-8 h-[300px] md:h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            dy={15}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc', radius: 10 }}
                            contentStyle={{
                                borderRadius: '16px',
                                border: '1px solid #f1f5f9',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                                padding: '12px'
                            }}
                            itemStyle={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a' }}
                            labelStyle={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}
                        />
                        <Bar
                            dataKey="count"
                            radius={[8, 8, 8, 8]}
                            barSize={32}
                            animationDuration={1500}
                        >
                            {activityData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.count > 10 ? 'hsl(var(--primary))' : '#e2e8f0'}
                                    className="transition-all duration-500 hover:opacity-80"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

