import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, ShieldAlert, Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getAdminStats, getAllUsers, banUser } from "@/api/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

            // Calculate stats from users if not provided by backend
            const usersArray = Array.isArray(usersData) ? usersData : [];

            // Count banned users
            const bannedCount = usersArray.filter(u => u.is_banned || u.status === 'banned').length;

            // Count active today (users with recent activity)
            // If backend doesn't provide this, we can estimate from created_at or last_active
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
            title: `Are you sure you want to ${action} this user?`,
            text: `User ${phone} will be ${action}ned.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: `Yes, ${action}!`
        });

        if (result.isConfirmed) {
            try {
                await banUser(phone, action);
                Swal.fire('Success', `User has been ${action}ned.`, 'success');
                loadData(); // Reload data
            } catch (error) {
                console.error("Ban error", error);
                Swal.fire('Error', error.response?.data?.message || `Failed to ${action} user.`, 'error');
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold text-foreground">
                Selamat Datang {adminName}
            </h2>

            {/* Stats Overview - User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.active_today || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Banned Users</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.banned_users || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Stats Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>User Activity Overview</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { name: "Total Users", value: stats?.total_users || 0 },
                            { name: "Active Today", value: stats?.active_today || 0 },
                            { name: "Banned", value: stats?.banned_users || 0 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                            <Tooltip
                                cursor={{ fill: '#f4f4f5' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* User Management */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex flex-col md:flex-row justify-between items-center gap-4">
                        User Management
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => {
                                    const isBanned = user.is_banned || user.status === 'banned';
                                    return (
                                        <TableRow key={user._id || user.id || user.phone_number}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.phone_number}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                    {isBanned ? 'Banned' : 'Active'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant={isBanned ? "outline" : "destructive"}
                                                    size="sm"
                                                    onClick={() => handleBan(user.phone_number, isBanned)}
                                                >
                                                    {isBanned ? 'Unban' : 'Ban'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
