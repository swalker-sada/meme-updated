import  firebase from "firebase";
import "firebase/database";

let config = {
    apiKey: "AIzaSyCY6myhzaUO1mwrIX-CIkJSumVkZSq1Bro",
    authDomain: "extra-2021.firebaseapp.com",
    databaseURL: "https://extra-2021-default-rtdb.firebaseio.com",
    projectId: "extra-2021",
    storageBucket: "extra-2021.appspot.com",
    messagingSenderId: "386238376767",
    appId: "1:386238376767:web:169bffa3033112c479418a",
    measurementId: "G-4NTPG61PG2"
};

firebase.initializeApp(config);

export default firebase.database();