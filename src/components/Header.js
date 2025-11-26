import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FaInfoCircle,
  FaMicrophoneAlt,
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
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
const Header = () => {
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(64);

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
      </MobileMenu>
    </HeaderContainer>
  );
};

export default Header;
