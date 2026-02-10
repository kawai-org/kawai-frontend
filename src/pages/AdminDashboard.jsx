import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, ShieldAlert, Search, Lock, Unlock, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { getAdminStats, getAllUsers, banUser } from "@/api/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Swal from "sweetalert2";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [adminName, setAdminName] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setAdminName(user.name || user.username || "Admin");
        loadData();
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            setFilteredUsers(
                users.filter(u =>
                    u.name?.toLowerCase().includes(search.toLowerCase()) ||
                    u.phone_number?.includes(search)
                )
            );
        }
    }, [search, users]);

    const loadData = async () => {
        try {
            const [statsData, usersData] = await Promise.all([
                getAdminStats(),
                getAllUsers()
            ]);

            const usersArray = Array.isArray(usersData) ? usersData : [];
            const bannedCount = usersArray.filter(u => u.is_banned || u.status === 'banned').length;
            const activeCount = statsData.active_today || 0;

            const finalStats = {
                total_users: statsData.total_users || usersArray.length,
                active_today: activeCount,
                banned_users: bannedCount
            };

            setStats(finalStats);
            setUsers(usersArray);
            setFilteredUsers(usersArray);
        } catch (error) {
            console.error("Failed to load admin data", error);
        }
    };

    const handleBan = async (phone, isBanned) => {
        const action = isBanned ? 'unban' : 'ban';
        const result = await Swal.fire({
            title: `Are you sure?`,
            text: `User ${phone} will be ${action}ned.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: isBanned ? '#10b981' : '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: `Yes, ${action}!`,
            customClass: {
                popup: 'rounded-[1.5rem] border-0',
                confirmButton: 'rounded-xl px-6 py-2',
                cancelButton: 'rounded-xl px-6 py-2'
            }
        });

        if (result.isConfirmed) {
            try {
                await banUser(phone, action);
                Swal.fire({
                    title: 'Success',
                    text: `User has been ${action}ned successfully.`,
                    icon: 'success',
                    customClass: { popup: 'rounded-[1.5rem] border-0' }
                });
                loadData();
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: error.response?.data?.message || `Failed to ${action} user.`,
                    icon: 'error',
                    customClass: { popup: 'rounded-[1.5rem] border-0' }
                });
            }
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase font-heading">
                        Welcome, <span className="text-gradient">{adminName}</span>
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Administrative Nerve Center • Live Control
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl border-slate-200 font-bold uppercase text-[10px] tracking-widest px-6 h-11" onClick={loadData}>
                        Refresh Data
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AdminStatCard
                    title="Total Population"
                    value={stats?.total_users || 0}
                    icon={<Users size={22} />}
                    color="blue"
                    trend="+5 today"
                />
                <AdminStatCard
                    title="Active Sessions"
                    value={stats?.active_today || 0}
                    icon={<Activity size={22} />}
                    color="green"
                    trend="Live now"
                />
                <AdminStatCard
                    title="Banned Accounts"
                    value={stats?.banned_users || 0}
                    icon={<ShieldAlert size={22} />}
                    color="red"
                    trend="Restricted"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Activity Summary */}
                <Card className="lg:col-span-5 border-0 shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
                    <CardHeader className="p-8 pb-2">
                        <CardTitle className="text-xl font-black uppercase tracking-tight font-heading">User Distribution</CardTitle>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status breakdown</p>
                    </CardHeader>
                    <CardContent className="px-6 pb-8 h-[340px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: "Total", value: stats?.total_users || 0 },
                                { name: "Active", value: stats?.active_today || 0 },
                                { name: "Banned", value: stats?.banned_users || 0 },
                            ]} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc', radius: 10 }}
                                    contentStyle={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', padding: '12px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: '#0f172a' }}
                                />
                                <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={48}>
                                    <Cell fill="hsl(var(--primary))" />
                                    <Cell fill="#10b981" />
                                    <Cell fill="#ef4444" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* User Management */}
                <Card className="lg:col-span-7 border-0 shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <CardTitle className="text-xl font-black uppercase tracking-tight font-heading">Master Controls</CardTitle>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">User registry & status</p>
                            </div>
                            <div className="relative w-full md:w-64 group">
                                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Search users..."
                                    className="pl-10 h-11 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all shadow-none focus:ring-0 focus:border-primary/30 font-medium"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-2 md:px-6 pb-8">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-0 hover:bg-transparent">
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 pb-4">Profile Info</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 pb-4">Phone Identity</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 pb-4">Account Status</TableHead>
                                        <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-slate-400 pb-4">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => {
                                            const isBanned = user.is_banned || user.status === 'banned';
                                            return (
                                                <TableRow key={user._id || user.id || user.phone_number} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                    <TableCell className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                                                                <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-black uppercase">
                                                                    {user.name?.charAt(0) || "U"}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <p className="font-bold text-slate-900 tracking-tight">{user.name}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium text-slate-500">{user.phone_number}</TableCell>
                                                    <TableCell>
                                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
                                                            ${isBanned ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                                                            {isBanned ? <ShieldAlert size={10} /> : <CheckCircle2 size={10} />}
                                                            {isBanned ? 'Banned' : 'Active'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleBan(user.phone_number, isBanned)}
                                                            className={`h-9 w-9 rounded-xl transition-all 
                                                                ${isBanned ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                                        >
                                                            {isBanned ? <Unlock size={16} /> : <Lock size={16} />}
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow className="border-0">
                                            <TableCell colSpan={4} className="h-48 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-3">
                                                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                                                        <Search size={20} className="text-slate-300" />
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No records matching search query</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function AdminStatCard({ title, value, icon, color, trend }) {
    const variants = {
        blue: "bg-blue-500/10 text-blue-600 border-blue-500/10",
        green: "bg-green-500/10 text-green-600 border-green-500/10",
        red: "bg-red-500/10 text-red-600 border-red-500/10",
    };

    return (
        <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-3xl group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden bg-white">
            <CardContent className="p-7 relative z-10">
                <div className="flex items-start justify-between">
                    <div className={`p-3.5 rounded-2xl border ${variants[color]} backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                        {icon}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <ArrowUpRight size={12} className="text-primary" />
                        {trend}
                    </div>
                </div>
                <div className="mt-8 space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">{value}</h3>
                </div>
            </CardContent>
        </Card>
    );
}

