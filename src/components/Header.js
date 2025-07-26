import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// Import specific icons from react-icons for Navbar
import { FaHome, FaInfoCircle, FaMicrophoneAlt, FaCalendarAlt, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';

// Styled components for Header
const HeaderContainer = styled.header`
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
    display: flex; /* Ensure icons align with text */
    align-items: center;

    &:hover {
      background: rgba(255,255,255,0.2);
      transform: translateY(-2px);
    }
    svg { /* Styling for React Icons */
      margin-right: 0.5rem;
      font-size: 1.2rem;
    }
  }

  @media (max-width: 768px) {
    display: none; /* Hide navigation links on small screens */
  }
`;

const Header = () => {
  const [headerScrolled, setHeaderScrolled] = useState(false);

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

  return (
    <HeaderContainer className={headerScrolled ? 'scrolled' : ''}>
      <Nav>
        <Logo>Impact Point Church</Logo>
        <NavLinks>
          <li><a href="#home"><FaHome /> Home</a></li>
          <li><a href="#about"><FaInfoCircle /> About</a></li>
          <li><a href="#livestream"><FaMicrophoneAlt /> Live Stream</a></li>
          <li><a href="#services"><FaCalendarAlt /> Services</a></li>
          <li><a href="#sermons"><FaMicrophoneAlt /> Sermons</a></li>
          <li><a href="#ministries"><FaUsers /> Ministries</a></li>
          <li><a href="#events"><FaCalendarAlt /> Events</a></li>
          <li><a href="#contact"><FaMapMarkerAlt /> Contact</a></li>
        </NavLinks>
        {/* Admin Login/Logout buttons removed from Navbar */}
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
