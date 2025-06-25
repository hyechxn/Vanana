import { db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export async function saveUserData(uid, data) {
  await setDoc(doc(db, "users", uid), data, { merge: true });
}

export async function getUserData(uid) {
  const docSnap = await getDoc(doc(db, "users", uid));
  return docSnap.exists() ? docSnap.data() : null;
}

export async function updateUserScore(uid, score) {
  await updateDoc(doc(db, "users", uid), { score });
}
