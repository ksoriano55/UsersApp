import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { IUsers } from '../Interfaces/IUsers';

export const getUsersFromFirestore = async (): Promise<any[]> => {
    try {
        const usersCollection = collection(db, 'Users');
        const querySnapshot = await getDocs(usersCollection);

        const usersList = querySnapshot.docs.map((doc) => ({
            UserId: doc.id,
            ...doc.data(),
        }));
        console.log("Respuesta de Firebase: ", usersList)
        return usersList;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
};

export const addUserToFirestore = async (user: IUsers) => {
    try {

        const usersCollection = collection(db, 'Users'); // Asegúrate que sea tu colección correcta
        const docRef = await addDoc(usersCollection, user);
        return docRef.id;
    } catch (error) {
        console.error('Error al insertar usuarios:', error);
        throw error;
    }

};

export const updateUserInFirestore = async (userId: string, user: IUsers) => {
    try {
        debugger
        const userRef = doc(db, 'Users', userId);
        await updateDoc(userRef, user as any);
    }
    catch (error) {
        console.error('Error al actualizar usuarios:', error);
        throw error;
    }
};

export const deleteUserFromFirestore = async (userId: string) => {
    try {
        debugger
        const userRef = doc(db, 'Users', userId);
        await deleteDoc(userRef);
    }
    catch (error) {
        console.error('Error al eliminar usuarios:', error);
        throw error;
    }
};