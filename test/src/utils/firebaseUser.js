import { db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

// 사용자 정보 저장/업데이트
export async function saveUserData(uid, data) {
  await setDoc(doc(db, "users", uid), data, { merge: true });
}

// 사용자 정보 가져오기
export async function getUserData(uid) {
  const docSnap = await getDoc(doc(db, "users", uid));
  return docSnap.exists() ? docSnap.data() : null;
}

// 점수만 업데이트
export async function updateUserScore(uid, score) {
  await updateDoc(doc(db, "users", uid), { score });
}

// 랭킹 리스트 가져오기 (점수 내림차순)
export async function getRanking(topN = 10) {
  const q = query(collection(db, "users"), orderBy("score", "desc"), limit(topN));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
}
