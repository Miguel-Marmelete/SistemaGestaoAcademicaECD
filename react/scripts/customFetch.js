// customFetch.js

const customFetch = async (
    endpoint,
    accessTokenData,
    setAccessTokenData,
    method = "GET",
    body = null
) => {
    const token = accessTokenData.access_token;

    try {
        const response = await fetch(endpoint, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: body ? JSON.stringify(body) : null,
        });

        // Check if a new token is in the response headers
        const newToken = response.headers.get("Authorization");
        if (newToken && newToken.startsWith("Bearer ")) {
            const extractedToken = newToken.split(" ")[1];
            console.log("extractedToken", extractedToken);

            // Update token in AuthContext
            setAccessTokenData((prevData) => ({
                ...prevData,
                access_token: extractedToken,
            }));

            // Update token in sessionStorage
            const updatedTokenData = {
                ...accessTokenData,
                access_token: extractedToken,
            };
            sessionStorage.setItem(
                "tokenData",
                JSON.stringify(updatedTokenData)
            );
        }

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json(); // Assuming the response is JSON
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

export default customFetch;
