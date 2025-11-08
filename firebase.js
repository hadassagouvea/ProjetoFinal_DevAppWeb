import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const carsCol = collection(db, "carros");

export async function addCar(car) {
  return addDoc(carsCol, { ...car, createdAt: serverTimestamp() });
}

export async function updateCar(id, car) {
  const ref = doc(db, "carros", id);
  return updateDoc(ref, { ...car });
}

export async function deleteCar(id) {
  const ref = doc(db, "carros", id);
  return deleteDoc(ref);
}

export function subscribeCars(callback) {
  const q = query(carsCol, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(data);
  });
}
