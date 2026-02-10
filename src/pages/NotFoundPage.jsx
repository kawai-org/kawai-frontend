import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MessageSquare, Home, ArrowLeft, Ghost } from "lucide-react";
import Logo from "@/assets/logo.png";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse transition-all duration-1000"></div>

            <div className="relative z-10 text-center max-w-xl w-full">
                {/* 404 Glitch Style */}
                <div className="relative inline-block mb-10">
                    <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 animate-in zoom-in duration-1000">
                        404
                    </h1>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center opacity-20 blur-2xl">
                        <h1 className="text-[140px] md:text-[200px] font-black text-primary">404</h1>
                    </div>
                </div>

                <div className="space-y-4 mb-12 px-4">
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight font-heading">
                        Sector Not <span className="text-primary italic">Found</span>
                    </h2>
                    <p className="text-slate-400 font-medium text-sm md:text-base max-w-md mx-auto leading-relaxed">
                        Kawai-chan scanned the entire database but this coordinate doesn't exist. You might have drifted out of bounds!
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-6">
                    <Button
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-primary/20 transition-all hover:scale-[1.05]"
                    >
                        <Home size={16} className="mr-2 stroke-[3]" /> Return To Core
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto h-14 px-10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 font-black uppercase text-[11px] tracking-[0.2em] transition-all"
                    >
                        <ArrowLeft size={16} className="mr-2 stroke-[3]" /> Previous Sector
                    </Button>
                </div>

                {/* Footer Logo */}
                <div className="mt-20 flex flex-col items-center gap-3">
                    <div className="w-10 h-10 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <img src={Logo} alt="Logo" className="w-full h-full object-contain brightness-0 invert opacity-50" />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">Kawai-chan Intelligent Assistant</p>
                </div>
            </div>
        </div>
    );
}

