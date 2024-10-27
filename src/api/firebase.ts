import { initializeApp } from "firebase/app";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    updateProfile,
    reauthenticateWithPopup,
    User,
} from "firebase/auth";
import { getFirestore, query, getDocs, collection, where, doc, setDoc } from "firebase/firestore";

// Web Firebase Configuration
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

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Authentication initilization and reference
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Google Authentication Logic
const googleProvider = new GoogleAuthProvider();
export const googleAuthorize = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "User"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await setDoc(doc(db, "User", user.uid), {
                name: user.displayName,
                authProvider: "google",
                email: user.email,
                isSetup: false,
                uid: user.uid,
                color: "red",
            });
        }
    } catch (err) {
        console.error(err);
    }
};

export async function reauthWithGoogle(user: User) {
    return await reauthenticateWithPopup(user, googleProvider);
}

export const logInWithEmailAndPassword = async (email: string, password: string) => {
    try {
        const data = await signInWithEmailAndPassword(auth, email, password);
        return {
            name: data.user.displayName,
            isSetup: false,
            habits: [],
            color: "red",
        };
    } catch (err) {
        console.error(err);
    }
};

export const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await updateProfile(user, { displayName: name });
        await setDoc(doc(db, "User", user.uid), {
            name: name,
            authProvider: "local",
            email: email,
            isSetup: false,
            uid: user.uid,
        });

        return {
            name: user.displayName,
            isSetup: false,
            habits: [],
            color: "red",
        };
    } catch (err) {
        console.error(err);
    }
};

export const sendPasswordReset = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err) {
        console.error(err);
    }
};

export const logout = () => {
    signOut(auth);
};
