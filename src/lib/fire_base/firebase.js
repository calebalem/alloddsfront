
import { initializeApp } from 'firebase/app'
import { getAnalytics, logEvent } from "firebase/analytics";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore/lite"
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyCGoZw1qwl_Y-G29yKZ1KmB55ahMLVdZ3g",
  authDomain: "oddshubt.firebaseapp.com",
  projectId: "oddshubt",
  storageBucket: "oddshubt.appspot.com",
  messagingSenderId: "464190519014",
  appId: "1:464190519014:web:3228110e41838007342d27",
  measurementId: "G-0PPDL4PBQC"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const db = getFirestore(app);

export async function getDocument(collection, docID) {
  let docRef = doc(db, collection, docID);
  let docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let data = docSnap.data()
    if (data != undefined) {
      return data.items
    }
  }
}

export async function addDocument(collection, docID, data) {
  await setDoc(doc(db, collection, docID), data);
}