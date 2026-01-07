import { useEffect, useState } from "react";
import { getReminders, updateReminder, deleteReminder } from "@/api/reminders";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Edit2, Trash2, CalendarIcon, Clock, Bell } from "lucide-react";
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
            // Ensure array
            setReminders(Array.isArray(data) ? data : data.reminders || []);
        } catch (error) {
            console.error("Failed to load reminders", error);
        }
    };

    const handleEdit = (reminder) => {
        Swal.fire({
            title: 'Edit Reminder',
            html: `
                <input id="swal-input1" class="swal2-input" placeholder="Title" value="${reminder.title}">
                <input id="swal-input2" type="datetime-local" class="swal2-input" value="${reminder.scheduled_time ? new Date(reminder.scheduled_time).toISOString().slice(0, 16) : ''}">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Save',
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
                    Swal.fire('Saved!', 'Your reminder has been updated.', 'success');
                    loadData();
                } catch (err) {
                    Swal.fire('Error!', 'Failed to update reminder.', 'error');
                }
            }
        })
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This reminder will be deleted permanently.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteReminder(id).then(() => {
                    Swal.fire('Deleted!', 'Reminder deleted.', 'success');
                    loadData();
                }).catch(() => {
                    Swal.fire('Error!', 'Failed to delete reminder.', 'error');
                });
            }
        })
    };

    const filteredReminders = reminders.filter(r =>
        r.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Bell className="text-orange-500" /> Reminders
                    </h1>
                    <p className="text-muted-foreground">Manage your scheduled alerts and tasks.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Search reminders..."
                        className="pl-9 bg-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredReminders.map((reminder, i) => (
                    <Card key={i} className="group hover:shadow-md transition-all duration-300 border-l-4 border-l-orange-400">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-lg line-clamp-1">{reminder.title}</h3>
                                <Badge variant="outline" className={`${reminder.is_executed ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                    {reminder.is_executed ? 'Done' : 'Pending'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                <Clock size={16} />
                                {reminder.scheduled_time ? format(new Date(reminder.scheduled_time), 'PPP p') : 'No Date'}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleEdit(reminder)}>
                                <Edit2 size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => handleDelete(reminder._id)}>
                                <Trash2 size={16} />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                {filteredReminders.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <Bell size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No reminders found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
