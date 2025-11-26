import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Button, Icon } from "./UtilityComponents";
import { useFirebase } from "../context/FirebaseContext";
import { ref, listAll, getDownloadURL } from "firebase/storage";

// ---------------- STYLED COMPONENTS - Mobile-first approach ----------------
const HeroSectionContainer = styled.section`
  position: relative;
  min-height: 100vh;
  height: 100vh;
  padding-top: 64px; /* Mobile header height */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  overflow: hidden;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  transition: background-image 0.8s ease-in-out;

  @media (min-width: 640px) {
    padding-top: 72px;
  }

  @media (min-width: 1024px) {
    padding-top: 80px;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ overlayOpacity = 0.6 }) =>
    `linear-gradient(135deg, rgba(79, 70, 229, ${overlayOpacity}) 0%, rgba(118, 75, 162, ${overlayOpacity}) 100%)`};
  z-index: 1;
  transition: opacity 0.3s ease;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 1.5rem; /* Mobile padding */
  width: 100%;
  animation: fadeIn 1s ease-out;

  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem; /* Mobile-first */
  line-height: 1.2;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
  animation: slideInUp 1s ease-out;
  font-weight: 700;

  @media (min-width: 640px) {
    font-size: 2.5rem;
  }

  @media (min-width: 768px) {
    font-size: 3rem;
  }

  @media (min-width: 1024px) {
    font-size: 3.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem; /* Mobile-first */
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.95;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
  animation: slideInUp 1s ease-out 0.3s both;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 640px) {
    font-size: 1.125rem;
  }

  @media (min-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 2.5rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.375rem;
  }
`;

const CtaButtons = styled.div`
  display: flex;
  flex-direction: column; /* Mobile: stacked */
  gap: 1rem;
  justify-content: center;
  align-items: stretch;
  animation: slideInUp 1s ease-out 0.6s both;
  max-width: 500px;
  margin: 0 auto;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  @media (min-width: 768px) {
    gap: 1.5rem;
  }
`;

const CarouselControl = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem;
  cursor: pointer;
  z-index: 3;
  border-radius: 50%;
  width: 48px; /* Touch target size */
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover,
  &:focus {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-50%) scale(1.1);
  }

  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &.left {
    left: 0.5rem;

    @media (min-width: 768px) {
      left: 1rem;
    }
  }

  &.right {
    right: 0.5rem;

    @media (min-width: 768px) {
      right: 1rem;
    }
  }

  @media (max-width: 640px) {
    display: none; /* Hide on very small screens to save space */
  }
`;

const DotIndicators = styled.div`
  position: absolute;
  bottom: 1rem; /* Mobile spacing */
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;

  @media (min-width: 768px) {
    bottom: 2rem;
    gap: 0.75rem;
  }
`;

const Dot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  min-width: 10px;
  min-height: 10px;

  &:hover,
  &:focus {
    background: rgba(255, 255, 255, 0.6);
    transform: scale(1.2);
  }

  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }

  &.active {
    background: white;
    width: 12px;
    height: 12px;
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
  }
`;

// ---------------- MAIN COMPONENT ----------------
const HeroSection = ({ data = [], isEditing, onUpdate }) => {
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { storage } = useFirebase();
  const isLoaded = useRef(false); // prevent re-fetch loops

  // 🔹 Load images only once (guarded + cached)
  useEffect(() => {
    const loadSlides = async () => {
      if (!storage || isLoaded.current) return;
      isLoaded.current = true;

      // Try cached data first
      const cached = sessionStorage.getItem("heroSlides");
      if (cached) {
        setSlides(JSON.parse(cached));
        return;
      }

      try {
        const folderRef = ref(storage, "carousel");
        const result = await listAll(folderRef);

        const urls = [];
        for (const item of result.items) {
          // sequential loading to prevent Chrome overload
          const url = await getDownloadURL(item);
          urls.push(url);
          await new Promise((res) => setTimeout(res, 100));
        }

        const fetchedSlides = urls.map((url, index) => ({
          id: `slide${index + 1}`,
          imageUrl: url,
          title: data[index]?.title || `Slide ${index + 1}`,
          subtitle:
            data[index]?.subtitle ||
            "Making a lasting impact in our community through faith and purpose.",
          ctaPrimaryText: data[index]?.ctaPrimaryText || "Join Us",
          ctaPrimaryLink: data[index]?.ctaPrimaryLink || "#services",
          ctaSecondaryText: data[index]?.ctaSecondaryText || "Learn More",
          ctaSecondaryLink: data[index]?.ctaSecondaryLink || "#about",
        }));

        setSlides(fetchedSlides);
        sessionStorage.setItem("heroSlides", JSON.stringify(fetchedSlides));
      } catch (err) {
        console.error("Error fetching hero slides:", err);
        setSlides(data);
      }
    };

    loadSlides();
  }, [storage, data]);

  // 🔹 Auto-play carousel (runs once)
  useEffect(() => {
    if (isEditing || slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides, isEditing]);

  if (slides.length === 0) {
    return (
      <HeroSectionContainer
        id="home"
        style={{
          backgroundImage: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
        }}
      >
        <Overlay overlayOpacity={0.6} />
        <ContentWrapper>
          <Title>Loading...</Title>
        </ContentWrapper>
      </HeroSectionContainer>
    );
  }

  const currentSlide = slides[currentSlideIndex];

  // Handle smooth scroll for anchor links
  const handleSmoothScroll = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <HeroSectionContainer
      id="home"
      style={{
        backgroundImage: `url(${currentSlide.imageUrl})`,
      }}
      role="banner"
      aria-label="Hero section"
    >
      <Overlay overlayOpacity={currentSlide.overlayOpacity ?? 0.6} />
      <ContentWrapper key={currentSlide.id}>
        <Title>{currentSlide.title}</Title>
        <Subtitle>{currentSlide.subtitle}</Subtitle>
        <CtaButtons>
          {currentSlide.ctaPrimaryText && (
            <Button 
              as="a" 
              href={currentSlide.ctaPrimaryLink} 
              className="btn-primary"
              onClick={(e) => handleSmoothScroll(e, currentSlide.ctaPrimaryLink)}
              aria-label={currentSlide.ctaPrimaryText}
            >
              {currentSlide.ctaPrimaryText}
            </Button>
          )}
          {currentSlide.ctaSecondaryText && (
            <Button 
              as="a" 
              href={currentSlide.ctaSecondaryLink} 
              className="btn-secondary"
              onClick={(e) => handleSmoothScroll(e, currentSlide.ctaSecondaryLink)}
              aria-label={currentSlide.ctaSecondaryText}
            >
              {currentSlide.ctaSecondaryText}
            </Button>
          )}
        </CtaButtons>
      </ContentWrapper>

      {slides.length > 1 && (
        <>
          <CarouselControl 
            className="left" 
            onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
            aria-label="Previous slide"
          >
            <Icon name="chevronLeft" size={24} />
          </CarouselControl>
          <CarouselControl 
            className="right" 
            onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
            aria-label="Next slide"
          >
            <Icon name="chevronRight" size={24} />
          </CarouselControl>

          <DotIndicators role="tablist" aria-label="Slide indicators">
            {slides.map((_, index) => (
              <Dot
                key={index}
                className={index === currentSlideIndex ? "active" : ""}
                onClick={() => setCurrentSlideIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                role="tab"
                aria-selected={index === currentSlideIndex}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setCurrentSlideIndex(index);
                  }
                }}
              />
            ))}
          </DotIndicators>
        </>
      )}
    </HeroSectionContainer>
  );
};

export default HeroSection;
