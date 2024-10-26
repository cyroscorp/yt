import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyADJwSudN3vMRicU7QdobwUT_55h1ughww",
  authDomain: "arrr-13914.firebaseapp.com",
  databaseURL: "https://arrr-13914-default-rtdb.firebaseio.com",
  projectId: "arrr-13914",
  storageBucket: "arrr-13914.appspot.com",
  messagingSenderId: "695438168915",
  appId: "1:695438168915:web:094bf90d0621de702347a6",
  measurementId: "G-CNSQQBD7FM"
};

export default firebaseConfig;
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
