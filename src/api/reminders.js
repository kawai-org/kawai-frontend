import client from './client';

// Helper to normalize ID from various formats
const normalizeId = (item) => {
    return item._id || item.id || item.reminder_id || null;
};

// Helper to check if response indicates error
const checkResponseError = (response) => {
    if (response.data && response.data.status === 'error') {
        throw new Error(response.data.msg || 'Operation failed');
    }
};

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

        // Normalize ID field for each reminder
        reminders = reminders.map(reminder => ({
            ...reminder,
            id: normalizeId(reminder)
        }));

        return reminders;
    } catch (error) {
        console.error("Fetch reminders error:", error.message);
        return [];
    }
};

export const updateReminder = async (id, data) => {
    try {
        // Ensure id is valid
        if (!id || id === 'undefined' || id === 'null') {
            throw new Error('Invalid reminder ID');
        }

        const response = await client.put(`/api/reminders/${id}`, data);

        // Check for backend error response
        checkResponseError(response);

        return response.data;
    } catch (error) {
        console.error("Error updating reminder:", error);
        throw error;
    }
};

export const deleteReminder = async (id) => {
    try {
        // Ensure id is valid
        if (!id || id === 'undefined' || id === 'null') {
            throw new Error('Invalid reminder ID');
        }

        const response = await client.delete(`/api/reminders/${id}`);

        // Check for backend error response
        checkResponseError(response);

        return response.data;
    } catch (error) {
        console.error("Error deleting reminder:", error);
        throw error;
    }
};
