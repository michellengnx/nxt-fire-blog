import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA92m0gHhgb-GHr4JJT8TD5QKYTE7M4FfU",
  authDomain: "nxt-fire-blog.firebaseapp.com",
  projectId: "nxt-fire-blog",
  storageBucket: "nxt-fire-blog.appspot.com",
  messagingSenderId: "595449385167",
  appId: "1:595449385167:web:23240c17a597673ed1a7ba",
  measurementId: "G-WGKRDTLL3K",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
