export const COHERE_KEY = "cohere-token";

const getHeaders = () => ({
    Authorization: `bearer ${getToken()}`,
    "Content-Type": "application/json",
    Accept: "application/json",
});

export async function validateToken(token?: string): Promise<boolean> {
    if (!token) token = <string | undefined>localStorage.getItem(COHERE_KEY);
    if (!token) return false;

    if (!token || !(await (await fetch("https://api.cohere.ai/v1/check-api-key", { headers: { ...getHeaders(), Authorization: `bearer ${token}` }, method: "POST" })).json()).valid) {
        console.log("Invalid API key");
        console.log("Please enter a valid API key");
        return false;
    }

    return true;
}

export async function saveToken(hook: string): Promise<void> {
    return localStorage.setItem(COHERE_KEY, hook);
}

export function getToken() {
    return localStorage.getItem(COHERE_KEY);
}
