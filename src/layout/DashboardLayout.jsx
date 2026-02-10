import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Link as LinkIcon,
    Calendar as CalendarIcon,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    HelpCircle
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

    // Navigation items - Chat Assistant removed
    const navItems = [
        { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { path: "/notes", label: "My Notes", icon: <FileText size={20} /> },
        { path: "/links", label: "Saved Links", icon: <LinkIcon size={20} /> },
        { path: "/reminders", label: "Reminders", icon: <Bell size={20} /> },
        { path: "/calendar", label: "Calendar", icon: <CalendarIcon size={20} /> },
    ];

    // Debug: Log navItems to console
    console.log("DashboardLayout navItems:", navItems);
    console.log("Total nav items:", navItems.length);
    console.log("Reminders item:", navItems.find(item => item.path === "/reminders"));
    console.log("Calendar item:", navItems.find(item => item.path === "/calendar"));

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-foreground">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-border/40 transition-transform duration-300 ease-in-out flex flex-col
                md:relative md:translate-x-0
                ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
            `}>
                <div className="h-16 flex items-center px-6 border-b border-border/40 flex-shrink-0">
                    <img src={Logo} alt="Logo" className="w-8 h-8 mr-3" />
                    <span className="font-bold text-xl tracking-tight text-primary font-heading">Kawai-chan</span>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto md:hidden text-muted-foreground"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Items - Scrollable area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-primary/10 text-primary font-medium shadow-sm'
                                        : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'}
                                `}
                            >
                                <span className={isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </NavLink>
                        );
                    })}
                </div>

                {/* Bottom section - Fixed at bottom */}
                <div className="flex-shrink-0 w-full px-4 border-t border-border/40 pt-4 pb-4 bg-white">
                    <NavLink
                        to="/faq"
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1 group
                            ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'}
                        `}
                    >
                        <HelpCircle size={20} className="group-hover:rotate-12 transition-transform" />
                        Help & Feedback
                    </NavLink>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-border/40 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden -ml-2 text-muted-foreground"
                        >
                            <Menu size={20} />
                        </Button>
                        <h2 className="font-semibold text-lg hidden md:block">
                            {navItems.find(i => i.path === location.pathname)?.label || "Dashboard"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </Button>

                        <div className="h-8 w-[1px] bg-border/60 mx-1"></div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-full pr-3 transition-colors">
                                    <Avatar className="h-8 w-8 border border-border shadow-sm">
                                        <AvatarImage src="" />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                            {user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || "KW"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium leading-none">{user.name || "Guest"}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{user.phone_number}</p>
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500" onClick={handleLogout}>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
