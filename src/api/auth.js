import client from "./client";

// Register new user
// Register new user
export const registerUser = async (userData) => {
    try {
        const response = await client.post("/api/register", {
            name: userData.name,
            phone_number: userData.phone_number,
            password: userData.password,
            secret_code: userData.secret_code || ""
        });
        return response.data;
    } catch (error) {
        console.error("Register API Error:", error);
        // Re-throw with better error info
        if (error.response) {
            throw {
                message: error.response.data?.msg || error.response.data?.message || "Registration failed",
                status: error.response.status
            };
        }
        throw { message: "Network error. Please check your connection." };
    }
};
