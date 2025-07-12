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
  const [firebaseInitError, setFirebaseInitError] = useState(null); // State to capture initialization errors

  useEffect(() => {
    let firebaseAppInstance = null; // Initialize to null

    const initializeFirebase = async () => {
      try {
        // 1. Get Firebase Configuration
        const firebaseConfig = typeof window !== 'undefined' && typeof window.__firebase_config !== 'undefined'
          ? JSON.parse(window.__firebase_config)
          :{
              apiKey: "AIzaSyAHFpmoR_VBPMhun1BlIMQJUJBlkXj8QnE",
              authDomain: "impact-point-church.firebaseapp.com",
              projectId: "impact-point-church",
              storageBucket: "impact-point-church.firebasestorage.app",
              messagingSenderId: "945935564073",
              appId: "1:945935564073:web:bae955de505f2762688b38",
              measurementId: "G-0DWQNE0NN5"
            };

        // Basic validation for Firebase config
        if (!firebaseConfig || Object.keys(firebaseConfig).length === 0 || firebaseConfig.apiKey === "YOUR_API_KEY") {
          const errorMsg = "Firebase config is missing or not updated. Please provide your valid Firebase configuration in src/context/FirebaseContext.js.";
          console.error("CRITICAL CONFIG ERROR:", errorMsg);
          setFirebaseInitError(new Error(errorMsg));
          setLoadingFirebase(false);
          return; // Stop initialization
        }

        console.log("FirebaseContext: Attempting to initialize Firebase app with config:", firebaseConfig.projectId);
        // 2. Initialize Firebase App
        firebaseAppInstance = initializeApp(firebaseConfig);
        console.log("FirebaseContext: Firebase app instance created.");

        // Ensure app instance is valid before getting services
        if (firebaseAppInstance) {
          const firestoreDb = getFirestore(firebaseAppInstance);
          const firebaseAuth = getAuth(firebaseAppInstance);

          setDb(firestoreDb);
          setAuth(firebaseAuth);
          console.log("FirebaseContext: Firestore and Auth services obtained.");

          // 3. Handle Authentication State
          const signInUser = async () => {
            try {
              if (typeof window !== 'undefined' && typeof window.__initial_auth_token !== 'undefined' && window.__initial_auth_token) {
                console.log("FirebaseContext: Attempting sign-in with custom token...");
                await signInWithCustomToken(firebaseAuth, window.__initial_auth_token);
                console.log("FirebaseContext: Signed in with custom token.");
              } else {
                console.log("FirebaseContext: Attempting anonymous sign-in...");
                await signInAnonymously(firebaseAuth);
                console.log("FirebaseContext: Signed in anonymously.");
              }
            } catch (error) {
              console.error("FirebaseContext: Firebase authentication failed:", error);
              // Do not set firebaseInitError here, as core services might still be usable
            }
          };

          // Listen for auth state changes to get the current user's UID
          const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
              setUserId(user.uid);
              console.log("FirebaseContext: Auth state changed, userId set:", user.uid);
            } else {
              setUserId(null);
              console.log("FirebaseContext: Auth state changed, no user (userId set to null).");
            }
            setLoadingFirebase(false); // Auth state determined, so loading is complete
          });

          signInUser(); // Initiate sign-in

          // Cleanup function for useEffect
          return () => {
            console.log("FirebaseContext: Cleaning up useEffect...");
            unsubscribeAuth(); // Unsubscribe from auth changes
            // Avoid deleting app instance here unless absolutely necessary,
            // as it can cause issues if other components are still using it.
          };
        } else {
          const errorMsg = "Firebase app instance is null after initialization.";
          console.error("CRITICAL INIT ERROR:", errorMsg);
          setFirebaseInitError(new Error(errorMsg));
          setLoadingFirebase(false);
        }

      } catch (error) {
        // Catch any errors during the initial Firebase SDK setup (e.g., invalid config format)
        console.error("CRITICAL: Firebase initialization failed completely:", error);
        setFirebaseInitError(error); // Store the error to display
        setLoadingFirebase(false); // Stop loading state
        setDb(null); // Ensure db is null
        setAuth(null); // Ensure auth is null
        setUserId(null); // Ensure userId is null
      }
    };

    initializeFirebase(); // Call the async initialization function

  }, []); // Empty dependency array ensures this runs only once on mount

  // Render an error message if Firebase failed to initialize
  if (firebaseInitError) {
    return (
      <div style={{ padding: '20px', color: 'red', border: '1px solid red', margin: '20px', backgroundColor: '#FFF0F0' }}>
        <h2>Firebase Initialization Error:</h2>
        <p style={{ marginBottom: '10px' }}>{firebaseInitError.message}</p>
        <p>This is a critical error preventing the app from connecting to Firebase.</p>
        <p>Please check the following:</p>
        <ul style={{ marginLeft: '20px', listStyleType: 'disc' }}>
          <li>Your `firebaseConfig` in `src/context/FirebaseContext.js` is **exactly** correct (no typos, all fields present, no extra characters).</li>
          <li>Firebase services (Firestore Database, Authentication) are **enabled** in your Firebase project console.</li>
          <li>Your internet connection is stable.</li>
        </ul>
        <p style={{ marginTop: '10px' }}>If the error persists, check your browser's console for more detailed logs from "FirebaseContext:".</p>
      </div>
    );
  }

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
