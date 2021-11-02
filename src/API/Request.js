const GetRequest = async (url) => {
    const access_token = localStorage.getItem("access_token");
    // POST request using fetch inside useEffect React hook
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
        },
    };
    return fetch(url, requestOptions).then((response) => response.json()).then((response) => response);
}


export default GetRequest;