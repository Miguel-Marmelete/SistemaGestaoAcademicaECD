import endpoints from "../src/endpoints";

export const fetchProfessors = (accessToken) => {
    return fetch(endpoints.GET_PROFESSORS, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch professors");
            }
            return response.json();
        })
        .then((data) => {
            console.log("API response:", data);
            return data.professors;
        })
        .catch((error) => {
            console.error("Error fetching professors:", error);
            alert(error);
            throw error;
        });
};
