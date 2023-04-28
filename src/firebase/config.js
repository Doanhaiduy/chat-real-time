import firebase from "firebase/app";

import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBDyVGGJq1f-F0wjyDf9FlSZPSNW9cEOSE",
    authDomain: "chat-app-d4547.firebaseapp.com",
    projectId: "chat-app-d4547",
    storageBucket: "chat-app-d4547.appspot.com",
    messagingSenderId: "269478219220",
    appId: "1:269478219220:web:e7df59cc5aa585bdbdda41",
    measurementId: "G-LZHTGJ9RFR",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

// auth.useEmulator("http://localhost:9099");
// if (window.location.hostname === "localhost") {
//     db.useEmulator("localhost", "8080");
// }

export { db, auth };
export default firebase;
