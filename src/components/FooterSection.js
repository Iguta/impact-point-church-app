import React from 'react';
import styled from 'styled-components';
import { Icon } from './UtilityComponents';

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

const FooterSection = () => (
  <Footer>
    <FooterContent>
      <SocialLinks>
        {/* Replaced emojis with Lucide-React icons or custom SVGs */}
        <SocialLink href="https://www.facebook.com/KenyaIndyMinistry/" target="_blank" rel="noopener noreferrer">
          <Icon name="facebook" size={24} />
        </SocialLink>
        {/* <SocialLink href="https://instagram.com/yourchurch" target="_blank" rel="noopener noreferrer">
          <Icon name="instagram" size={24} />
        </SocialLink>
        <SocialLink href="https://twitter.com/yourchurch" target="_blank" rel="noopener noreferrer">
          <Icon name="twitter" size={24} />
        </SocialLink> */}
        <SocialLink href="https://www.youtube.com/@impactpointchurch" target="_blank" rel="noopener noreferrer">
          <Icon name="youtube" size={24} />
        </SocialLink>
      </SocialLinks>
      <p>&copy; {new Date().getFullYear()} Impact Point Church. All rights reserved.</p>
      <p>Making an Impact, One Life at a Time</p>
    </FooterContent>
  </Footer>);
export default FooterSection;