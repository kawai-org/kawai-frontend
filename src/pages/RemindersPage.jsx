import { useEffect, useState } from "react";
import { getReminders, updateReminder, deleteReminder } from "@/api/reminders";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit2, Trash2, Calendar, Clock, Bell, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import Swal from 'sweetalert2';

export default function RemindersPage() {
    const [reminders, setReminders] = useState([]);
    const [search, setSearch] = useState("");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Load Reminders
    useEffect(() => {
        loadData();
    }, [search]);

    const loadData = async () => {
        try {
            const data = await getReminders(search);
            setReminders(Array.isArray(data) ? data : data.reminders || []);
        } catch (error) {
            console.error("Failed to load reminders", error);
        }
    };

    const handleEdit = (reminder) => {
        Swal.fire({
            title: 'Reschedule Task',
            html: `
                <div class="space-y-4 text-left p-2">
                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Reminder Title</label>
                        <input id="swal-input1" class="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 font-bold focus:ring-0 outline-none focus:border-primary/30" placeholder="Title" value="${reminder.title}">
                    </div>
                    <div class="space-y-2 mt-4">
                        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Scheduled Time</label>
                        <input id="swal-input2" type="datetime-local" class="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 font-bold focus:ring-0 outline-none focus:border-primary/30" value="${reminder.scheduled_time ? new Date(reminder.scheduled_time).toISOString().slice(0, 16) : ''}">
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Update Tracker',
            confirmButtonColor: 'hsl(var(--primary))',
            cancelButtonColor: '#64748b',
            customClass: {
                popup: 'rounded-[2rem] border-0 p-8',
                confirmButton: 'rounded-xl px-6 py-2 uppercase text-[10px] font-black tracking-widest h-11',
                cancelButton: 'rounded-xl px-6 py-2 uppercase text-[10px] font-black tracking-widest h-11'
            },
            preConfirm: () => {
                return {
                    title: document.getElementById('swal-input1').value,
                    scheduled_time: document.getElementById('swal-input2').value
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await updateReminder(reminder._id, result.value);
                    Swal.fire({
                        title: 'Synchronized',
                        text: 'Your schedule has been updated across the cloud.',
                        icon: 'success',
                        customClass: { popup: 'rounded-[1.5rem]' }
                    });
                    loadData();
                } catch (err) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Failed to synchronize updates.',
                        icon: 'error',
                        customClass: { popup: 'rounded-[1.5rem]' }
                    });
                }
            }
        })
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Abort Reminder?',
            text: "This schedule will be permanently removed from your queue.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Delete It',
            customClass: {
                popup: 'rounded-[2rem] border-0 p-8',
                confirmButton: 'rounded-xl px-6 py-2 uppercase text-[10px] font-black tracking-widest h-11',
                cancelButton: 'rounded-xl px-6 py-2 uppercase text-[10px] font-black tracking-widest h-11'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                deleteReminder(id).then(() => {
                    Swal.fire({
                        title: 'Terminated',
                        text: 'Reminder successfully removed.',
                        icon: 'success',
                        customClass: { popup: 'rounded-[1.5rem]' }
                    });
                    loadData();
                }).catch(() => {
                    Swal.fire({
                        title: 'Error',
                        text: 'Failed to remove reminder.',
                        icon: 'error',
                        customClass: { popup: 'rounded-[1.5rem]' }
                    });
                });
            }
        })
    };

    const filteredReminders = reminders.filter(r =>
        r.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase font-heading flex items-center gap-3">
                        <span className="text-gradient">Active</span> Reminders
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {filteredReminders.length} Scheduled Alerts in Queue
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative group min-w-[280px]">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Find specific alerts..."
                            className="pl-10 h-11 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all shadow-none focus:ring-0 focus:border-primary/30 font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {/* Note: The original code didn't have a Plus button here, but the Header UI usually holds it. 
                        Reminders are usually added via chat/bot in this app context. 
                        I'll include the search as the primary action. */}
                </div>
            </div>

            {/* Reminders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredReminders.map((reminder, i) => (
                    <Card key={i} className={`group border-0 shadow-xl shadow-slate-200/50 rounded-[2.5rem] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden bg-white ${reminder.is_executed ? 'opacity-75' : ''}`}>
                        <div className={`absolute top-0 left-0 w-2 h-full ${reminder.is_executed ? 'bg-green-400' : 'bg-orange-400'}`}></div>

                        <CardHeader className="p-8 pb-4">
                            <div className="flex justify-between items-start gap-4">
                                <h3 className="text-slate-900 font-black text-lg uppercase tracking-tight line-clamp-2 leading-tight">
                                    {reminder.title}
                                </h3>
                                <Badge className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-0 ${reminder.is_executed ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                    {reminder.is_executed ? 'Executed' : 'Pending'}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="px-8 py-0 space-y-4">
                            <div className="flex items-center gap-3 text-slate-400 font-bold bg-slate-50 p-4 rounded-2xl group-hover:bg-slate-100 transition-colors">
                                <Clock size={16} className="text-primary stroke-[2.5]" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-300">Target Time</span>
                                    <span className="text-xs text-slate-600">
                                        {reminder.scheduled_time ? format(new Date(reminder.scheduled_time), 'PPP p') : 'Unscheduled'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>

                        <div className="p-8 pt-4 flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-11 w-11 rounded-2xl text-slate-400 hover:bg-slate-100 transition-all"
                                onClick={() => handleEdit(reminder)}
                            >
                                <Edit2 size={18} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-11 w-11 rounded-2xl text-red-500 hover:bg-red-50 transition-all"
                                onClick={() => handleDelete(reminder._id)}
                            >
                                <Trash2 size={18} />
                            </Button>
                        </div>
                    </Card>
                ))}

                {filteredReminders.length === 0 && (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                            <Bell size={32} className="text-slate-200" />
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Queue is Clear</p>
                            <p className="text-slate-300 text-xs font-medium">No alerts scheduled. Use the WhatsApp bot to add reminders.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

