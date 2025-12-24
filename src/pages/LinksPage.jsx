import { useEffect, useState } from "react";
import { getDashboardData } from "@/api/chat";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink, Copy, Tag } from "lucide-react";
import { format } from "date-fns";
import Swal from 'sweetalert2';

export default function LinksPage() {
    const [links, setLinks] = useState([]);
    const [search, setSearch] = useState("");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        loadLinks();
    }, []);

    const loadLinks = async () => {
        if (user.phone_number) {
            try {
                const data = await getDashboardData(user.phone_number);
                setLinks(data.links || []); // Ensure this matches backend structure data.links
                // If backend stores mixed notes, we might need to filter `data.notes` for type='mixed' if separate `links` collection isn't used.
                // Assuming `links` array exists from previous plan, or we filter notes.
                // Let's fallback to filtering notes if links is empty to be safe.
                if (!data.links || data.links.length === 0 && data.notes) {
                    const extractedLinks = data.notes.filter(n => n.type === 'mixed' || n.content.includes('http'));
                    setLinks(extractedLinks);
                }
            } catch (error) {
                console.error("Failed to load links", error);
            }
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

    const filteredLinks = links.filter(l => l.content.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Saved Links</h1>
                    <p className="text-muted-foreground">Quick access to your bookmarked URLs.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Search links..."
                        className="pl-9 bg-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-border/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-muted-foreground">Title / Content</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground w-32">Date</th>
                                <th className="px-6 py-4 font-semibold text-muted-foreground w-48 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {filteredLinks.map((link, i) => {
                                // Simple extraction of first URL if content is mixed
                                const urlMatch = link.content.match(/(https?:\/\/[^\s]+)/g);
                                const url = urlMatch ? urlMatch[0] : "#";
                                const displayContent = link.content.replace(url, '').trim() || url;

                                return (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">{displayContent.substring(0, 60)}...</span>
                                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs mt-1 truncate max-w-[300px] flex items-center gap-1">
                                                    {url} <ExternalLink size={10} />
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {link.created_at ? format(new Date(link.created_at), 'MMM dd, yyyy') : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleCopy(url)}>
                                                    <Copy size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            {filteredLinks.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                                        No links found. Try typing 'Simpan https://example.com' in chat.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
