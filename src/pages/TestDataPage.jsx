import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TestDataPage() {
    const [testResults, setTestResults] = useState([]);

    const testMongoDBFormat = () => {
        console.log("=== TESTING MONGODB FORMAT ===");

        // Test data dengan format MongoDB yang user berikan
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
                type: 'Note',
                success: true,
                data: {
                    id: noteId,
                    content: note.content,
                    date: noteDate.toLocaleDateString(),
                    type: note.type
                }
            });
            console.log("✅ Note parsed:", { id: noteId, date: noteDate });
        } catch (error) {
            results.push({ type: 'Note', success: false, error: error.message });
            console.error("❌ Note parse error:", error);
        }

        // Test Reminders
        try {
            const reminder = mockReminders[0];
            const reminderId = reminder._id.$oid || reminder._id;
            const reminderDate = new Date(reminder.scheduled_time.$date || reminder.scheduled_time);
            results.push({
                type: 'Reminder',
                success: true,
                data: {
                    id: reminderId,
                    title: reminder.title,
                    date: reminderDate.toLocaleDateString(),
                    time: reminderDate.toLocaleTimeString(),
                    status: reminder.status
                }
            });
            console.log("✅ Reminder parsed:", { id: reminderId, date: reminderDate });
        } catch (error) {
            results.push({ type: 'Reminder', success: false, error: error.message });
            console.error("❌ Reminder parse error:", error);
        }

        // Test Links
        try {
            const link = mockLinks[0];
            const linkId = link._id.$oid || link._id;
            const linkDate = new Date(link.created_at.$date || link.created_at);
            results.push({
                type: 'Link',
                success: true,
                data: {
                    id: linkId,
                    url: link.url,
                    date: linkDate.toLocaleDateString()
                }
            });
            console.log("✅ Link parsed:", { id: linkId, url: link.url });
        } catch (error) {
            results.push({ type: 'Link', success: false, error: error.message });
            console.error("❌ Link parse error:", error);
        }

        console.log("=== TEST RESULTS ===", results);
        setTestResults(results);
    };

    const checkAuth = () => {
        console.log("=== CHECKING AUTHENTICATION ===");
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        console.log("Token:", token ? `${token.substring(0, 20)}...` : 'NOT FOUND');
        console.log("User:", user);
        console.log("User Phone:", user.phone_number);
        console.log("User Name:", user.name);
        console.log("User Role:", user.role);

        alert(`Token: ${token ? 'EXISTS' : 'NOT FOUND'}\nPhone: ${user.phone_number || 'NOT FOUND'}`);
    };

    return (
        <div className="space-y-6 p-6">
            <Card>
                <CardHeader>
                    <CardTitle>🔧 Data Format Testing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        <Button onClick={testMongoDBFormat}>
                            Test MongoDB Format
                        </Button>
                        <Button onClick={checkAuth} variant="outline">
                            Check Authentication
                        </Button>
                    </div>

                    {testResults.length > 0 && (
                        <div className="mt-6 space-y-2">
                            <h3 className="font-semibold">Test Results:</h3>
                            {testResults.map((result, i) => (
                                <div key={i} className={`p-3 rounded ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                    <div className="font-medium">{result.success ? '✅' : '❌'} {result.type}</div>
                                    {result.success ? (
                                        <pre className="text-xs mt-2">{JSON.stringify(result.data, null, 2)}</pre>
                                    ) : (
                                        <div className="text-red-600 text-sm">{result.error}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>📋 Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><strong>1. Click "Check Authentication"</strong> - Verify token exists</p>
                    <p><strong>2. Click "Test MongoDB Format"</strong> - Verify data parsing works</p>
                    <p><strong>3. Open Console (F12)</strong> - Check detailed logs</p>
                    <p><strong>4. Go to Notes/Reminders page</strong> - Check API response</p>
                    <p className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <strong>⚠️ If array is still empty:</strong><br />
                        The problem is in the BACKEND, not frontend. Backend is not returning data for this user's phone number.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
