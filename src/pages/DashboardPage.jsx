import { MessageSquare, Zap, Target, Star } from "lucide-react";
import AdminDashboard from "./AdminDashboard";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardActivity from "@/components/dashboard/DashboardActivity";
import DashboardRecentNotes from "@/components/dashboard/DashboardRecentNotes";

export default function DashboardPage() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // If Admin, render Admin Dashboard
    if (user.role === 'admin') {
        return <AdminDashboard />;
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Welcome Banner */}
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-900 p-1 md:p-1.5 shadow-2xl shadow-primary/20">
                <div className="absolute inset-0 mesh-gradient opacity-30 group-hover:opacity-40 transition-opacity duration-700" />

                <div className="relative bg-slate-900 rounded-[2.2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5">
                    <div className="space-y-5 text-center md:text-left z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                            <Zap size={12} className="fill-primary" /> System Online
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase font-heading">
                                Welcome Back, <span className="text-gradient">{user.name?.split(' ')[0]}</span>! 👋
                            </h1>
                            <p className="text-slate-400 font-medium text-lg max-w-xl leading-relaxed">
                                Your smart assistant has been busy. Here's a quick overview of your digital life today.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                            <BannerBadge icon={<Star size={14} />} text="Pro Member" />
                            <BannerBadge icon={<Target size={14} />} text="12 Goals Met" />
                        </div>
                    </div>

                    <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0 pointer-events-none">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px] animate-pulse" />
                        <MessageSquare size={200} className="text-white opacity-10 rotate-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="currentColor" />
                        {/* Abstract floating elements */}
                        <div className="absolute top-10 right-10 w-4 h-4 bg-primary/40 rounded-full animate-float-slow" />
                        <div className="absolute bottom-10 left-10 w-3 h-3 bg-purple-500/30 rounded-full animate-float" />
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <DashboardStats />

            {/* Charts & Lists Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Activity Chart */}
                <div className="lg:col-span-8">
                    <DashboardActivity />
                </div>

                {/* Recent Items */}
                <div className="lg:col-span-4">
                    <DashboardRecentNotes />
                </div>
            </div>
        </div>
    );
}

function BannerBadge({ icon, text }) {
    return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-white/70 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            {icon} {text}
        </div>
    );
}

