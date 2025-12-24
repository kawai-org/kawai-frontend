import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/logo.png";
import { loginUser, registerUser } from "@/api/auth";
import Swal from 'sweetalert2';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userData = await loginUser(phone);
            // Simpan data dari BE
            localStorage.setItem("user", JSON.stringify(userData));

            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'Welcome back!',
                timer: 1500,
                showConfirmButton: false
            });
            navigate("/dashboard");
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.message || "User not found. Please register.",
            });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (name && phone) {
            try {
                await registerUser(name, phone);
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful',
                    text: 'Account created! Please login.',
                });
                setIsLogin(true);
                setPhone("");
                setName("");
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: error.message || "Could not create account.",
                });
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background blobs for Kawai effect */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-secondary/30 rounded-full blur-[100px]" />

            {/* Navbar / Back Button */}
            <div className="absolute top-6 left-6 z-20">
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-primary hover:bg-white/50"
                    onClick={() => navigate("/")}
                >
                    &larr; Back to Home
                </Button>
            </div>

            <Card className="w-full max-w-md relative z-10 glass-effect border-2 border-white/50 shadow-xl">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-24 h-24 mb-4 bg-white rounded-full p-2 shadow-sm flex items-center justify-center cursor-pointer" onClick={() => navigate("/")}>
                        <img src={Logo} alt="Kawai Logo" className="w-full h-full object-contain" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-primary tracking-tight">Kawai-chan Assistant</CardTitle>
                    <CardDescription className="text-muted-foreground text-lg">
                        {isLogin ? "Welcome back!" : "Join us and get a cute assistant!"}
                    </CardDescription>
                </CardHeader>
                <CardContent>

                    {/* Visual Toggle */}
                    <div className="flex w-full mb-6 bg-secondary/30 p-1 rounded-xl">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${isLogin ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${!isLogin ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            Register
                        </button>
                    </div>

                    {isLogin ? (
                        <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="login-phone" className="text-base text-foreground/80">Phone Number</Label>
                                <Input
                                    id="login-phone"
                                    placeholder="Enter your phone number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    type="tel"
                                    className="h-12 bg-white/50 border-input focus:border-primary focus:ring-primary rounded-xl"
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 text-lg font-medium rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
                                Login
                            </Button>
                            <p className="text-center text-sm text-muted-foreground">
                                Don't have an account? <button type="button" onClick={() => setIsLogin(false)} className="text-primary font-semibold hover:underline">Register here</button>
                            </p>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="reg-name" className="text-base text-foreground/80">Nickname</Label>
                                <Input
                                    id="reg-name"
                                    placeholder="What should I call you?"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="h-12 bg-white/50 border-input focus:border-primary focus:ring-primary rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reg-phone" className="text-base text-foreground/80">Phone Number</Label>
                                <Input
                                    id="reg-phone"
                                    placeholder="e.g. 08123456789"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    type="tel"
                                    className="h-12 bg-white/50 border-input focus:border-primary focus:ring-primary rounded-xl"
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 text-lg font-medium rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
                                Create Account
                            </Button>
                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account? <button type="button" onClick={() => setIsLogin(true)} className="text-primary font-semibold hover:underline">Login here</button>
                            </p>
                        </form>
                    )}

                </CardContent>
                <CardFooter className="justify-center text-sm text-muted-foreground">
                    Kawai-chan v1.0 Beta Version
                </CardFooter>
            </Card>
        </div>
    );
}
