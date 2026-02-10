import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Link as LinkIcon,
    Calendar as CalendarIcon,
    LogOut,
    Menu,
    X,
    Bell,
    HelpCircle,
    ChevronRight,
    CircleDot,
    UserCheck
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/assets/logo.png";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    const navItems = [
        { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { path: "/notes", label: "My Notes", icon: <FileText size={20} /> },
        { path: "/links", label: "Saved Links", icon: <LinkIcon size={20} /> },
        { path: "/reminders", label: "Reminders", icon: <Bell size={20} /> },
        { path: "/calendar", label: "Calendar", icon: <CalendarIcon size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 flex font-sans text-slate-900">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-md transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-50 h-[100dvh] w-72 bg-white border-r border-slate-100 transition-all duration-300 ease-in-out flex flex-col
                md:relative md:translate-x-0
                ${sidebarOpen ? 'translate-x-0 shadow-2xl shadow-slate-200' : '-translate-x-full'}
            `}>
                <div className="h-20 flex items-center px-8 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center p-1.5 border border-primary/5 shadow-sm">
                            <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-black text-xl tracking-tighter text-slate-900 uppercase font-heading">Kawai-chan</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto md:hidden text-slate-400 hover:text-primary rounded-xl"
                    >
                        <X size={20} />
                    </Button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-1">Main Menu</p>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) => `
                                    flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group
                                    ${isActive
                                        ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                                `}
                            >
                                <div className="flex items-center gap-3.5">
                                    <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400 group-hover:text-primary"}`}>
                                        {item.icon}
                                    </span>
                                    <span className="font-bold text-sm tracking-tight uppercase">{item.label}</span>
                                </div>
                                {isActive && <ChevronRight size={16} className="text-white/60" />}
                            </NavLink>
                        );
                    })}
                </div>

                {/* Bottom section */}
                <div className="flex-shrink-0 w-full px-4 border-t border-slate-50 pt-6 pb-6 bg-white space-y-2">
                    <NavLink
                        to="/faq"
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) => `
                            flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                            ${isActive ? 'bg-primary/5 text-primary border border-primary/10' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <HelpCircle size={20} className={`${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                                <span className="font-bold text-sm tracking-tight uppercase">Support Center</span>
                            </>
                        )}
                    </NavLink>

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3.5 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all duration-300 group font-bold text-sm tracking-tight uppercase"
                    >
                        <div className="bg-red-50 p-2 rounded-lg group-hover:bg-red-100 transition-colors">
                            <LogOut size={16} />
                        </div>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-30 transition-all">
                    <div className="flex items-center gap-5">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden text-slate-500 hover:bg-slate-100 rounded-xl"
                        >
                            <Menu size={22} />
                        </Button>
                        <div className="hidden md:flex flex-col">
                            <h2 className="font-black text-xl tracking-tighter text-slate-900 uppercase font-heading">
                                {navItems.find(i => i.path === location.pathname)?.label || (location.pathname === "/faq" ? "Support" : "Kawai-chan")}
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Live</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="hidden sm:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100">
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-primary hover:bg-white rounded-xl shadow-none transition-all">
                                <Bell size={18} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-primary hover:bg-white rounded-xl shadow-none transition-all">
                                <CalendarIcon size={18} />
                            </Button>
                        </div>

                        <div className="w-[1px] h-8 bg-slate-100 mx-1 hidden md:block" />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-3 cursor-pointer p-1 rounded-2xl md:pl-3 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                                    <div className="hidden md:block text-right">
                                        <p className="text-xs font-black uppercase tracking-tight text-slate-900">{user.name || "Kawai User"}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.role || 'Member'}</p>
                                    </div>
                                    <div className="relative">
                                        <Avatar className="h-10 w-10 border-2 border-white shadow-lg ring-1 ring-slate-100">
                                            <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-white font-black text-xs">
                                                {user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || "KW"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border-slate-100 shadow-3xl">
                                <DropdownMenuLabel className="px-3 py-2">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-black uppercase tracking-tight">{user.name}</p>
                                        <p className="text-xs text-slate-400 font-medium">{user.phone_number}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="mx-2 bg-slate-50" />
                                <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer font-bold text-xs uppercase tracking-widest text-slate-600 focus:bg-slate-50 focus:text-primary">
                                    <UserCheck className="w-4 h-4 mr-3" /> Account Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer font-bold text-xs uppercase tracking-widest text-slate-600 focus:bg-slate-50 focus:text-primary">
                                    <CircleDot className="w-4 h-4 mr-3" /> System Status
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="mx-2 bg-slate-50" />
                                <DropdownMenuItem
                                    className="rounded-xl px-3 py-2.5 cursor-pointer font-bold text-xs uppercase tracking-widest text-red-500 focus:bg-red-50 focus:text-red-600"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-4 h-4 mr-3" /> Secure Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-10 scroll-smooth">
                    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

