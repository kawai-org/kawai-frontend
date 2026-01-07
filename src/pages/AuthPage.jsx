import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/logo.png";
import { loginAdmin } from "@/api/auth";
import Swal from 'sweetalert2';

export default function AuthPage() {
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Register State
    const [regName, setRegName] = useState("");
    const [regPhone, setRegPhone] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regSecret, setRegSecret] = useState("");

    const navigate = useNavigate();

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
                secret_code: regSecret
            }));

            Swal.fire({
                icon: 'success',
                title: 'Registration Success',
                text: 'You can now login.',
                timer: 2000
            });
            setIsRegister(false);
            if (regSecret) setIsAdminLogin(true);
        } catch (error) {
            console.error("Register error", error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.response?.data?.message || "Please check your inputs and try again.",
            });
        }
    };



    const handleAdminLogin = async (e) => {
        e.preventDefault();

        // Validation
        if (!username.trim()) {
            return Swal.fire({ icon: 'warning', title: 'Missing Username', text: 'Please enter your admin username or phone.' });
        }
        if (!password) {
            return Swal.fire({ icon: 'warning', title: 'Missing Password', text: 'Please enter your password.' });
        }

        try {
            const data = await loginAdmin(username, password);
            console.log("Admin Login Response:", data); // Debugging

            // Robust token extraction: Check root token or data.token
            const token = data.token || data.data?.token;

            if (!token) {
                throw new Error("Token not found in login response");
            }

            // Admin username IS the phone number (e.g., "6285793766959")
            // Save to localStorage with phone_number field
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify({
                token,
                role: 'admin',
                name: data.name || "Admin",
                username: username,
                phone_number: username  // ← FIX: username is phone number!
            }));

            Swal.fire({
                icon: 'success',
                title: 'Welcome back, Admin!',
                text: 'Redirecting to your dashboard...',
                timer: 1500,
                showConfirmButton: false
            });
            navigate("/dashboard");
        } catch (error) {
            console.error("Login error", error);
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.response?.status === 401 || error.response?.status === 404
                    ? "Invalid credentials or not an Admin. Did you use the Secret Code?"
                    : (error.response?.data?.message || "Invalid credentials."),
            });
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-background overflow-hidden font-sans">
            {/* Left Side - Hero / Branding (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 relative bg-gradient-to-r from-pink-400 to-purple-600 items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 text-center text-white space-y-8 max-w-lg">
                    <img src={Logo} alt="Kawai Logo" className="w-32 h-32 mx-auto drop-shadow-2xl bg-white/20 p-4 rounded-full backdrop-blur-sm" />
                    <div>
                        <h1 className="text-5xl font-extrabold tracking-tight mb-4">Adventure starts here</h1>
                        <p className="text-indigo-100 text-xl leading-relaxed">
                            Join our community and organize your digital life with Kawai-chan Assistant.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Forms */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
                {/* Mobile Background Elements */}
                <div className="absolute lg:hidden top-[-20%] right-[-10%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px]" />

                <div className="w-full max-w-md space-y-8 relative z-10">
                    <div className="text-center lg:text-left space-y-2">
                        <div className="lg:hidden mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <img src={Logo} alt="Logo" className="w-10 h-10 object-contain" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">
                            {isRegister ? "Create Account" : (isAdminLogin ? "Admin Login" : "Welcome Back")}
                        </h2>
                        <p className="text-muted-foreground">
                            {isRegister ? "Enter your details below to create your account" : (isAdminLogin ? "Enter your admin credentials" : "Login to access your personalized dashboard")}
                        </p>
                    </div>

                    <Card className="border-0 shadow-none bg-transparent">
                        <CardContent className="p-0 space-y-6">

                            {/* User Login Option (WhatsApp Only) */}
                            {!isAdminLogin && !isRegister && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="text-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-700">User Login</h3>
                                        <p className="text-sm text-muted-foreground">Login via WhatsApp Magic Link</p>
                                    </div>

                                    {/* Magic Link Button */}
                                    <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm text-center space-y-4">
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
                                                            text: 'VITE_BOT_NUMBER is not set in .env.local file! Please contact administrator.'
                                                        });
                                                    }
                                                }}
                                            >
                                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                </svg>
                                                Send Magic Link
                                            </a>
                                        </Button>
                                        <p className="text-xs text-muted-foreground">
                                            We will send a login link to your WhatsApp number.
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-border/50 flex flex-col gap-2 text-center text-sm">
                                        <p className="text-muted-foreground">
                                            Don't have an account?{" "}
                                            <button onClick={() => setIsRegister(true)} className="font-semibold text-primary hover:underline">
                                                Sign up
                                            </button>
                                        </p>
                                        <button
                                            onClick={() => setIsAdminLogin(true)}
                                            className="text-muted-foreground hover:text-primary text-xs mt-2"
                                        >
                                            Go to Admin Login
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Admin Login Form */}
                            {isAdminLogin && !isRegister && (
                                <form onSubmit={handleAdminLogin} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                                    {/* Removed redundant header */}
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Admin Phone Number</Label>
                                        <Input id="username" placeholder="628..." value={username} onChange={e => setUsername(e.target.value)} className="h-11" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">Password</Label>
                                        </div>
                                        <Input id="password" type="password" placeholder="••••••" value={password} onChange={e => setPassword(e.target.value)} className="h-11" />
                                    </div>
                                    <Button type="submit" className="w-full h-11 text-base bg-gradient-to-r from-pink-400 to-purple-600 hover:from-pink-500 hover:to-purple-700 text-white shadow-md transition-all hover:scale-[1.02]">Sign In (Admin)</Button>

                                    <p className="text-center text-sm text-muted-foreground">
                                        <button type="button" onClick={() => setIsAdminLogin(false)} className="hover:text-primary transition-colors">
                                            &larr; Back to User Login
                                        </button>
                                    </p>
                                </form>
                            )}

                            {/* Register Form */}
                            {isRegister && (
                                <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
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
                                        <button type="button" onClick={() => setIsRegister(false)} className="font-semibold text-primary hover:underline">
                                            Login
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
