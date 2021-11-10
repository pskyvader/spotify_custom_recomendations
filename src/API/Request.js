const GetRequest = async (url, method="GET", body=null) => {
    const access_token = localStorage.getItem("access_token");
    // POST request using fetch inside useEffect React hook
    const requestOptions = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
        },
        body:body
    };
    return fetch(url, requestOptions).then((response) => {console.log(response):response.json()}).then((response) => response).catch((error)=>console.log(error));
}


export default GetRequest;