import { fetchAPI } from "./client";

export const registerUser = async (name, phoneNumber) => {
    // Body harus match dengan struct User di backend (json tags)
    // Backend: Phone string `json:"phone_number"` Name string `json:"name"`
    return await fetchAPI("/api/signup", "POST", {
        name,
        phone_number: phoneNumber
    });
};

export const loginUser = async (phoneNumber) => {
    // Login di backend kita set pake phone number aja dulu sebagai kredensial
    return await fetchAPI("/api/signin", "POST", {
        phone_number: phoneNumber
    });
};
