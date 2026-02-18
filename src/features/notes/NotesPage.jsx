import { useEffect, useState } from "react";
import { getNotes, updateNote, deleteNote } from "@/api/notes";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Edit2, Trash2, Clock, FileText } from "lucide-react";
import { format } from "date-fns";
import Swal from 'sweetalert2';

export default function NotesPage() {
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        loadNotes();
    }, [search]);

    const loadNotes = async () => {
        if (user) {
            try {
                const data = await getNotes(search);
                setNotes(Array.isArray(data) ? data : data.notes || []);
            } catch (error) {
                console.error("Failed to load notes", error);
            }
        }
    };

    const handleEdit = (note) => {
        Swal.fire({
            title: 'Refine Note',
            input: 'textarea',
            inputValue: note.content,
            showCancelButton: true,
            confirmButtonText: 'Update Content',
            confirmButtonColor: 'hsl(var(--primary))',
            cancelButtonColor: '#64748b',
            showLoaderOnConfirm: true,
            customClass: {
                popup: 'rounded-[1.5rem] border-0',
                input: 'rounded-xl border-slate-100 bg-slate-50 p-4 focus:ring-0',
                confirmButton: 'rounded-xl px-6 py-2',
                cancelButton: 'rounded-xl px-6 py-2'
            },
            preConfirm: async (newContent) => {
                try {
                    return await updateNote(note.id, newContent);
                } catch (error) {
                    Swal.showValidationMessage(error.message || 'Failed to update note');
                    return false;
                }
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                Swal.fire({
                    title: 'Success',
                    text: 'Your note has been refined successfully.',
                    icon: 'success',
                    customClass: { popup: 'rounded-[1.5rem]' }
                });
                loadNotes();
            }
        })
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete Permanently?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                popup: 'rounded-[1.5rem] border-0',
                confirmButton: 'rounded-xl px-6 py-2',
                cancelButton: 'rounded-xl px-6 py-2'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                deleteNote(id).then(() => {
                    Swal.fire({
                        title: 'Deleted',
                        text: 'Note has been removed from your history.',
                        icon: 'success',
                        customClass: { popup: 'rounded-[1.5rem]' }
                    });
                    loadNotes();
                }).catch((err) => {
                    Swal.fire({
                        title: 'Error',
                        text: err.message || 'Failed to delete note.',
                        icon: 'error',
                        customClass: { popup: 'rounded-[1.5rem]' }
                    });
                });
            }
        })
    };

    const filteredNotes = notes.filter(n => n.content.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase font-heading">
                        My <span className="text-gradient">Personal Notes</span>
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {filteredNotes.length} Thoughts & Records Captured
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative group min-w-[280px]">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search your notes..."
                            className="pl-10 h-11 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all shadow-none focus:ring-0 focus:border-primary/30 font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNotes.map((note, i) => (
                    <Card key={i} className="group border-0 shadow-xl shadow-slate-200/50 rounded-[2rem] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden bg-white">
                        <CardHeader className="p-7 pb-4">
                            <div className="flex justify-between items-center">
                                <Badge className="bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-primary/10 hover:bg-primary/10 truncate max-w-[120px]">
                                    {note.type || "General"}
                                </Badge>
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Clock size={12} className="stroke-[2.5]" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">
                                        {note.created_at ? format(new Date(note.created_at), 'MMM dd') : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-7 py-0">
                            <p className="text-slate-600 font-bold text-sm leading-relaxed whitespace-pre-wrap line-clamp-6 min-h-[120px]">
                                {note.content}
                            </p>
                        </CardContent>
                        <div className="p-7 pt-4 flex gap-2">
                            <NoteActionButton icon={<Edit2 size={16} />} onClick={() => handleEdit(note)} color="slate" />
                            <NoteActionButton icon={<Trash2 size={16} />} onClick={() => handleDelete(note.id)} color="red" />
                        </div>
                    </Card>
                ))}

                {filteredNotes.length === 0 && (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                            <FileText size={32} className="text-slate-200" />
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">No matching notes found</p>
                            <p className="text-slate-300 text-xs font-medium">Try a different search term or add notes via WhatsApp.</p>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}

function NoteActionButton({ icon, onClick, color }) {
    const variants = {
        blue: "text-blue-500 hover:bg-blue-50",
        slate: "text-slate-400 hover:bg-slate-100",
        red: "text-red-500 hover:bg-red-50"
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className={`h-11 w-11 rounded-2xl transition-all ${variants[color]}`}
            onClick={onClick}
        >
            {icon}
        </Button>
    );
}
