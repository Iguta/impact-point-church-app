import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Input, TextArea, FormSpace, SectionContainer, SectionTitle } from './UtilityComponents';
import { PlayCircle, Wifi } from 'lucide-react';
import isEqual from 'lodash.isequal';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const LiveStreamSectionContainer = styled(SectionContainer)`
  background-color: #f8f9fa;
  max-width: none;
  width: 100%;
  margin: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LiveStreamContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem; /* Mobile-first */
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: translateY(${({ isVisible }) => (isVisible ? 0 : '30px')});
  transition: opacity 0.8s ease, transform 0.8s ease;
  text-align: center; /* Center all content inside */

  @media (min-width: 640px) {
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #EF4444; /* Red */
  font-weight: bold;
  margin-bottom: 1rem;
  font-size: 1.2rem;

  svg {
    margin-right: 0.5rem;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const VideoEmbedContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 1.5rem;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const StreamTitle = styled.h3`
  font-size: 1.5rem; /* Mobile-first */
  color: #1f2937;
  margin-bottom: 0.75rem;
  font-weight: 700;
  line-height: 1.3;
  text-align: center; /* Ensure title is centered */

  @media (min-width: 640px) {
    font-size: 1.75rem;
  }

  @media (min-width: 1024px) {
    font-size: 2rem;
  }
`;

const StreamDescription = styled.p`
  color: #4b5563;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 0.9375rem;
  text-align: center; /* Ensure description is centered */

  @media (min-width: 640px) {
    font-size: 1rem;
  }
`;

const GoLiveButton = styled(Button)`
  background: linear-gradient(45deg, #22C55E, #16A34A); /* Green gradient */
  color: white;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
  margin: 0 auto; /* Center the button */
  display: inline-flex; /* Keep inline-flex for icon alignment */

  &:hover {
    background: linear-gradient(45deg, #16A34A, #15803D);
  }
`;

const AdminControls = styled(FormSpace)`
  background: #F0F0F0;
  padding: 1.5rem;
  border-radius: 10px;
  margin-top: 2rem;
  text-align: left;
  
  .dark & {
    background-color: #2C3E50;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  input[type="checkbox"] {
    margin-right: 0.5rem;
    width: 1.2rem;
    height: 1.2rem;
  }
  label {
    font-weight: bold;
    color: #2c3e50;
    .dark & {
        color: white;
    }
  }
`;

const LiveStreamSection = ({ data, isEditing, onUpdate }) => {
  const [tempStreamData, setTempStreamData] = useState(data);

  useEffect(() => {
    if(!isEditing && !isEqual(data, tempStreamData)){
      console.log("tempStreamData changed:", tempStreamData)
      setTempStreamData(data)
    }
  },
  [data,tempStreamData, isEditing]);

  const handleSave = () => {
    onUpdate('liveStream', tempStreamData);
  };

  const [contentRef, isVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <LiveStreamSectionContainer id="livestream" role="region" aria-labelledby="livestream-title">
      <ContentWrapper ref={contentRef}>
        <SectionTitle id="livestream-title">Live Stream</SectionTitle>
        <LiveStreamContent isVisible={isVisible}>
        {isEditing ? (
          <AdminControls>
            <CheckboxContainer>
              <input
                type="checkbox"
                checked={tempStreamData.isLive}
                onChange={(e) => setTempStreamData({ ...tempStreamData, isLive: e.target.checked })}
              />
              <label>Is Live Now?</label>
            </CheckboxContainer>
            <Input
              type="text"
              placeholder="Stream Title"
              value={tempStreamData.title}
              onChange={(e) => setTempStreamData({ ...tempStreamData, title: e.target.value })}
            />
            <TextArea
              placeholder="Stream Description"
              value={tempStreamData.description}
              onChange={(e) => setTempStreamData({ ...tempStreamData, description: e.target.value })}
              rows="3"
            />
            <Input
              type="text"
              placeholder="Video Embed URL (e.g., YouTube embed link)"
              value={tempStreamData.embedUrl}
              onChange={(e) => setTempStreamData({ ...tempStreamData, embedUrl: e.target.value })}
            />
            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Live Stream Settings</Button>
          </AdminControls>
        ) : (
          <>
            {tempStreamData.isLive && tempStreamData.embedUrl ? (
              <>
                <LiveIndicator>
                  <Wifi size={24} /> LIVE NOW
                </LiveIndicator>
                <VideoEmbedContainer>
                  <iframe
                    src={tempStreamData.embedUrl}
                    title={tempStreamData.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </VideoEmbedContainer>
                <StreamTitle>{tempStreamData.title}</StreamTitle>
                <StreamDescription>{tempStreamData.description}</StreamDescription>
                <GoLiveButton as="a" href={tempStreamData.embedUrl.split('?')[0]} target="_blank" rel="noopener noreferrer">
                  <PlayCircle size={24} style={{ marginRight: '0.5rem' }} /> Watch Live
                </GoLiveButton>
              </>
            ) : (
              <>
                <StreamTitle>No Live Stream Currently Active</StreamTitle>
                <StreamDescription>
                  Check back during our regular service times or visit our sermons page for past messages.
                </StreamDescription>
                <GoLiveButton as="a" href="#sermons">
                  <PlayCircle size={24} style={{ marginRight: '0.5rem' }} /> View Past Sermons
                </GoLiveButton>
              </>
            )}
          </>
        )}
        </LiveStreamContent>
      </ContentWrapper>
    </LiveStreamSectionContainer>
  );
};

export default LiveStreamSection;
