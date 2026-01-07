import client from './client';

export const getReminders = async (search = "") => {
    try {
        const url = `/api/dashboard/reminders${search ? `?search=${search}` : ''}`;
        console.log("=== REMINDERS API DEBUG ===");
        console.log("1. Fetching from:", url);

        // Check authentication
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        console.log("2. User info:", {
            phone: user.phone_number,
            name: user.name,
            role: user.role
        });

        const response = await client.get(url);
        console.log("3. Raw Response:", response);
        console.log("4. Response data:", response.data);

        // Handle various response structures
        let reminders = [];

        if (Array.isArray(response.data)) {
            // Direct array
            reminders = response.data;
            console.log("5. Format: Direct array");
        } else if (response.data.data && Array.isArray(response.data.data)) {
            // { data: [...] }
            reminders = response.data.data;
            console.log("5. Format: {data: [...]}");
        } else if (response.data.reminders && Array.isArray(response.data.reminders)) {
            // { reminders: [...] }
            reminders = response.data.reminders;
            console.log("5. Format: {reminders: [...]}");
        } else {
            console.warn("5. Unknown format:", response.data);
            reminders = [];
        }

        console.log("6. Parsed reminders count:", reminders.length);
        console.log("7. First reminder sample:", reminders[0]);
        console.log("=== END REMINDERS DEBUG ===");

        return reminders;
    } catch (error) {
        console.error("=== REMINDERS API ERROR ===");
        console.error("Error:", error.message);
        console.error("Response:", error.response?.data);
        console.error("Status:", error.response?.status);
        console.error("=== END ERROR ===");
        return [];
    }
};

export const updateReminder = async (id, data) => {
    try {
        const response = await client.put(`/api/reminders/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating reminder:", error);
        throw error;
    }
};

export const deleteReminder = async (id) => {
    try {
        const response = await client.delete(`/api/reminders/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting reminder:", error);
        throw error;
    }
};
