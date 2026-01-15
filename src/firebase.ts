import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBnP8V6xWabk0cfGhwY4AdPX829rPPRnf4",
  authDomain: "bourbon-d0505.firebaseapp.com",
  projectId: "bourbon-d0505",
  storageBucket: "bourbon-d0505.firebasestorage.app",
  messagingSenderId: "935278237286",
  appId: "1:935278237286:web:2b8183abb241ac932fffa7",
  measurementId: "G-TEV7YQWQBZ"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const analytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};
 