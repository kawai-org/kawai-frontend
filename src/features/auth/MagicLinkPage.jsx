import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import {
    Loader2,
    UserCheck,
    LayoutDashboard,
    XCircle,
    CheckCircle2
} from "lucide-react";

// Helper to decode JWT payload safely - defined outside component
const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

export default function MagicLinkPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [status, setStatus] = useState("Initializing verification...");
    const [stage, setStage] = useState(1); // 1: Verify, 2: Auth, 3: Redirect
    const [error, setError] = useState(null);

    const hasProcessed = useRef(false);

    const handleLogin = useCallback((token) => {
        try {
            setStage(1);
            setStatus("Verifying magic link...");

            // 1. Decode token
            const userPayload = parseJwt(token);

            if (!userPayload) {
                throw new Error("Invalid token format");
            }

            // 2. Extract phone number (multiple possible fields)
            const phoneNumber = (
                userPayload.user_phone ||
                userPayload.phone_number ||
                userPayload.phone ||
                userPayload.sub ||
                ""
            );

            if (!phoneNumber) {
                throw new Error("Invalid user data in token");
            }

            // 3. Build user object (Frontend ini hanya untuk user, tidak ada admin)
            const user = {
                name: userPayload.name || userPayload.username || "User",
                phone_number: phoneNumber,
                role: userPayload.role || "user"
            };

            // 4. Use auth context to login (saves to localStorage and updates state)
            login(user, token);

            // Transition to Authenticated stage
            setTimeout(() => {
                setStage(2);
                setStatus(`Authenticated as ${user.name}`);

                // Transition to Redirect stage
                setTimeout(() => {
                    setStage(3);
                    setStatus("Loading Dashboard...");

                    // Navigate to dashboard immediately
                    setTimeout(() => {
                        navigate("/dashboard-user", { replace: true });
                    }, 1000);
                }, 800);
            }, 800);

        } catch (err) {
            console.error("❌ Magic login error:", err);
            setError("The magic link has expired or is invalid.");
            setStatus("Unauthorized. Back to home...");
            setTimeout(() => navigate("/"), 3000);
        }
    }, [login, navigate]);

    useEffect(() => {
        const token = searchParams.get("token");

        if (token && !hasProcessed.current) {
            hasProcessed.current = true;
            handleLogin(token);
        } else if (!token) {
            setError("No magic token found in the link.");
            setStatus("Redirecting to home...");
            setTimeout(() => navigate("/"), 2500);
        }
    }, [searchParams, navigate, handleLogin]);

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
                                    ${i <= stage ? 'w-8 bg-primary' : 'w-1.5 bg-slate-200'}`} />
                            ))}
                        </div>
                    )}

                    {error && (
                        <p className="text-red-600 text-xs font-medium bg-red-50 p-3 rounded-lg border border-red-100 italic">
                            {error}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
