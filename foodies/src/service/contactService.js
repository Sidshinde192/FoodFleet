import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const submitContact = async (data) => {
    try {
        const response = await axios.post(
            `${API_URL}/contact`,
            data
        );
        return response;
    } catch (error) {
        throw error;
    }
}


