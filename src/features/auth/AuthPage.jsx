import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/logo.png";
import Swal from 'sweetalert2';
import {
    User,
    Phone,
    Lock,
    Key,
    ArrowLeft,
    CheckCircle2,
    MessageCircle,
    ShieldCheck
} from 'lucide-react';

export default function AuthPage() {
    const [isRegister, setIsRegister] = useState(false);

    // Register State
    const [regName, setRegName] = useState("");
    const [regPhone, setRegPhone] = useState("");
    const [regPassword, setRegPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validation
        if (!regName.trim()) {
            return Swal.fire({ icon: 'warning', title: 'Start Adventure', text: 'Please enter your name.' });
        }
        if (!regPhone.trim() || !/^\d+$/.test(regPhone) || regPhone.length < 10) {
            return Swal.fire({ icon: 'warning', title: 'Invalid Phone', text: 'Please enter a valid phone number (digits only, min 10 chars).' });
        }
        if (!regPassword || regPassword.length < 6) {
            return Swal.fire({ icon: 'warning', title: 'Weak Password', text: 'Password must be at least 6 characters long.' });
        }

        try {
            await import("@/api/auth").then(m => m.registerUser({
                name: regName,
                phone_number: regPhone,
                password: regPassword,
            }));

            Swal.fire({
                icon: 'success',
                title: 'Registration Success',
                text: 'You can now login via WhatsApp.',
                timer: 2000
            });
            setIsRegister(false);
        } catch (error) {
            console.error("Register error", error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.response?.data?.message || "Please check your inputs and try again.",
            });
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-slate-50 overflow-hidden font-sans relative">
            {/* Background Blob for Mobile */}
            <div className="fixed lg:hidden inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 bg-purple-500/10 rounded-full blur-2xl" />
            </div>

            {/* Left Side - Hero / Branding (Premium Mesh) */}
            <div className="hidden lg:flex w-5/12 relative mesh-gradient items-center justify-center p-16 overflow-hidden shadow-[20px_0_40px_rgba(0,0,0,0.1)]">
                <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.4),transparent)]" />
                </div>

                <div className="relative z-10 text-center text-white space-y-10 max-w-sm">
                    <div className="relative inline-block group">
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 scale-110" />
                        <div className="bg-white/20 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/30 shadow-2xl relative">
                            <img src={Logo} alt="Kawai Logo" className="w-24 h-24 drop-shadow-lg animate-bounce-slow" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl font-black tracking-tight leading-tight uppercase font-heading">
                            One Step <br /> to <span className="text-slate-900/40">Smarter</span>
                        </h1>
                        <p className="text-white/80 text-lg font-medium leading-relaxed italic">
                            "Organize your thoughts and tasks with a companion that truly understands you."
                        </p>
                    </div>

                    <div className="flex justify-center gap-3 pt-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs font-bold text-white/60 self-center uppercase tracking-widest">+10K Users Joined</p>
                    </div>
                </div>

                {/* Decorative particles */}
                <div className="absolute top-10 left-10 w-2 h-2 bg-white/40 rounded-full animate-ping" />
                <div className="absolute bottom-20 right-20 w-3 h-3 bg-white/30 rounded-full animate-float" />
            </div>

            {/* Right Side - Forms */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
                <div className="w-full max-w-md space-y-10 relative">
                    {/* Floating Back Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute -top-16 left-0 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl group transition-all"
                        asChild
                    >
                        <a href="/">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
                        </a>
                    </Button>

                    <div className="text-center md:text-left space-y-3">
                        <div className="lg:hidden mx-auto w-20 h-20 bg-white shadow-xl shadow-primary/10 rounded-3xl flex items-center justify-center p-3 mb-6 border border-slate-50">
                            <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-slate-900 uppercase font-heading">
                            {isRegister ? "Join Us" : "Welcome"}
                        </h2>
                        <p className="text-slate-400 font-medium">
                            {isRegister
                                ? "Become part of the most kawaii productivity community."
                                : "Login to pick up right where you left off."}
                        </p>
                    </div>

                    <Card className="border-0 shadow-2xl shadow-slate-200/60 rounded-[2rem] bg-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

                        <CardContent className="p-8 md:p-10 relative z-10">
                            {/* Unified Login via WhatsApp */}
                            {!isRegister && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="space-y-6">
                                        <div className="relative group/btn">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-2xl blur opacity-20 group-hover/btn:opacity-40 transition duration-500" />
                                            <Button
                                                asChild
                                                className="w-full h-16 text-xl bg-[#25D366] hover:bg-[#128C7E] text-white font-black rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] border-0"
                                            >
                                                <a
                                                    href={`https://wa.me/${import.meta.env.VITE_BOT_NUMBER}?text=Dashboard`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center justify-center gap-4"
                                                    onClick={(e) => {
                                                        if (!import.meta.env.VITE_BOT_NUMBER) {
                                                            e.preventDefault();
                                                            Swal.fire({
                                                                icon: 'error',
                                                                title: 'Ops!',
                                                                text: 'WhatsApp bot configuration is missing. Contact support.'
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <MessageCircle className="w-7 h-7 fill-white/20" />
                                                    LOGIN VIA WA
                                                </a>
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <InfoCard
                                                icon={<Key className="w-4 h-4 text-amber-500" />}
                                                text="Magic Link validation"
                                            />
                                            <InfoCard
                                                icon={<ShieldCheck className="w-4 h-4 text-blue-500" />}
                                                text="Secure auto-role detection"
                                            />
                                        </div>
                                    </div>

                                    <div className="relative flex items-center py-2">
                                        <div className="flex-grow border-t border-slate-100"></div>
                                        <span className="flex-shrink mx-4 text-slate-300 text-xs font-black uppercase tracking-widest">Or Register</span>
                                        <div className="flex-grow border-t border-slate-100"></div>
                                    </div>

                                    <div className="text-center">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsRegister(true)}
                                            className="w-full h-14 rounded-2xl border-slate-100 text-slate-600 font-bold hover:bg-slate-50 hover:text-primary hover:border-primary/20 transition-all border-2"
                                        >
                                            CREATE NEW ACCOUNT
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Register Form */}
                            {isRegister && (
                                <form onSubmit={handleRegister} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nama Lengkap</Label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                    <Input
                                                        placeholder="Kawai Dev"
                                                        className="h-12 pl-11 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all shadow-sm"
                                                        value={regName}
                                                        onChange={e => setRegName(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</Label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                    <Input
                                                        placeholder="628123..."
                                                        className="h-12 pl-11 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all shadow-sm"
                                                        value={regPhone}
                                                        onChange={e => setRegPhone(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Create Password</Label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="h-12 pl-11 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all shadow-sm"
                                                    value={regPassword}
                                                    onChange={e => setRegPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                        FINISH ADVENTURE
                                    </Button>

                                    <p className="text-center text-sm font-bold text-slate-400 py-2">
                                        Have account?{" "}
                                        <button type="button" onClick={() => setIsRegister(false)} className="text-primary hover:underline underline-offset-4">
                                            Login here
                                        </button>
                                    </p>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function InfoCard({ icon, text }) {
    return (
        <div className="group cursor-pointer relative rounded-2xl border border-slate-100 bg-white p-5 transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-1">
            <div className="flex items-center gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    {icon}
                </div>
                <p className="font-bold text-slate-700 text-sm group-hover:text-primary transition-colors">{text}</p>
            </div>
        </div>
    );
}