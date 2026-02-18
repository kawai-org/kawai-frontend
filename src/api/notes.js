import client from './client';

// Helper to normalize ID from various formats
const normalizeId = (item) => {
    return item._id || item.id || item.note_id || null;
};

// Helper to check if response indicates error
const checkResponseError = (response) => {
    if (response.data && response.data.status === 'error') {
        throw new Error(response.data.msg || 'Operation failed');
    }
};

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

        // Normalize ID field for each note
        notes = notes.map(note => ({
            ...note,
            id: normalizeId(note)
        }));

        return notes;
    } catch (error) {
        console.error("Fetch notes error:", error.message);
        return [];
    }
};


export const updateNote = async (id, content) => {
    try {
        // Ensure id is valid
        if (!id || id === 'undefined' || id === 'null') {
            throw new Error('Invalid note ID');
        }

        const response = await client.put(`/api/notes/${id}`, { content });

        // Check for backend error response
        checkResponseError(response);

        return response.data;
    } catch (error) {
        console.error("Error updating note:", error);
        throw error;
    }
};

export const deleteNote = async (id) => {
    try {
        // Ensure id is valid
        if (!id || id === 'undefined' || id === 'null') {
            throw new Error('Invalid note ID');
        }

        const response = await client.delete(`/api/notes/${id}`);

        // Check for backend error response
        checkResponseError(response);

        return response.data;
    } catch (error) {
        console.error("Error deleting note:", error);
        throw error;
    }
};

export const getNoteDetail = async (id) => {
    try {
        // Ensure id is valid
        if (!id || id === 'undefined' || id === 'null') {
            throw new Error('Invalid note ID');
        }

        const response = await client.get(`/api/notes/detail/${id}`);

        // Check for backend error response
        checkResponseError(response);

        return response.data;
    } catch (error) {
        console.error("Error fetching note detail:", error);
        throw error;
    }
};
