import { db } from "../_utils/firebase";
import { collection, getDocs, addDoc, query } from "firebase/firestore";

export async function getItems(userId) {
  const q = query(collection(db, "users", userId, "items"));
  const querySnapshot = await getDocs(q);

  const items = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  return items;
}

export async function addItem(userId, item) {
  const docRef = await addDoc(collection(db, "users", userId, "items"), item);
  return docRef.id;
}