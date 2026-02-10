import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Logo from "@/assets/logo.png";
import LoginModal from "@/components/LoginModal";
import {
    MessageCircle,
    Save,
    Smartphone,
    Zap,
    Send,
    Users,
    Clock,
    Shield,
    Star,
    ChevronRight,
    CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();
    const [loginOpen, setLoginOpen] = useState(false);

    const handleStart = () => {
        const user = localStorage.getItem("user");
        if (user) {
            navigate("/dashboard");
        } else {
            setLoginOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden font-sans text-foreground">
            {/* Background blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-purple-400/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Navbar */}
            <nav className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-sm bg-white/30 border-b border-white/20 sticky top-0">
                <div className="flex items-center gap-3">
                    <img src={Logo} alt="Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
                    <span className="font-bold text-xl tracking-tight text-primary font-heading">Kawai-chan</span>
                </div>
                <div className="flex gap-4">
                    <LoginModal open={loginOpen} onOpenChange={setLoginOpen}>
                        <Button
                            variant="ghost"
                            className="text-primary hover:bg-primary/10 font-medium"
                        >
                            Sign In
                        </Button>
                    </LoginModal>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 container mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-32 text-center">
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <span className="inline-block py-1 px-3 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-semibold mb-6 border border-secondary shadow-sm">
                        ✨ Your Personal AI Companion
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 font-heading">
                        Chat. Organize. <br className="hidden md:block" /> Simply Your Life.
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Kawai is not just a chatbot. It's your smart friend that helps you save notes, manage links, and integrate with advanced AI tools.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            onClick={handleStart}
                            size="lg"
                            className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 hover:-translate-y-1 transition-all duration-300 group"
                        >
                            Chat with Kawai-chan <Zap className="ml-2 w-5 h-5 fill-yellow-400 text-yellow-500 group-hover:scale-110 transition-transform" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 bg-white/50 backdrop-blur-sm py-16 md:py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Powerful Features</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">Everything you need to organize your digital life in one place</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        <FeatureCard
                            icon={<MessageCircle className="w-7 h-7 text-primary" />}
                            title="Instant Conversations"
                            desc="Experience seamless and natural conversations powered by AI."
                        />
                        <FeatureCard
                            icon={<Save className="w-7 h-7 text-green-500" />}
                            title="Smart Memory"
                            desc="Save important notes and ideas just by asking Kawai."
                        />
                        <FeatureCard
                            icon={<Send className="w-7 h-7 text-blue-500" />}
                            title="WhatsApp Integration"
                            desc="Connect via WhatsApp for on-the-go assistance."
                        />
                        <FeatureCard
                            icon={<Shield className="w-7 h-7 text-purple-500" />}
                            title="Secure & Private"
                            desc="Your data is encrypted and safe with us."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="relative z-10 py-16 md:py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">How It Works</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">Get started in just 3 simple steps</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <StepCard
                            step={1}
                            icon={<Smartphone className="w-8 h-8" />}
                            title="Connect via WhatsApp"
                            desc="Simply click the login button and connect with our WhatsApp bot."
                        />
                        <StepCard
                            step={2}
                            icon={<MessageCircle className="w-8 h-8" />}
                            title="Chat with Kawai"
                            desc="Ask anything, save notes, or manage your links through chat."
                        />
                        <StepCard
                            step={3}
                            icon={<CheckCircle2 className="w-8 h-8" />}
                            title="Access Anywhere"
                            desc="Access your saved data from any device, anytime."
                        />
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="relative z-10 bg-gradient-to-r from-primary to-purple-600 py-16 md:py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                        <StatCard number="10,000+" label="Active Users" />
                        <StatCard number="50,000+" label="Messages Sent" />
                        <StatCard number="99%" label="Happy Users" />
                        <StatCard number="24/7" label="Available" />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="relative z-10 py-16 md:py-24 bg-white/50 backdrop-blur-sm">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">What Our Users Say</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">Real stories from real people who love Kawai</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <TestimonialCard
                            quote="Kawai has completely changed how I organize my daily tasks. It's like having a personal assistant in my pocket!"
                            name="Sarah M."
                            role="Entrepreneur"
                        />
                        <TestimonialCard
                            quote="The WhatsApp integration is genius. I can save notes and reminders without leaving my chat app."
                            name="Budi S."
                            role="University Student"
                        />
                        <TestimonialCard
                            quote="Simple, effective, and always available. Kawai helps me stay productive throughout the day."
                            name="Rina P."
                            role="Freelancer"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-16 md:py-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-pink-400 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl shadow-purple-500/20">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                        <p className="text-white/80 mb-8 text-lg max-w-xl mx-auto">
                            Join thousands of users who have simplified their digital life with Kawai-chan.
                        </p>
                        <LoginModal open={loginOpen} onOpenChange={setLoginOpen}>
                            <Button
                                size="lg"
                                className="h-14 px-8 text-lg rounded-full bg-white text-primary hover:bg-white/90 shadow-xl hover:-translate-y-1 transition-all duration-300 group font-bold"
                            >
                                Start Your Journey <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </LoginModal>
                    </div>
                </div>
            </section>

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

// Feature Card Component
function FeatureCard({ icon, title, desc }) {
    return (
        <Card className="p-6 bg-white/80 border-white/50 hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-1 duration-300 group h-full">
            <div className="mb-4 p-3 bg-gradient-to-br from-primary/10 to-purple-100 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
        </Card>
    );
}

// Step Card Component
function StepCard({ step, icon, title, desc }) {
    return (
        <div className="text-center group">
            <div className="relative inline-flex items-center justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary font-bold text-sm shadow-md border-2 border-primary">
                    {step}
                </span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-foreground">{title}</h3>
            <p className="text-muted-foreground text-sm">{desc}</p>
        </div>
    );
}

// Statistic Card Component
function StatCard({ number, label }) {
    return (
        <div className="group">
            <div className="text-4xl md:text-5xl font-extrabold mb-2 group-hover:scale-110 transition-transform duration-300">{number}</div>
            <div className="text-white/80 text-sm md:text-base">{label}</div>
        </div>
    );
}

// Testimonial Card Component
function TestimonialCard({ quote, name, role }) {
    return (
        <Card className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed flex-grow mb-4">"{quote}"</p>
            <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {name.charAt(0)}
                </div>
                <div>
                    <div className="font-semibold text-sm text-foreground">{name}</div>
                    <div className="text-xs text-muted-foreground">{role}</div>
                </div>
            </div>
        </Card>
    );
}
