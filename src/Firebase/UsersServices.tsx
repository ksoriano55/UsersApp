import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const getUsersFromFirestore = async (): Promise<any[]> => {
    try {
        const usersCollection = collection(db, 'Users'); 
        const querySnapshot = await getDocs(usersCollection);

        const usersList = querySnapshot.docs.map((doc) => ({
            UserId: doc.id,
            ...doc.data(),
        }));
        console.log("Respuesta de Firebase: ",usersList)
        return usersList;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
};