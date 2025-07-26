import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Icon, Input, TextArea, FormSpace, SectionContainer, SectionTitle } from './UtilityComponents';
import { isEqual } from 'lodash';

// Reusing SectionContainer and SectionTitle from UtilityComponents
const AboutContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const AboutText = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  color: #555; /* from HTML */
`;

const AboutSectionContainer = styled(SectionContainer)`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); /* from HTML */
  max-width: none;
  margin: 0; /* Override default SectionContainer margin */
  padding-left: 0; /* Override default SectionContainer padding */
  padding-right: 0; /* Override default SectionContainer padding */
  width: 100%; /* Ensure it takes full width */

  /* Add back padding to inner content if desired, or let AboutContent handle it */
  ${AboutContent} {
    padding: 0 2rem; /* Add horizontal padding back to the content inside */
  }

  @media (max-width: 768px) {
    ${AboutContent} {
      padding: 0 1rem; /* Adjust padding for smaller screens */
    }
  }
`;

const AboutSection = ({ data, isEditing, onUpdate }) => {
  const [tempData, setTempData] = useState(data);

  useEffect(() => {
    if(!isEditing && isEqual(data, tempData))
    setTempData(data);
  }, [data]);

  const handleSave = () => {
    onUpdate('about', tempData);
  };

  return (
    <AboutSectionContainer id="about">
      <AboutContent> {/* Apply fade-in class */}
        <SectionTitle>Our Mission</SectionTitle>
        {isEditing ? (
          <FormSpace>
            <Input
              type="text"
              value={tempData.title}
              onChange={(e) => setTempData({ ...tempData, title: e.target.value })}
            />
            <TextArea
              value={tempData.text}
              onChange={(e) => setTempData({ ...tempData, text: e.target.value })}
              rows="10"
            />
            <Input
              type="text"
              placeholder="Image URL"
              value={tempData.imageUrl}
              onChange={(e) => setTempData({ ...tempData, imageUrl: e.target.value })}
            />
            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">Save About</Button>
          </FormSpace>
        ) : (
          <>
            <AboutText>{data.text.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</AboutText>
            {data.imageUrl && (
              <img
                src={data.imageUrl}
                alt="About Us"
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x400/c3cfe2/555?text=About+Us+Image"; }}
              />
            )}
          </>
        )}
      </AboutContent>
    </AboutSectionContainer>
  );
};

export default AboutSection;
