import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANAK-SjIi_MKxPYJWPIiYw4C4VtpF7Dfo",
  authDomain: "kinetic-2f10e.firebaseapp.com",
  projectId: "kinetic-2f10e",
  storageBucket: "kinetic-2f10e.firebasestorage.app",
  messagingSenderId: "735838168637",
  appId: "1:735838168637:web:b3f280ac5831a5bd50ec54",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;
