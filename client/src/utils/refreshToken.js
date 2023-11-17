const refreshToken = async () => {
    try {
        
        const res = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
        });

        if (res.ok) {
            const data = await res.json();
            return data.accessToken;
        } else {
            throw new Error("Error in calling refreshing token");
        }

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export default refreshToken;