import endpoints from "../src/endpoints";

export const fetchCoursesAndModulesOfProfessor = (accessToken) => {
    return fetch(endpoints.GET_COURSES_AND_MODULES_OF_PROFESSOR, {
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
            return data;
        })
        .catch((error) => {
            console.error("Error fetching courses and modules:", error);
            alert(error);
            throw error;
        });
};
