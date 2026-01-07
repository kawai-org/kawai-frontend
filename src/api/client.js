import axios from 'axios';

const client = axios.create({
    baseURL: "https://kawai-be.vercel.app",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const activeToken = token || user.token;

        if (activeToken) {
            config.headers.Authorization = `Bearer ${activeToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default client;
