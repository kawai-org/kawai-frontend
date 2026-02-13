import client from './client';

// Backend doesn't have /api/dashboard/links endpoint
// Links are stored separately in 'links' collection but no API endpoint exists
// We need to extract links from notes with type='mixed' as a workaround
export const getLinks = async (search = "") => {
    try {
        // Get notes first, then filter for mixed type (contains links)
        const response = await client.get(`/api/dashboard/notes${search ? `?search=${search}` : ''}`);
        console.log("Notes Response (for links):", response.data);

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

            return {
                _id: note._id || note.id,
                note_id: note._id || note.id,
                user_phone: note.user_phone,
                url: url,
                created_at: note.created_at,
                // Keep original note content for reference
                note_content: note.content
            };
        }).filter(link => link.url); // Only keep items with valid URLs

        console.log("Parsed Links from Notes:", links);
        return links;
    } catch (error) {
        console.error("Error fetching links:", error);
        return [];
    }
};

export const deleteLink = async (id) => {
    try {
        // Since links are tied to notes, we delete the note
        const response = await client.delete(`/api/notes/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting link:", error);
        throw error;
    }
};

