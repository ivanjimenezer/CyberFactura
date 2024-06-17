import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStateContext, getUserData } from "../context/ContextProvider.jsx";
import axiosClient from "../axios-client.js";

export default function DefaultLayout() {
    const { token, setUser, setToken, notification, isAdmin } = useStateContext();
    const [selectedLink, setSelectedLink] = useState('/dashboard');
    const location = useLocation();
    if (!token) {
        return <Navigate to="/login"/>;
    }
    const user = getUserData();

    const onLogout = ev => {
        
        ev.preventDefault();
        axiosClient.post('/logout')
            .then(() => {
                setUser(null);
                setToken(null);
                window.location.reload();
            })
            .catch((err) => {
                console.log("error during logout: ", err)
            });
    };
    const titles = {
        '/dashboard': 'RESUMEN',
        '/factura': 'FACTURAS',
        '/cliente': 'CLIENTES',
        '/impuestos': 'IMPUESTOS',
        '/prodserv': 'PRODUCTOS/SERVICIOS',
        '/emisor': 'EMISORES',
        '/users': 'USUARIOS',
    };
    return (
        <div id="defaultLayout">
            <aside className="aside-container">
                <img className="aside-logo" src="/Front/media/logoPNG.png" />
                <div className="aside-funciones">
                    <Link
                        to="/dashboard"
                        className={selectedLink === '/dashboard' ? 'selected' : ''}
                        onClick={() => setSelectedLink('/dashboard')}
                    >
                        RESUMEN
                    </Link>
                    <Link
                        to="/factura"
                        className={selectedLink === '/factura' ? 'selected' : ''}
                        onClick={() => setSelectedLink('/factura')}
                    >
                        FACTURAS
                    </Link>
                    <Link
                        to="/cliente"
                        className={selectedLink === '/cliente' ? 'selected' : ''}
                        onClick={() => setSelectedLink('/cliente')}
                    >
                        CLIENTES
                    </Link>
                    <Link
                        to="/impuestos"
                        className={selectedLink === '/impuestos' ? 'selected' : ''}
                        onClick={() => setSelectedLink('/impuestos')}
                    >
                        IMPUESTOS
                    </Link>
                    <Link
                        to="/prodserv"
                        className={selectedLink === '/prodserv' ? 'selected' : ''}
                        onClick={() => setSelectedLink('/prodserv')}
                    >
                        PRODUCTOS/SERVICIOS
                    </Link>
                    <Link
                        to="/emisor"
                        className={selectedLink === '/emisor' ? 'selected' : ''}
                        onClick={() => setSelectedLink('/emisor')}
                    >
                        EMISOR
                    </Link>
                    {isAdmin && (
                        <Link
                            to="/users"
                            className={selectedLink === '/users' ? 'selected' : ''}
                            onClick={() => setSelectedLink('/users')}
                        >
                            USUARIOS
                        </Link>
                    )}
                </div>
                <div className="aside-logout">
                    <a onClick={onLogout} className="btn-logout"> Cerrar sesión </a>
                </div>
            </aside>
            <div className="content">
                <header >
                     
                    <div className="content-title">
                        <h3>{titles[selectedLink] || 'Sistema de Facturación Electrónica'}</h3>
                    </div>
                    <div className="content-username" >
                    <img className="user-icon" src="/Front/media/icon.png" />
                        <p className="user-name">{user.name}</p>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
                {notification &&
                    <div className="notification">
                        {notification}
                    </div>
                }
            </div>
        </div>
    );
}
