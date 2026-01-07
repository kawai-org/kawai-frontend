import client from "./client";

// Admin Login - POST /api/admin/login
export const loginAdmin = async (username, password) => {
    try {
        const response = await client.post("/api/admin/login", {
            username,
            password
        });
        console.log("Admin Login Response:", response.data);

        // Response should contain token
        const data = response.data?.data || response.data;
        return data;
    } catch (error) {
        console.error("Admin login error:", error);
        throw error;
    }
};

// Get admin statistics (total_users, active_today, banned_users)
// GET /api/admin/stats
export const getAdminStats = async () => {
    const response = await client.get("/api/admin/stats");
    console.log("Admin Stats Response:", response.data);

    // Handle multiple response structures:
    // Backend returns: { stats: { total_users: X, ... }, status: "success" }
    let stats = response.data;

    // If wrapped in a stats property, unwrap it
    if (stats.stats && typeof stats.stats === 'object') {
        stats = stats.stats;
    }
    // If wrapped in a data property, unwrap it
    else if (stats.data && typeof stats.data === 'object') {
        stats = stats.data;
    }

    console.log("Parsed Stats:", stats);
    return stats;
};

// Get all users
// GET /api/admin/users
export const getAllUsers = async () => {
    const response = await client.get("/api/admin/users");
    console.log("Admin Users Response:", response.data);

    // Backend returns: { data: Array(5), status: "success" }
    let data = response.data;

    // If wrapped in a data property, unwrap it
    if (data.data) {
        data = data.data;
    }

    // If users array is nested, extract it
    let users = data.users || data;

    // Ensure we return an array
    if (!Array.isArray(users)) {
        console.warn("Users data is not an array:", users);
        users = [];
    }

    console.log("Parsed Users:", users);
    return users;
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
