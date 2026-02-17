import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    User,
    Phone,
    MessageCircle,
    Key,
    ArrowLeft,
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function LoginModal({ open, onOpenChange, children }) {
    const [isRegister, setIsRegister] = useState(false);

    // Register State
    const [regName, setRegName] = useState("");
    const [regPhone, setRegPhone] = useState("");
    const [regPassword, setRegPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!regName.trim()) {
            return Swal.fire({ icon: 'warning', title: 'Nama Diperlukan', text: 'Masukkan nama lengkap kamu.' });
        }
        if (!regPhone.trim() || !/^\d+$/.test(regPhone) || regPhone.length < 10) {
            return Swal.fire({ icon: 'warning', title: 'Nomor Tidak Valid', text: 'Masukkan nomor HP valid (hanya angka, min 10 digit).' });
        }
        if (!regPassword || regPassword.length < 6) {
            return Swal.fire({ icon: 'warning', title: 'Password Lemah', text: 'Password minimal 6 karakter.' });
        }

        try {
            const response = await import("@/api/auth").then(m => m.registerUser({
                name: regName,
                phone_number: regPhone,
                password: regPassword,
            }));

            console.log("👉 Register Debug Response:", response);

            // Check for logical error in 200 OK response
            if (response?.status === false || response?.error) {
                throw new Error(response?.message || "Registration failed (backend logic)");
            }

            Swal.fire({
                icon: 'success',
                title: 'Registrasi Berhasil!',
                text: 'Sekarang kamu bisa login via WhatsApp.',
                timer: 2000
            });
            setIsRegister(false);
            setRegName("");
            setRegPhone("");
            setRegPassword("");
        } catch (error) {
            console.error("Register error", error);
            Swal.fire({
                icon: 'error',
                title: 'Registrasi Gagal',
                text: error?.message || "Cek kembali input kamu dan coba lagi.",
            });
        }
    };

    const resetAndClose = (val) => {
        if (!val) {
            setIsRegister(false);
            setRegName("");
            setRegPhone("");
            setRegPassword("");
        }
        onOpenChange(val);
    };

    return (
        <Dialog open={open} onOpenChange={resetAndClose}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="sm:max-w-md rounded-[2rem] border-0 shadow-2xl p-0 overflow-hidden">
                <div className="p-8 space-y-6">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-3xl font-black tracking-tight text-slate-900 uppercase font-heading text-center">
                            {isRegister ? "Daftar Akun" : "Masuk"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium text-center">
                            {isRegister
                                ? "Buat akun baru untuk mulai menggunakan Kawai-chan."
                                : "Login ke dashboard melalui WhatsApp."}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Login View */}
                    {!isRegister && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="relative group/btn">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-2xl blur opacity-20 group-hover/btn:opacity-40 transition duration-500" />
                                <Button
                                    asChild
                                    className="w-full h-14 text-lg bg-[#25D366] hover:bg-[#128C7E] text-white font-black rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] border-0 relative"
                                >
                                    <a
                                        href={`https://wa.me/${import.meta.env.VITE_BOT_NUMBER}?text=Dashboard`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-3"
                                        onClick={(e) => {
                                            if (!import.meta.env.VITE_BOT_NUMBER) {
                                                e.preventDefault();
                                                Swal.fire({
                                                    icon: 'error',
                                                    title: 'Ops!',
                                                    text: 'Konfigurasi WhatsApp bot belum diatur. Hubungi support.'
                                                });
                                            }
                                        }}
                                    >
                                        <MessageCircle className="w-6 h-6 fill-white/20" />
                                        LOGIN VIA WA
                                    </a>
                                </Button>
                            </div>

                            <div className="relative flex items-center py-1">
                                <div className="flex-grow border-t border-slate-100"></div>
                                <span className="flex-shrink mx-4 text-slate-300 text-xs font-black uppercase tracking-widest">Belum punya akun?</span>
                                <div className="flex-grow border-t border-slate-100"></div>
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => setIsRegister(true)}
                                className="w-full h-12 rounded-2xl border-slate-100 text-slate-600 font-bold hover:bg-slate-50 hover:text-primary hover:border-primary/20 transition-all border-2"
                            >
                                BUAT AKUN BARU
                            </Button>
                        </div>
                    )}

                    {/* Register View */}
                    {isRegister && (
                        <form onSubmit={handleRegister} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                            <button
                                type="button"
                                onClick={() => setIsRegister(false)}
                                className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary font-semibold transition-colors group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Kembali ke Login
                            </button>

                            <div className="space-y-4">
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
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nomor HP</Label>
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
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</Label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors">
                                            <Key className="w-4 h-4" />
                                        </div>
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

                            <Button type="submit" className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                DAFTAR
                            </Button>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}


