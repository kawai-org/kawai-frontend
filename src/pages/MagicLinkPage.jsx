import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
    Loader2,
    ShieldCheck,
    UserCheck,
    LayoutDashboard,
    XCircle,
    CheckCircle2
} from "lucide-react";

export default function MagicLinkPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("Initializing verification...");
    const [stage, setStage] = useState(1); // 1: Verify, 2: Auth, 3: Redirect
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            handleLogin(token);
        } else {
            setError("No magic token found in the link.");
            setStatus("Redirecting to login...");
            setTimeout(() => navigate("/auth"), 2500);
        }
    }, [searchParams, navigate]);

    const handleLogin = (token) => {
        try {
            setStage(1);
            setStatus("Verifying magic link...");

            // 1. Store and decode token
            localStorage.setItem("token", token);
            const userPayload = parseJwt(token);

            // 2. Extract phone number (multiple possible fields)
            const phoneNumber = (
                userPayload.user_phone ||
                userPayload.phone_number ||
                userPayload.phone ||
                userPayload.sub ||
                ""
            );

            // 3. Check if admin via whitelist
            const adminPhonesEnv = import.meta.env.VITE_ADMIN_PHONES || "";
            const adminPhones = adminPhonesEnv.split(',').map(p => p.trim()).filter(p => p);
            const isAdmin = adminPhones.includes(phoneNumber);

            // 4. Determine actual role
            const actualRole = isAdmin ? "admin" : "user";

            // 5. Build user object
            const user = {
                token: token,
                name: userPayload.name || userPayload.username || "User",
                phone_number: phoneNumber,
                role: actualRole
            };

            // 6. Save to localStorage
            localStorage.setItem("user", JSON.stringify(user));

            // Transition to Authenticated stage
            setTimeout(() => {
                setStage(2);
                setStatus(`Authenticated as ${user.name}`);

                // Transition to Redirect stage
                setTimeout(() => {
                    setStage(3);
                    setStatus(`Loading ${actualRole === 'admin' ? 'Admin Panel' : 'Dashboard'}...`);

                    setTimeout(() => {
                        if (actualRole === 'admin') {
                            navigate("/admin");
                        } else {
                            navigate("/dashboard");
                        }
                    }, 1500);
                }, 1000);
            }, 1000);

        } catch (error) {
            console.error("❌ Magic login error:", error);
            setError("The magic link has expired or is invalid.");
            setStatus("Unauthorized. Back to login...");
            setTimeout(() => navigate("/auth"), 3000);
        }
    };

    // Helper to decode JWT payload safely
    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return {};
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 selection:bg-primary/30 font-sans">
            {/* Mesh Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            <Card className="w-full max-w-sm text-center relative z-10 border-0 shadow-3xl rounded-[2.5rem] bg-white/80 backdrop-blur-xl group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

                <CardContent className="p-10 space-y-8 relative z-10">
                    {/* Dynamic Icon Display */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center border-2 transition-all duration-500 
                                ${error ? 'bg-red-50 border-red-100 text-red-500' :
                                    stage === 1 ? 'bg-primary/5 border-primary/10 text-primary animate-pulse' :
                                        stage === 2 ? 'bg-green-50 border-green-100 text-green-500 scale-110 shadow-lg shadow-green-100' :
                                            'bg-purple-50 border-purple-100 text-purple-600 scale-110 shadow-lg shadow-purple-100'}`}>

                                {error ? <XCircle className="w-12 h-12" /> :
                                    stage === 1 ? <Loader2 className="w-12 h-12 animate-spin" /> :
                                        stage === 2 ? <UserCheck className="w-12 h-12" /> :
                                            <LayoutDashboard className="w-12 h-12" />}
                            </div>

                            {!error && stage > 1 && (
                                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md border border-slate-50 animate-in zoom-in duration-300">
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className={`text-2xl font-black tracking-tight uppercase font-heading 
                            ${error ? 'text-red-600' : 'text-slate-900'}`}>
                            {error ? "Verification failed" :
                                stage === 1 ? "Verifying..." :
                                    stage === 2 ? "Success!" :
                                        "Entering..."}
                        </h2>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] leading-relaxed">
                            {status}
                        </p>
                    </div>

                    {/* Progress Dots */}
                    {!error && (
                        <div className="flex justify-center gap-2 pt-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 
                                    ${stage >= i ? 'bg-primary' : 'bg-slate-100'} 
                                    ${stage === i ? 'w-8' : 'w-4'}`} />
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="pt-4">
                            <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest bg-slate-50 py-2 px-4 rounded-full inline-block">
                                Error logged for developer
                            </p>
                        </div>
                    )}

                    {/* Footer Info */}
                    <div className="pt-4 border-t border-slate-50 flex items-center justify-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-slate-300" />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Kawai Security</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

