import { useEffect, useState } from "react";
import { addUserToFirestore, deleteUserFromFirestore, getUsersFromFirestore, updateUserInFirestore } from "../../Firebase/UsersServices";
import { IUsers } from "../../Interfaces/IUsers";
import Header from "../../Layout/Navbar";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2'

function Users() {
  const [users, setUsers] = useState<IUsers[]>([]);
  const [usersTable, setUsersTable] = useState<IUsers[]>([]);
  const [show, setShow] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [newUser, setNewUser] = useState<IUsers>({
    UserId: '',
    UserName: '',
    Password: '',
    FirstName: '',
    LastName: '',
    Address: '',
    Phone: '',
    Email: '',
    Status: true,
    ConfirmPassword: ''
  });

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setNewUser({
      UserId: '',
      UserName: '',
      Password: '',
      FirstName: '',
      LastName: '',
      Address: '',
      Phone: '',
      Email: '',
      Status: true
    });
  };

  const fetchUsers = async () => {
    const fetchedUsers = await getUsersFromFirestore();
    setUsers(fetchedUsers);
    setUsersTable(fetchedUsers);
  };

  useEffect(() => {
    if (localStorage.getItem('userName') === null || localStorage.getItem('userName') === "") {
      window.location.href = "/";
    }
    fetchUsers();
  }, []);

  const handleResetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetPassword(e.target.checked);
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewUser({
      ...newUser,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveUser = async () => {
    try {

      if (newUser.firestoreId) {
        const { firestoreId, ConfirmPassword, ...userToUpdate } = newUser;
        await updateUserInFirestore(firestoreId, userToUpdate);
        Swal.fire({ icon: 'success', title: 'Usuario actualizado', timer: 1500 });
        handleClose();
      } else {
        if (newUser.Password !== newUser.ConfirmPassword) {
          Swal.fire({
            icon: 'error',
            title: 'Las contraseñas no coinciden',
            showConfirmButton: true,
          });
          return;
        }
        const newUserWithTempId = { ...newUser, UserId: Date.now().toString() };

        await addUserToFirestore(newUserWithTempId).then(resp => {
          if (resp) {
            Swal.fire({
              icon: 'success',
              title: 'Usuario registrado',
              showConfirmButton: false,
              timer: 1500
            });
          }
          handleClose();
        }).catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar usuario',
            showConfirmButton: false,
            timer: 1500
          });
          console.error("Error al guardar en Firebase:", error);
        });
      }

      fetchUsers();
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
    }
  };

  const handleEditUser = (user: IUsers) => {
    setNewUser(user);
    setShow(true);
  };

  const handleDeleteUser = async (userId: string) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará el usuario",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteUserFromFirestore(userId);
        Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
        fetchUsers();
      }
    });
  };

  const columns = [
    { name: 'Id', selector: (row: IUsers) => row.UserId, sortable: true },
    { name: 'Usuario', selector: (row: IUsers) => row.UserName, sortable: true },
    { name: 'Nombre', selector: (row: IUsers) => `${row.FirstName} ${row.LastName}`, sortable: true },
    { name: 'Teléfono', selector: (row: IUsers) => row.Phone },
    { name: 'Email', selector: (row: IUsers) => row.Email },
    {
      name: 'Estado',
      cell: (row: IUsers) => row.Status
        ? <span className="badge bg-success">Activo</span>
        : <span className="badge bg-danger">Inactivo</span>,
      sortable: true
    },
    {
      name: 'Acciones',
      cell: (row: IUsers) => (
        <>
          <Button variant="warning" size="sm" className="me-2" hidden={row.UserName === 'admin'} onClick={() => handleEditUser(row)}>Editar</Button>
          <Button variant="danger" size="sm" hidden={row.UserName === 'admin'} onClick={() => handleDeleteUser(row.firestoreId ? row.firestoreId : "")}>Eliminar</Button>
        </>
      )

    }
  ];

  return (
    <div>
      <Header usuario={localStorage.getItem('userName')} />
      <div style={{ paddingTop: "80px" }}>
        <DataTable
          columns={columns}
          data={usersTable}
          pagination
          highlightOnHover
          responsive
          fixedHeader
          fixedHeaderScrollHeight="65vh"
          persistTableHead
          subHeader
          subHeaderComponent={
            <>
              <Button variant="primary" onClick={handleShow} style={{ marginRight: "10px" }}>
                Registrar Usuario
              </Button>
              <input
                type="text"
                placeholder="Buscar..."
                className="form-control w-25"
                onChange={(e) => {
                  const searchText = e.target.value.toLowerCase();
                  setUsersTable(
                    searchText === "" ? users :
                      users.filter(u =>
                        u.UserName.toLowerCase().includes(searchText) ||
                        u.FirstName.toLowerCase().includes(searchText) ||
                        u.LastName.toLowerCase().includes(searchText) ||
                        u.Email.toLowerCase().includes(searchText)
                      )
                  );
                }}
              />
            </>
          }
        />
      </div>

      {/* Modal para registrar o editar usuario */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control name="UserName" type="text" placeholder="Usuario" onChange={handleInputChange} value={newUser.UserName} />
                </Form.Group>
              </Col>
              <Col>
                <br></br>
                <Form.Group className="mb-2">
                  <Form.Check
                    name="Status"
                    type="checkbox"
                    label="Activo"
                    checked={newUser.Status}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              {newUser.UserId && (
                <Form.Group className="mb-2">
                  <Form.Check
                    name="Status"
                    type="checkbox"
                    label="Resetear contraseña"
                    checked={resetPassword}
                    onChange={handleResetChange}
                  />
                </Form.Group>
              )}

              {newUser.UserId && resetPassword && (
                <>
                  <Col>
                    <Form.Group className="mb-2">
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control name="Password" type="password" placeholder="Contraseña" onChange={handleInputChange} value={newUser.Password} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-2">
                      <Form.Label>Confirmar Contraseña</Form.Label>
                      <Form.Control
                        name="ConfirmPassword"
                        type="password"
                        placeholder="Confirmar Contraseña"
                        value={newUser.ConfirmPassword}
                        onChange={(e) => setNewUser({ ...newUser, ConfirmPassword: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                </>
              )}

              {!newUser.UserId && (
                <>
                  <Col>
                    <Form.Group className="mb-2">
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control name="Password" type="password" placeholder="Contraseña" onChange={handleInputChange} value={newUser.Password} />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-2">
                      <Form.Label>Confirmar Contraseña</Form.Label>
                      <Form.Control
                        name="ConfirmPassword"
                        type="password"
                        placeholder="Confirmar Contraseña"
                        value={newUser.ConfirmPassword}
                        onChange={(e) => setNewUser({ ...newUser, ConfirmPassword: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                </>
              )}

            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control name="FirstName" type="text" placeholder="Nombre" onChange={handleInputChange} value={newUser.FirstName} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control name="LastName" type="text" placeholder="Apellido" onChange={handleInputChange} value={newUser.LastName} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control name="Phone" type="text" placeholder="Teléfono" onChange={handleInputChange} value={newUser.Phone} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control name="Email" type="email" placeholder="Email" onChange={handleInputChange} value={newUser.Email} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-2">
              <Form.Label>Dirección</Form.Label>
              <Form.Control name="Address" type="text" placeholder="Dirección" onChange={handleInputChange} value={newUser.Address} />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          <Button variant="primary" onClick={handleSaveUser}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Users;
