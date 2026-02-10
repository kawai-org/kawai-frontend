import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { getNotes } from "@/api/notes";

export default function DashboardRecentNotes() {
    const [recentNotes, setRecentNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecent = async () => {
            try {
                // Fetch notes with empty search to get all
                // Ideally backend should support ?limit=5
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

    return (
        <Card className="border-border/40 shadow-sm">
            <CardHeader>
                <CardTitle>Recent Notes</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center p-4">
                            <span className="text-sm text-muted-foreground animate-pulse">Loading recent notes...</span>
                        </div>
                    ) : (
                        <>
                            {recentNotes.map((note, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                    <div className="bg-blue-50 p-2 rounded-lg text-blue-500 flex-shrink-0">
                                        <FileText size={16} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium truncate">{note.content}</p>
                                        <p className="text-xs text-muted-foreground mt-1 truncate">
                                            {note.created_at ? new Date(note.created_at.$date || note.created_at).toLocaleDateString() : "Just now"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {recentNotes.length === 0 && (
                                <p className="text-sm text-center text-muted-foreground py-8">No notes yet.</p>
                            )}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
