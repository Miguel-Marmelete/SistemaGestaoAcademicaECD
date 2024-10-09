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

        // Check if the response is not okay (i.e., status code is not 2xx)
        if (!response.ok) {
            // Attempt to parse the response as JSON
            const errorResponse = await response.json().catch(() => null);
            const errorMessage = errorResponse?.message || response.statusText;
            const errorDetails = errorResponse?.details || "";

            throw new Error(
                `Error: ${response.status}\nMessage: ${errorMessage}\nDetails: ${errorDetails}`
            );
        }

        // Assuming the response is JSON
        const data = await response.json();
        return data;
    } catch (error) {
        // Return the error so it can be handled where customFetch is called
        return Promise.reject(error.message);
    }
};
export default customFetch;
