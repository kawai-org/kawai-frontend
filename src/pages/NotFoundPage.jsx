import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MessageSquare, Home } from "lucide-react";
import Logo from "@/assets/logo.png";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
            <div className="text-center max-w-md w-full p-8 bg-white rounded-3xl shadow-xl border border-border/50 relative overflow-hidden">
                {/* Decor blobs */}
                <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-primary/10 rounded-full blur-[40px]" />
                <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-purple-500/10 rounded-full blur-[30px]" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                        <span className="text-4xl font-bold text-red-500">404</span>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Where are we?</h1>
                    <p className="text-muted-foreground mb-8">
                        Kawai-chan looked everywhere but couldn't find this page. Maybe it got lost in the digital void!
                    </p>

                    <div className="grid gap-3 w-full">
                        <Button
                            onClick={() => navigate('/')}
                            className="w-full h-11 text-base gap-2 rounded-xl shadow-lg shadow-primary/20"
                        >
                            <Home size={18} />
                            Go Home
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                            className="w-full h-11 text-base gap-2 rounded-xl"
                        >
                            Go Back
                        </Button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100 w-full flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <img src={Logo} alt="Logo" className="w-4 h-4 opacity-50" />
                        <span>Kawai-chan Assistant</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
