import React from 'react';
import styled from 'styled-components';
import { Icon } from './UtilityComponents';

const Footer = styled.footer`
  background: #1A365D; /* Matching navbar color */
  color: white;
  text-align: center;
  padding: 2.5rem 1rem 1.5rem; /* Mobile-first */

  @media (min-width: 640px) {
    padding: 3rem 1.5rem 2rem;
  }

  @media (min-width: 1024px) {
    padding: 3.5rem 2rem 2rem;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  @media (min-width: 640px) {
    gap: 2rem;
  }
`;

const FooterLogo = styled.img`
  width: 140px; /* Mobile size */
  max-width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;

  @media (min-width: 640px) {
    width: 160px;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

const SocialLinks = styled.nav`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0;
  flex-wrap: wrap;

  @media (min-width: 640px) {
    gap: 1.25rem;
  }
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px; /* Touch target size */
  height: 44px;
  background: #34495e; /* Dark gray fill */
  border: 2px solid #95a5a6; /* Light gray border */
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (min-width: 640px) {
    width: 50px;
    height: 50px;
  }

  &:hover,
  &:focus {
    background: #3d566e;
    border-color: #bdc3c7;
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }

  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(-1px);
  }

  svg {
    width: 22px;
    height: 22px;

    @media (min-width: 640px) {
      width: 24px;
      height: 24px;
    }
  }
`;

const FooterContainer = styled.div`
  display: flex;
  flex-direction: row; /* Always horizontal - logo and social icons on same row */
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  width: 100%;
  flex-wrap: wrap; /* Allow wrapping on very small screens */

  @media (min-width: 640px) {
    gap: 2rem;
    flex-wrap: nowrap;
  }
`;

const FooterText = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0.5rem 0;
  line-height: 1.6;

  @media (min-width: 640px) {
    font-size: 1rem;
  }

  &:first-of-type {
    margin-top: 1rem;
  }
`;

const FooterSection = () => (
  <Footer role="contentinfo">
    <FooterContent>
      <FooterContainer>
        <FooterLogo 
          src="/assets/logo-header.webp" 
          alt="Impact Point Church logo"
          width="160"
          height="auto"
          loading="lazy"
        />
        <SocialLinks aria-label="Social media links">
          <SocialLink 
            href="https://www.facebook.com/KenyaIndyMinistry/" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Visit our Facebook page"
          >
            <Icon name="facebook" size={24} />
          </SocialLink>
          <SocialLink 
            href="https://www.youtube.com/@impactpointchurch" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Visit our YouTube channel"
          >
            <Icon name="youtube" size={24} />
          </SocialLink>
        </SocialLinks>
      </FooterContainer>
      <FooterText>
        &copy; {new Date().getFullYear()} Impact Point Church. All rights reserved.
      </FooterText>
      <FooterText>Making an Impact, One Life at a Time</FooterText>
    </FooterContent>
  </Footer>
);

export default FooterSection;