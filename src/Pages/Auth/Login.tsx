import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBInput,
}
  from 'mdb-react-ui-kit';
import "./login.css"
import { getUsersFromFirestore } from '../../Firebase/UsersServices';
import { IUsers } from '../../Interfaces/IUsers';
import Swal from 'sweetalert2';
function App() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUsers[]>([]);

  const fetchUsers = async () => {
    const fetchedUsers = await getUsersFromFirestore();
    setUsers(fetchedUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, [])

  const handleLogin = () => {
    const userValue = (document.getElementById('txtUser') as HTMLInputElement)?.value;
    const passValue = (document.getElementById('txtPass') as HTMLInputElement)?.value;

    if(userValue === "" || passValue === "" || userValue === undefined || passValue === undefined){
      Swal.fire({
        position: "top-start",
        icon: "warning",
        title: "Favor ingrese usuario y contraseña",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    const user = users.find(x => x.UserName === userValue);
    
    if(user === undefined){
      Swal.fire({
        position: "top-start",
        icon: "error",
        title: "Usuario no encontrado",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    if(user.Status === false){
      Swal.fire({
        position: "top-start",
        icon: "error",
        title: "Usuario Inactivo",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    if(user.Password !== passValue){
      Swal.fire({
        position: "top-start",
        icon: "error",
        title: "Credenciales incorrectas",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    localStorage.setItem('userName', user.UserName);

    navigate("/home");
  };
  return (
    <MDBContainer fluid className="p-3 my-5">
      <MDBRow>
        <MDBCol col='10' md='6'>
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" className="img-fluid" alt="Phone image" />
        </MDBCol>

        <MDBCol col='4' md='6'>
          <MDBInput wrapperClass='mb-4' label='Usuario' id='txtUser' type='text' size="lg" />
          <MDBInput wrapperClass='mb-4' label='Contraseña' id='txtPass' type='password' size="lg" />

          <MDBBtn className="mb-4 w-100" size="lg" onClick={handleLogin}>Iniciar Sesión</MDBBtn>

          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0">Ó</p>
          </div>

        </MDBCol>

      </MDBRow>

    </MDBContainer>
  );
}

export default App;