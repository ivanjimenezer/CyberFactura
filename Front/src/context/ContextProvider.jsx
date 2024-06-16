import { createContext, useContext, useState } from "react"; // Import necessary functions from React
// Importing Functions: This line brings in necessary functions from React, a library for building user interfaces in JavaScript.
// The functions imported are createContext, useContext, and useState. These functions help us manage state and context in our application.

// Create a context to manage the application state
const StateContext = createContext({
    user: null,
    token: null,
    isAdmin: false,
    setUser: () => { }, // Function to update the user state
    setToken: () => { }, // Function to update the token state 
    setNotification: () => { }  
});
// Creating Context: We create a context called StateContext. 
//Think of a context like a global storage space where we can put values and functions that need to be accessible across 
//different parts of our app.

// ContextProvider component to manage the state and provide it to the children components
export const ContextProvider = ({ children }) => {
    //seting a string
    const [user, _setUser] = useState(localStorage.getItem('USER_DATA'));
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [notification, _setNotification] = useState('');
    // Parse the user string into a JSON object
    const parsedUser = user ? JSON.parse(user) : null;
    // Determine the isAdmin value based on the parsed user object
    let isAdmin = parsedUser && parsedUser.type === 'admin';


    const setUser = (userData) => {
        console.log("handleSetUser: ", userData)
        _setUser(userData ? JSON.stringify(userData) : null);
        isAdmin = userData ? userData.type === 'admin' : false;
        if (userData) { 
            localStorage.setItem('USER_DATA', JSON.stringify(userData)); 
        } else {
            localStorage.removeItem('USER_DATA');
        }
    
        
    };
    // Function to set token and update local storage accordingly
    const setToken = (token) => {
        _setToken(token); // Update token state
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token); // Store token in local storage
        } else {
            localStorage.removeItem('ACCESS_TOKEN'); // Remove token from local storage if null
        }
    };
    // ContextProvider Component: This is a special component responsible for managing the application's state and making it available 
    //to other components. 
    // It wraps around other components, passing down the state as needed.
    const setNotification = message => {
        _setNotification(message);

        setTimeout(() => {
            _setNotification('')
        }, 5000)
    }
    // Provide state values and setter functions to the context
    return (
        <StateContext.Provider value={{
            user,
            token,
            isAdmin,
            setUser, 
            setToken, 
            notification,
            setNotification
        }}>
            {children}
        </StateContext.Provider>
    );
    // Providing State with Context: We use StateContext.Provider to provide the state variables and functions to other components.
    // The value prop of the provider contains the current state values and functions.
    // Rendering Children Components: The {children} inside the ContextProvider component represents any components that are nested within it.
    // These components will have access to the state provided by the context.
};

// Custom hook to access the state values and setter functions from the context
export const useStateContext = () => useContext(StateContext);
// useState Custom Hook: This custom hook allows other components to access the state values and functions from the context.
// It's a convenient way to access and update state without needing to pass props down through multiple layers of components.

export const getUserData = () => {
    const userDataString = localStorage.getItem('USER_DATA');
    if (userDataString) {
        try {
            return JSON.parse(userDataString);
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }
    return null;
};
