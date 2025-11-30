import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import {
  FaInfoCircle,
  FaMicrophoneAlt,
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaHeart,
  FaTimes,
} from "react-icons/fa";

// ------------------ STYLED COMPONENTS ------------------
// Mobile-first approach: base styles are for mobile, then scale up
const HeaderContainer = styled.header`
  background: ${({ scrolled }) => (scrolled ? '#1A365D' : 'transparent')};
  color: white;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: ${({ scrolled }) => (scrolled ? '0 4px 15px rgba(0, 0, 0, 0.15)' : 'none')};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${({ hidden }) => (hidden ? "translateY(-100%)" : "translateY(0)")};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  backdrop-filter: ${({ scrolled }) => (scrolled ? 'none' : 'blur(10px)')};
  -webkit-backdrop-filter: ${({ scrolled }) => (scrolled ? 'none' : 'blur(10px)')};

  /* Add text shadow when transparent for better readability over hero images */
  text-shadow: ${({ scrolled }) => (scrolled ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.3)')};

  &.scrolled {
    background: #1A365D;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1rem; /* Mobile padding */
  transition: padding 0.3s ease;

  @media (min-width: 640px) {
    padding: 0.75rem 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 1rem 2rem;
  }
`;

const Logo = styled.a`
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 4px;
    border-radius: 4px;
  }

  img {
    height: ${({ shrink }) => (shrink ? "64px" : "72px")}; /* Mobile size - increased for readability */
    width: auto;
    object-fit: contain;
    transition: height 0.3s ease;
    display: block;
  }

  @media (min-width: 640px) {
    img {
      height: ${({ shrink }) => (shrink ? "72px" : "80px")};
    }
  }

  @media (min-width: 1024px) {
    img {
      height: ${({ shrink }) => (shrink ? "80px" : "90px")};
    }
  }
`;

const NavLinks = styled.ul`
  display: none; /* Hidden on mobile */
  list-style: none;
  gap: 0.5rem;
  align-items: center;

  @media (min-width: 992px) {
    display: flex;
    gap: 0.75rem; /* Tightened spacing */
  }

  @media (min-width: 1280px) {
    gap: 1rem; /* Tightened spacing */
  }

  a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 0.875rem; /* Slightly reduced padding */
    border-radius: 8px;
    display: flex;
    align-items: center;
    font-size: 0.9375rem; /* 15px base */
    font-weight: 600; /* Semi-bold */
    position: relative;
    transition: all 0.3s ease;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;

    @media (min-width: 1280px) {
      font-size: 1rem;
      padding: 0.625rem 1rem; /* Slightly reduced padding */
    }

    &:hover,
    &:focus {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    &:focus-visible {
      outline: 2px solid white;
      outline-offset: 2px;
    }

    svg {
      display: none; /* Hide icons on desktop */
      margin-right: 0.5rem;
      font-size: 1.1rem;
    }
  }
`;

const DonateButton = styled.button`
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #22c55e, #16a34a); /* Green gradient for donate */
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);

  @media (min-width: 992px) {
    display: flex;
  }

  &:hover {
    background: linear-gradient(135deg, #16a34a, #15803d);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }

  svg {
    font-size: 1rem;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 2000;
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: ${({ isOpen }) => (isOpen ? 'fadeIn 0.3s ease' : 'none')};
  overflow-y: auto;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  max-width: 500px;
  width: calc(100% - 2rem);
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
  position: relative;
  margin: auto;
  min-width: 0; /* Prevents flex item from overflowing */

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (min-width: 375px) {
    width: calc(100% - 2rem);
    padding: 2rem;
  }

  @media (min-width: 640px) {
    padding: 2.5rem;
    max-width: 550px;
    width: 100%;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #22c55e;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  min-width: 36px;
  min-height: 36px;

  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }

  &:focus-visible {
    outline: 2px solid #1A365D;
    outline-offset: 2px;
  }
`;

const CashAppInfo = styled.div`
  background: linear-gradient(135deg, #00d632, #00b82e);
  color: white;
  padding: 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  text-align: center;
  min-width: 0; /* Prevents flex item from overflowing */
  overflow: hidden; /* Prevents content from overflowing */

  @media (min-width: 640px) {
    padding: 1.5rem;
  }
`;

const CashAppTagBase = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  letter-spacing: 0.05em;
  max-width: 100%;
  display: block;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  /* Responsive base sizes - will be adjusted by JS to fit */
  @media (max-width: 374px) {
    font-size: 1.25rem;
  }
  
  @media (min-width: 375px) and (max-width: 479px) {
    font-size: 1.5rem;
  }
  
  @media (min-width: 480px) and (max-width: 639px) {
    font-size: 1.75rem;
  }
  
  @media (min-width: 640px) {
    font-size: 2rem;
  }
`;

const CashAppTag = React.forwardRef((props, ref) => (
  <CashAppTagBase ref={ref} {...props} />
));
CashAppTag.displayName = 'CashAppTag';

const CashAppLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Instructions = styled.div`
  color: #1f2937;
  font-size: 0.9375rem;
  line-height: 1.5;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;

  p {
    margin-bottom: 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    color: #1A365D;
    font-weight: 600;
  }

  ol {
    margin: 0.75rem 0;
    padding-left: 1.25rem;

    li {
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }
  }
`;

const CopyButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: #1A365D;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  margin-top: 1rem;

  &:hover {
    background: #2a4a6d;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(26, 54, 93, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid #1A365D;
    outline-offset: 2px;
  }
`;

const MenuButton = styled.button`
  display: flex; /* Show on mobile */
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  min-width: 44px; /* Touch target size */
  min-height: 44px;
  transition: all 0.3s ease;

  @media (min-width: 992px) {
    display: none; /* Hide on desktop */
  }

  &:hover,
  &:focus {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }

  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const MobileMenu = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: fixed;
  top: ${({ headerHeight }) => `${headerHeight}px`};
  left: 0;
  right: 0;
  background: rgba(26, 54, 93, 0.85); /* Semi-transparent for glassmorphism */
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  padding: 1rem;
  z-index: 999;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  animation: slideInDown 0.3s ease-out;
  max-height: calc(100vh - ${({ headerHeight }) => `${headerHeight}px`});
  overflow-y: auto;

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (min-width: 992px) {
    display: none;
  }

  a {
    display: flex;
    align-items: center;
    color: white;
    text-decoration: none;
    padding: 1rem;
    font-size: 1.0625rem; /* 17px */
    font-weight: 600; /* Semi-bold */
    border-radius: 8px;
    transition: all 0.3s ease;
    min-height: 48px; /* Touch target */
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;

    &:hover,
    &:focus {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(4px);
    }

    &:focus-visible {
      outline: 2px solid white;
      outline-offset: -2px;
    }

    svg {
      margin-right: 0.75rem;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    & + a {
      margin-top: 0.5rem;
    }
  }
`;

// ------------------ COMPONENT ------------------
const Header = ({ onShowToast }) => {
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(64);
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const cashAppTagRef = React.useRef(null);

  // Smooth scroll handler with better UX
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMenuOpen(false); // Close mobile menu after navigation
  };

  useEffect(() => {
    // Set header height for mobile menu positioning
    const header = document.querySelector('header');
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  }, [headerScrolled, menuOpen]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setHeaderScrolled(currentY > 50);

          // Hide header on scroll down, show on scroll up (only on desktop for better UX)
          if (window.innerWidth > 768) {
            if (currentY > lastScrollY && currentY > 200) {
              setHidden(true);
            } else {
              setHidden(false);
            }
          } else {
            // Always show header on mobile for better navigation
            setHidden(false);
          }
          setLastScrollY(currentY);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 992 && menuOpen) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleEscape);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen, lastScrollY]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e) => {
      const menu = document.querySelector('[data-mobile-menu]');
      const button = document.querySelector('[data-menu-button]');
      if (menu && !menu.contains(e.target) && !button?.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && donateModalOpen) {
        setDonateModalOpen(false);
      }
    };

    if (donateModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [donateModalOpen]);

  // Auto-resize Cash App tag to fit container
  useEffect(() => {
    if (!donateModalOpen || !cashAppTagRef.current) return;

    const resizeText = () => {
      const element = cashAppTagRef.current;
      if (!element) return;

      const container = element.parentElement;
      if (!container) return;

      const containerWidth = container.offsetWidth - 48; // Account for padding
      const text = element.textContent;
      
      // Start with a reasonable font size
      let fontSize = parseFloat(window.getComputedStyle(element).fontSize);
      element.style.fontSize = `${fontSize}px`;
      
      // Decrease font size until text fits
      while (element.scrollWidth > containerWidth && fontSize > 12) {
        fontSize -= 1;
        element.style.fontSize = `${fontSize}px`;
      }
    };

    // Resize on mount and window resize
    resizeText();
    window.addEventListener('resize', resizeText);
    
    return () => {
      window.removeEventListener('resize', resizeText);
    };
  }, [donateModalOpen]);

  // Copy Cash App tag to clipboard
  const handleCopyCashApp = () => {
    navigator.clipboard.writeText('$ImpactPointChurch').then(() => {
      // Close modal after successful copy
      setDonateModalOpen(false);
      // Show toast notification
      if (onShowToast) {
        onShowToast('Cash App tag copied to clipboard!', 'success');
      }
    }).catch(() => {
      // Show error toast if copy fails
      if (onShowToast) {
        onShowToast('Failed to copy. Please manually copy: $ImpactPointChurch', 'error');
      }
    });
  };

  return (
    <HeaderContainer 
      className={headerScrolled ? "scrolled" : ""} 
      hidden={hidden}
      scrolled={headerScrolled}
      role="banner"
    >
      <Nav role="navigation" aria-label="Main navigation">
        {/* Clickable Logo (acts as Home) */}
        <Logo 
          href="#home" 
          shrink={headerScrolled}
          onClick={(e) => handleSmoothScroll(e, '#home')}
          aria-label="Impact Point Church - Home"
        >
          <img
            src="/assets/logo-header.webp"
            alt="Impact Point Church Logo"
            width="auto"
          />
        </Logo>

        {/* Desktop navigation */}
        <NavLinks role="list">
          <li role="listitem">
            <a href="#about" onClick={(e) => handleSmoothScroll(e, '#about')} aria-label="About us">
              About
            </a>
          </li>
          <li role="listitem">
            <a href="#livestream" onClick={(e) => handleSmoothScroll(e, '#livestream')} aria-label="Live stream">
              Live
            </a>
          </li>
          <li role="listitem">
            <a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} aria-label="Service times">
              Services
            </a>
          </li>
          <li role="listitem">
            <a href="#sermons" onClick={(e) => handleSmoothScroll(e, '#sermons')} aria-label="Sermons">
              Sermons
            </a>
          </li>
          <li role="listitem">
            <a href="#ministries" onClick={(e) => handleSmoothScroll(e, '#ministries')} aria-label="Ministries">
              Ministries
            </a>
          </li>
          <li role="listitem">
            <a href="#events" onClick={(e) => handleSmoothScroll(e, '#events')} aria-label="Events">
              Events
            </a>
          </li>
          <li role="listitem">
            <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} aria-label="Contact us">
              Contact
            </a>
          </li>
        </NavLinks>

        {/* Donate Button */}
        <DonateButton
          onClick={() => setDonateModalOpen(true)}
          aria-label="Donate to Impact Point Church"
        >
          <FaHeart /> Donate
        </DonateButton>

        {/* Mobile menu button */}
        <MenuButton
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          data-menu-button
        >
          {menuOpen ? "✕" : "☰"}
        </MenuButton>
      </Nav>

      {/* Mobile dropdown menu */}
      <MobileMenu 
        id="mobile-menu"
        isOpen={menuOpen}
        headerHeight={headerHeight}
        data-mobile-menu
        role="menu"
        aria-label="Mobile navigation menu"
      >
        <a 
          href="#about" 
          onClick={(e) => handleSmoothScroll(e, '#about')}
          role="menuitem"
        >
          <FaInfoCircle /> About
        </a>
        <a 
          href="#livestream" 
          onClick={(e) => handleSmoothScroll(e, '#livestream')}
          role="menuitem"
        >
          <FaMicrophoneAlt /> Live
        </a>
        <a 
          href="#services" 
          onClick={(e) => handleSmoothScroll(e, '#services')}
          role="menuitem"
        >
          <FaCalendarAlt /> Services
        </a>
        <a 
          href="#sermons" 
          onClick={(e) => handleSmoothScroll(e, '#sermons')}
          role="menuitem"
        >
          <FaMicrophoneAlt /> Sermons
        </a>
        <a 
          href="#ministries" 
          onClick={(e) => handleSmoothScroll(e, '#ministries')}
          role="menuitem"
        >
          <FaUsers /> Ministries
        </a>
        <a 
          href="#events" 
          onClick={(e) => handleSmoothScroll(e, '#events')}
          role="menuitem"
        >
          <FaCalendarAlt /> Events
        </a>
        <a 
          href="#contact" 
          onClick={(e) => handleSmoothScroll(e, '#contact')}
          role="menuitem"
        >
          <FaMapMarkerAlt /> Contact
        </a>
        <a 
          href="#donate" 
          onClick={(e) => {
            e.preventDefault();
            setMenuOpen(false);
            setDonateModalOpen(true);
          }}
          role="menuitem"
        >
          <FaHeart /> Donate
        </a>
      </MobileMenu>

      {/* Donate Modal - Rendered as Portal for proper centering */}
      {donateModalOpen && typeof document !== 'undefined' && createPortal(
        <ModalBackdrop 
          isOpen={donateModalOpen}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDonateModalOpen(false);
            }
          }}
        >
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                <FaHeart /> Give & Support
              </ModalTitle>
              <CloseButton
                onClick={() => setDonateModalOpen(false)}
                aria-label="Close donation modal"
              >
                <FaTimes />
              </CloseButton>
            </ModalHeader>

            <CashAppInfo>
              <CashAppLabel>Cash App Tag</CashAppLabel>
              <CashAppTag ref={cashAppTagRef}>$ImpactPointChurch</CashAppTag>
            </CashAppInfo>

            <Instructions>
              <p style={{ marginBottom: '0.75rem' }}>
                <strong>How to Give:</strong>
              </p>
              <ol style={{ marginLeft: '1.25rem', marginBottom: '1rem' }}>
                <li>Open Cash App and search for <strong>$ImpactPointChurch</strong></li>
                <li>Enter your donation amount</li>
                <li><strong>Add a note</strong> in the "For" field (e.g., "Offering", "Tithe", "Building Fund")</li>
                <li>Complete your payment</li>
              </ol>
              <p style={{ fontStyle: 'italic', color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Thank you for your generous support!
              </p>
            </Instructions>

            <CopyButton onClick={handleCopyCashApp}>
              Copy Cash App Tag
            </CopyButton>
          </ModalContent>
        </ModalBackdrop>,
        document.body
      )}
    </HeaderContainer>
  );
};

export default Header;
