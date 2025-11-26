import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Icon, SectionContainer, SectionTitle } from './UtilityComponents';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const SermonsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* Mobile: single column */
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const SermonCard = styled.article`
  background-color: #ffffff;
  padding: 1.25rem; /* Mobile padding */
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e5e7eb;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: translateY(${({ isVisible }) => (isVisible ? 0 : '20px')});
  animation: ${({ isVisible, index }) => 
    isVisible ? `fadeInUp 0.6s ease-out ${index * 0.1}s both` : 'none'};

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (min-width: 640px) {
    padding: 1.5rem;
  }

  @media (min-width: 1024px) {
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      border-color: #d1d5db;
    }
  }
`;

const CardTitle = styled.h3`
  font-size: 1.25rem; /* Mobile-first */
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
  line-height: 1.3;

  @media (min-width: 640px) {
    font-size: 1.375rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.5rem;
  }
`;

const CardDetail = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  line-height: 1.5;

  strong {
    font-weight: 600;
    color: #374151;
  }

  @media (min-width: 640px) {
    font-size: 0.9375rem;
  }
`;

const CardDescription = styled.p`
  color: #4b5563;
  margin-bottom: 1rem;
  flex-grow: 1;
  line-height: 1.6;
  font-size: 0.9375rem;

  @media (min-width: 640px) {
    font-size: 1rem;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-top: auto;
  flex-wrap: wrap;

  a {
    color: #4f46e5;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    font-size: 0.9375rem;
    padding: 0.5rem 0;
    transition: all 0.2s ease;
    border-radius: 4px;

    &:hover,
    &:focus {
      color: #4338ca;
      transform: translateX(2px);
    }

    &:focus-visible {
      outline: 2px solid #4f46e5;
      outline-offset: 2px;
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const AdminButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem; /* space-x-2 */
  margin-top: 1rem; /* mt-4 */
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.375rem;
  background-color: white;
  color: #1F2937;
  width: 100%;

  .dark & {
    border-color: #4B5563;
    background-color: #374151;
    color: white;
  }
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.375rem;
  background-color: white;
  color: #1F2937;
  width: 100%;

  .dark & {
    border-color: #4B5563;
    background-color: #374151;
    color: white;
  }
`;

const FormSpace = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* space-y-3 */
`;

const SermonsSection = ({ data, isEditing, onUpdate }) => {
  const [tempSermons, setTempSermons] = useState(data);
  const [editingSermon, setEditingSermon] = useState(null);
  const [newSermon, setNewSermon] = useState({
    title: '', speaker: '', date: '', description: '', videoLink: '', audioLink: ''
  });

  useEffect(() => {
    setTempSermons(data);
  }, [data]);

  const startEdit = (sermon) => {
    setEditingSermon(sermon);
  };

  const cancelEdit = () => {
    setEditingSermon(null);
  };

  const handleUpdateSermon = () => {
    if (editingSermon) {
      const updatedSermons = tempSermons.map(s =>
        s.id === editingSermon.id ? editingSermon : s
      );
      setTempSermons(updatedSermons);
      onUpdate('sermons', updatedSermons);
      setEditingSermon(null);
    }
  };

  const handleAddSermon = () => {
    if (newSermon.title && newSermon.speaker && newSermon.date) {
      const sermonToAdd = { ...newSermon, id: `sermon-${Date.now()}` };
      const updatedSermons = [...tempSermons, sermonToAdd];
      setTempSermons(updatedSermons);
      onUpdate('sermons', updatedSermons);
      setNewSermon({ title: '', speaker: '', date: '', description: '', videoLink: '', audioLink: '' });
    }
  };

  const handleDeleteSermon = (id) => {
    const updatedSermons = tempSermons.filter(s => s.id !== id);
    setTempSermons(updatedSermons);
    onUpdate('sermons', updatedSermons, 'delete');
  };

  // Sort sermons by date in descending order
  const sortedSermons = [...tempSermons].sort((a, b) => new Date(b.date) - new Date(a.date));
  const [sectionRef, isSectionVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <SectionContainer id="sermons" role="region" aria-labelledby="sermons-title">
      <ContentWrapper ref={sectionRef}>
        <SectionTitle id="sermons-title">Latest Sermons</SectionTitle>
        <SermonsGrid>
          {sortedSermons.map((sermon, index) => (
            <SermonCard 
              key={sermon.id} 
              isVisible={isSectionVisible}
              index={index}
            >
              {isEditing && editingSermon?.id === sermon.id ? (
                // Edit form for sermon
                <FormSpace>
                  <Input
                    type="text"
                    value={editingSermon.title}
                    onChange={(e) => setEditingSermon({ ...editingSermon, title: e.target.value })}
                  />
                  <Input
                    type="text"
                    value={editingSermon.speaker}
                    onChange={(e) => setEditingSermon({ ...editingSermon, speaker: e.target.value })}
                  />
                  <Input
                    type="date"
                    value={editingSermon.date}
                    onChange={(e) => setEditingSermon({ ...editingSermon, date: e.target.value })}
                  />
                  <TextArea
                    value={editingSermon.description}
                    onChange={(e) => setEditingSermon({ ...editingSermon, description: e.target.value })}
                    rows="3"
                  />
                  <Input
                    type="text"
                    placeholder="Video Embed Link (YouTube)"
                    value={editingSermon.videoLink}
                    onChange={(e) => setEditingSermon({ ...editingSermon, videoLink: e.target.value })}
                  />
                  <Input
                    type="text"
                    placeholder="Audio Link (MP3, etc.)"
                    value={editingSermon.audioLink}
                    onChange={(e) => setEditingSermon({ ...editingSermon, audioLink: e.target.value })}
                  />
                  <AdminButtonsContainer>
                    <Button onClick={handleUpdateSermon} className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1">Save</Button>
                    <Button onClick={cancelEdit} className="bg-gray-400 hover:bg-gray-500 text-white flex-1">Cancel</Button>
                  </AdminButtonsContainer>
                </FormSpace>
              ) : (
                // Display sermon details
                <>
                  <CardTitle>{sermon.title}</CardTitle>
                  <CardDetail><strong>Speaker:</strong> {sermon.speaker}</CardDetail>
                  <CardDetail><strong>Date:</strong> {sermon.date}</CardDetail>
                  <CardDescription>{sermon.description}</CardDescription>
                  <LinksContainer>
                    {sermon.videoLink && (
                      <a
                        href={sermon.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Watch sermon: ${sermon.title}`}
                      >
                        <Icon name="externalLink" size={18} /> Watch
                      </a>
                    )}
                    {sermon.audioLink && (
                      <a
                        href={sermon.audioLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Listen to sermon: ${sermon.title}`}
                      >
                        <Icon name="externalLink" size={18} /> Listen
                      </a>
                    )}
                  </LinksContainer>
                  {isEditing && (
                    <AdminButtonsContainer>
                      <Button onClick={() => startEdit(sermon)} className="bg-yellow-500 hover:bg-yellow-600 text-white flex-1">
                        <Icon name="edit" className="mr-1" /> Edit
                      </Button>
                      <Button onClick={() => handleDeleteSermon(sermon.id)} className="bg-red-500 hover:bg-red-600 text-white flex-1">
                        <Icon name="trash2" className="mr-1" /> Delete
                      </Button>
                    </AdminButtonsContainer>
                  )}
                </>
              )}
            </SermonCard>
          ))}

          {isEditing && (
            <SermonCard>
              <CardTitle>Add New Sermon</CardTitle>
              <FormSpace>
                <Input
                  type="text"
                  placeholder="Title"
                  value={newSermon.title}
                  onChange={(e) => setNewSermon({ ...newSermon, title: e.target.value })}
                />
                <Input
                  type="text"
                  placeholder="Speaker"
                  value={newSermon.speaker}
                  onChange={(e) => setNewSermon({ ...newSermon, speaker: e.target.value })}
                />
                <Input
                  type="date"
                  placeholder="Date (YYYY-MM-DD)"
                  value={newSermon.date}
                  onChange={(e) => setNewSermon({ ...newSermon, date: e.target.value })}
                />
                <TextArea
                  placeholder="Description"
                  value={newSermon.description}
                  onChange={(e) => setNewSermon({ ...newSermon, description: e.target.value })}
                  rows="3"
                />
                <Input
                  type="text"
                  placeholder="Video Embed Link"
                  value={newSermon.videoLink}
                  onChange={(e) => setNewSermon({ ...newSermon, videoLink: e.target.value })}
                />
                <Input
                  type="text"
                  placeholder="Audio Link"
                  value={newSermon.audioLink}
                  onChange={(e) => setNewSermon({ ...newSermon, audioLink: e.target.value })}
                />
                <Button onClick={handleAddSermon} className="bg-green-600 hover:bg-green-700 text-white">
                  <Icon name="plusCircle" className="mr-1" /> Add Sermon
                </Button>
              </FormSpace>
            </SermonCard>
          )}
        </SermonsGrid>
      </ContentWrapper>
    </SectionContainer>
  );
};

export default SermonsSection;
