import client from './client';

export const getNotes = async (search = "") => {
    try {
        const url = `/api/dashboard/notes${search ? `?search=${search}` : ''}`;
        console.log("=== NOTES API DEBUG ===");
        console.log("1. Fetching from:", url);

        // Check authentication - DETAILED
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        const user = JSON.parse(userStr || '{}');

        console.log("2. LocalStorage check:");
        console.log("   - Token exists:", !!token);
        console.log("   - Token preview:", token ? token.substring(0, 30) + '...' : 'NONE');
        console.log("   - User object:", user);
        console.log("   - User phone_number:", user.phone_number);
        console.log("   - User username:", user.username);
        console.log("   - User name:", user.name);
        console.log("   - User role:", user.role);

        // Make request
        const response = await client.get(url);
        console.log("3. Raw Response:", response);
        console.log("4. Response data:", response.data);
        console.log("5. Response status:", response.status);

        // Parse response
        let notes = [];

        if (Array.isArray(response.data)) {
            notes = response.data;
            console.log("6. Format: Direct array");
        } else if (response.data.data && Array.isArray(response.data.data)) {
            notes = response.data.data;
            console.log("6. Format: {data: [...]}");
        } else if (response.data.notes && Array.isArray(response.data.notes)) {
            notes = response.data.notes;
            console.log("6. Format: {notes: [...]}");
        } else {
            console.warn("6. Unknown format:", response.data);
            notes = [];
        }

        console.log("7. Parsed notes count:", notes.length);
        console.log("8. First note sample:", notes[0]);

        // If still empty, check if it's a backend issue
        if (notes.length === 0) {
            console.error("⚠️ BACKEND RETURNED EMPTY ARRAY!");
            console.error("Possible causes:");
            console.error("1. JWT token doesn't contain phone_number in claims");
            console.error("2. Backend query filter is wrong");
            console.error("3. No notes exist for this user's phone number");
            console.error("4. Backend authentication issue");

            // Try to decode JWT to see claims
            if (token) {
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    const claims = JSON.parse(jsonPayload);
                    console.error("JWT Claims:", claims);
                    console.error("Does JWT have phone_number?", 'phone_number' in claims);
                    console.error("Does JWT have phone?", 'phone' in claims);
                    console.error("Does JWT have user_phone?", 'user_phone' in claims);
                } catch (e) {
                    console.error("Failed to decode JWT:", e);
                }
            }
        }

        console.log("=== END NOTES DEBUG ===");
        return notes;
    } catch (error) {
        console.error("=== NOTES API ERROR ===");
        console.error("Error:", error.message);
        console.error("Response:", error.response?.data);
        console.error("Status:", error.response?.status);
        console.error("Headers:", error.response?.headers);
        console.error("=== END ERROR ===");
        return [];
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
