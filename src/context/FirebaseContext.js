import React, { useState, useEffect, createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithCustomToken,
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Added for Firebase Storage

// Create Firebase Context
const FirebaseContext = createContext(null);

// Firebase Provider Component
export const FirebaseProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [storage, setStorage] = useState(null); // ✅ Storage state
  const [userId, setUserId] = useState(null);
  const [loadingFirebase, setLoadingFirebase] = useState(true);
  const [firebaseInitError, setFirebaseInitError] = useState(null);

  useEffect(() => {
    let unsubscribeAuth = null;

    const initializeFirebase = async () => {
      try {
        // 1️⃣ Get Firebase Config
        const firebaseConfig =
          typeof window !== "undefined" &&
          typeof window.__firebase_config !== "undefined"
            ? JSON.parse(window.__firebase_config)
            : {
                apiKey: "AIzaSyAHFpmoR_VBPMhun1BlIMQJUJBlkXj8QnE",
                authDomain: "impact-point-church.firebaseapp.com",
                projectId: "impact-point-church",
                storageBucket: "impact-point-church.firebasestorage.app",
                messagingSenderId: "945935564073",
                appId: "1:945935564073:web:bae955de505f2762688b38",
                measurementId: "G-0DWQNE0NN5",
              };

        // Basic validation
        if (
          !firebaseConfig ||
          Object.keys(firebaseConfig).length === 0 ||
          firebaseConfig.apiKey === "YOUR_API_KEY"
        ) {
          const errorMsg =
            "Firebase config is missing or invalid. Please check FirebaseContext.js.";
          console.error("CRITICAL CONFIG ERROR:", errorMsg);
          setFirebaseInitError(new Error(errorMsg));
          setLoadingFirebase(false);
          return;
        }

        console.log(
          "FirebaseContext: Initializing Firebase app →",
          firebaseConfig.projectId
        );

        // 2️⃣ Initialize Firebase App
        const firebaseAppInstance = initializeApp(firebaseConfig);
        console.log("FirebaseContext: Firebase app instance created.");

        // 3️⃣ Initialize Services
        if (firebaseAppInstance) {
          const firestoreDb = getFirestore(firebaseAppInstance);
          const firebaseAuth = getAuth(firebaseAppInstance);
          const firebaseStorage = getStorage(firebaseAppInstance); // ✅ Initialize Storage

          setDb(firestoreDb);
          setAuth(firebaseAuth);
          setStorage(firebaseStorage);
          console.log("FirebaseContext: Firestore, Auth, and Storage ready.");

          // 4️⃣ Handle Authentication
          const signInUser = async () => {
            try {
              if (
                typeof window !== "undefined" &&
                typeof window.__initial_auth_token !== "undefined" &&
                window.__initial_auth_token
              ) {
                console.log("FirebaseContext: Signing in with custom token...");
                await signInWithCustomToken(
                  firebaseAuth,
                  window.__initial_auth_token
                );
              } else {
                console.log("FirebaseContext: Signing in anonymously...");
                await signInAnonymously(firebaseAuth);
              }
            } catch (error) {
              console.error(
                "FirebaseContext: Firebase authentication failed:",
                error
              );
            }
          };

          // Listen for auth state changes
          unsubscribeAuth = onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
              setUserId(user.uid);
              console.log("FirebaseContext: User signed in →", user.uid);
            } else {
              setUserId(null);
              console.log("FirebaseContext: No authenticated user.");
            }
            setLoadingFirebase(false);
          });

          await signInUser();
        } else {
          const errorMsg = "Firebase app instance is null after initialization.";
          console.error("CRITICAL INIT ERROR:", errorMsg);
          setFirebaseInitError(new Error(errorMsg));
          setLoadingFirebase(false);
        }
      } catch (error) {
        console.error("CRITICAL: Firebase initialization failed:", error);
        setFirebaseInitError(error);
        setLoadingFirebase(false);
        setDb(null);
        setAuth(null);
        setStorage(null);
        setUserId(null);
      }
    };

    initializeFirebase();

    // Cleanup
    return () => {
      console.log("FirebaseContext: Cleaning up useEffect...");
      if (typeof unsubscribeAuth === "function") {
        try {
          unsubscribeAuth();
        } catch (_) {}
      }
    };
  }, []);

  // 5️⃣ Render Initialization Error (if any)
  if (firebaseInitError) {
    return (
      <div
        style={{
          padding: "20px",
          color: "red",
          border: "1px solid red",
          margin: "20px",
          backgroundColor: "#FFF0F0",
        }}
      >
        <h2>Firebase Initialization Error</h2>
        <p>{firebaseInitError.message}</p>
        <p>Please check:</p>
        <ul style={{ marginLeft: "20px" }}>
          <li>All Firebase config fields are valid and match your console.</li>
          <li>Firestore, Authentication, and Storage are enabled in Firebase.</li>
          <li>Your internet connection is stable.</li>
        </ul>
        <p>See console logs for details ("FirebaseContext:").</p>
      </div>
    );
  }

  // 6️⃣ Provide Firebase Instances
  return (
    <FirebaseContext.Provider
      value={{ db, auth, storage, userId, loadingFirebase }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

// Custom hook to access Firebase context
export const useFirebase = () => {
  return useContext(FirebaseContext);
};
