import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { GymAttendanceData } from './Jsons/Frequency';

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

const updateJson = async (user: string, json: GymAttendanceData) => {
  const gamesRef = collection(db, "jsons");
  const q = query(gamesRef, where('name', '==', user));
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
  const q = query(usersRef, where('name', '==', user));

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

export {
  getJson,
  updateJson,
  getAllJsons
};