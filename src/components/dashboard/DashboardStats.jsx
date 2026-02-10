import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Link as LinkIcon, Calendar, TrendingUp } from "lucide-react";
import { getNotes } from "@/api/notes";
import { getReminders } from "@/api/reminders";

export default function DashboardStats() {
    const [stats, setStats] = useState({
        notesCount: 0,
        linksCount: 0,
        remindersCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [notesData, remindersData] = await Promise.all([
                    getNotes(),
                    getReminders()
                ]);

                // Ensure arrays
                const notes = Array.isArray(notesData) ? notesData : [];
                const reminders = Array.isArray(remindersData) ? remindersData : [];

                // Filter "Links" from notes if they contain URLs
                const linksCount = notes.filter(n =>
                    n.type === 'mixed' ||
                    (n.content && /(https?:\/\/[^\s]+)/g.test(n.content))
                ).length;

                setStats({
                    notesCount: notes.length,
                    linksCount: linksCount,
                    remindersCount: reminders.length
                });
            } catch (error) {
                console.error("Failed to load stats", error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Total Notes"
                value={loading ? "..." : stats.notesCount}
                icon={<FileText className="text-blue-500" size={24} />}
                trend="+2 this week"
            />
            <StatCard
                title="Saved Links"
                value={loading ? "..." : stats.linksCount}
                icon={<LinkIcon className="text-green-500" size={24} />}
                trend="No new links"
            />
            <StatCard
                title="Reminders"
                value={loading ? "..." : stats.remindersCount}
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
