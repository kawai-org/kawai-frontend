import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, HelpCircle, MessageSquare } from "lucide-react";
import Swal from 'sweetalert2';

export default function FaqPage() {
    const [feedback, setFeedback] = useState("");

    const handleSendFeedback = (e) => {
        e.preventDefault();
        // Mock feedback submission
        Swal.fire({
            icon: 'success',
            title: 'Feedback Sent!',
            text: 'Thank you for helping us improve Kawai.',
            showConfirmButton: false,
            timer: 1500
        });
        setFeedback("");
    };

    const faqs = [
        {
            question: "How do I save a note?",
            answer: "Simply type 'Simpan' followed by your note in the Chat Assistant. For example: 'Simpan Buy milk tomorrow'. You can also view it in the Notes tab."
        },
        {
            question: "Can I save links?",
            answer: "Yes! If you save a note containing a URL, Kawai automatically detects it and marks it as a link. Check the 'Saved Links' page to see them organized."
        },
        {
            question: "Is Kawai connected to real AI?",
            answer: "Kawai uses advanced AI simulations. The 'Chat with Gemini' feature connects to Google's Gemini API (if configured) to provide smart answers."
        },
        {
            question: "How do I create a reminder?",
            answer: "Currently, you can save notes with dates. In the future, typing 'Remind me to...' will automatically set a calendar alert!"
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-primary">Help Center</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Find answers to common questions or send us your feedback to make Kawai even cuter and smarter!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* FAQ Section */}
                <Card className="border-border/60 shadow-sm h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HelpCircle className="text-primary" size={24} />
                            Frequently Asked Questions
                        </CardTitle>
                        <CardDescription>
                            Quick answers to help you get started.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-left font-medium hover:text-primary">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>

                {/* Feedback Form */}
                <Card className="border-border/60 shadow-sm h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="text-secondary-foreground" size={24} />
                            Send Feedback
                        </CardTitle>
                        <CardDescription>
                            Have a suggestion or found a bug? Let us know!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSendFeedback} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Subject</label>
                                <Input placeholder="Brief summary of your feedback" className="bg-gray-50" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Message</label>
                                <Textarea
                                    placeholder="Tell us what you think..."
                                    className="min-h-[150px] bg-gray-50 resize-none"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full gap-2">
                                <Send size={16} /> Send Feedback
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
