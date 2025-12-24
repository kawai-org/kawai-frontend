import { fetchAPI } from "./client";

export const getChatHistory = async (phoneNumber) => {
    return await fetchAPI(`/api/history?phone=${phoneNumber}`, "GET");
};

export const getDashboardData = async (phoneNumber) => {
    return await fetchAPI(`/api/dashboard?phone=${phoneNumber}`, "GET");
};

export const sendMessage = async (phoneNumber, message) => {
    return await fetchAPI("/api/chat", "POST", { phone: phoneNumber, message });
};
