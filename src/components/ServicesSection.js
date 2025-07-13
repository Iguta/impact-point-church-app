import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Icon, Input, TextArea, FormSpace, SectionContainer, SectionTitle } from './UtilityComponents';

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem; /* gap-8 */
  margin-top: 3rem;
`;

const ServiceCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  }
`;

const ServiceIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #3498db, #9b59b6); /* Blue to purple gradient */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem; /* text-2xl */
  font-weight: 600; /* font-semibold */
  color: #2c3e50; /* Dark blue-gray from HTML */
  margin-bottom: 0.5rem;
`;

const CardTime = styled.p`
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const CardDescription = styled.p`
  color: #555; /* from HTML */
`;

const ServicesSection = ({ data, isEditing, onUpdate }) => {
  const [tempServices, setTempServices] = useState(data);
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({
    icon: '', title: '', time: '', description: ''
  });

  useEffect(() => {
    setTempServices(data);
  }, [data]);

  const startEdit = (service) => {
    setEditingService(service);
  };

  const cancelEdit = () => {
    setEditingService(null);
  };

  const handleUpdateService = () => {
    if (editingService) {
      const updatedServices = tempServices.map(s =>
        s.id === editingService.id ? editingService : s
      );
      setTempServices(updatedServices);
      onUpdate('services', updatedServices);
      setEditingService(null);
    }
  };

  const handleAddService = () => {
    if (newService.title && newService.time) {
      const serviceToAdd = { ...newService, id: `service-${Date.now()}` };
      const updatedServices = [...tempServices, serviceToAdd];
      setTempServices(updatedServices);
      onUpdate('services', updatedServices);
      setNewService({ icon: '', title: '', time: '', description: '' });
    }
  };

  const handleDeleteService = (id) => {
    const updatedServices = tempServices.filter(s => s.id !== id);
    setTempServices(updatedServices);
    onUpdate('services', updatedServices);
  };

  return (
    <SectionContainer id="services">
      <SectionTitle>Service Times</SectionTitle>
      <ServicesGrid>
        {tempServices.map((service) => (
          <ServiceCard key={service.id}> {/* Apply fade-in class */}
            {isEditing && editingService?.id === service.id ? (
              <FormSpace>
                <Input
                  type="text"
                  placeholder="Icon (e.g., 🌅 or Lucide icon name)"
                  value={editingService.icon}
                  onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                />
                <Input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                />
                <Input
                  type="text"
                  value={editingService.time}
                  onChange={(e) => setEditingService({ ...editingService, time: e.target.value })}
                />
                <TextArea
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  rows="3"
                />
                <Button onClick={handleUpdateService} className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1">Save</Button>
                <Button onClick={cancelEdit} className="bg-gray-400 hover:bg-gray-500 text-white flex-1">Cancel</Button>
              </FormSpace>
            ) : (
              <>
                <ServiceIcon>{service.icon.length > 2 ? <Icon name={service.icon} /> : service.icon}</ServiceIcon>
                <CardTitle>{service.title}</CardTitle>
                <CardTime>{service.time}</CardTime>
                <CardDescription>{service.description}</CardDescription>
                {isEditing && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <Button onClick={() => startEdit(service)} className="bg-yellow-500 hover:bg-yellow-600 text-white flex-1">
                      <Icon name="edit" className="mr-1" /> Edit
                    </Button>
                    <Button onClick={() => handleDeleteService(service.id)} className="bg-red-500 hover:bg-red-600 text-white flex-1">
                      <Icon name="trash2" className="mr-1" /> Delete
                    </Button>
                  </div>
                )}
              </>
            )}
          </ServiceCard>
        ))}

        {isEditing && (
          <ServiceCard>
            <CardTitle>Add New Service</CardTitle>
            <FormSpace>
              <Input
                type="text"
                placeholder="Icon (e.g., 🌅 or Lucide icon name)"
                value={newService.icon}
                onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Title"
                value={newService.title}
                onChange={(e) => setNewService({ ...newService, title: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Time"
                value={newService.time}
                onChange={(e) => setNewService({ ...newService, time: e.target.value })}
              />
              <TextArea
                placeholder="Description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                rows="3"
              />
              <Button onClick={handleAddService} className="bg-green-600 hover:bg-green-700 text-white">
                <Icon name="plusCircle" className="mr-1" /> Add Service
              </Button>
            </FormSpace>
          </ServiceCard>
        )}
      </ServicesGrid>
    </SectionContainer>
  );
};

export default ServicesSection;
