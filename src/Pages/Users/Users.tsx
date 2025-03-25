import { useEffect, useState } from "react";
import { getUsersFromFirestore } from "../../Firebase/UsersServices";
import { IUsers } from "../../Interfaces/IUsers";

function Users() {
  const [users, setUsers] = useState<IUsers[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsersFromFirestore();
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, []);

  console.log("Usuarios State:" , users)
  return (
    <div>
      {/* El contenido del resto de tu aplicación */}
    </div>
  );
}

export default Users;
