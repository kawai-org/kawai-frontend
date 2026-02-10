import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, HelpCircle, MessageSquare, Sparkles, MessageCircle, ExternalLink } from "lucide-react";
import Swal from 'sweetalert2';

export default function FaqPage() {
    const [feedback, setFeedback] = useState("");

    const handleSendFeedback = (e) => {
        e.preventDefault();
        Swal.fire({
            icon: 'success',
            title: 'Report Received',
            text: 'Your contribution helps optimize the cloud experience.',
            showConfirmButton: false,
            timer: 2000,
            customClass: { popup: 'rounded-[1.5rem]' }
        });
        setFeedback("");
    };

    const faqs = [
        {
            category: "CORE ENGINE",
            question: "How do I save a note successfully?",
            answer: "Simply target our WhatsApp gateway and type 'Catat [Topic] [Content]'. Our NLP engine will capture it. Example: 'Catat #research focus on AI architecture'."
        },
        {
            category: "RESOURCE HUB",
            question: "Can I manage external URLs?",
            answer: "Affirmative. Use the command 'Simpan Link [URL]'. Our system will archive the destination for quick retrieval from your dashboard."
        },
        {
            category: "AUTOMATION",
            question: "How do I initialize a reminder?",
            answer: "Message the assistant with 'Ingatkan [Task] [Time]'. Example: 'Ingatkan Sync Meeting Tomorrow at 10 AM'. We will trigger a notification script."
        },
        {
            category: "SYSTEM DATA",
            question: "Are there interactive commands?",
            answer: "Type 'List' to query your database, 'Backup' to synchronize with Drive, or 'Dashboard' for secure access tokens."
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Hero Header */}
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <Sparkles className="stroke-[2.5]" size={32} />
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase font-heading">
                    Support <span className="text-gradient">Infrastructure</span>
                </h2>
                <p className="text-slate-400 font-medium text-sm md:text-base max-w-2xl">
                    Query our database of knowledge or contribute directly to the platform's evolution through our feedback gateway.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* FAQ Architecture */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="space-y-1 px-2">
                        <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                            <HelpCircle size={14} /> Knowledge Base
                        </h3>
                        <p className="text-2xl font-black text-slate-800 tracking-tight">Technical Clarifications</p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-50 p-6 md:p-8">
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`} className="border-0 bg-slate-50/50 rounded-2xl px-5 transition-all hover:bg-slate-50">
                                    <AccordionTrigger className="text-left py-5 hover:no-underline group">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 group-hover:text-primary transition-colors">
                                                {faq.category}
                                            </span>
                                            <span className="text-slate-700 font-bold text-sm md:text-base tracking-tight leading-tight">
                                                {faq.question}
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-500 font-medium text-sm leading-relaxed pb-6">
                                        <div className="pl-0 border-l-[3px] border-primary/20 ps-4">
                                            {faq.answer}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                    {/* WhatsApp CTA */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-2 text-center md:text-left">
                                <h4 className="text-xl font-black uppercase tracking-tight">Need Real-time Sync?</h4>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Connect directly via our WhatsApp interface</p>
                            </div>
                            <Button className="h-14 px-8 rounded-2xl bg-[#25D366] hover:bg-[#128C7E] text-white font-black uppercase text-[11px] tracking-[0.15em] shadow-xl shadow-green-500/20 group-hover:scale-105 transition-all">
                                <MessageCircle size={18} className="mr-2 stroke-[3]" /> Launch Assistant
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Feedback Gateway */}
                <div className="lg:col-span-5">
                    <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[3rem] bg-white overflow-hidden h-full">
                        <CardHeader className="p-10 pb-6 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mx-auto mb-6">
                                <MessageSquare className="stroke-[2.5]" size={24} />
                            </div>
                            <CardTitle className="text-2xl font-black uppercase tracking-tight font-heading">Feed Input</CardTitle>
                            <CardDescription className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">
                                Collaborative System Optimization
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 pt-0">
                            <form onSubmit={handleSendFeedback} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Subject Vector</label>
                                    <Input
                                        placeholder="Enter classification (Bug / Idea / Refinement)"
                                        className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all px-6 font-bold text-slate-900 shadow-none focus-visible:ring-primary/20"
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Payload Content</label>
                                    <Textarea
                                        placeholder="Detailed technical feedback or suggestion..."
                                        className="min-h-[180px] rounded-3xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all p-6 font-bold text-slate-900 shadow-none focus-visible:ring-primary/20 resize-none"
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
                                    <Send size={16} className="mr-2 stroke-[3]" /> Submit Feedback
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

