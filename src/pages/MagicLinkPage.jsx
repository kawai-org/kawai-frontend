import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function MagicLinkPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("Verifying magic link...");

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            handleLogin(token);
        } else {
            setStatus("No token found. Redirecting...");
            setTimeout(() => navigate("/auth"), 2000);
        }
    }, [searchParams, navigate]);

    const handleLogin = (token) => {
        try {
            // 1. Store and decode token
            localStorage.setItem("token", token);
            const userPayload = parseJwt(token);

            console.log("=== MAGIC LINK DEBUG ===");
            console.log("JWT Payload:", JSON.stringify(userPayload, null, 2));

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

            console.log("Phone Number:", phoneNumber);
            console.log("Admin Whitelist:", adminPhones);
            console.log("Is Admin?", isAdmin);

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

            console.log("User Object:", JSON.stringify(user, null, 2));
            console.log("======================");

            // 7. Update UI status
            setStatus(`Login berhasil sebagai ${actualRole}! Redirecting...`);

            // 8. Redirect based on role
            setTimeout(() => {
                if (actualRole === 'admin') {
                    console.log("✅ ADMIN → Redirecting to /admin");
                    navigate("/admin");
                } else {
                    console.log("✅ USER → Redirecting to /dashboard");
                    navigate("/dashboard");
                }
            }, 1500);

        } catch (error) {
            console.error("❌ Magic login error:", error);
            setStatus("Token tidak valid. Silakan login kembali.");
            setTimeout(() => navigate("/auth"), 2000);
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
            <Card className="w-full max-w-sm text-center shadow-xl border border-gray-100 bg-white">
                <CardHeader className="pb-2">
                    <CardTitle className="flex flex-col items-center gap-4 text-primary">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <Loader2 className="animate-spin w-8 h-8 text-primary" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Kawai-chan
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground font-medium text-sm animate-pulse">
                        {status}
                    </p>
                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary animate-progress origin-left w-full duration-1000"></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
