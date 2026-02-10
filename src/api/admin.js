import client from "./client";

// Admin authentication is now handled via WhatsApp Magic Link
// These functions are for admin operations after authentication


// Get admin statistics (total_users, active_today, banned_users)
// GET /api/admin/stats
export const getAdminStats = async () => {
    try {
        const response = await client.get("/api/admin/stats");
        let stats = response.data;

        // Unwrap if needed
        if (stats.stats && typeof stats.stats === 'object') {
            stats = stats.stats;
        } else if (stats.data && typeof stats.data === 'object') {
            stats = stats.data;
        }

        return stats;
    } catch (error) {
        console.error("Fetch admin stats error:", error.message);
        return {};
    }
};

// Get all users
// GET /api/admin/users
export const getAllUsers = async () => {
    try {
        const response = await client.get("/api/admin/users");
        let data = response.data;

        if (data.data) {
            data = data.data;
        }

        let users = data.users || data;

        return Array.isArray(users) ? users : [];
    } catch (error) {
        console.error("Fetch users error:", error.message);
        return [];
    }
};

// Ban or unban a user
// POST /api/admin/ban
export const banUser = async (phoneNumber, action = "ban") => {
    const response = await client.post("/api/admin/ban", {
        phone_number: phoneNumber,
        action: action
    });
    return response.data;
};
