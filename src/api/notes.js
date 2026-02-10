import client from './client';

export const getNotes = async (search = "") => {
    try {
        const url = `/api/dashboard/notes${search ? `?search=${search}` : ''}`;
        const response = await client.get(url);

        // Parse response
        let notes = [];

        if (Array.isArray(response.data)) {
            notes = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
            notes = response.data.data;
        } else if (response.data.notes && Array.isArray(response.data.notes)) {
            notes = response.data.notes;
        } else {
            notes = [];
        }

        return notes;
    } catch (error) {
        console.error("Fetch notes error:", error.message);
        return [];
    }
};

export const createNote = async (content, type = "text") => {
    try {
        const response = await client.post("/api/notes", { content, type });
        return response.data;
    } catch (error) {
        console.error("Create note error:", error);
        throw error;
    }
};

export const updateNote = async (id, content) => {
    try {
        const response = await client.put(`/api/notes/${id}`, { content });
        return response.data;
    } catch (error) {
        console.error("Error updating note:", error);
        throw error;
    }
};

export const deleteNote = async (id) => {
    try {
        const response = await client.delete(`/api/notes/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting note:", error);
        throw error;
    }
};

export const getNoteDetail = async (id) => {
    try {
        const response = await client.get(`/api/notes/detail/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching note detail:", error);
        throw error;
    }
};
