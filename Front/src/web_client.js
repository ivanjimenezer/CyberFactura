import axios from "axios"; // Import the axios library for making HTTP requests
//import {useStateContext} from "./context/ContextProvider.jsx";
const backend_url = import.meta.env.VITE_API_BASE_URL;
// Create an axios instance with a custom configuration
const web_client = axios.create({
    baseURL: backend_url, // Set the base URL for API requests
    timeout: 60000,
   // withCredentials: true,
    headers:{
        Accept: '*/*',
        'Content-Type': 'application/vnd.api+json'
    }
});

// Request interceptor to modify outgoing requests before they are sent
web_client.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    config.headers.Authorization = `Bearer ${token}`
    return config;
  })

// Response interceptor to handle responses and errors
web_client.interceptors.response.use((response) => {
    return response
  }, (error) => {
    const {response} = error;
    //console.log("axioslcient: ", error);
    if(error.message == 'Network Error'){
      let customErrorMessage = 'No se puede conectar al servidor. Intentelo de nuevo más tarde.'; 
      // Create a new error with the custom message
      const customError = new Error(customErrorMessage);
      customError.response = error.response;
      customError.request = error.request;
      customError.config = error.config; 
      // Return a rejected promise with the custom error
      return Promise.reject(customError);
    }
    else if (response.status === 401) {
      localStorage.removeItem('ACCESS_TOKEN'); 
      // window.location.reload();
    } else if (response.status === 404) {
      //Show not found
      console.log('not found');
    }
    else if (response.status === 403) {
      //Show not found
      console.log("From axios: ",response.error);
    }
    throw error;
  })

  
  export default web_client // Export the axios instance for use in other parts of the application
