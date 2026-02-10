import client from './client';

export const getReminders = async (search = "") => {
    try {
        const url = `/api/dashboard/reminders${search ? `?search=${search}` : ''}`;
        const response = await client.get(url);

        // Handle various response structures
        let reminders = [];

        if (Array.isArray(response.data)) {
            reminders = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
            reminders = response.data.data;
        } else if (response.data.reminders && Array.isArray(response.data.reminders)) {
            reminders = response.data.reminders;
        } else {
            reminders = [];
        }

        return reminders;
    } catch (error) {
        console.error("Fetch reminders error:", error.message);
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
