import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  setDoc,
} from "firebase/firestore";
import { GymAttendanceData } from './Jsons/Frequency';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCV0iq454qWhIbfx5OFQmcoqb7za9qNY_0",
  authDomain: "gym-atendece.firebaseapp.com",
  projectId: "gym-atendece",
  storageBucket: "gym-atendece.appspot.com",
  messagingSenderId: "1062919792111",
  appId: "1:1062919792111:web:c5575a0530eec84eda821a",
  measurementId: "G-2BF0YF7QH4"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Configurar os serviços do Firebase que você deseja usar
const auth = getAuth(app);

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  } catch (err: any) {
    throw Error(err);
  }
};

const addCompensatedDaysToAllJsons = async () => {
  const gamesRef = collection(db, "jsons");
  const q = query(gamesRef);
  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log('No documents found in the collection.');
      return 'No documents';
    }

    const updates = querySnapshot.docs.map(async (doc) => {
      const data = doc.data() as GymAttendanceData;
      // Modify the frequency to add 'compensatedDays' to each 'DateAttendance'
      Object.keys(data.frequency).forEach(year => {
        data.frequency[year].forEach(month => {
          Object.keys(month.weaks).forEach(week => {
            const dateAttendance = month.weaks[week];
            if (!dateAttendance.compesatedDays) {
              dateAttendance.compesatedDays = []; // Initialize with an empty array if not present
            }
          });
        });
      });

      // Update the document with the modified data
      await setDoc(doc.ref, data);
    });

    // Wait for all updates to complete
    await Promise.all(updates);
    return 'All documents updated successfully';
  } catch (err: any) {
    console.error("Failed to update documents:", err);
    throw new Error(err.message);
  }
};


const updateJson = async (user: string, json: GymAttendanceData) => {
  const gamesRef = collection(db, "jsons");
  const q = query(gamesRef, where('email', '==', user));
  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log('No matching documents. Consider creating a new one or handling this case differently.');
      return 'No matching document'; // or throw an error, based on your use case
    }

    // Assuming 'name' is unique, there should only be one document per user
    const docRef = querySnapshot.docs[0].ref; // Get the reference of the first document

    // Overwrite the document
    await setDoc(docRef, json);
    return 'Success';
  } catch (err: any) {
    console.error("Failed to update JSON:", err);
    throw new Error(err.message);
  }
}

const getJson = async (user: string) => {
  console.log(user)
  const usersRef = collection(db, "jsons");
  const q = query(usersRef, where('email', '==', user));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log('No matching documents.');
      return {};  // Return an empty object or any appropriate value
    }
    
    // Extract data from each document
    const userData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return userData;  // This will be an array of users
  } catch (err: any) {
    console.error("Error fetching user data:", err);
    throw new Error(err);
  }
}

const getAllJsons = async () => {
  const allJsonsRef = collection(db, "jsons");
  try {
    const querySnapshot = await getDocs(allJsonsRef);
    if (querySnapshot.empty) {
      console.log('No documents found.');
      return [];
    }

    const allJsons = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return allJsons; // This will be an array of all documents in the "jsons" collection
  } catch (err: any) {
    console.error("Error fetching all JSONs:", err);
    throw new Error(err.message);
  }
}

const addExtraDayUsed = async (email: string, extraDay: string) => {
  const usersRef = collection(db, "jsons");
  const q = query(usersRef, where('email', '==', email));
  
  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log('No matching documents.');
      return 'No matching document'; // or handle this case differently
    }

    // Assuming there's only one document per user
    const doc = querySnapshot.docs[0];
    const data = doc.data() as GymAttendanceData;

    // Check if the extraDaysUsed key exists and update accordingly
    if (!data.extraDaysUsed) {
      data.extraDaysUsed = [extraDay];
    } else {
      data.extraDaysUsed.push(extraDay);
    }

    // Update the document with the modified data
    await setDoc(doc.ref, data);
    return 'Success';
  } catch (err: any) {
    console.error("Failed to update JSON with extraDaysUsed:", err);
    throw new Error(err.message);
  }
}

export {
  getJson,
  updateJson,
  getAllJsons,
  logInWithEmailAndPassword,
  addCompensatedDaysToAllJsons,
  addExtraDayUsed
};
