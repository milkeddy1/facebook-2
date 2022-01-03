// for V9
// import { getFirestore } from 'firebase/firestore'
// import { initializeApp, } from 'firebase/app';
// import { getStorage } from 'firebase/storage';

// for V8
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


const firebaseConfig = {
    apiKey: "AIzaSyC73WPyjGCKkQucVSbnv8L9EOb44bPB-6I",
    authDomain: "facebook-48e4f.firebaseapp.com",
    projectId: "facebook-48e4f",
    storageBucket: "facebook-48e4f.appspot.com",
    messagingSenderId: "1006103878975",
    appId: "1:1006103878975:web:7d83bd5caf07de0324c78a"
};

// V9寫法
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app)
// const storage = getStorage(app);

// V8寫法
// const app = !firebase.apps.length ? firebase.intializaApp(firebaseConfig) : firebase.app();


const app = firebase.initializeApp(firebaseConfig)
const db = app.firestore();
const storage = firebase.storage();






export { db, storage };
