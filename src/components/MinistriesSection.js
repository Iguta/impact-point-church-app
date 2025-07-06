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

const MinistriesGrid = styled.div`
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

const MinistryCard = styled.div`
  background-color: #F9FAFB; /* gray-50 */
  padding: 1.5rem; /* p-6 */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadow-md */

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

const CardDescription = styled.p`
  color: #374151; /* gray-700 */
  line-height: 1.625; /* leading-relaxed */

  .dark & {
    color: #D1D5DB; /* gray-300 */
  }
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

const MinistriesSection = ({ data, isEditing, onUpdate }) => {
  const [tempMinistries, setTempMinistries] = useState(data);
  const [newMinistry, setNewMinistry] = useState({ name: '', description: '' });

  useEffect(() => {
    setTempMinistries(data);
  }, [data]);

  const handleAddMinistry = () => {
    if (newMinistry.name && newMinistry.description) {
      const updatedMinistries = [...tempMinistries, newMinistry];
      setTempMinistries(updatedMinistries);
      onUpdate('ministries', updatedMinistries);
      setNewMinistry({ name: '', description: '' });
    }
  };

  const handleUpdateMinistry = (index, field, value) => {
    const updatedMinistries = tempMinistries.map((ministry, i) =>
      i === index ? { ...ministry, [field]: value } : ministry
    );
    setTempMinistries(updatedMinistries);
    onUpdate('ministries', updatedMinistries);
  };

  const handleDeleteMinistry = (index) => {
    const updatedMinistries = tempMinistries.filter((_, i) => i !== index);
    setTempMinistries(updatedMinistries);
    onUpdate('ministries', updatedMinistries);
  };

  return (
    <SectionContainer id="ministries">
      <ContentWrapper>
        <SectionTitle>
          <Icon name="users" className="mr-3" /> Our Ministries
        </SectionTitle>
        <MinistriesGrid>
          {tempMinistries.map((ministry, index) => (
            <MinistryCard key={index}>
              {isEditing ? (
                <FormSpace>
                  <Input
                    type="text"
                    value={ministry.name}
                    onChange={(e) => handleUpdateMinistry(index, 'name', e.target.value)}
                  />
                  <TextArea
                    value={ministry.description}
                    onChange={(e) => handleUpdateMinistry(index, 'description', e.target.value)}
                    rows="3"
                  />
                  <Button onClick={() => handleDeleteMinistry(index)} className="bg-red-500 hover:bg-red-600 text-white">
                    <Icon name="trash2" className="mr-1" /> Delete
                  </Button>
                </FormSpace>
              ) : (
                <>
                  <CardTitle>{ministry.name}</CardTitle>
                  <CardDescription>{ministry.description}</CardDescription>
                </>
              )}
            </MinistryCard>
          ))}

          {isEditing && (
            <MinistryCard>
              <CardTitle>Add New Ministry</CardTitle>
              <FormSpace>
                <Input
                  type="text"
                  placeholder="Ministry Name"
                  value={newMinistry.name}
                  onChange={(e) => setNewMinistry({ ...newMinistry, name: e.target.value })}
                />
                <TextArea
                  placeholder="Description"
                  value={newMinistry.description}
                  onChange={(e) => setNewMinistry({ ...newMinistry, description: e.target.value })}
                  rows="3"
                />
                <Button onClick={handleAddMinistry} className="bg-green-600 hover:bg-green-700 text-white">
                  <Icon name="plusCircle" className="mr-1" /> Add Ministry
                </Button>
              </FormSpace>
            </MinistryCard>
          )}
        </MinistriesGrid>
      </ContentWrapper>
    </SectionContainer>
  );
};

export default MinistriesSection;
