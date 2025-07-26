import React, { useState, useEffect } from 'react';
import { FirebaseProvider, useFirebase } from './context/FirebaseContext';
import { initialChurchData } from './data/initialChurchData';
import { Button, Icon } from './components/UtilityComponents';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SermonsSection from './components/SermonsSection'; // Existing sermons section
import ServicesSection from './components/ServicesSection'; // New services section
import EventsSection from './components/EventsSection';
import MinistriesSection from './components/MinistriesSection';
import ContactSection from './components/ContactSection';
import LiveStreamSection from './components/LiveStreamSection'; // Import LiveStreamSection
import AdminLogin from './components/AdminLogin'; // Import AdminLogin component
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import styled, { createGlobalStyle } from 'styled-components';

// Global styles for body and animations
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif; /* As per HTML */
    line-height: 1.6;
    color: #333; /* Default text color */
    overflow-x: hidden;
  }

  /* Custom animations from HTML */
  @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
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

  /* Fade in animation for sections */
  .fade-in {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s ease;
  }

  .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
  }

  html {
      scroll-behavior: smooth; /* Smooth scrolling */
  }
`;

// Styled components for App layout
const AppContainer = styled.div`
  font-family: 'Arial', sans-serif;
  color: #333;
  min-height: 100vh;
`;

const Header = styled.header`
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  padding: 1rem 0;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  transition: background 0.3s ease; /* For scroll effect */

  &.scrolled {
    background: linear-gradient(135deg, rgba(44, 62, 80, 0.95), rgba(52, 152, 219, 0.95));
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  gap: 2rem;

  a {
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
    padding: 0.5rem 1rem;
    border-radius: 20px;

    &:hover {
      background: rgba(255,255,255,0.2);
      transform: translateY(-2px);
    }
  }

  @media (max-width: 768px) {
    display: none; /* Hide navigation links on small screens */
  }
`;

const AdminToggleContainer = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 50;
`;

const Footer = styled.footer`
  background: #2c3e50;
  color: white;
  text-align: center;
  padding: 3rem 2rem 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SocialLink = styled.a`
  display: inline-block;
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #3498db, #9b59b6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1.5rem; /* For emojis/icons */

  &:hover {
    transform: translateY(-5px) rotate(10deg);
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  }
`;

const App = () => {
  const { db, userId, loadingFirebase, auth, firebaseInitError } = useFirebase(); // Added 'auth' from context
  const [churchData, setChurchData] = useState(initialChurchData);
  const [isEditing, setIsEditing] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  // Define allowed admin UIDs for the church website
  // IMPORTANT: Replace 'YOUR_ADMIN_UID_1' with the actual persistent UID from your Firebase Authentication
  // (e.g., from an Email/Password or Google login user).
  const allowedAdminUids = [
    "H8cw5YK3nQcbuiB5g7cDF0viwMr1", // <--- REPLACE THIS WITH YOUR ACTUAL PERSISTENT UID
    // "another_church_admin_uid", // Add more UIDs if needed
  ];

  // Check if the current user is an admin
  const isAdmin = userId && allowedAdminUids.includes(userId);

  // Firestore document path: artifacts/{appId}/users/{userId}/church_website/main_church_data
  const appId = typeof window !== 'undefined' && typeof window.__app_id !== 'undefined' ? window.__app_id : 'local-dev-app-id';
  const churchDocRef = userId && db ? doc(db, 'artifacts', appId, 'users', userId, 'church_website', 'main_church_data') : null;

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
      setDataLoading(false);
    });

    return () => unsubscribe();
  }, [churchDocRef, loadingFirebase, isAdmin]); // Added isAdmin to dependency array

  // Handle header background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setHeaderScrolled(true);
      } else {
        setHeaderScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to update specific sections in Firestore
  const handleUpdateSection = async (sectionKey, newData) => {
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

  return (
    <AppContainer>
      <GlobalStyle /> {/* Apply global styles */}
      {/* Header and Navigation */}
      <Header className={headerScrolled ? 'scrolled' : ''}>
        <Nav>
          <Logo>Impact Point Church</Logo>
          <NavLinks>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            {/* <li><a href="#livestream">Live Stream</a></li> */}
            <li><a href="#services">Services</a></li>
            <li><a href="#sermons">Sermons</a></li>
            <li><a href="#ministries">Ministries</a></li>
            <li><a href="#events">Events</a></li>
            <li><a href="#contact">Contact</a></li>
          </NavLinks>
        </Nav>
      </Header>

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
      <HeroSection data={churchData.heroSlides} isEditing={isEditing} onUpdate={handleUpdateSection} />
      <AboutSection data={churchData.about} isEditing={isEditing} onUpdate={handleUpdateSection} />
      <LiveStreamSection data={churchData.liveStream} isEditing={isEditing} onUpdate={handleUpdateSection} />
      <ServicesSection data={churchData.services} isEditing={isEditing} onUpdate={handleUpdateSection} />
      <SermonsSection data={churchData.sermons} isEditing={isEditing} onUpdate={handleUpdateSection} />
      <MinistriesSection data={churchData.ministries} isEditing={isEditing} onUpdate={handleUpdateSection} />
      <EventsSection data={churchData.events} isEditing={isEditing} onUpdate={handleUpdateSection} />
      <ContactSection data={churchData.contact} isEditing={isEditing} onUpdate={handleUpdateSection} />

      {/* Footer */}
      <Footer>
        <FooterContent>
          <SocialLinks>
            {/* Replaced emojis with Lucide-React icons or custom SVGs */}
            <SocialLink href="https://facebook.com/yourchurch" target="_blank" rel="noopener noreferrer">
              <Icon name="facebook" size={24} />
            </SocialLink>
            <SocialLink href="https://instagram.com/yourchurch" target="_blank" rel="noopener noreferrer">
              <Icon name="instagram" size={24} />
            </SocialLink>
            <SocialLink href="https://twitter.com/yourchurch" target="_blank" rel="noopener noreferrer">
              <Icon name="twitter" size={24} />
            </SocialLink>
            <SocialLink href="https://youtube.com/yourchurch" target="_blank" rel="noopener noreferrer">
              <Icon name="youtube" size={24} />
            </SocialLink>
          </SocialLinks>
          <p>&copy; {new Date().getFullYear()} Impact Point Church. All rights reserved.</p>
          <p>Making an Impact, One Life at a Time</p>
        </FooterContent>
      </Footer>
    </AppContainer>
  );
};

export default App;
