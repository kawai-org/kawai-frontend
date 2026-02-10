import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Link as LinkIcon, Calendar, TrendingUp, ArrowUpRight } from "lucide-react";
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Total Notes"
                value={loading ? "..." : stats.notesCount}
                icon={<FileText size={22} />}
                color="blue"
                trend="+12%"
            />
            <StatCard
                title="Saved Links"
                value={loading ? "..." : stats.linksCount}
                icon={<LinkIcon size={22} />}
                color="green"
                trend="+5%"
            />
            <StatCard
                title="Reminders"
                value={loading ? "..." : stats.remindersCount}
                icon={<Calendar size={22} />}
                color="amber"
                trend="Ongoing"
            />
            <StatCard
                title="Activity"
                value="98%"
                icon={<TrendingUp size={22} />}
                color="purple"
                trend="Optimal"
            />
        </div>
    );
}

function StatCard({ title, value, icon, color, trend }) {
    const colors = {
        blue: "bg-blue-500/10 text-blue-600 border-blue-500/10",
        green: "bg-green-500/10 text-green-600 border-green-500/10",
        amber: "bg-amber-500/10 text-amber-600 border-amber-500/10",
        purple: "bg-purple-500/10 text-purple-600 border-purple-500/10",
    };

    return (
        <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-3xl group hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 opacity-5 pointer-events-none transition-transform duration-500 group-hover:scale-150 ${colors[color].split(' ')[0]}`} />

            <CardContent className="p-6 md:p-7 relative z-10">
                <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-2xl border ${colors[color]} backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                        {icon}
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <ArrowUpRight size={10} className="text-primary" />
                        {trend}
                    </div>
                </div>

                <div className="mt-6 md:mt-8 space-y-1">
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter tabular-nums">{value}</h3>
                </div>
            </CardContent>
        </Card>
    );
}

