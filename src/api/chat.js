import client from './client';

export const getChatHistory = async (phone) => {
    const response = await client.get(`/api/chat/history?phone=${phone}`);
    return response.data;
};

export const sendMessage = async (messageData) => {
    const response = await client.post('/api/chat/send', messageData);
    return response.data;
};

export const getDashboardData = async (phoneNumber) => {
    const response = await client.get(`/api/dashboard?phone=${phoneNumber}`);
    // Robust unwrapping
    return response.data?.data || response.data;
};
