const API_BASE_URL = "http://localhost:5000/api";


/*
|--------------------------------------------------------------------------
| CENTRAL API REQUEST
|--------------------------------------------------------------------------
*/

async function apiRequest(endpoint, options = {}) {

    const token = localStorage.getItem("token");

    const config = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    };


    // Attach JWT if the user is logged in
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }


    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        config
    );


    /*
    |--------------------------------------------------------------------------
    | Handle empty response
    |--------------------------------------------------------------------------
    */

    if (response.status === 204) {
        return null;
    }


    /*
    |--------------------------------------------------------------------------
    | Convert response to JSON
    |--------------------------------------------------------------------------
    */

    const data = await response.json();


    /*
    |--------------------------------------------------------------------------
    | Handle backend errors
    |--------------------------------------------------------------------------
    */

    if (!response.ok) {

        throw new Error(
            data.message ||
            data.error ||
            "Something went wrong."
        );

    }


    return data;
}


/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
*/

async function apiGet(endpoint) {

    return apiRequest(endpoint, {
        method: "GET"
    });

}


/*
|--------------------------------------------------------------------------
| POST
|--------------------------------------------------------------------------
*/

async function apiPost(endpoint, data) {

    return apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(data)
    });

}


/*
|--------------------------------------------------------------------------
| PUT
|--------------------------------------------------------------------------
*/

async function apiPut(endpoint, data) {

    return apiRequest(endpoint, {
        method: "PUT",
        body: JSON.stringify(data)
    });

}


/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

async function apiDelete(endpoint) {

    return apiRequest(endpoint, {
        method: "DELETE"
    });

}