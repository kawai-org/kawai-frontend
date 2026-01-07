import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Link as LinkIcon, MessageSquare, TrendingUp, Calendar } from "lucide-react";
import { getNotes } from "@/api/notes";
import { getReminders } from "@/api/reminders";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

import AdminDashboard from "./AdminDashboard";

export default function DashboardPage() {
    const [stats, setStats] = useState({ notes: [], links: [], reminders: [] });
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // If Admin, render Admin Dashboard
    if (user.role === 'admin') {
        return <AdminDashboard />;
    }

    useEffect(() => {
        const loadData = async () => {
            if (user.phone_number) {
                try {
                    console.log("Loading dashboard data...");
                    const [notesData, remindersData] = await Promise.all([
                        getNotes(),
                        getReminders()
                    ]);

                    console.log("Dashboard - Notes Data:", notesData);
                    console.log("Dashboard - Reminders Data:", remindersData);

                    // Ensure arrays
                    const notes = Array.isArray(notesData) ? notesData : [];
                    const reminders = Array.isArray(remindersData) ? remindersData : [];

                    // Filter "Links" from notes if they contain URLs
                    const linksData = notes.filter(n =>
                        n.type === 'mixed' ||
                        (n.content && /(https?:\/\/[^\s]+)/g.test(n.content))
                    );

                    console.log("Dashboard - Filtered Links:", linksData);

                    setStats({
                        notes: notes,
                        links: linksData,
                        reminders: reminders
                    });
                } catch (error) {
                    console.error("Dashboard data error", error);
                    // Set empty arrays on error
                    setStats({
                        notes: [],
                        links: [],
                        reminders: []
                    });
                }
            }
        };
        loadData();
    }, [user.phone_number]);

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
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-8 text-white shadow-lg shadow-primary/20 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
                    <p className="opacity-90 max-w-xl">
                        Here's what's happening today. You have <span className="font-bold">{stats.notes?.length || 0}</span> notes and <span className="font-bold">{stats.links?.length || 0}</span> saved links.
                    </p>
                </div>
                <div className="absolute right-[-20px] bottom-[-40px] opacity-20 rotate-12 pointer-events-none">
                    <MessageSquare size={200} fill="currentColor" />
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Notes"
                    value={stats.notes?.length || 0}
                    icon={<FileText className="text-blue-500" size={24} />}
                    trend="+2 this week"
                />
                <StatCard
                    title="Saved Links"
                    value={stats.links?.length || 0}
                    icon={<LinkIcon className="text-green-500" size={24} />}
                    trend="No new links"
                />
                <StatCard
                    title="Reminders"
                    value={stats.reminders?.length || 0}
                    icon={<Calendar className="text-orange-500" size={24} />}
                    trend="You're all clear"
                />
                <StatCard
                    title="Activity"
                    value="High"
                    icon={<TrendingUp className="text-purple-500" size={24} />}
                    trend="Top 10% users"
                />
            </div>

            {/* Charts & Lists Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Chart */}
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

                {/* Recent Items */}
                <Card className="border-border/40 shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {(stats.notes || []).slice(0, 5).map((note, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                    <div className="bg-blue-50 p-2 rounded-lg text-blue-500 flex-shrink-0">
                                        <FileText size={16} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium truncate">{note.content}</p>
                                        <p className="text-xs text-muted-foreground mt-1 truncate">
                                            {note.created_at ? new Date(note.created_at.$date || note.created_at).toLocaleDateString() : "Just now"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {(!stats.notes || stats.notes.length === 0) && (
                                <p className="text-sm text-center text-muted-foreground py-8">No notes yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend }) {
    return (
        <Card className="border-border/40 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
                </div>
                <div>
                    <h3 className="text-2xl font-bold">{value}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{trend}</p>
                </div>
            </CardContent>
        </Card>
    );
}
