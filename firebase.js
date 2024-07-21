// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6ROhdf3QG42CVY546TS7Tf4vh_kDN6w4",
  authDomain: "gen-ai-e98cc.firebaseapp.com",
  projectId: "gen-ai-e98cc",
  storageBucket: "gen-ai-e98cc.appspot.com",
  messagingSenderId: "549467197963",
  appId: "1:549467197963:web:667db600926c547f626d0e",
  measurementId: "G-GTQ30HMEGR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Initialize Firebase Analytics on the client-side only
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { auth, analytics, signInWithGoogle, signOutUser };
