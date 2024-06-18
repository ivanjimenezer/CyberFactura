//import {Link, useRef} from "react";
import { Link, useRef } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import { useState } from "react";
export default function Login() {
  const [email, setEmail] = useState('invitado@example.com');
  const [password, setPassword] = useState('Invitado_098');

  const emailRef = useRef();
  const passwordRef = useRef();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const [message, setMessage] = useState(null);
  const { setUser, setToken } = useStateContext();

  const onSubmit = ev => {
    setErrors(null);
    ev.preventDefault()
    setLoading(true); // Set loading state to true

    ///const email = emailRef.current.value;
    //const password = passwordRef.current.value;

    if (!email || !password) {
      setErrors({ email: !email ? ["El correo es requerido"] : [], password: !password ? ["La contraseña es requerida"] : [] });
      setLoading(false);
      return;
    }

    //datos que se enviaran
    const payload = {
      email,
      password,
    };

    console.log('Submitting login form with payload:', payload);

    axiosClient.post('/login', payload)
      .then(({ data }) => {
        console.log('Login successful');
        setUser(data.user);
        setToken(data.token);
        //setIsAdmin(data.user?.type === 'admin');
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setMessage(response.data.message);
        } else {
          setMessage(response.data.message);
        }
      })
      .finally(() => {
        setLoading(false); // Set loading state to false
      });

  };
  return (
    <div className="login-page">

      {loading && (
        <div className="loading-layout" >
          <div className="loading-message">
            <div className="loading-spinner"></div>
            Cargando...
          </div>
        </div>
      )}

      <div className="login-elements">
        <div className="login-wallpaper">
          <img className="login-wallpaper-img" src="./Front/media/wall2.jpg" />
        </div>

        <div className="login-forms">
          <form className="login-forms-elements" onSubmit={onSubmit}>
            <img className="title-logo" src="./Front/media/logoPNG.png" />
            {errors && <div className="alert alert-login" >
              {
                Object.keys(errors).map(key => (
                  <p key={key}> {errors[key][0]} </p>
                ))
              }
            </div>}
            {message &&
              <div className="alert">
                <p>{message}</p>
              </div>
            }

            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="login-input"
              type="email"
              placeholder="Ingrese su correo"
            />
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="login-input"
              type="password"
              placeholder="Ingrese su contraseña"
            />
            <button className="btn btn-login">INICIAR SESIÓN</button>
          </form>
        </div>
      </div>
    </div>
  )
}