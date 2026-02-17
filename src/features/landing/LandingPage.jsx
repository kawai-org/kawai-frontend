import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Logo from "@/assets/logo.png";
import LoginModal from "@/components/common/LoginModal";
import {
    MessageCircle,
    Save,
    Smartphone,
    Send,
    Shield,
    Star,
    ArrowRight,
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

    const waLink = `https://wa.me/${import.meta.env.VITE_BOT_NUMBER}?text=Halo%20Kawai-chan!`;

    return (
        <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary-foreground font-sans">
            {/* Mesh Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
                <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-[100px]" />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-12 backdrop-blur-xl bg-white/40 border-b border-white/20 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center p-1.5 border border-primary/10">
                            <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-gradient font-heading">Kawai-chan</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Features</a>
                        <a href="#how-it-works" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">How it Works</a>
                        <a href="#testimonials" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Testimonials</a>
                    </div>

                    <div className="flex gap-4">
                        <LoginModal open={loginOpen} onOpenChange={setLoginOpen}>
                            <Button variant="ghost" className="font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full px-6">
                                Sign In
                            </Button>
                        </LoginModal>
                        <Button
                            onClick={handleStart}
                            className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full px-6 shadow-lg shadow-primary/20 transition-transform active:scale-95"
                        >
                            Get Started
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="container mx-auto px-6 pt-32 pb-20 md:pt-48 md:pb-40 text-center">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Your Smart WA Companion
                        </div>

                        <h1 className="text-5xl md:text-8xl font-black leading-[1.1] tracking-tight text-slate-900 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                            Organize Everything <br />
                            <span className="text-gradient">Through WhatsApp</span>
                        </h1>

                        <p className="text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            Kawai is your intelligent assistant that lives in your chat. Save notes, manage links, and set reminders without ever leaving WhatsApp.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            <Button
                                asChild
                                size="lg"
                                className="h-16 px-10 text-xl font-bold rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20 transition-all hover:-translate-y-1 group"
                            >
                                <a href={waLink} target="_blank" rel="noreferrer">
                                    Chat with Kawai <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </Button>
                            <Button
                                onClick={handleStart}
                                variant="outline"
                                size="lg"
                                className="h-16 px-10 text-xl font-bold rounded-2xl border-2 hover:bg-slate-50 transition-all"
                            >
                                Access Dashboard
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section - Bento Grid */}
                <section id="features" className="py-24 bg-slate-50/50 backdrop-blur-sm relative">
                    <div className="container mx-auto px-6">
                        <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
                            <h2 className="text-4xl font-black text-slate-900">Simply Smarter</h2>
                            <p className="text-slate-500 text-lg">Four powerful features to streamline your digital productivity.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto">
                            <Card className="md:col-span-8 p-8 bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500" />
                                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                                    <div className="w-20 h-20 shrink-0 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
                                        <MessageCircle size={40} />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-bold text-slate-900">Conversational Data Entry</h3>
                                        <p className="text-slate-500 text-lg leading-relaxed">Simply tell Kawai what to save. "Catat ide buat skripsi #kuliah" or "Ingatkan rapat besok jam 10". Our AI handles the rest.</p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="md:col-span-4 p-8 bg-gradient-to-br from-primary to-purple-600 border-0 shadow-2xl shadow-primary/20 rounded-3xl text-white group">
                                <div className="space-y-6">
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                                        <Shield size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold uppercase tracking-tighter">100% Secure</h3>
                                        <p className="text-white/80 leading-relaxed">Your data is encrypted and only accessible by you. Your privacy is our priority.</p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="md:col-span-4 p-8 bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl group transition-all hover:-translate-y-2">
                                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6 border border-green-200">
                                    <Save size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Smart Memory</h3>
                                <p className="text-slate-500">Save everything from shopping lists to deep thoughts. Tagged and searchable.</p>
                            </Card>

                            <Card className="md:col-span-4 p-8 bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl group transition-all hover:-translate-y-2">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 border border-blue-200">
                                    <Send size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">WhatsApp First</h3>
                                <p className="text-slate-500">No new apps to install. No new passwords to remember. Just add Kawai to your contacts.</p>
                            </Card>

                            <Card className="md:col-span-4 p-8 bg-white border-0 shadow-xl shadow-slate-200/50 rounded-3xl group transition-all hover:-translate-y-2">
                                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 border border-purple-200">
                                    ⚡
                                </div>
                                <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
                                <p className="text-slate-500">Cloud-synced and available across all your platforms instantly through the dashboard.</p>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* How It Works - Modern Steps */}
                <section id="how-it-works" className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
                            <h2 className="text-4xl font-black text-slate-900 italic uppercase">3 Simple Steps</h2>
                            <p className="text-slate-500 text-lg">Zero friction productivity begins right here.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
                            {/* Connector Line (Desktop Only) */}
                            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent z-0 transform -translate-y-12" />

                            <Step
                                num="01"
                                icon={<Smartphone size={32} />}
                                title="Chat on WhatsApp"
                                desc="Send anything to Kawai. A link, a reminder, or a personal memo."
                            />
                            <Step
                                num="02"
                                icon={<Shield size={32} />}
                                title="Auto-Organize"
                                desc="Our AI categorizes your data instantly and saves it to your cloud."
                            />
                            <Step
                                num="03"
                                icon={<CheckCircle2 size={32} />}
                                title="Manage Anywhere"
                                desc="Access and manage everything through your clean, modern dashboard."
                            />
                        </div>
                    </div>
                </section>

                {/* Stats Section with gradient background */}
                <section className="py-20 bg-slate-900 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] opacity-30 -mr-[400px] -mt-[400px]" />
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                            <Stat num="10K+" label="Active Users" />
                            <Stat num="500K+" label="Messages Sent" />
                            <Stat num="99%" label="Reliability" />
                            <Stat num="24/7" label="Availability" />
                        </div>
                    </div>
                </section>

                {/* Testimonials - modern floating cards */}
                <section id="testimonials" className="py-24 bg-slate-50/50 relative overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
                            <h2 className="text-4xl font-black text-slate-900 uppercase">Trusted by thousands</h2>
                            <p className="text-slate-500 text-lg">Join the cute but powerful productivity revolution.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <Testimonial
                                quote="Kawai-chan has replaced three different productivity apps for me. Now I just use WA."
                                name="Alex Johnson"
                                role="Tech Founder"
                            />
                            <Testimonial
                                quote="The reminder system is flawless. It sends me a WhatsApp message right when I need it."
                                name="Sarah Lee"
                                role="Student"
                                featured
                            />
                            <Testimonial
                                quote="Simple, effective, and actually fun to use. WhatsApp first is a game changer."
                                name="Michael Chen"
                                role="Freelancer"
                            />
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-24 container mx-auto px-6">
                    <div className="max-w-6xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-3xl">
                        <div className="absolute inset-0 mesh-gradient opacity-20" />
                        <div className="relative z-10 space-y-10">
                            <h2 className="text-4xl md:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1]">
                                Ready to level up your <span className="text-gradient">productivity?</span>
                            </h2>
                            <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                                Join our community and simplify your digital life. Kawai-chan is waiting for your first message.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
                                <Button
                                    asChild
                                    size="lg"
                                    className="h-16 px-12 text-xl font-bold rounded-2xl bg-white text-slate-900 hover:bg-white/90 shadow-2xl transition-all hover:scale-105 active:scale-95"
                                >
                                    <a href={waLink} target="_blank" rel="noreferrer">
                                        Start Your Journey
                                    </a>
                                </Button>
                                <Button
                                    onClick={handleStart}
                                    variant="outline"
                                    size="lg"
                                    className="h-16 px-12 text-xl font-bold rounded-2xl bg-white text-slate-900 hover:bg-white/90 shadow-2xl transition-all hover:scale-105 active:scale-95"
                                >
                                    View Dashboard
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-20 relative z-10">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-20">
                        <div className="md:col-span-4 space-y-8">
                            <div className="flex items-center gap-3">
                                <img src={Logo} alt="Logo" className="w-10 h-10" />
                                <span className="font-bold text-2xl tracking-tighter text-slate-900 uppercase">Kawai-chan</span>
                            </div>
                            <p className="text-slate-500 text-lg leading-relaxed max-w-xs">
                                Redefining productivity through the simplicity of conversational AI.
                            </p>
                            <div className="flex gap-4">
                                <SocialIcon />
                                <SocialIcon />
                                <SocialIcon />
                            </div>
                        </div>

                        <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
                            <FooterColumn
                                title="Product"
                                links={["Features", "Integrations", "Roadmap", "Pricing"]}
                            />
                            <FooterColumn
                                title="Resources"
                                links={["Documentation", "API Guide", "Help Center", "Community"]}
                            />
                            <FooterColumn
                                title="Company"
                                links={["About Us", "Contact", "Privacy", "Terms"]}
                            />
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm font-medium">
                        <p>&copy; {new Date().getFullYear()} Kawai-chan AI Assistant. Made with ✨ for global productivity.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function Step({ num, icon, title, desc }) {
    return (
        <div className="text-center group relative z-10">
            <div className="w-24 h-24 mx-auto bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center p-4 border border-slate-100 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2 group-hover:border-primary/30 group-hover:shadow-primary/5 cursor-default">
                <div className="text-primary mb-1">
                    {icon}
                </div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{num}</span>
            </div>
            <div className="mt-8 space-y-2">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h3>
                <p className="text-slate-500 max-w-[240px] mx-auto text-sm leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function Stat({ num, label }) {
    return (
        <div className="space-y-2 group">
            <div className="text-5xl md:text-64px font-black text-white tracking-tighter group-hover:scale-105 transition-transform duration-300">
                {num}
            </div>
            <div className="text-primary font-bold uppercase tracking-widest text-xs">
                {label}
            </div>
        </div>
    );
}

function Testimonial({ quote, name, role, featured = false }) {
    return (
        <Card className={`p-8 rounded-[2rem] border-0 shadow-xl transition-all duration-300 hover:shadow-2xl ${featured ? 'bg-primary text-white scale-105 z-10' : 'bg-white text-slate-900'} hover:-translate-y-2`}>
            <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" className={featured ? 'text-white' : 'text-yellow-400'} />
                ))}
            </div>
            <p className={`text-lg italic font-medium leading-relaxed mb-8 ${featured ? 'text-white' : 'text-slate-700'}`}>"{quote}"</p>
            <div className={`flex items-center gap-4 pt-6 border-t ${featured ? 'border-white/20' : 'border-slate-100'}`}>
                <div className={`w-12 h-12 rounded-2xl ${featured ? 'bg-white text-primary' : 'bg-primary text-white'} flex items-center justify-center font-black text-lg shadow-lg`}>
                    {name.charAt(0)}
                </div>
                <div>
                    <p className="font-bold text-sm">{name}</p>
                    <p className={`text-xs ${featured ? 'text-white/60' : 'text-slate-500'}`}>{role}</p>
                </div>
            </div>
        </Card>
    );
}

function SocialIcon() {
    return (
        <div className="w-10 h-10 rounded-full bg-slate-100 hover:bg-primary hover:text-white transition-all cursor-pointer flex items-center justify-center text-slate-600">
            <span className="text-lg">→</span>
        </div>
    );
}

function FooterColumn({ title, links }) {
    return (
        <div className="space-y-4">
            <p className="font-bold text-slate-900 text-sm">{title}</p>
            <ul className="space-y-2">
                {links.map((link, i) => (
                    <li key={i}>
                        <a href="#" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">
                            {link}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}