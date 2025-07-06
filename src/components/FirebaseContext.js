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
            // __firebase_config is a global variable provided by the Canvas environment
            // IMPORTANT: Replace this placeholder with your actual Firebase config object
            const firebaseConfig = {
               apiKey: "YOUR_API_KEY",
               authDomain: "YOUR_AUTH_DOMAIN",
               projectId: "YOUR_PROJECT_ID",
               storageBucket: "YOUR_STORAGE_BUCKET",
               messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
               appId: "YOUR_APP_ID",
               measurementId: "YOUR_MEASUREMENT_ID" // Optional, if Analytics is enabled
            };

            if (!firebaseConfig || Object.keys(firebaseConfig).length === 0 || firebaseConfig.apiKey === "YOUR_API_KEY") {
              console.error("Firebase config is missing or not updated. Please provide your valid Firebase configuration.");
              setLoadingFirebase(false);
              return;
            }
            const app = initializeApp(firebaseConfig);
            const firestoreDb = getFirestore(app);
            const firebaseAuth = getAuth(app);

            setDb(firestoreDb);
            setAuth(firebaseAuth);

            // 2. Sign in with custom token or anonymously
            // __initial_auth_token is a global variable provided by the Canvas environment
            const signInUser = async () => {
              try {
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                  await signInWithCustomToken(firebaseAuth, __initial_auth_token);
                } else {
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
        