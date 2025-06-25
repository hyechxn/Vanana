import { db } from "../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export async function getRanking(topN = 10) {
  const q = query(collection(db, "users"), orderBy("score", "desc"), limit(topN));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
}
