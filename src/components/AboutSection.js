import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Icon } from './UtilityComponents';

const SectionContainer = styled.section`
  padding: 4rem 0; /* py-16 */
  background-color: #F9FAFB; /* gray-50 */

  .dark & {
    background-color: #1F2937; /* gray-800 */
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem; /* px-4 */
`;

const SectionTitle = styled.h2`
  font-size: 2.25rem; /* text-4xl */
  font-weight: 700; /* font-bold */
  color: #1F2937; /* gray-900 */
  margin-bottom: 2rem; /* mb-8 */
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  .dark & {
    color: white;
  }
`;

const AboutContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem; /* space-y-8 */

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 3rem; /* md:space-x-12 */
    margin-top: 0; /* md:space-y-0 */
  }
`;

const ImageContainer = styled.div`
  flex-shrink: 0;
  img {
    width: 100%;
    max-width: 28rem; /* max-w-md */
    height: auto;
    border-radius: 0.5rem; /* rounded-lg */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadow-lg */
  }
`;

const TextContent = styled.div`
  text-align: center;
  max-width: 42rem; /* max-w-2xl */

  @media (min-width: 768px) {
    text-align: left;
  }

  h3 {
    font-size: 1.875rem; /* text-3xl */
    font-weight: 600; /* font-semibold */
    color: #1F2937; /* gray-900 */
    margin-bottom: 1rem; /* mb-4 */

    .dark & {
      color: white;
    }
  }

  p {
    color: #374151; /* gray-700 */
    line-height: 1.625; /* leading-relaxed */

    .dark & {
      color: #D1D5DB; /* gray-300 */
    }
  }
`;

const Input = styled.input`
  margin-top: 1rem; /* mt-4 */
  padding: 0.5rem;
  width: 100%;
  border: 1px solid #D1D5DB; /* gray-300 */
  border-radius: 0.375rem; /* rounded-md */
  background-color: white;
  color: #1F2937;

  .dark & {
    border-color: #4B5563; /* gray-600 */
    background-color: #374151; /* gray-700 */
    color: white;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  color: #374151;
  line-height: 1.625;
  padding: 0.5rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.375rem;
  background-color: white;

  .dark & {
    border-color: #4B5563;
    background-color: #374151;
    color: white;
  }
`;

const StyledSaveButton = styled(Button)`
  margin-top: 1rem;
`;

const AboutSection = ({ data, isEditing, onUpdate }) => {
  const [tempData, setTempData] = useState(data);

  useEffect(() => {
    setTempData(data);
  }, [data]);

  const handleSave = () => {
    onUpdate('about', tempData);
  };

  return (
    <SectionContainer id="about">
      <ContentWrapper>
        <SectionTitle>
          <Icon name="church" className="mr-3" /> {isEditing ? 'Edit About Us' : 'About Us'}
        </SectionTitle>
        <AboutContent>
          <ImageContainer>
            <img
              src={tempData.imageUrl}
              alt="Church Building"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x400/6366F1/FFFFFF?text=Church+Image+Not+Found"; }}
            />
            {isEditing && (
              <Input
                type="text"
                placeholder="Image URL"
                value={tempData.imageUrl}
                onChange={(e) => setTempData({ ...tempData, imageUrl: e.target.value })}
              />
            )}
          </ImageContainer>
          <TextContent>
            {isEditing ? (
              <>
                <Input
                  type="text"
                  value={tempData.title}
                  onChange={(e) => setTempData({ ...tempData, title: e.target.value })}
                />
                <TextArea
                  value={tempData.text}
                  onChange={(e) => setTempData({ ...tempData, text: e.target.value })}
                  rows="8"
                />
                <StyledSaveButton onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">Save About</StyledSaveButton>
              </>
            ) : (
              <>
                <h3>{data.title}</h3>
                <p>{data.text}</p>
              </>
            )}
          </TextContent>
        </AboutContent>
      </ContentWrapper>
    </SectionContainer>
  );
};

export default AboutSection;
