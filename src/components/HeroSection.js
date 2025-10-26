import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Button, Icon } from "./UtilityComponents";
import { useFirebase } from "../context/FirebaseContext";
import { ref, listAll, getDownloadURL } from "firebase/storage";

// ---------------- STYLED COMPONENTS ----------------
const HeroSectionContainer = styled.section`
  position: relative;
  height: 100vh;
  padding-top: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  transition: background-image 0.8s ease-in-out;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ overlayOpacity = 0.6 }) =>
    `linear-gradient(135deg, rgba(102, 126, 234, ${overlayOpacity}) 0%, rgba(118, 75, 162, ${overlayOpacity}) 100%)`};
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
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: slideInUp 1s ease-out;
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  animation: slideInUp 1s ease-out 0.3s both;
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CtaButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: slideInUp 1s ease-out 0.6s both;
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

  if (slides.length === 0) return <p>Loading slides...</p>;
  const currentSlide = slides[currentSlideIndex];

  return (
    <HeroSectionContainer
      id="home"
      style={{
        backgroundImage: `url(${currentSlide.imageUrl})`,
        padding: "200px",
        backgroundPosition: "center top 2px",
      }}
    >
      <Overlay overlayOpacity={currentSlide.overlayOpacity ?? 0.6} />
      <ContentWrapper key={currentSlide.id}>
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

      <CarouselControl className="left" onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}>
        <Icon name="chevronLeft" size={32} />
      </CarouselControl>
      <CarouselControl className="right" onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}>
        <Icon name="chevronRight" size={32} />
      </CarouselControl>

      <DotIndicators>
        {slides.map((_, index) => (
          <Dot
            key={index}
            className={index === currentSlideIndex ? "active" : ""}
            onClick={() => setCurrentSlideIndex(index)}
          />
        ))}
      </DotIndicators>
    </HeroSectionContainer>
  );
};

export default HeroSection;
