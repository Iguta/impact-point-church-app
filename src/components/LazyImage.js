import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  background-color: #f3f4f6;
  display: block;
  width: 100%;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: ${({ objectFit }) => objectFit || 'cover'};
  display: block;
  transition: opacity 0.3s ease-in-out;
  opacity: ${({ loaded }) => (loaded ? 1 : 0)};
`;

const Placeholder = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
  
  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

/**
 * LazyImage component for optimized image loading
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {string} objectFit - CSS object-fit property
 * @param {string} className - Additional CSS classes
 */
const LazyImage = ({ src, alt, objectFit = 'cover', className = '', ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Load the image
              const imageSrc = img.dataset.src;
              if (imageSrc && !loaded && !error) {
                const tempImg = new Image();
                tempImg.onload = () => {
                  img.src = imageSrc;
                  setLoaded(true);
                };
                tempImg.onerror = () => {
                  setError(true);
                };
                tempImg.src = imageSrc;
              }
              // Stop observing once image is loading
              if (loaded || error) {
                observerRef.current.unobserve(img);
              }
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before image enters viewport
        }
      );

      observerRef.current.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      const tempImg = new Image();
      tempImg.onload = () => {
        img.src = img.dataset.src;
        setLoaded(true);
      };
      tempImg.onerror = () => setError(true);
      tempImg.src = img.dataset.src;
    }

    return () => {
      if (observerRef.current && img) {
        observerRef.current.unobserve(img);
      }
    };
  }, [loaded, error]);

  return (
    <ImageContainer className={className}>
      {!loaded && !error && <Placeholder aria-hidden="true" />}
      <StyledImage
        ref={imgRef}
        data-src={src}
        alt={alt || ''}
        loaded={loaded}
        objectFit={objectFit}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
    </ImageContainer>
  );
};

export default LazyImage;

