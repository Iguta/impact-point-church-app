import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Input, TextArea, FormSpace, SectionContainer, SectionTitle } from './UtilityComponents';
import { isEqual } from 'lodash';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Reusing SectionContainer and SectionTitle from UtilityComponents
const AboutContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: translateY(${({ isVisible }) => (isVisible ? 0 : '30px')});
  transition: opacity 0.8s ease, transform 0.8s ease;
`;

const MissionVisionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* Mobile: single column */
  gap: 2rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
  }
`;

const MissionVisionCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: left;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  @media (min-width: 640px) {
    padding: 2.5rem;
    border-radius: 15px;
  }

  @media (min-width: 1024px) {
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  text-align: center;

  @media (min-width: 640px) {
    font-size: 1.75rem;
  }

  @media (min-width: 1024px) {
    font-size: 2rem;
  }
`;

const AboutText = styled.p`
  font-size: 1rem; /* Mobile-first */
  line-height: 1.7;
  margin-bottom: 1.5rem;
  color: #374151;
  text-align: left;

  @media (min-width: 640px) {
    font-size: 1.0625rem;
    margin-bottom: 2rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.125rem;
    line-height: 1.8;
  }
`;

const AboutImageWrapper = styled.div`
  margin-top: 2rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  @media (min-width: 1024px) {
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
    }
  }

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const AboutSectionContainer = styled(SectionContainer)`
  background: linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%);
  max-width: none;
  margin: 0;
  padding: 3rem 1rem;
  width: 100%;

  @media (min-width: 640px) {
    padding: 4rem 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 5rem 2rem;
  }

  ${AboutContent} {
    padding: 0;

    @media (min-width: 640px) {
      padding: 0 1rem;
    }

    @media (min-width: 1024px) {
      padding: 0 2rem;
    }
  }
`;

const AboutSection = ({ data, isEditing, onUpdate }) => {
  const [tempData, setTempData] = useState(data);
  const [contentRef, isVisible] = useScrollAnimation({ threshold: 0.1 });

  useEffect(() => {
    // When not editing, sync local state from props only if changed
    if (!isEditing && !isEqual(data, tempData)) {
      setTempData(data);
    }
  }, [data, isEditing, tempData]);

  const handleSave = () => {
    onUpdate('about', tempData);
  };

  // Ensure we have the right data structure (support both old and new format)
  const missionData = data?.mission || (data?.title ? { title: data.title, text: data.text } : { title: "Our Mission", text: "" });
  const visionData = data?.vision || { title: "Our Vision", text: "" };

  return (
    <AboutSectionContainer id="about" role="region" aria-labelledby="about-title">
      <AboutContent ref={contentRef} isVisible={isVisible}>
        <SectionTitle id="about-title">About Us</SectionTitle>
        {isEditing ? (
          <FormSpace>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#1f2937' }}>Mission</h3>
            <Input
              type="text"
              placeholder="Mission Title"
              value={tempData?.mission?.title || tempData?.title || ''}
              onChange={(e) => setTempData({ 
                ...tempData, 
                mission: { ...tempData.mission, title: e.target.value },
                title: e.target.value // Support old format
              })}
              aria-label="Mission title"
            />
            <TextArea
              placeholder="Mission Text"
              value={tempData?.mission?.text || tempData?.text || ''}
              onChange={(e) => setTempData({ 
                ...tempData, 
                mission: { ...tempData.mission, text: e.target.value },
                text: e.target.value // Support old format
              })}
              rows="6"
              aria-label="Mission description"
            />
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '1rem', color: '#1f2937' }}>Vision</h3>
            <Input
              type="text"
              placeholder="Vision Title"
              value={tempData?.vision?.title || ''}
              onChange={(e) => setTempData({ 
                ...tempData, 
                vision: { ...tempData.vision, title: e.target.value }
              })}
              aria-label="Vision title"
            />
            <TextArea
              placeholder="Vision Text"
              value={tempData?.vision?.text || ''}
              onChange={(e) => setTempData({ 
                ...tempData, 
                vision: { ...tempData.vision, text: e.target.value }
              })}
              rows="6"
              aria-label="Vision description"
            />

            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '1rem', color: '#1f2937' }}>Image URL (Optional)</h3>
            <Input
              type="text"
              placeholder="Image URL"
              value={tempData?.imageUrl || ''}
              onChange={(e) => setTempData({ ...tempData, imageUrl: e.target.value })}
              aria-label="About image URL"
            />
            
            <Button onClick={handleSave} className="bg-indigo-600">Save About</Button>
          </FormSpace>
        ) : (
          <>
            <MissionVisionGrid>
              {/* Mission Card */}
              <MissionVisionCard>
                <CardTitle>{missionData.title}</CardTitle>
                <AboutText>
                  {missionData.text ? missionData.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < missionData.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  )) : 'Our mission is to make a lasting impact in our community through faith and purpose.'}
                </AboutText>
              </MissionVisionCard>

              {/* Vision Card */}
              <MissionVisionCard>
                <CardTitle>{visionData.title}</CardTitle>
                <AboutText>
                  {visionData.text ? visionData.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < visionData.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  )) : 'Our vision is to be a beacon of hope and transformation in our community.'}
                </AboutText>
              </MissionVisionCard>
            </MissionVisionGrid>

            {/* Image below Mission and Vision */}
            {(data?.imageUrl || tempData?.imageUrl) && (
              <AboutImageWrapper>
                <img
                  src={data?.imageUrl || tempData?.imageUrl}
                  alt="About Impact Point Church"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover'
                  }}
                  loading="lazy"
                  onError={(e) => {
                    if (e.target.src !== "https://firebasestorage.googleapis.com/v0/b/impact-point-church.firebasestorage.app/o/IMG-20250810-WA0012.jpg?alt=media&token=16d6924b-3eea-4197-8899-f40b7d5933a6") {
                      e.target.onerror = null;
                      e.target.src = "https://firebasestorage.googleapis.com/v0/b/impact-point-church.firebasestorage.app/o/IMG-20250810-WA0012.jpg?alt=media&token=16d6924b-3eea-4197-8899-f40b7d5933a6";
                    }
                  }}
                />
              </AboutImageWrapper>
            )}
          </>
        )}
      </AboutContent>
    </AboutSectionContainer>
  );
};

export default AboutSection;
