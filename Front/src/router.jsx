import { createBrowserRouter, Navigate } from "react-router-dom"; 

import Login from "./views/Login";
import Signup from "./views/Signup";
import Users from "./views/Users";

import NotFound from "./views/NotFound";
// View Layout
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
// Dashboard
import Dashboard from "./views/Dashboard";
//Usuarios
import IndexUsers from "./views/Users/IndexUsers";
import FormsUsers from "./views/Users/FormsUsers";

// Impuestos
import IndexImpuestos from "./views/Impuestos/IndexImpuestos";
import FormsImpuestos from "./views/Impuestos/FormsImpuestos";
// ProdServ
import IndexProdServ from "./views/ProdServ/IndexProdServ";
import FormsProdServ from "./views/ProdServ/FormsProdServ";

// User
import UserForm from "./views/UserForm";
// Clientes
import IndexClientes from "./views/Clientes/IndexClientes";
import FormsCliente from "./views/Clientes/FormsCliente";
// Emisor
import IndexEmisor from "./views/Emisor/IndexEmisor";
import FormsEmisor from "./views/Emisor/FormsEmisor";
// Factura
import IndexFactura from "./views/Facturas/IndexFactura";
import FormsFactura from "./views/Facturas/FormsFactura";
import { useStateContext } from "./context/ContextProvider";

// Encapsulate createBrowserRouter inside a function
 export default function createRouter(print){
  
  //const { token, setUser, setToken, notification, isAdmin } = useStateContext();
  // Access context inside the function if needed
 console.log("message: ", print);
  // Define router using createBrowserRouter
  const router = createBrowserRouter([
    {
      path: '/',
      element: <DefaultLayout/>,
      children: [
        { path:'/', element: <Navigate to="/dashboard"/> },
        { path:'/dashboard', element:<Dashboard/> },
        // Usuarios
        { path: '/users', element: <IndexUsers/>},
        { path: '/users/forms', element: <FormsUsers/> }, 
        // Impuestos
        { path: '/impuestos/', element: <IndexImpuestos/> },
        { path: '/impuestos/forms', element: <FormsImpuestos/> },

        { path: '/prodserv', element:<IndexProdServ/>},
        { path: '/prodserv/forms', element: <FormsProdServ/> },

        { path: '/cliente', element: <IndexClientes/>},
        { path: '/cliente/forms' , element:<FormsCliente />},

        { path: '/emisor', element: <IndexEmisor/>},
        { path: '/emisor/forms' , element:<FormsEmisor/>},

        { path: '/factura' , element:<IndexFactura/>},
        { path: '/factura/forms' , element:<FormsFactura/>},
      ]
    },
    {
      path: '/',
      element: <GuestLayout/>,
      children:[
        { path: '/login', element: <Login/> },
        { path: '/signup', element: <Signup/> }
      ]
    }, 
    { path: '*', element: <NotFound/> }
  ]);

  return router; // Return the router
};

//export default createRouter(); // Call createRouter() to get the router constant
