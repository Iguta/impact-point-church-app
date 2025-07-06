import React, { useState, useEffect, createContext, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Create a React Context for Firebase
const FirebaseContext = createContext(null);

// Firebase Provider component to wrap the entire application
export const FirebaseProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null); // User ID for data segregation
  const [loadingFirebase, setLoadingFirebase] = useState(true);

  useEffect(() => {
    // 1. Initialize Firebase App
    // IMPORTANT: Replace this placeholder with your actual Firebase config object
    // When running locally, __firebase_config is undefined, so we use the hardcoded config.
    // When running in Canvas, __firebase_config is defined, so it takes precedence.
    const firebaseConfig = {
        apiKey: "AIzaSyAHFpmoR_VBPMhun1BlIMQJUJBlkXj8QnE",
        authDomain: "impact-point-church.firebaseapp.com",
        projectId: "impact-point-church",
        storageBucket: "impact-point-church.firebasestorage.app",
        messagingSenderId: "945935564073",
        appId: "1:945935564073:web:bae955de505f2762688b38",
        measurementId: "G-0DWQNE0NN5"
    };

    // Basic check to ensure config is updated for local development
    if (!firebaseConfig || Object.keys(firebaseConfig).length === 0 || firebaseConfig.apiKey === "YOUR_API_KEY") {
      console.error("Firebase config is missing or not updated. Please provide your valid Firebase configuration in src/context/FirebaseContext.js.");
      setLoadingFirebase(false);
      return;
    }
    const app = initializeApp(firebaseConfig);
    const firestoreDb = getFirestore(app);
    const firebaseAuth = getAuth(app);

    setDb(firestoreDb);
    setAuth(firebaseAuth);

    // 2. Sign in with custom token or anonymously
    // For local development, __initial_auth_token will be undefined, so it will sign in anonymously.
    const signInUser = async () => {
      try {
        if (typeof window !== 'undefined' && typeof window.__initial_auth_token !== 'undefined' && window.__initial_auth_token) {
          // This path is for Canvas environment with a custom token
          await signInWithCustomToken(firebaseAuth, window.__initial_auth_token);
        } else {
          // This path is for local development or anonymous Canvas users
          await signInAnonymously(firebaseAuth);
        }
      } catch (error) {
        console.error("Firebase authentication failed:", error);
      } finally {
        // Authentication attempt is complete, whether successful or not.
        // onAuthStateChanged will handle setting the userId based on the result.
      }
    };

    // 3. Listen for auth state changes to get the current user's UID
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        // Use user.uid whether it's from custom token sign-in or anonymous sign-in
        setUserId(user.uid);
      } else {
        // No Firebase user is currently authenticated
        setUserId(null);
      }
      setLoadingFirebase(false); // Firebase is ready after auth state is determined
    });

    signInUser(); // Initiate sign-in when component mounts

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Provide Firebase instances and userId to all children components
  return (
    <FirebaseContext.Provider value={{ db, auth, userId, loadingFirebase }}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Custom hook to consume Firebase context
export const useFirebase = () => {
  return useContext(FirebaseContext);
};
