import { useEffect, useState } from "react";
import { getLinks, deleteLink } from "@/api/links";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink, Copy, Trash2, Globe, Check, Link as LinkIcon } from "lucide-react";
import { format } from "date-fns";
import Swal from 'sweetalert2';

export default function LinksPage() {
    const [links, setLinks] = useState([]);
    const [search, setSearch] = useState("");
    const [copiedId, setCopiedId] = useState(null);

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

    const handleCopy = (id, text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);

        const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        Toast.fire({
            icon: 'success',
            title: 'Copied to clipboard',
            customClass: { popup: 'rounded-xl mb-4 mr-4' }
        });
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Remove Link?',
            text: "This bookmark will be deleted permanently.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                popup: 'rounded-[1.5rem] border-0',
                confirmButton: 'rounded-xl px-6 py-2',
                cancelButton: 'rounded-xl px-6 py-2'
            }
        });

        if (result.isConfirmed) {
            try {
                await deleteLink(id);
                Swal.fire({
                    title: 'Deleted',
                    text: 'Link has been removed.',
                    icon: 'success',
                    customClass: { popup: 'rounded-[1.5rem]' }
                });
                loadLinks();
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: error.message || 'Failed to delete link.',
                    icon: 'error',
                    customClass: { popup: 'rounded-[1.5rem]' }
                });
            }
        }
    };

    const filteredLinks = links.filter(l =>
        l.url?.toLowerCase().includes(search.toLowerCase())
    );

    const getDomain = (url) => {
        try {
            return new URL(url).hostname;
        } catch (e) {
            return "External Link";
        }
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase font-heading">
                        Reference <span className="text-gradient">Library</span>
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {filteredLinks.length} Resources & Bookmarks Saved
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative group min-w-[280px]">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Filter your links..."
                            className="pl-10 h-11 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all shadow-none focus:ring-0 focus:border-primary/30 font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Links Registry Table */}
            <div className="border-0 shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80 border-b border-slate-100 backdrop-blur-sm">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Resource Information</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 w-40">Saved Date</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 w-48 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredLinks.map((link) => (
                                <tr key={link._id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
                                                <Globe size={20} className="stroke-[2.5]" />
                                            </div>
                                            <div className="flex flex-col overflow-hidden max-w-[300px] lg:max-w-md">
                                                <a
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-slate-900 font-bold text-sm truncate hover:text-primary transition-colors flex items-center gap-2 group/link"
                                                >
                                                    {link.url}
                                                    <ExternalLink size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                </a>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
                                                    {getDomain(link.url)}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-1.5 text-slate-500">
                                            <p className="text-[11px] font-bold tracking-tight">
                                                {link.created_at ? format(new Date(link.created_at.$date || link.created_at), 'PPP') : '-'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className={`h-11 w-11 rounded-2xl transition-all ${copiedId === link._id ? 'bg-green-50 text-green-600' : 'text-slate-400 hover:bg-slate-100'}`}
                                                onClick={() => handleCopy(link._id, link.url)}
                                            >
                                                {copiedId === link._id ? <Check size={18} /> : <Copy size={18} />}
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-11 w-11 rounded-2xl text-red-500 hover:bg-red-50"
                                                onClick={() => handleDelete(link._id)}
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredLinks.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                                                <LinkIcon size={32} className="text-slate-200" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Library Empty</p>
                                                <p className="text-slate-300 text-xs font-medium">Use the WhatsApp assistant to save new links.</p>
                                            </div>
                                        </div>
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
