import { MessageSquare } from "lucide-react";
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
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-8 text-white shadow-lg shadow-primary/20 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
                    <p className="opacity-90 max-w-xl">
                        Here's what's happening today. Check your stats below.
                    </p>
                </div>
                <div className="absolute right-[-20px] bottom-[-40px] opacity-20 rotate-12 pointer-events-none">
                    <MessageSquare size={200} fill="currentColor" />
                </div>
            </div>

            {/* Stat Cards */}
            <DashboardStats />

            {/* Charts & Lists Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Chart */}
                <DashboardActivity />

                {/* Recent Items */}
                <DashboardRecentNotes />
            </div>
        </div>
    );
}
