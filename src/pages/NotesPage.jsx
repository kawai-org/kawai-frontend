import { useEffect, useState } from "react";
import { getNotes, updateNote, deleteNote, getNoteDetail } from "@/api/notes";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit2, Trash2, CalendarIcon, Eye } from "lucide-react";
import { format } from "date-fns";
import Swal from 'sweetalert2';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";

export default function NotesPage() {
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedNote, setSelectedNote] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        loadNotes();
    }, [search]);

    const loadNotes = async () => {
        if (user) {
            try {
                // Pass search param if exists
                const data = await getNotes(search);
                // data might be array directly if backend returns array
                setNotes(Array.isArray(data) ? data : data.notes || []);
            } catch (error) {
                console.error("Failed to load notes", error);
            }
        }
    };

    const handleView = async (note) => {
        try {
            setViewOpen(true);
            setSelectedNote(note); // temporary show what we have
            const detail = await getNoteDetail(note._id);
            setSelectedNote(detail);
        } catch (error) {
            console.error("Failed to fetch detail", error);
        }
    };

    const handleEdit = (note) => {
        Swal.fire({
            title: 'Edit Note',
            input: 'textarea',
            inputValue: note.content,
            showCancelButton: true,
            confirmButtonText: 'Save',
            showLoaderOnConfirm: true,
            preConfirm: (newContent) => {
                return updateNote(note._id, newContent);
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Saved!', 'Your note has been updated.', 'success');
                loadNotes();
            }
        })
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteNote(id).then(() => {
                    Swal.fire('Deleted!', 'Your note has been deleted.', 'success');
                    loadNotes();
                }).catch(() => {
                    Swal.fire('Error!', 'Failed to delete note.', 'error');
                });
            }
        })
    };

    const filteredNotes = notes.filter(n => n.content.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">My Notes</h1>
                    <p className="text-muted-foreground">Manage your saved texts and ideas.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Search notes..."
                        className="pl-9 bg-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredNotes.map((note, i) => (
                    <Card key={i} className="group hover:shadow-md transition-all duration-300 border-border/60">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-blue-200">
                                    {note.type || "Text"}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <CalendarIcon size={12} />
                                    {note.created_at ? format(new Date(note.created_at), 'MMM dd, yyyy') : 'N/A'}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap line-clamp-4">
                                {note.content}
                            </p>
                        </CardContent>
                        <CardFooter className="pt-0 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-500" onClick={() => handleView(note)}>
                                <Eye size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleEdit(note)}>
                                <Edit2 size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => handleDelete(note._id)}>
                                <Trash2 size={16} />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                {filteredNotes.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <FileText size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No notes found matching your search.</p>
                    </div>
                )}
            </div>
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            Note Details
                            {selectedNote?.type && (
                                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-600">
                                    {selectedNote.type}
                                </Badge>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            Created at {selectedNote?.created_at ? format(new Date(selectedNote.created_at), 'PPP pp') : 'N/A'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 whitespace-pre-wrap leading-relaxed text-sm md:text-base text-foreground/80">
                            {selectedNote?.content}
                        </div>

                        {selectedNote?.related_tags && selectedNote.related_tags.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                    Related Tags
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedNote.related_tags.map((tag, i) => (
                                        <Badge key={i} variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100">
                                            #{tag.name || tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function FileText({ size, className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <line x1="10" x2="8" y1="9" y2="9" />
        </svg>
    )
}
