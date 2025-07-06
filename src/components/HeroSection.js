import React from 'react';
import styled from 'styled-components';
import { Button } from './UtilityComponents';

const HeroSectionContainer = styled.section`
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-image: url("https://placehold.co/1920x1080/4F46E5/FFFFFF?text=Welcome+to+Impact+Point+Church");
  background-size: cover;
  background-position: center;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: black;
  opacity: 0.6;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
`;

const Title = styled.h2`
  font-size: 3rem; /* text-5xl */
  line-height: 1;
  font-weight: 800; /* font-extrabold */
  margin-bottom: 1rem;
  animation: fadeInDown 1s ease-out forwards;

  @media (min-width: 768px) {
    font-size: 4.5rem; /* md:text-7xl */
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem; /* text-xl */
  font-weight: 300; /* font-light */
  margin-bottom: 2rem;
  animation: fadeInUp 1s ease-out forwards;
  animation-delay: 0.3s;
  
  @media (min-width: 768px) {
    font-size: 1.5rem; /* md:text-2xl */
  }
`;

const StyledHeroButton = styled(Button)`
  font-size: 1.125rem; /* text-lg */
  padding: 0.75rem 2rem; /* px-8 py-3 */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  animation: fadeIn 1s ease-out forwards;
  animation-delay: 0.6s;
`;

const HeroSection = () => (
  <HeroSectionContainer>
    <Overlay />
    <ContentWrapper>
      <Title className="animate-fade-in-down">Welcome to Impact Point Church</Title>
      <Subtitle className="animate-fade-in-up">Where Faith Meets Action</Subtitle>
      <StyledHeroButton className="bg-indigo-600 hover:bg-indigo-700 text-white animate-fade-in">
        Join Us This Sunday!
      </StyledHeroButton>
    </ContentWrapper>
  </HeroSectionContainer>
);

export default HeroSection;
