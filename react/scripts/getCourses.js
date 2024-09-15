import endpoints from "../src/endpoints";

export const fetchCourses = (accessToken) => {
    return fetch(endpoints.GET_COURSES, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((errorData) => {
                    throw new Error(errorData.details);
                });
            }
            return response.json();
        })
        .then((data) => {
            console.log("API response:", data);
            return data.courses;
        })
        .catch((error) => {
            console.error("Error fetching courses:", error);
            alert(error);
            throw error;
        });
};
