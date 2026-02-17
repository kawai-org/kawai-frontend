import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ChevronRight, Clock } from "lucide-react";
import { getNotes } from "@/api/notes";

export default function RecentNotes() {
    const [recentNotes, setRecentNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecent = async () => {
            try {
                const notesData = await getNotes();
                const notes = Array.isArray(notesData) ? notesData : [];
                setRecentNotes(notes.slice(0, 5));
            } catch (error) {
                console.error("Failed to load recent notes", error);
            } finally {
                setLoading(false);
            }
        };

        loadRecent();
    }, []);

    const formatTime = (dateStr) => {
        if (!dateStr) return "Just now";
        try {
            const date = new Date(dateStr.$date || dateStr);
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);

            if (diffInSeconds < 60) return "Just now";
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
            return date.toLocaleDateString();
        } catch (e) {
            return "Recently";
        }
    };

    return (
        <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="p-8 pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-black uppercase tracking-tight font-heading">Recent Notes</CardTitle>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Your latest snapshots</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl text-slate-400">
                        <FileText size={18} />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pb-8">
                <div className="space-y-2">
                    {loading ? (
                        <div className="space-y-3 p-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-16 w-full bg-slate-50 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <>
                            {recentNotes.map((note, i) => (
                                <div key={i} className="group flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-100 cursor-pointer">
                                    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <FileText size={16} className="md:w-[18px] md:h-[18px]" />
                                        </div>
                                        <div className="overflow-hidden space-y-1">
                                            <p className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                                                {note.content || "Empty note"}
                                            </p>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={10} className="text-slate-300" />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    {formatTime(note.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-200 group-hover:text-primary transition-colors" />
                                </div>
                            ))}
                            {recentNotes.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                        <FileText size={24} className="text-slate-200" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">No notes found</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
