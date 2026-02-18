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

// Backend doesn't have /api/dashboard/links endpoint
// Links are stored separately in 'links' collection but no API endpoint exists
// We need to extract links from notes with type='mixed' as a workaround
export const getLinks = async (search = "") => {
    try {
        // Get notes first, then filter for mixed type (contains links)
        const response = await client.get(`/api/dashboard/notes${search ? `?search=${search}` : ''}`);

        // Check for backend error response
        checkResponseError(response);

        // Handle various response structures
        const data = response.data?.data || response.data;
        const notes = Array.isArray(data) ? data : (data.notes || []);

        // Filter notes that contain links (type='mixed' or content contains http)
        const notesWithLinks = notes.filter(note =>
            note.type === 'mixed' ||
            (note.content && (note.content.includes('http://') || note.content.includes('https://')))
        );

        // Extract URLs from notes and create link objects
        const links = notesWithLinks.map(note => {
            // Extract first URL from content
            const urlMatch = note.content?.match(/(https?:\/\/[^\s]+)/);
            const url = urlMatch ? urlMatch[0] : '';
            const normalizedId = normalizeId(note);

            return {
                _id: normalizedId,
                id: normalizedId,
                note_id: normalizedId,
                user_phone: note.user_phone,
                url: url,
                created_at: note.created_at,
                // Keep original note content for reference
                note_content: note.content
            };
        }).filter(link => link.url); // Only keep items with valid URLs

        return links;
    } catch (error) {
        console.error("Error fetching links:", error);
        return [];
    }
};

export const deleteLink = async (id) => {
    try {
        // Ensure id is valid
        if (!id || id === 'undefined' || id === 'null') {
            throw new Error('Invalid link ID');
        }

        // Since links are tied to notes, we delete the note
        const response = await client.delete(`/api/notes/${id}`);

        // Check for backend error response
        checkResponseError(response);

        return response.data;
    } catch (error) {
        console.error("Error deleting link:", error);
        throw error;
    }
};

