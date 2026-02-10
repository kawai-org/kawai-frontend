import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar as CalendarIcon, Users, Clock, Info, ShieldCheck } from 'lucide-react';
import { getReminders } from "@/api/reminders";
import { format, isSameDay } from "date-fns";

export default function CalendarPage() {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isAdmin = user.role === 'admin' || user.username;

    useEffect(() => {
        const loadEvents = async () => {
            if (user) {
                try {
                    const data = await getReminders();
                    const dataArray = Array.isArray(data) ? data : (data.reminders || []);

                    const mappedEvents = dataArray.map(r => {
                        const scheduledTime = r.scheduled_time?.$date || r.scheduled_time;
                        const createdAt = r.created_at?.$date || r.created_at;

                        return {
                            date: new Date(scheduledTime || createdAt),
                            title: r.title || "Untitled Activity",
                            type: 'schedule',
                            id: r._id || r.id,
                            user_name: r.user_name || (isAdmin ? "Anonymous User" : "My Record"),
                            status: r.status
                        };
                    });

                    setEvents(mappedEvents);
                } catch (error) {
                    console.error("Failed to load calendar data", error);
                    setEvents([]);
                }
            }
        };
        loadEvents();
    }, [user.phone_number, isAdmin]);

    const getEventsForDate = (d) => {
        return events.filter(e => isSameDay(e.date, d));
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase font-heading flex items-center gap-3">
                        Cloud <span className="text-gradient">Calendar</span>
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {isAdmin ? "Administrative Control & Oversight" : "Personal Timeline & History"}
                    </p>
                </div>

                {isAdmin && (
                    <Badge className="bg-red-50 text-red-600 border-red-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck size={14} /> Admin Privileges Active
                    </Badge>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Calendar Pane */}
                <div className="lg:col-span-8">
                    <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white h-full">
                        <CardContent className="p-8 md:p-10">
                            <div className="calendar-container">
                                <Calendar
                                    onChange={setDate}
                                    value={date}
                                    tileContent={({ date, view }) => {
                                        if (view === 'month') {
                                            const dayEvents = getEventsForDate(date);
                                            if (dayEvents.length > 0) {
                                                return (
                                                    <div className="flex justify-center mt-2 gap-1">
                                                        {dayEvents.slice(0, 3).map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-red-400 ring-2 ring-red-100' : 'bg-primary ring-2 ring-primary/20'}`}
                                                            />
                                                        ))}
                                                        {dayEvents.length > 3 && (
                                                            <span className="text-[8px] font-black text-slate-300">+{dayEvents.length - 3}</span>
                                                        )}
                                                    </div>
                                                )
                                            }
                                        }
                                    }}
                                    className="modern-calendar"
                                    prev2Label={null}
                                    next2Label={null}
                                />
                            </div>

                            <div className="mt-10 pt-8 border-t border-slate-50 flex flex-wrap gap-6 justify-center">
                                <LegendItem color={isAdmin ? "bg-red-400" : "bg-primary"} label={isAdmin ? "User Events" : "Cloud Records"} />
                                <LegendItem color="bg-slate-200" label="Current Day" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Event Sidebar */}
                <div className="lg:col-span-4 h-full">
                    <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-slate-900 overflow-hidden h-full min-h-[500px]">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-white text-lg font-black uppercase tracking-tight font-heading flex items-center gap-3">
                                <Clock className="text-primary" size={20} />
                                {format(date, 'MMM dd, yyyy')}
                            </CardTitle>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
                                {getEventsForDate(date).length} Activities Detected
                            </p>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="space-y-4">
                                {getEventsForDate(date).map((ev, i) => (
                                    <div key={i} className="group relative bg-white/5 border border-white/10 p-5 rounded-[1.5rem] hover:bg-white/10 transition-all duration-300 animate-in fade-in slide-in-from-right-4" style={{ animationDelay: `${i * 100}ms` }}>
                                        <div className="flex flex-col gap-3">
                                            <Badge className={`w-fit text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border-0 ${isAdmin ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary-foreground'}`}>
                                                {ev.user_name}
                                            </Badge>
                                            <h4 className="text-white font-bold text-sm leading-tight line-clamp-2">
                                                {ev.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Clock size={12} className="stroke-[2.5]" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.1em]">
                                                    {format(ev.date, 'HH:mm')} • {ev.type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {getEventsForDate(date).length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                            <AlertCircle className="text-slate-700" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-600">Timeline Empty</p>
                                            <p className="text-slate-500 text-[10px] font-medium mt-1">No recorded activities for this date.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <style>{`
                .modern-calendar {
                    width: 100% !important;
                    border: none !important;
                    font-family: inherit !important;
                }
                .react-calendar__navigation {
                    margin-bottom: 2rem !important;
                    height: 50px !important;
                }
                .react-calendar__navigation button {
                    font-family: 'Outfit', sans-serif !important;
                    font-weight: 900 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.1em !important;
                    font-size: 14px !important;
                    border-radius: 1rem !important;
                    color: #0f172a !important;
                }
                .react-calendar__navigation button:hover {
                    background-color: #f8fafc !important;
                }
                .react-calendar__month-view__weekdays {
                    font-weight: 900 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.15em !important;
                    font-size: 10px !important;
                    color: #94a3b8 !important;
                    margin-bottom: 1rem !important;
                }
                .react-calendar__month-view__weekdays__weekday abbr {
                    text-decoration: none !important;
                }
                .react-calendar__tile {
                    height: 120px !important;
                    padding: 1rem !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    justify-content: flex-start !important;
                    border-radius: 1.5rem !important;
                    transition: all 0.2s ease !important;
                    font-weight: 600 !important;
                    color: #475569 !important;
                    border: 2px solid transparent !important;
                }
                .react-calendar__tile:hover {
                    background-color: #f8fafc !important;
                    transform: scale(0.98);
                }
                .react-calendar__tile--now {
                    background-color: #f1f5f9 !important;
                    font-weight: 900 !important;
                    color: #0f172a !important;
                }
                .react-calendar__tile--active {
                    background-color: white !important;
                    border-color: ${isAdmin ? '#f87171' : 'hsl(var(--primary))'} !important;
                    color: ${isAdmin ? '#ef4444' : 'hsl(var(--primary))'} !important;
                    box-shadow: 0 10px 20px -10px ${isAdmin ? 'rgba(239,68,68,0.3)' : 'rgba(var(--primary-rgb),0.3)'} !important;
                }
                .react-calendar__tile--active:enabled:focus, 
                .react-calendar__tile--active:enabled:hover {
                    background-color: white !important;
                }
                .react-calendar__month-view__days__day--neighboringMonth {
                    color: #e2e8f0 !important;
                }
                
                @media (max-width: 768px) {
                    .react-calendar__tile {
                        height: 80px !important;
                        padding: 0.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
}

function LegendItem({ color, label }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
        </div>
    );
}

