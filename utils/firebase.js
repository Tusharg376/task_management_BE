const { initializeApp } = require("firebase/app");
const { getStorage, ref } = require("firebase/storage")

const firebaseConfig = {
  apiKey: process.env.FB_APIKEY,
  authDomain: process.env.FB_AUTHDOMAIN,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_BUCKET,
  messagingSenderId:process.env.FB_MESSAGE_SENDER_ID,
  appId: process.env.FB_API_ID,
  measurementId:process.env.FB_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = {storage}