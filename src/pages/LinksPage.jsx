import { useEffect, useState } from "react";
import { getLinks, deleteLink, createLink } from "@/api/links";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink, Copy, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import Swal from 'sweetalert2';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function LinksPage() {
    const [links, setLinks] = useState([]);
    const [search, setSearch] = useState("");

    // Create Link State
    const [createOpen, setCreateOpen] = useState(false);
    const [newLinkUrl, setNewLinkUrl] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        loadLinks();
    }, []);

    const loadLinks = async () => {
        try {
            const data = await getLinks();
            setLinks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load links", error);
            setLinks([]);
        }
    };

    const handleCreate = async () => {
        if (!newLinkUrl.trim()) {
            return Swal.fire('Error', 'URL cannot be empty', 'warning');
        }
        // Basic URL validation
        if (!newLinkUrl.startsWith('http')) {
            return Swal.fire('Error', 'URL must start with http:// or https://', 'warning');
        }

        setIsCreating(true);
        try {
            await createLink(newLinkUrl);
            Swal.fire({
                icon: 'success',
                title: 'Link Saved',
                showConfirmButton: false,
                timer: 1500
            });
            setNewLinkUrl("");
            setCreateOpen(false);
            loadLinks();
        } catch (error) {
            Swal.fire('Error', 'Failed to save link', 'error');
        } finally {
            setIsCreating(false);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'success',
            title: 'Link copied!',
            showConfirmButton: false,
            timer: 1500
        });
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete this link?',
            text: "This action cannot be undone",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteLink(id);
                Swal.fire('Deleted!', 'Link has been deleted.', 'success');
                loadLinks();
            } catch (error) {
                console.error("Delete error", error);
                Swal.fire('Error', 'Failed to delete link.', 'error');
            }
        }
    };

    const filteredLinks = links.filter(l =>
        l.url?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Saved Links</h1>
                    <p className="text-muted-foreground">Quick access to your bookmarked URLs.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            placeholder="Search links..."
                            className="pl-9 bg-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => setCreateOpen(true)} className="bg-primary hover:bg-primary/90">
                        <Plus className="mr-2 h-4 w-4" /> Add Link
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-border/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">URL</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground w-32">Date</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground w-48 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {filteredLinks.map((link) => (
                                <tr key={link._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline flex items-center gap-2 font-medium"
                                            >
                                                {link.url}
                                                <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {link.created_at ? format(new Date(link.created_at.$date || link.created_at), 'MMM dd, yyyy') : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8"
                                                onClick={() => handleCopy(link.url)}
                                            >
                                                <Copy size={16} />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-red-500 hover:text-red-700"
                                                onClick={() => handleDelete(link._id)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredLinks.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                                        No links found. Add one manually or type 'Simpan https://...' in chat.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Link Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="max-w-md bg-white">
                    <DialogHeader>
                        <DialogTitle>Add New Link</DialogTitle>
                        <DialogDescription>
                            Paste the URL you want to save.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>URL</Label>
                            <Input
                                placeholder="https://example.com"
                                value={newLinkUrl}
                                onChange={(e) => setNewLinkUrl(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={isCreating}>
                            {isCreating ? "Saving..." : "Save Link"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
