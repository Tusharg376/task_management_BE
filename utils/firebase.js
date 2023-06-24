const { initializeApp } = require("firebase/app");
const { getStorage, ref } = require("firebase/storage")

const firebaseConfig = {
  apiKey: "AIzaSyCSyWOZ34EfTEBHNmrdbFoEWka-Q5MPs_s",
  authDomain: "task-management-7b5a8.firebaseapp.com",
  projectId: "task-management-7b5a8",
  storageBucket: "task-management-7b5a8.appspot.com",
  messagingSenderId: "1036475818489",
  appId: "1:1036475818489:web:2815071e59e6c1e2e79d28",
  measurementId: "G-QNDVWD1CVW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = {storage}