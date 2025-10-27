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
const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  transform: ${({ hidden }) => (hidden ? "translateY(-100%)" : "translateY(0)")};

  &.scrolled {
    background: linear-gradient(
      135deg,
      rgba(44, 62, 80, 0.95),
      rgba(52, 152, 219, 0.95)
    );
    padding: 0.4rem 0; /* shrink header padding */
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.8rem 2rem;
  transition: padding 0.3s ease;

  @media (max-width: 992px) {
    padding: 0.6rem 1.5rem;
  }
`;

const Logo = styled.a`
  display: flex;
  align-items: center;
  cursor: pointer;

  img {
    height: ${({ shrink }) => (shrink ? "45px" : "60px")};
    width: auto;
    object-fit: contain;
    transition: height 0.3s ease;
  }

  @media (max-width: 992px) {
    img {
      height: ${({ shrink }) => (shrink ? "38px" : "48px")};
    }
  }
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
    display: flex;
    align-items: center;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    svg {
      margin-right: 0.5rem;
      font-size: 1.2rem;
      display: none; /* hide icons on desktop */
    }

    @media (max-width: 992px) {
      justify-content: center;
      font-size: 1.05rem;

      svg {
        display: inline; /* show icons only on mobile/tablet */
      }
    }
  }

  @media (max-width: 992px) {
    display: none;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;

  @media (max-width: 992px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background: rgba(44, 62, 80, 0.98);
  backdrop-filter: blur(10px);
  padding: 1rem 1.25rem;
  z-index: 999;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

  a {
    display: block;
    color: white;
    text-decoration: none;
    padding: 0.75rem 0;
    font-size: 1.05rem;
  }

  a + a {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 992px) {
    display: block;
  }
`;

// ------------------ COMPONENT ------------------
const Header = () => {
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setHeaderScrolled(currentY > 100);

      // hide header on scroll down, show on scroll up
      if (currentY > lastScrollY && currentY > 200) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentY);
    };

    const handleResize = () => {
      if (window.innerWidth > 992 && menuOpen) setMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen, lastScrollY]);

  return (
    <HeaderContainer className={headerScrolled ? "scrolled" : ""} hidden={hidden}>
      <Nav>
        {/* ✅ Clickable Logo (acts as Home) */}
        <Logo href="#home" shrink={headerScrolled}>
          <img
            src="/images/logo-header.png"
            alt="Impact Point Church Logo"
          />
        </Logo>

        {/* ✅ Desktop navigation */}
        <NavLinks>
          <li><a href="#about"><FaInfoCircle /> About</a></li>
          <li><a href="#livestream"><FaMicrophoneAlt /> Live</a></li>
          <li><a href="#services"><FaCalendarAlt /> Services</a></li>
          <li><a href="#sermons"><FaMicrophoneAlt /> Sermons</a></li>
          <li><a href="#ministries"><FaUsers /> Ministries</a></li>
          <li><a href="#events"><FaCalendarAlt /> Events</a></li>
          <li><a href="#contact"><FaMapMarkerAlt /> Contact</a></li>
        </NavLinks>

        {/* ✅ Mobile menu button */}
        <MenuButton
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? "✕" : "☰"}
        </MenuButton>
      </Nav>

      {/* ✅ Mobile dropdown menu */}
      {menuOpen && (
        <MobileMenu onClick={(e) => e.target.tagName === "A" && setMenuOpen(false)}>
          <a href="#about"><FaInfoCircle /> About</a>
          <a href="#livestream"><FaMicrophoneAlt /> Live</a>
          <a href="#services"><FaCalendarAlt /> Services</a>
          <a href="#sermons"><FaMicrophoneAlt /> Sermons</a>
          <a href="#ministries"><FaUsers /> Ministries</a>
          <a href="#events"><FaCalendarAlt /> Events</a>
          <a href="#contact"><FaMapMarkerAlt /> Contact</a>
        </MobileMenu>
      )}
    </HeaderContainer>
  );
};

export default Header;
