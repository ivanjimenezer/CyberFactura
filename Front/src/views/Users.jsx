
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../context/ContextProvider.jsx";

export default function Users(){
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const {setNotification} = useStateContext();
  
    useEffect(() => {
      getUsers();
    }, []);


    const onDeleteClick = user => {
      if (!window.confirm("¿Estas seguro de borrar este usuario?")) {
        return
      }
      axiosClient.delete(`/users/${user.id}`)
        .then(() => {
          //Show notification
          setNotification('User was successfully deleted');
          getUsers();
        })
    }

    const getUsers = () => {
        setLoading(true)
        axiosClient.get('/users')
          .then(({ data }) => {
            console.log(data);
            setLoading(false)
            setUsers(data.data)
          })
          .catch((error) => {
            console.log(error.response.data.error);
            setLoading(false)
          })
      }


    return(
      <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Users</h1>
        <Link className="btn-add" to="/users/new">Add new</Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Updated Date</th>
            <th>Actions</th>
          </tr>
          </thead>
          {//si loading es true, se muestra el codigo que esta debajo
          loading &&
            <tbody>
            <tr>
              <td colSpan="5" className="text-center">
                Cargando...
              </td>
            </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.updated_at}</td>
                <td>
                  <Link className="btn-edit" to={'/users/' + u.id}>Edit</Link>
                  &nbsp;
                  <button className="btn-delete" onClick={ev => onDeleteClick(u)}>Delete</button>
                </td>
              </tr>
            ))}
            </tbody>
          }
        </table>
      </div>
    </div>
    )
} 