import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, FileText, Link as LinkIcon, Calendar as CalendarIcon } from 'lucide-react';
import { getDashboardData } from "@/api/chat";
import { format, isSameDay, parseISO } from 'date-fns';

export default function CalendarPage() {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        const loadEvents = async () => {
            if (user.phone_number) {
                try {
                    const data = await getDashboardData(user.phone_number);
                    const notes = data.notes || [];
                    const links = data.links || [];

                    // Transform Notes & Links into "Activity Events"
                    // 1. Note Creation Events
                    const noteEvents = notes.map(n => ({
                        date: new Date(n.created_at || Date.now()),
                        title: `Created Note: "${n.content.substring(0, 20)}..."`,
                        type: 'note'
                    }));

                    // 2. Link Creation Events
                    const linkEvents = links.map(l => ({
                        date: new Date(l.created_at || Date.now()),
                        title: `Saved Link: ${l.content.substring(0, 20)}...`,
                        type: 'link'
                    }));

                    // 3. "Meeting" Parser (Mockup Logic for "Jadwal")
                    // If note contains "meeting", "jadwal", "acara" -> Mark as Schedule
                    const scheduleEvents = notes
                        .filter(n => /meeting|jadwal|acara/i.test(n.content))
                        .map(n => ({
                            date: new Date(n.created_at || Date.now()), // Ideally verify if note HAS a future date string
                            title: `SCHEDULE: ${n.content}`,
                            type: 'schedule'
                        }));

                    setEvents([...noteEvents, ...linkEvents, ...scheduleEvents]);
                } catch (error) {
                    console.error("Failed to load calendar data", error);
                }
            }
        };
        loadEvents();
    }, [user.phone_number]);

    const getEventsForDate = (d) => {
        return events.filter(e => isSameDay(e.date, d));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Activity Calendar</h1>
                <p className="text-muted-foreground">Track your notes, links, and scheduled activities.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-border/40 shadow-sm h-fit">
                    <CardContent className="p-6">
                        <div className="calendar-wrapper">
                            <Calendar
                                onChange={setDate}
                                value={date}
                                tileContent={({ date, view }) => {
                                    if (view === 'month') {
                                        const dayEvents = getEventsForDate(date);
                                        if (dayEvents.length > 0) {
                                            // Show dots for events
                                            return (
                                                <div className="flex justify-center mt-1 gap-1 flex-wrap max-w-[2rem] mx-auto">
                                                    {dayEvents.slice(0, 3).map((ev, i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-1.5 h-1.5 rounded-full ${ev.type === 'note' ? 'bg-blue-400' :
                                                                    ev.type === 'link' ? 'bg-green-400' : 'bg-purple-500'
                                                                }`}
                                                        />
                                                    ))}
                                                    {dayEvents.length > 3 && <span className="text-[6px] leading-none text-gray-400">+</span>}
                                                </div>
                                            )
                                        }
                                    }
                                }}
                                className="w-full border-none font-sans"
                            />
                        </div>
                        <div className="mt-6 flex gap-4 justify-center text-xs text-muted-foreground">
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400"></div> Note</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-400"></div> Link</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Schedule/Event</div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="h-full border-border/40">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CalendarIcon size={18} />
                                Activity on {format(date, 'MMM dd, yyyy')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {getEventsForDate(date).map((ev, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-right-2" style={{ animationDelay: `${i * 100}ms` }}>
                                        <div className={`mt-1 bg-white p-1.5 rounded-lg shadow-sm ${ev.type === 'note' ? 'text-blue-500' :
                                                ev.type === 'link' ? 'text-green-500' : 'text-purple-500'
                                            }`}>
                                            {ev.type === 'note' && <FileText size={14} />}
                                            {ev.type === 'link' && <LinkIcon size={14} />}
                                            {ev.type === 'schedule' && <CalendarIcon size={14} />}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-medium text-sm truncate w-full">{ev.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className={`text-[10px] h-5 px-1.5 capitalize ${ev.type === 'note' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                                                        ev.type === 'link' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-purple-100 text-purple-700 hover:bg-purple-100'
                                                    }`}>
                                                    {ev.type}
                                                </Badge>
                                                <span className="text-[10px] text-muted-foreground">{format(ev.date, 'HH:mm')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {getEventsForDate(date).length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground text-sm flex flex-col items-center">
                                        <AlertCircle className="w-10 h-10 mb-3 opacity-20" />
                                        No activity recorded for this day.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <style>{`
                .react-calendar { 
                    width: 100%; 
                    background: white; 
                    border: none; 
                    font-family: inherit;
                }
                .react-calendar__tile {
                    padding: 1.5em 0.5em;
                    height: 100px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                }
                .react-calendar__month-view__days__day--weekend {
                    color: #ef4444;
                }
                .react-calendar__tile--active {
                    background: #fdf2f8 !important;
                    color: var(--primary) !important;
                    border: 2px solid var(--primary);
                    border-radius: 12px;
                }
                .react-calendar__tile--now {
                    background: #f3f4f6;
                    border-radius: 12px;
                }
                .react-calendar__navigation button {
                    font-size: 1.2rem;
                    font-weight: bold;
                }
                .react-calendar abbr {
                    text-decoration: none;
                }
            `}</style>
        </div>
    );
}
