import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Logo from "@/assets/logo.png";
import { MessageCircle, Save, Smartphone, Zap, ArrowLeft, Send } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    const handleStart = () => {
        const user = localStorage.getItem("user");
        if (user) {
            navigate("/chat");
        } else {
            navigate("/auth");
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden font-sans text-foreground flex flex-col">
            {/* Background blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Navbar */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-sm bg-white/30 border-b border-white/20 sticky top-0">
                <div className="flex items-center gap-3">
                    <img src={Logo} alt="Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
                    <span className="font-bold text-xl tracking-tight text-primary font-heading">Kawai-chan</span>
                </div>
                <div className="flex gap-4">
                    <Button
                        onClick={() => navigate("/auth")}
                        variant="ghost"
                        className="text-primary hover:bg-primary/10 font-medium"
                    >
                        Sign In
                    </Button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 container mx-auto px-6 pt-16 flex-grow text-center">
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <span className="inline-block py-1 px-3 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-semibold mb-6 border border-secondary shadow-sm">
                        ✨ Your Personal AI Companion
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 font-heading">
                        Chat. Organize. <br className="hidden md:block" /> Simply Your Life.
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Kawai is not just a chatbot. It's your smart friend that helps you save notes, manage links, and integrate with advanced AI tools.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            onClick={handleStart}
                            size="lg"
                            className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all duration-300 group"
                        >
                            Chat with Gemini <Zap className="ml-2 w-5 h-5 fill-yellow-400 text-yellow-500 group-hover:scale-110 transition-transform" />
                        </Button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto mb-20">
                    <FeatureCard
                        icon={<MessageCircle className="w-8 h-8 text-primary" />}
                        title="Instant Conversions"
                        desc="Experience seamless and natural conversations powered by state-of-the-art AI technology."
                    />
                    <FeatureCard
                        icon={<Save className="w-8 h-8 text-green-500" />}
                        title="Smart Memory"
                        desc="Easily save important notes, links, and ideas just by asking Kawai to 'Save' them."
                    />
                    <FeatureCard
                        icon={<Send className="w-8 h-8 text-blue-500" />}
                        title="WhatsApp Integration"
                        desc="Connect via WhatsApp for on-the-go assistance anytime, anywhere."
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 bg-white/50 backdrop-blur-md border-t border-border/40 pt-16 pb-8">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <img src={Logo} alt="Logo" className="w-8 h-8" />
                                <span className="font-bold text-xl text-primary font-heading">Kawai-chan</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Making your digital life cuter and smarter, one chat at a time.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
                        <p>&copy; {(new Date()).getFullYear()} Kawai Personal Assistant Bot. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <Card className="p-6 glass-effect border-white/50 hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-1 duration-300 group h-full">
            <div className="mb-4 p-3 bg-white rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform duration-300 border border-primary/10">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{desc}</p>
        </Card>
    );
}
