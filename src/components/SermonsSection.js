import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Icon } from './UtilityComponents';

const SectionContainer = styled.section`
  padding: 4rem 0; /* py-16 */
  background-color: white;

  .dark & {
    background-color: #1F2937; /* gray-900 */
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

const SermonsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem; /* gap-8 */

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr); /* md:grid-cols-2 */
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr); /* lg:grid-cols-3 */
  }
`;

const SermonCard = styled.div`
  background-color: #F9FAFB; /* gray-50 */
  padding: 1.5rem; /* p-6 */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadow-md */
  display: flex;
  flex-direction: column;

  .dark & {
    background-color: #1F2937; /* gray-800 */
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem; /* text-2xl */
  font-weight: 600; /* font-semibold */
  color: #1F2937; /* gray-900 */
  margin-bottom: 0.5rem; /* mb-2 */

  .dark & {
    color: white;
  }
`;

const CardDetail = styled.p`
  color: #374151; /* gray-700 */
  font-size: 0.875rem; /* text-sm */
  margin-bottom: 0.25rem; /* mb-1 */

  strong {
    font-weight: 600;
  }

  .dark & {
    color: #D1D5DB; /* gray-300 */
  }
`;

const CardDescription = styled.p`
  color: #374151; /* gray-700 */
  margin-bottom: 1rem; /* mb-4 */
  flex-grow: 1;

  .dark & {
    color: #D1D5DB; /* gray-300 */
  }
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1rem; /* space-x-4 */
  margin-top: auto;

  a {
    color: #4F46E5; /* indigo-600 */
    text-decoration: none;
    display: flex;
    align-items: center;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: #3730A3; /* indigo-800 */
    }

    .dark & {
      color: #818CF8; /* indigo-400 */
      &:hover {
        color: #A5B4FC; /* indigo-300 */
      }
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
    onUpdate('sermons', updatedSermons);
  };

  // Sort sermons by date in descending order
  const sortedSermons = [...tempSermons].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <SectionContainer id="sermons">
      <ContentWrapper>
        <SectionTitle>
          <Icon name="mic" className="mr-3" /> Latest Sermons
        </SectionTitle>
        <SermonsGrid>
          {sortedSermons.map((sermon) => (
            <SermonCard key={sermon.id}>
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
                      >
                        <Icon name="externalLink" className="mr-1" /> Watch
                      </a>
                    )}
                    {sermon.audioLink && (
                      <a
                        href={sermon.audioLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon name="externalLink" className="mr-1" /> Listen
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
