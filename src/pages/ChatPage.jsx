import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Menu, Phone, MoreVertical, LogOut, History, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';
import Logo from "@/assets/logo.png";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isToday, isYesterday } from 'date-fns';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


import { getChatHistory, sendMessage } from "@/api/chat";

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [showHistory, setShowHistory] = useState(false); // Mobile toggle
    const messagesEndRef = useRef(null);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Load History on Mount
    useEffect(() => {
        const loadHistory = async () => {
            if (user.phone_number) {
                try {
                    const history = await getChatHistory(user.phone_number);
                    if (Array.isArray(history)) {
                        const formatted = history.map(h => ({
                            id: h._id,
                            text: h.message,
                            sender: h.from === user.phone_number ? "user" : "bot",
                            timestamp: new Date(h.received_at)
                        }));
                        setMessages(prev => [...formatted, ...prev]);
                    }
                } catch (error) {
                    console.error("Failed to load history", error);
                }
            }
        };
        loadHistory();

        // Initial Greeting
        setMessages([{ id: 'init', text: `Hi ${user.name}! (* ^ ω ^)\nHow can I help you today?`, sender: "bot", timestamp: new Date() }]);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const currentInput = input;
        setInput(""); // Clear immediately for UX

        const newUserMsg = { id: Date.now(), text: currentInput, sender: "user", timestamp: new Date() };
        setMessages(prev => [...prev, newUserMsg]);

        try {
            // Call Backend API
            const response = await sendMessage(user.phone_number, currentInput);

            // Backend Response (Gemini/Smart Logic)
            if (response && response.reply) {
                const botResponse = {
                    id: Date.now() + 1,
                    text: response.reply,
                    sender: "bot",
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botResponse]);
            }
        } catch (error) {
            console.error("Send failed", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "⚠️ Failed to send message.",
                sender: "bot",
                timestamp: new Date()
            }]);
        }
    };

    const handleRedirectWA = () => {
        window.open("https://wa.me/628999808001", "_blank");
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    // Group messages by Date for History Sidepanel
    const groupedMessages = messages.reduce((groups, msg) => {
        const date = format(msg.timestamp, 'yyyy-MM-dd');
        if (!groups[date]) groups[date] = [];
        groups[date].push(msg);
        return groups;
    }, {});

    return (
        <div className="flex bg-background h-[calc(100vh-8rem)] relative overflow-hidden rounded-2xl border border-border/40 shadow-sm">

            {/* History Sidebar (Desktop: Visible, Mobile: Toggle) */}
            <aside className={`
                absolute md:relative z-20 h-full w-64 bg-gray-50/80 backdrop-blur-md border-r border-border transition-transform duration-300
                ${showHistory ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-4 border-b border-border/40 flex justify-between items-center">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                        <History size={16} /> Chat History
                    </h3>
                    <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={() => setShowHistory(false)}>
                        &times;
                    </Button>
                </div>
                <div className="overflow-y-auto h-[calc(100%-4rem)] p-3 space-y-4">
                    {/* Bot Commands Cheatsheet */}
                    <div className="mb-4">
                        <Card className="bg-white/80 border-indigo-100 shadow-sm">
                            <CardHeader className="p-3">
                                <CardTitle className="text-xs font-bold text-indigo-600">Bot Commands (WhatsApp)</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 pt-0 text-[10px] space-y-2 text-muted-foreground">
                                <div>
                                    <p className="font-semibold text-gray-700">1. Simpan Catatan</p>
                                    <p>Catat [Hashtag] [Isi]</p>
                                    <p className="italic text-gray-400">Ex: Catat #kuliah ide skripsi</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700">2. Lihat Data</p>
                                    <p>Ketik: List, Menu, atau List Link</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700">3. Pengingat</p>
                                    <p>Ex: Ingatkan Rapat Besok jam 10</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700">4. Dashboard & Backup</p>
                                    <p>Ketik: Dashboard / Backup</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {Object.keys(groupedMessages).sort().reverse().map(date => (
                        <div key={date}>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                                {isToday(new Date(date)) ? 'Today' : isYesterday(new Date(date)) ? 'Yesterday' : format(new Date(date), 'MMM dd')}
                            </p>
                            <div className="space-y-1">
                                {groupedMessages[date].map(msg => (
                                    <div key={msg.id} className="text-xs p-2 rounded-lg hover:bg-white hover:shadow-sm cursor-pointer transition-all truncate text-muted-foreground hover:text-foreground">
                                        <span className={msg.sender === 'user' ? 'text-blue-500' : 'text-purple-500'}>
                                            {msg.sender === 'user' ? 'You: ' : 'Bot: '}
                                        </span>
                                        {msg.text.substring(0, 30)}...
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {messages.length <= 1 && (
                        <div className="text-center py-8 text-xs text-muted-foreground">No history yet.</div>
                    )}
                </div>
            </aside>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 relative">

                {/* Mobile History Toggle Overlay */}
                {showHistory && <div className="absolute inset-0 bg-black/20 z-10 md:hidden" onClick={() => setShowHistory(false)} />}

                {/* Toolbar for History Toggle (Mobile Only) */}
                <div className="md:hidden p-2 absolute top-2 left-2 z-30">
                    <Button variant="secondary" size="sm" className="shadow-sm backdrop-blur-sm bg-white/50" onClick={() => setShowHistory(true)}>
                        <Clock size={16} className="mr-1" /> History
                    </Button>
                </div>

                <main className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth pb-20 pt-12 md:pt-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300 w-full`}>
                            <div className={`
                                max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3 text-sm shadow-sm relative group break-words
                                ${msg.sender === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                    : 'bg-white border border-border text-foreground rounded-tl-sm'}
                            `}>
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                <span className={`text-[10px] mt-1 block text-right ${msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} className="h-4" />
                </main>

                {/* Input Area */}
                <div className="p-4 bg-white/80 backdrop-blur-md border-t border-border/40 pb-6 md:pb-4">
                    <div className="flex gap-2 max-w-4xl mx-auto relative">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            className="rounded-3xl border-border bg-gray-50/50 focus:bg-white transition-all h-12 px-6 pr-12 shadow-sm focus:ring-2 focus:ring-primary/20"
                        />
                        <div className="absolute right-1 top-1">
                            <Button
                                onClick={handleSend}
                                size="icon"
                                className="rounded-full w-10 h-10 bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-sm"
                                disabled={!input.trim()}
                            >
                                <ArrowUp size={20} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating WA Button (Keep existing) */}
            <div className="fixed bottom-24 right-5 z-40">
                <Button
                    onClick={handleRedirectWA}
                    className="rounded-full w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-green-500/20 flex items-center justify-center transition-all hover:scale-110 hover:-rotate-12"
                    title="Chat on WhatsApp"
                >
                    <Phone size={26} fill="white" />
                </Button>
            </div>
        </div>
    );
}
