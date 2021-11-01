import {
    useEffect
} from "react";

const Me = async () => {
    //return useEffect(() => {
        const access_token = localStorage.getItem("access_token");
        // POST request using fetch inside useEffect React hook
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + access_token,
            },
        };
        return fetch("https://api.spotify.com/v1/me", requestOptions)
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                return response;
            });
    //}, []);
}

export default Me;