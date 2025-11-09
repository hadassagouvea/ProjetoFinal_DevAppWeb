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
    apiKey: "AIzaSyD_5t-DN7j9kRAuZTSlqLKFdNWQTRr9Fgc",
    authDomain: "projetofinal-devappweb.firebaseapp.com",
    projectId: "projetofinal-devappweb",
    storageBucket: "projetofinal-devappweb.firebasestorage.app",
    messagingSenderId: "758187527267",
    appId: "1:758187527267:web:b7b77d394887f34c3fbc56"
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
