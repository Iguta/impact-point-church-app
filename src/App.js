import React, { useState, useEffect, useCallback } from 'react';
import { FirebaseProvider, useFirebase } from './context/FirebaseContext';
import { initialChurchData } from './data/initialChurchData';
import { Button} from './components/UtilityComponents';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SermonsSection from './components/SermonsSection'; // Existing sermons section
import ServicesSection from './components/ServicesSection'; // New services section
import EventsSection from './components/EventsSection';
import MinistriesSection from './components/MinistriesSection';
import ContactSection from './components/ContactSection';
import LiveStreamSection from './components/LiveStreamSection'; // Import LiveStreamSection
import AdminLogin from './components/AdminLogin'; // Import AdminLogin component
import FooterSection from './components/FooterSection';
import SEO from './components/SEO';
import { ToastNotification } from './utils/Toast';
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import styled, { createGlobalStyle } from 'styled-components';

// Global styles for body and animations - Mobile-first approach
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px; /* Base font size for mobile */
    
    @media (min-width: 768px) {
      font-size: 17px;
    }
    
    @media (min-width: 1024px) {
      font-size: 18px;
    }
  }

  body {
    /* Modern, web-safe font stack with fallbacks */
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.6;
    color: #1f2937; /* Modern dark gray instead of pure black */
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #ffffff;
  }

  /* Modern color palette variables */
  :root {
    --color-primary: #4f46e5;
    --color-primary-dark: #4338ca;
    --color-secondary: #667eea;
    --color-accent: #764ba2;
    --color-text: #1f2937;
    --color-text-light: #6b7280;
    --color-bg-light: #f9fafb;
    --color-bg-white: #ffffff;
    --color-success: #22c55e;
    --color-error: #ef4444;
    --color-warning: #f59e0b;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }

  /* Custom animations */
  @keyframes float {
    0%, 100% { 
      transform: translateY(0px); 
    }
    50% { 
      transform: translateY(-10px); 
    }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideInFromLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInFromRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Fade in animation for sections */
  .fade-in {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }

  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Smooth transitions for interactive elements */
  a, button {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Focus styles for accessibility */
  *:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
    border-radius: 4px;
  }


  /* Image optimization */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Loading state animation */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading {
    animation: spin 1s linear infinite;
  }
`;

// Styled components for App layout
const AppContainer = styled.div`
  font-family: 'Arial', sans-serif;
  color: #333;
  min-height: 100vh;
`;


const AdminToggleContainer = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 50;
`;


const App = () => {
  const { db, userId, loadingFirebase, auth, firebaseInitError } = useFirebase(); // Added 'auth' from context
  const [churchData, setChurchData] = useState(initialChurchData);
  const [isEditing, setIsEditing] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  // Memoize the toast close handler to prevent unnecessary re-renders
  const handleToastClose = useCallback(() => {
    setToastMessage('');
    setToastType('success');
  }, []);

  // Function to show toast notifications from child components
  const showToast = useCallback((message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
  }, []);

  // Minimal client-side routing for /login without react-router
  useEffect(() => {
    const onPopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // (Reverted) removed animation/focus-trap side effects for simplicity

  const navigate = (path) => {
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
    }
  };

  // Define allowed admin UIDs for the church website
  // IMPORTANT: Replace 'YOUR_ADMIN_UID_1' with the actual persistent UID from your Firebase Authentication
  // (e.g., from an Email/Password or Google login user).
  const allowedAdminUids = [
    "gxD1Un1yKCSei1l6RYdIYu8GXW73", // <--- REPLACE THIS WITH YOUR ACTUAL PERSISTENT UID
    // "another_church_admin_uid", // Add more UIDs if needed
    "wyna7iUTkVZg9FWoteMQAzSDKYS2"
  ];

  // Check if the current user is an admin
  const isAdmin = userId && allowedAdminUids.includes(userId);


  // Firestore document path: artifacts/{appId}/public/church_website
  const appId = typeof window !== 'undefined' && typeof window.__app_id !== 'undefined' ? window.__app_id : 'local-dev-app-id';
  // Note: Document references must have an even number of segments (collection/doc/collection/doc)
  const churchDocRef = db ? doc(db, 'artifacts', appId, 'public', 'church_website') : null;

  // Real-time data fetching from Firestore
  useEffect(() => {
    if (!churchDocRef || loadingFirebase) return;

    const unsubscribe = onSnapshot(churchDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setChurchData(docSnap.data());
      } else {
        console.log("No church data found, attempting to create initial data.");
        // Only attempt to set initial data if the current user is an admin
        if (isAdmin) {
          setDoc(churchDocRef, initialChurchData)
            .then(() => setChurchData(initialChurchData))
            .catch((error) => console.error("Error setting initial data:", error));
        } else {
          console.log("Not an admin, initial data not created. Displaying default initial data.");
          // For non-admins, if no data exists, they will just see the hardcoded initial data
          setChurchData(initialChurchData);
        }
      }
      setDataLoading(false);
    }, (error) => {
      console.error("Error fetching church data:", error);
      // Fallback to local initial data so site still renders
      setChurchData(initialChurchData);
      setDataLoading(false);
    });

    return () => unsubscribe();
  }, [churchDocRef, loadingFirebase, isAdmin]); // Added isAdmin to dependency array


  // Mapping of section keys to user-friendly names
  const sectionNames = {
    heroSlides: 'Hero Section',
    about: 'About Section',
    liveStream: 'Live Stream Settings',
    services: 'Services',
    sermons: 'Sermons',
    ministries: 'Ministries',
    events: 'Events',
    contact: 'Contact Information'
  };

  // Function to update specific sections in Firestore
  // actionType can be 'save', 'delete', or undefined (defaults to 'save')
  const handleUpdateSection = async (sectionKey, newData, actionType = 'save') => {
    if (!churchDocRef) {
      console.error("Firestore document reference is not available.");
      return;
    }
    // Only allow updates if the current user is an admin
    if (!isAdmin) {
      console.warn("Attempted to update data without admin privileges.");
      alert("You do not have permission to edit this content.");
      return;
    }
    try {
      await updateDoc(churchDocRef, { [sectionKey]: newData });
      console.log(`${sectionKey} section updated successfully!`);
      // Show success/delete message
      const sectionName = sectionNames[sectionKey] || sectionKey;
      const isDelete = actionType === 'delete';
      setToastType(isDelete ? 'delete' : 'success');
      setToastMessage(isDelete 
        ? `${sectionName} deleted successfully!` 
        : `${sectionName} saved successfully!`);
    } catch (error) {
      console.error(`Error updating ${sectionKey} section:`, error);
      alert(`Error saving changes: ${error.message}. Check console for details.`);
    }
  };

  // --- Render Logic ---
  // If there's a critical Firebase initialization error, display it from FirebaseProvider
  if (firebaseInitError) {
    return <FirebaseProvider><div style={{textAlign:'center',padding:'50px'}}>Firebase init error handled by provider</div></FirebaseProvider>;
  }

  // If Firebase is still loading or data is loading, show spinner
  if (loadingFirebase || dataLoading) {
    return (
      <AppContainer>
        <GlobalStyle />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#F3F4F6', color: '#1F2937' }}>
          <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '4rem', width: '4rem', borderTop: '4px solid #4F46E5', borderBottom: '4px solid #4F46E5' }}></div>
          <p style={{ marginLeft: '1rem', fontSize: '1.25rem' }}>Loading website...</p>
        </div>
      </AppContainer>
    );
  }

  // If not an admin AND currently in editing mode (meaning they tried to enter it), show login
  if (!isAdmin && isEditing) {
    return (
      <AppContainer>
        <GlobalStyle />
        <AdminLogin auth={auth} onLoginSuccess={() => setIsEditing(true)} /> {/* Pass auth and a success callback */}
      </AppContainer>
    );
  }

  // Dedicated login route: show admin login when path is /login
  if (currentPath === '/login') {
    return (
      <AppContainer>
        <GlobalStyle />
        <AdminLogin auth={auth} onLoginSuccess={() => navigate('/')} />
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <GlobalStyle /> {/* Apply global styles */}
      <SEO /> {/* SEO meta tags and structured data */}
      <Header />
      {/* Toast Notification */}
      <ToastNotification 
        message={toastMessage} 
        type={toastType}
        onClose={handleToastClose} 
      />
      {/* Admin Toggle - Only visible to admins */}
      {isAdmin && (
        <AdminToggleContainer>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className={isEditing ? 'btn-primary-red' : 'btn-primary-green'}
          >
            {isEditing ? 'Exit Edit Mode' : 'Enter Edit Mode'}
          </Button>
        </AdminToggleContainer>
      )}

      {/* Website Sections */}
      <main role="main" id="main-content">
        <HeroSection data={churchData.heroSlides} isEditing={isEditing} onUpdate={handleUpdateSection} />
        <AboutSection data={churchData.about} isEditing={isEditing} onUpdate={handleUpdateSection} />
        <LiveStreamSection data={churchData.liveStream} isEditing={isEditing} onUpdate={handleUpdateSection} />
        <ServicesSection data={churchData.services} isEditing={isEditing} onUpdate={handleUpdateSection} />
        <SermonsSection data={churchData.sermons} isEditing={isEditing} onUpdate={handleUpdateSection} />
        <MinistriesSection data={churchData.ministries} isEditing={isEditing} onUpdate={handleUpdateSection} />
        <EventsSection data={churchData.events} isEditing={isEditing} onUpdate={handleUpdateSection} />
        <ContactSection data={churchData.contact} isEditing={isEditing} onUpdate={handleUpdateSection} onShowToast={showToast} />
      </main>
      <FooterSection />
    </AppContainer>
  );
};

export default App;
