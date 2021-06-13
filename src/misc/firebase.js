import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage'

const config = {
  apiKey: "AIzaSyAw029cB1c36k-gEv1Gw2qF74HzarZvb1o",
  authDomain: "chat-web-app-e9bed.firebaseapp.com",
  projectId: "chat-web-app-e9bed",
  storageBucket: "chat-web-app-e9bed.appspot.com",
  messagingSenderId: "339637749262",
  appId: "1:339637749262:web:65fb2a0131666b5e075e5f"
};

const app = firebase.initializeApp(config);

export const auth =  app.auth();
export const database = app.database();
export const storage = app.storage();
