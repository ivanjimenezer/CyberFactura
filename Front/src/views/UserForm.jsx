import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function UserForm() {
    const navigate = useNavigate();
    let { id } = useParams();
    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const { setNotification } = useStateContext()

    if (id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/users/${id}`)
                //obtiene datos y los pasa
                .then(({ data }) => {
                    setLoading(false)
                    setUser(data)
                })
                .catch(() => {
                    setLoading(false)
                })
        }, [])
    }

    const onSubmit = ev => {
        ev.preventDefault()
        if (user.id) {//update
            axiosClient.put(`/users/${user.id}`, user)
                .then(() => {
                    setNotification('User was successfully updated')
                    //SHot notification
                    navigate('/users')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response)
                    }
                })
        } else {//crreate
            console.log("user a mandar: ",user);
            axiosClient.post('/users', user)
                .then(() => {
                    setNotification('User was successfully created')
                    navigate('/users')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                    else{
                        setErrors(response.data.errors)
                    }
                })
        }
    }

    return (
        <>
            {// si el id del user existe entonces es update
                user.id && <h1>Update User: {user.name}</h1>}
            {//si el id no existe entonces es un nuevo usuario
                !user.id && <h1>New User</h1>}
            <div className="card animated fadeInDown">
                {loading && (
                    <div className="text-center">
                        Loading...
                    </div>
                )}
                {errors &&
                    <div className="alert">
                        {Object.keys(errors).map(key => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                }
                {!loading && (
                    <form onSubmit={onSubmit}>
                        {//cada campo guarda el valor dentro del setuser
                        }
                        <input value={user.name} onChange={ev => setUser({ ...user, name: ev.target.value })} placeholder="Name" />
                        <input type="email" value={user.email} onChange={ev => setUser({ ...user, email: ev.target.value })} placeholder="Email" />
                        <input type="password" onChange={ev => setUser({ ...user, password: ev.target.value })} placeholder="Password" />
                        <input type="password" onChange={ev => setUser({ ...user, password_confirmation: ev.target.value })} placeholder="Password Confirmation" />
                        <button className="btn">Save</button>
                    </form>
                )}
            </div>
        </>
    )
}