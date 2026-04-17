const API_URL = "http://192.168.100.176:3000/api";

export const sendScore = async(token, data) => {
    try {
        const res = await fetch(`${API_URL}/performances`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        return await res.json();
    } catch (err) {
        console.log("score error", err);
    }
};