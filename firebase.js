import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

var firebaseConfig = {
    apiKey: "AIzaSyCn_rYkVsmF00GElkFcj2NuUlTmOqIwhR0",
    authDomain: "gifted-chat-e6d17.firebaseapp.com",
    projectId: "gifted-chat-e6d17",
    storageBucket: "gifted-chat-e6d17.appspot.com",
    messagingSenderId: "904313002201",
    appId: "1:904313002201:web:1a966c4d1655fd627946c8",
    measurementId: "G-Q6X5TZ33EL"
  };

  let app;
if (firebase.apps.length === 0) {
app = firebase.initializeApp(firebaseConfig);
} else {
app = firebase.app();
}

const ad = firebase.firestore
const db = app.firestore();
const auth = firebase.auth();
const data = firebase.database();
export { db, auth, data, ad };