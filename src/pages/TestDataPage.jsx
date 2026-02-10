import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Terminal, Database, ShieldCheck, Info, CheckCircle2, XCircle, AlertTriangle, Code2 } from "lucide-react";
import Swal from 'sweetalert2';

export default function TestDataPage() {
    const [testResults, setTestResults] = useState([]);

    const testMongoDBFormat = () => {
        const mockNotes = [
            {
                "_id": { "$oid": "694571978ba0344589dd699a" },
                "user_phone": "6285793766959",
                "original": "Simpan materi kuliah di https://google.com #penting",
                "content": "materi kuliah di https://google.com #penting",
                "type": "mixed",
                "created_at": { "$date": "2025-12-19T15:39:03.092Z" }
            }
        ];

        const mockReminders = [
            {
                "_id": { "$oid": "6954b4c4e7b65866f73e89c2" },
                "user_phone": "6285793766959",
                "title": "Angkat jemuran",
                "scheduled_time": { "$date": "2025-12-31T05:39:40.966Z" },
                "status": "sent"
            }
        ];

        const mockLinks = [
            {
                "_id": { "$oid": "694571978ba0344589dd699b" },
                "note_id": { "$oid": "694571978ba0344589dd699a" },
                "user_phone": "6285793766959",
                "url": "https://google.com",
                "created_at": { "$date": "2025-12-19T15:39:03.324Z" }
            }
        ];

        const results = [];

        // Test Notes
        try {
            const note = mockNotes[0];
            const noteId = note._id.$oid || note._id;
            const noteDate = new Date(note.created_at.$date || note.created_at);
            results.push({
                type: 'Note Parser',
                success: true,
                data: { id: noteId, content: note.content, date: noteDate.toLocaleDateString(), type: note.type }
            });
        } catch (error) {
            results.push({ type: 'Note Parser', success: false, error: error.message });
        }

        // Test Reminders
        try {
            const reminder = mockReminders[0];
            const reminderId = reminder._id.$oid || reminder._id;
            const reminderDate = new Date(reminder.scheduled_time.$date || reminder.scheduled_time);
            results.push({
                type: 'Reminder Parser',
                success: true,
                data: { id: reminderId, title: reminder.title, date: reminderDate.toLocaleDateString(), time: reminderDate.toLocaleTimeString(), status: reminder.status }
            });
        } catch (error) {
            results.push({ type: 'Reminder Parser', success: false, error: error.message });
        }

        // Test Links
        try {
            const link = mockLinks[0];
            const linkId = link._id.$oid || link._id;
            const linkDate = new Date(link.created_at.$date || link.created_at);
            results.push({
                type: 'Link Parser',
                success: true,
                data: { id: linkId, url: link.url, date: linkDate.toLocaleDateString() }
            });
        } catch (error) {
            results.push({ type: 'Link Parser', success: false, error: error.message });
        }

        setTestResults(results);
    };

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        Swal.fire({
            title: 'Auth Vector Status',
            html: `
                <div class="text-left space-y-3 p-2 font-mono text-[11px]">
                    <div class="bg-slate-900 text-green-400 p-4 rounded-xl border border-white/10">
                        <p class="text-white/40 uppercase font-black tracking-widest text-[9px] mb-2">Token Signal</p>
                        <p class="truncate">${token ? token.substring(0, 40) + '...' : 'NOT_FOUND'}</p>
                    </div>
                    <div class="bg-slate-900 text-primary p-4 rounded-xl border border-white/10">
                        <p class="text-white/40 uppercase font-black tracking-widest text-[9px] mb-2">User Identity</p>
                        <ul class="space-y-1">
                            <li>PHONE: ${user.phone_number || 'NULL'}</li>
                            <li>NAME : ${user.name || 'NULL'}</li>
                            <li>ROLE : ${user.role || 'NULL'}</li>
                        </ul>
                    </div>
                </div>
            `,
            confirmButtonText: 'Synchronized',
            confirmButtonColor: 'hsl(var(--primary))',
            customClass: { popup: 'rounded-[2rem] p-8', confirmButton: 'rounded-xl h-11 px-8 uppercase text-[10px] font-black tracking-widest' }
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase font-heading flex items-center gap-3">
                        System <span className="text-gradient">Diagnostics</span>
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Data Integrity & API Response Validation
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button onClick={testMongoDBFormat} className="h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200">
                        <Database size={16} className="mr-2" /> Run Data Test
                    </Button>
                    <Button onClick={checkAuth} variant="outline" className="h-11 rounded-2xl border-slate-200 font-black uppercase text-[10px] tracking-widest transition-all hover:bg-slate-50">
                        <ShieldCheck size={16} className="mr-2 text-primary" /> Auth Check
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Diagnostics Output */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center gap-3">
                                <Terminal className="text-primary" size={20} />
                                <CardTitle className="text-lg font-black uppercase tracking-tight">Execution Logs</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            {testResults.length > 0 ? (
                                <div className="space-y-4">
                                    {testResults.map((result, i) => (
                                        <div key={i} className={`group relative p-6 rounded-[2rem] border transition-all duration-300 ${result.success ? 'bg-green-50/30 border-green-100 hover:bg-green-50' : 'bg-red-50/30 border-red-100'}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    {result.success ? <CheckCircle2 className="text-green-500" size={18} /> : <XCircle className="text-red-500" size={18} />}
                                                    <span className="font-black uppercase tracking-widest text-[11px] text-slate-800">{result.type}</span>
                                                </div>
                                                <Badge className={`text-[9px] font-black uppercase border-0 ${result.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    {result.success ? 'Passed' : 'Failed'}
                                                </Badge>
                                            </div>
                                            {result.success ? (
                                                <div className="bg-slate-900/5 rounded-2xl p-4">
                                                    <pre className="text-[11px] font-mono text-slate-600 overflow-x-auto">
                                                        {JSON.stringify(result.data, null, 2)}
                                                    </pre>
                                                </div>
                                            ) : (
                                                <p className="text-red-600 text-[11px] font-bold bg-white p-4 rounded-xl border border-red-50 italic">
                                                    Error Vector: {result.error}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                        <Code2 size={32} className="text-slate-300" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Idle State - Waiting for Signal</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Technical Overview */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] bg-amber-50/50 overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center gap-3">
                                <Info className="text-amber-500" size={20} />
                                <CardTitle className="text-lg font-black uppercase tracking-tight">System Intel</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-4">
                            <DiagnosticStep number="01" label="AUTHENTICATION" desc="Ensure JWT handshake completes and identity is cached in browser storage." />
                            <DiagnosticStep number="02" label="JSON PARSING" desc="Validate MongoDB specific object formats ($oid, $date) map to app models." />
                            <DiagnosticStep number="03" label="API INTEGRITY" desc="Final verification of payload structures before data binding occurs." />

                            <div className="mt-8 p-6 bg-amber-100/50 rounded-3xl border border-amber-200/50">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="text-amber-600 shrink-0 mt-1" size={16} />
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-tight text-amber-900 leading-none mb-2">Backend Alert</p>
                                        <p className="text-[10px] font-medium text-amber-700/80 leading-relaxed">
                                            Empty diagnostic results typically indicate a backend filtration issue. Verify phone number mapping in the core API.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function DiagnosticStep({ number, label, desc }) {
    return (
        <div className="group flex gap-4">
            <span className="text-xl font-black text-amber-200 group-hover:text-amber-400 transition-colors leading-none">{number}</span>
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-800 leading-none">{label}</p>
                <p className="text-[10px] font-medium text-slate-500 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

