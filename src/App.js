import React, { useState, useEffect } from 'react';
import { FirebaseProvider, useFirebase } from './context/FirebaseContext';
import { initialChurchData } from './data/initialChurchData';
import { Button, Icon } from './components/UtilityComponents';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SermonsSection from './components/SermonsSection';
import EventsSection from './components/EventsSection';
import MinistriesSection from './components/MinistriesSection';
import ContactSection from './components/ContactSection';
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import styled, { createGlobalStyle } from 'styled-components';

// Global styles for body and animations
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #F3F4F6; /* Light gray for body */
    color: #1F2937; /* Dark gray for text */
  }

  /* Dark mode styles */
  body.dark {
    background-color: #111827; /* Darker gray for body */
    color: #F9FAFB; /* Light text for dark mode */
  }

  /* Custom animations */
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .animate-fade-in-down {
    animation: fadeInDown 1s ease-out forwards;
  }
  .animate-fade-in-up {
    animation: fadeInUp 1s ease-out forwards;
    animation-delay: 0.3s;
  }
  .animate-fade-in {
    animation: fadeIn 1s ease-out forwards;
    animation-delay: 0.6s;
  }
`;

// Styled components for App layout
const AppContainer = styled.div`
  font-family: 'Inter', sans-serif;
  color: #1F2937; /* Default text color */
  background-color: #F3F4F6; /* Default background color */
  min-height: 100vh;

  &.dark {
    color: #F9FAFB; /* Dark mode text color */
    background-color: #111827; /* Dark mode background color */
  }
`;

const Header = styled.header`
  background-color: #4F46E5; /* Indigo-700 */
  color: white;
  padding: 1rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  .dark & {
    background-color: #3730A3; /* Indigo-900 */
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const SiteTitle = styled.h1`
  font-size: 1.875rem; /* text-3xl */
  font-weight: 800; /* font-extrabold */
  margin-bottom: 0.5rem;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const Nav = styled.nav`
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem; /* space-x-4 */

    @media (min-width: 768px) {
      gap: 1.5rem; /* md:space-x-6 */
    }

    li {
      a {
        color: inherit;
        text-decoration: none;
        font-size: 1.125rem; /* text-lg */
        display: flex;
        align-items: center;
        transition: color 0.2s ease-in-out;

        &:hover {
          color: #E0E7FF; /* Indigo-200 */
        }
      }
    }
  }
`;

const AdminToggleContainer = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 50;
`;

const Footer = styled.footer`
  background-color: #1F2937; /* Gray-800 */
  color: #D1D5DB; /* Gray-300 */
  padding: 1.5rem 0;
  text-align: center;
  font-size: 0.875rem; /* text-sm */

  .dark & {
    background-color: #1F2937; /* Gray-900 */
  }

  p {
    margin-top: 0.5rem;
  }

  span {
    font-family: monospace;
  }
`;


const App = () => {
  const { db, userId, loadingFirebase } = useFirebase();
  const [churchData, setChurchData] = useState(initialChurchData);
  const [isEditing, setIsEditing] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Firestore document path: artifacts/{appId}/users/{userId}/church_website/main_church_data
  // Use a fallback for __app_id when running locally outside Canvas
  const appId = typeof window !== 'undefined' && typeof window.__app_id !== 'undefined' ? window.__app_id : 'local-dev-app-id';
  const churchDocRef = userId && db ? doc(db, 'artifacts', appId, 'users', userId, 'church_website', 'main_church_data') : null;

  // Real-time data fetching from Firestore
  useEffect(() => {
    if (!churchDocRef || loadingFirebase) return;

    const unsubscribe = onSnapshot(churchDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setChurchData(docSnap.data());
      } else {
        // If document doesn't exist, create it with initial data
        console.log("No church data found, creating initial data.");
        setDoc(churchDocRef, initialChurchData)
          .then(() => setChurchData(initialChurchData))
          .catch((error) => console.error("Error setting initial data:", error));
      }
      setDataLoading(false);
    }, (error) => {
      console.error("Error fetching church data:", error);
      setDataLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [churchDocRef, loadingFirebase]); // Re-run when doc ref or firebase loading state changes

  // Function to update specific sections in Firestore
  const handleUpdateSection = async (sectionKey, newData) => {
    if (!churchDocRef) {
      console.error("Firestore document reference is not available.");
      return;
    }
    try {
      await updateDoc(churchDocRef, { [sectionKey]: newData });
      console.log(`${sectionKey} section updated successfully!`);
    } catch (error) {
      console.error(`Error updating ${sectionKey} section:`, error);
    }
  };

  // --- Render Logic ---
  if (loadingFirebase || dataLoading) {
    return (
      <AppContainer>
        <GlobalStyle />
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 dark:border-indigo-400"></div>
          <p className="ml-4 text-xl">Loading website...</p>
        </div>
      </AppContainer>
    );
  }

  return (
    <AppContainer className="font-sans">
      <GlobalStyle /> {/* Apply global styles */}
      {/* Header and Navigation */}
      <Header>
        <HeaderContent>
          <SiteTitle>Impact Point Church</SiteTitle>
          <Nav>
            <ul>
              <li><a href="#about"><Icon name="church" className="mr-1"/> About</a></li>
              <li><a href="#sermons"><Icon name="mic" className="mr-1"/> Sermons</a></li>
              <li><a href="#events"><Icon name="calendar" className="mr-1"/> Events</a></li>
              <li><a href="#ministries"><Icon name="users" className="mr-1"/> Ministries</a></li>
              <li><a href="#contact"><Icon name="mappin" className="mr-1"/> Contact</a></li>
            </ul>
          </Nav>
        </HeaderContent>
      </Header>

      {/* Admin Toggle */}
      <AdminToggleContainer>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-6 py-3 rounded-full text-lg font-semibold shadow-lg ${
            isEditing ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isEditing ? 'Exit Edit Mode' : 'Enter Edit Mode'}
        </Button>
      </AdminToggleContainer>

      {/* Website Sections */}
      <HeroSection />
      <AboutSection data={churchData.about} isEditing={isEditing} onUpdate={handleUpdateSection} />
      <SermonsSection data={churchData.sermons} isEditing={isEditing} onUpdate={handleUpdateSection} />
      <EventsSection data={churchData.events} isEditing={isEditing} onUpdate={handleUpdateSection} />
      <MinistriesSection data={churchData.ministries} isEditing={isEditing} onUpdate={handleUpdateSection} />
      <ContactSection data={churchData.contact} isEditing={isEditing} onUpdate={handleUpdateSection} />

      {/* Footer */}
      <Footer>
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Impact Point Church. All rights reserved.</p>
          <p className="mt-2">Built with React and powered by Firebase Firestore.</p>
          <p className="mt-1">Your User ID: <span className="font-mono">{userId || 'Loading...'}</span></p>
        </div>
      </Footer>
    </AppContainer>
  );
};

// Wrapper to provide Firebase context to the App component
const ChurchWebsite = () => (
  <FirebaseProvider>
    <App />
  </FirebaseProvider>
);

export default ChurchWebsite;
