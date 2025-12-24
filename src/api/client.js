export const API_BASE_URL = "https://kawai-be.vercel.app"; // Sesuaikan port backend Go kamu

export const fetchAPI = async (endpoint, method = "GET", body = null) => {
    const headers = {
        "Content-Type": "application/json",
    };

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.Response || "Something went wrong");
        }

        return data;
    } catch (error) {
        throw error;
    }
};
