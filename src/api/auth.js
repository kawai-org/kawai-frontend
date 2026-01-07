import client from "./client";

// Admin Login only. User login is handled via Magic Link (frontend directly).
export const loginAdmin = async (username, password) => {
    try {
        const response = await client.post("/api/admin/login", {
            username,
            phone_number: username, // Send both to handle potential backend inconsistency
            password
        });
        return response.data;
    } catch (error) {
        console.error("Admin Login error:", error);
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await client.post("/api/register", userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};



// "User Login" via phone input is DEPRECATED in favor of Magic Link.
// However, we keep a stub or remove it. I will remove it to avoid confusion,
// as the UI no longer uses it for real login.
