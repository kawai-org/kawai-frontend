import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function DashboardActivity() {
    // Mock Activity Data for Chart
    // In future, this can be fetched from an API endpoint
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
        <Card className="lg:col-span-2 border-border/40 shadow-sm">
            <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                        <Tooltip
                            cursor={{ fill: '#f4f4f5' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
