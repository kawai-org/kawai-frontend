import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, User } from 'lucide-react';
import Swal from 'sweetalert2';
import { loginAdmin, registerUser } from '@/api/auth';

export default function LoginModal({ children, open, onOpenChange }) {
    const navigate = useNavigate();
    const [mode, setMode] = useState('user'); // 'user' | 'admin' | 'register'

    // Admin Login State
    const [adminPhone, setAdminPhone] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Register State
    const [regName, setRegName] = useState("");
    const [regPhone, setRegPhone] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regSecret, setRegSecret] = useState("");

    const handleAdminLogin = async (e) => {
        e.preventDefault();

        if (!adminPhone.trim()) {
            return Swal.fire({ icon: 'warning', title: 'Input Required', text: 'Please enter your phone number.' });
        }
        if (!adminPassword) {
            return Swal.fire({ icon: 'warning', title: 'Input Required', text: 'Please enter your password.' });
        }

        setIsLoading(true);
        try {
            const response = await loginAdmin(adminPhone, adminPassword);

            if (response.status === 'success') {
                // Save token and user info
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify({
                    token: response.token,
                    role: 'admin',
                    phone_number: adminPhone
                }));

                Swal.fire({
                    icon: 'success',
                    title: 'Login Berhasil!',
                    text: 'Selamat datang, Admin!',
                    timer: 1500,
                    showConfirmButton: false
                });

                // Close modal and redirect
                onOpenChange?.(false);
                setTimeout(() => {
                    navigate('/admin');
                }, 1500);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Gagal',
                    text: response.msg || 'Terjadi kesalahan'
                });
            }
        } catch (error) {
            console.error("Admin login error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Login Gagal',
                text: error.response?.data?.msg || 'Phone number atau password salah'
            });
        } finally {
            setIsLoading(false);
        }
    };

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
            const response = await registerUser({
                name: regName,
                phone_number: regPhone,
                password: regPassword,
                secret_code: regSecret
            });

            console.log("Register response:", response);

            Swal.fire({
                icon: 'success',
                title: 'Registration Success',
                text: 'You can now login via WhatsApp.',
                timer: 2000
            });
            setMode('user');
            // Reset form
            setRegName("");
            setRegPhone("");
            setRegPassword("");
            setRegSecret("");
        } catch (error) {
            console.error("Register error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.message || error.response?.data?.message || "Please check your inputs and try again."
            });
        }
    };

    const resetForm = () => {
        setMode('user');
        setAdminPhone("");
        setAdminPassword("");
        setRegName("");
        setRegPhone("");
        setRegPassword("");
        setRegSecret("");
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) resetForm();
            onOpenChange?.(isOpen);
        }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl p-0 gap-0 border-0 shadow-2xl">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-pink-400 to-purple-600 p-6 rounded-t-2xl">
                    <DialogHeader className="text-white">
                        <DialogTitle className="text-2xl font-bold">
                            {mode === 'register' ? "Create Account" :
                                mode === 'admin' ? "Admin Login" : "Welcome Back"}
                        </DialogTitle>
                        <DialogDescription className="text-white/80">
                            {mode === 'register'
                                ? "Enter your details below to create your account"
                                : mode === 'admin'
                                    ? "Login with your admin credentials"
                                    : "Login to access your personalized dashboard"
                            }
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-6">
                    {/* Tab Toggle (User / Admin) - Only show when not registering */}
                    {mode !== 'register' && (
                        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                            <button
                                onClick={() => setMode('user')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${mode === 'user'
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <User className="w-4 h-4" />
                                User
                            </button>
                            <button
                                onClick={() => setMode('admin')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${mode === 'admin'
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Shield className="w-4 h-4" />
                                Admin
                            </button>
                        </div>
                    )}

                    {/* User Login via WhatsApp */}
                    {mode === 'user' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="text-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-700">Login</h3>
                                <p className="text-sm text-muted-foreground">Login via WhatsApp Magic Link</p>
                            </div>

                            {/* Magic Link Button */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center space-y-4">
                                <Button
                                    asChild
                                    className="w-full h-14 text-lg bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl shadow-md transition-transform hover:scale-[1.02]"
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
                                                    title: 'Configuration Error',
                                                    text: 'VITE_BOT_NUMBER is not set in .env file! Please contact administrator.'
                                                });
                                            }
                                        }}
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        Login via WhatsApp
                                    </a>
                                </Button>
                                <p className="text-xs text-muted-foreground">
                                    We will send a login link to your WhatsApp number.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-border/50 flex flex-col gap-2 text-center text-sm">
                                <p className="text-muted-foreground">
                                    Don't have an account?{" "}
                                    <button onClick={() => setMode('register')} className="font-semibold text-primary hover:underline">
                                        Sign up
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Admin Login Form */}
                    {mode === 'admin' && (
                        <form onSubmit={handleAdminLogin} className="space-y-4 animate-in fade-in duration-300">
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input
                                    placeholder="628xxxxxxxxxx"
                                    value={adminPhone}
                                    onChange={e => setAdminPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Password</Label>
                                <Input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={adminPassword}
                                    onChange={e => setAdminPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 text-base bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-md transition-all hover:scale-[1.02]"
                            >
                                {isLoading ? "Logging in..." : "Login sebagai Admin"}
                            </Button>

                            <p className="text-center text-xs text-muted-foreground pt-2">
                                Only registered admins can login here
                            </p>
                        </form>
                    )}

                    {/* Register Form */}
                    {mode === 'register' && (
                        <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input placeholder="John Doe" value={regName} onChange={e => setRegName(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input placeholder="628..." value={regPhone} onChange={e => setRegPhone(e.target.value)} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Password</Label>
                                <Input type="password" placeholder="Create password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Secret Code (Optional)</Label>
                                <Input type="password" placeholder="For Admins only" value={regSecret} onChange={e => setRegSecret(e.target.value)} />
                            </div>

                            <Button type="submit" className="w-full h-11 text-base bg-gradient-to-r from-pink-400 to-purple-600 hover:from-pink-500 hover:to-purple-700 text-white shadow-md transition-all hover:scale-[1.02]">
                                Create Account
                            </Button>

                            <p className="text-center text-sm text-muted-foreground pt-2">
                                Already have an account?{" "}
                                <button type="button" onClick={() => setMode('user')} className="font-semibold text-primary hover:underline">
                                    Login
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
