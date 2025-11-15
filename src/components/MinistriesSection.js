import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Icon, Input, TextArea, FormSpace, SectionContainer, SectionTitle } from './UtilityComponents';

// Reusing SectionContainer and SectionTitle from UtilityComponents
// Ministry specific grid and card styles
const MinistriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem; /* gap-8 */
  margin-top: 3rem;
`;

const MinistryCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* from HTML */
  color: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem; /* text-2xl */
  font-weight: 600; /* font-semibold */
  margin-bottom: 0.5rem; /* mb-2 */
`;

const CardDescription = styled.p`
  line-height: 1.6; /* from HTML body */
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
    onUpdate('ministries', updatedMinistries, 'delete');
  };

  return (
    <SectionContainer id="ministries">
      <SectionTitle>Our Ministries</SectionTitle>
      <MinistriesGrid>
        {tempMinistries.map((ministry, index) => (
          <MinistryCard key={index}> {/* Apply fade-in class */}
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
                <Button onClick={() => handleDeleteMinistry(index)} className="bg-red-600 hover:bg-red-700 text-white">
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
    </SectionContainer>
  );
};

export default MinistriesSection;
