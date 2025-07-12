import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Icon } from './UtilityComponents';

const HeroSectionContainer = styled.section`
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  transition: background-image 0.5s ease-in-out; /* Smooth transition for background */

  /* Pseudo-element for floating effect from HTML */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="a"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.1"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="url(%23a)"/></svg>') center/300px;
    animation: float 6s ease-in-out infinite;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%); /* Hero gradient with opacity */
  z-index: 1;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  animation: slideInUp 1s ease-out; /* Animation from HTML */

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  animation: slideInUp 1s ease-out 0.3s both; /* Animation from HTML */

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CtaButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: slideInUp 1s ease-out 0.6s both; /* Animation from HTML */

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CarouselControl = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 1rem;
  cursor: pointer;
  z-index: 3;
  border-radius: 50%;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }

  &.left {
    left: 1rem;
  }
  &.right {
    right: 1rem;
  }
`;

const DotIndicators = styled.div`
  position: absolute;
  bottom: 2rem;
  z-index: 3;
  display: flex;
  gap: 0.5rem;
`;

const Dot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;

  &.active {
    background: white;
  }
`;

const HeroSection = ({ data, isEditing, onUpdate }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slides = data; // Assuming data prop contains heroSlides array
  const currentSlide = slides[currentSlideIndex];

  // Auto-play carousel
  useEffect(() => {
    if (isEditing) return; // Disable auto-play in edit mode

    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 8000); // Change slide every 8 seconds

    return () => clearInterval(interval);
  }, [slides.length, isEditing]);

  const goToNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlideIndex(index);
  };

  // Admin editing for slides (simplified for carousel)
  // For a full admin experience, each slide would need its own editable fields
  // For now, we'll just allow basic text/link updates through the initial data.
  // A dedicated "Hero Slide Editor" component would be ideal for full CRUD.

  return (
    <HeroSectionContainer id="home" style={{ backgroundImage: `url(${currentSlide.imageUrl})` }}>
      <Overlay />
      <ContentWrapper key={currentSlide.id}> {/* Key to re-render and re-trigger animations */}
        <Title>{currentSlide.title}</Title>
        <Subtitle>{currentSlide.subtitle}</Subtitle>
        <CtaButtons>
          {currentSlide.ctaPrimaryText && (
            <Button as="a" href={currentSlide.ctaPrimaryLink} className="btn-primary">
              {currentSlide.ctaPrimaryText}
            </Button>
          )}
          {currentSlide.ctaSecondaryText && (
            <Button as="a" href={currentSlide.ctaSecondaryLink} className="btn-secondary">
              {currentSlide.ctaSecondaryText}
            </Button>
          )}
        </CtaButtons>
      </ContentWrapper>

      {/* Carousel Controls */}
      <CarouselControl className="left" onClick={goToPrevSlide}>
        <Icon name="chevronLeft" size={32} />
      </CarouselControl>
      <CarouselControl className="right" onClick={goToNextSlide}>
        <Icon name="chevronRight" size={32} />
      </CarouselControl>

      <DotIndicators>
        {slides.map((_, index) => (
          <Dot
            key={index}
            className={index === currentSlideIndex ? 'active' : ''}
            onClick={() => goToSlide(index)}
          />
        ))}
      </DotIndicators>
    </HeroSectionContainer>
  );
};

export default HeroSection;
