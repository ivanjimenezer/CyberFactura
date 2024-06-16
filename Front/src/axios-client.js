import axios from "axios"; // Import the axios library for making HTTP requests
//import {useStateContext} from "./context/ContextProvider.jsx";
const backend_url = import.meta.env.VITE_API_BASE_URL;
// Create an axios instance with a custom configuration
const axiosClient = axios.create({
    baseURL: backend_url+'/api', // Set the base URL for API requests
    timeout: 60000,
   // withCredentials: true,
    headers:{
        Accept: '*/*', 
    }
});

// Request interceptor to modify outgoing requests before they are sent
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    config.headers.Authorization = `Bearer ${token}`
    return config;
  })

// Response interceptor to handle responses and errors
axiosClient.interceptors.response.use((response) => {
    return response
  }, (error) => {
    const {response} = error;
     //console.log("axioslcient PRINT: ", error);
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
       window.location.reload();
    } else if (response.status === 404) {
      //Show not found
      console.log('not found 404: ', response.error);
    }
    else if (response.status === 403) {
      //Show not found
      console.log("From axios 403: ",response.error);
    }
    else if (response.status === 406) {
       
      console.log("From axios 406 : ",response);
    }
    else if (response.status === 429) { 
      //console.log("From axios 429 : ",response);
      let customErrorMessage = 'Ha realizado demasiadas peticiones. Espere unos minutos';  
      const customError = new Error(customErrorMessage);
      customError.response = error.response;
      customError.request = error.request;
      customError.config = error.config;  
      return Promise.reject(customError);
    }
    else if (response.status === 500) { 
    console.log("From axios 429 : ",response);
      let customErrorMessage = 'Ha ocurrido un error en el servidor. Inténtelo más tarde.';  
      const customError = new Error(customErrorMessage);
      customError.response = error.response;
      customError.request = error.request;
      customError.config = error.config;  
      return Promise.reject(customError);
    }
    throw error;
  })

  
  export default axiosClient // Export the axios instance for use in other parts of the application
