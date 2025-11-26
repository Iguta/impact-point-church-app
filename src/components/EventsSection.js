import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Icon, Input, TextArea, FormSpace, SectionContainer, SectionTitle } from './UtilityComponents';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const EventsSectionContainer = styled(SectionContainer)`
  background: #f8f9fa;
  max-width: none;
  width: 100%;
  margin: 0;
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

const EventsList = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;

  @media (min-width: 640px) {
    padding: 0;
  }
`;

const EventItem = styled.article`
  background: white;
  padding: 1.5rem; /* Mobile-first */
  margin-bottom: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #4f46e5;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-left-width: 5px;
  }

  @media (min-width: 1024px) {
    &:hover {
      transform: translateX(8px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
  }
`;

const EventDate = styled.div`
  color: #4f46e5;
  font-weight: 600;
  font-size: 0.9375rem; /* Mobile-first */
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (min-width: 640px) {
    font-size: 1rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.0625rem;
  }
`;

const EventTitle = styled.h3`
  font-size: 1.25rem; /* Mobile-first */
  margin-bottom: 0.75rem;
  color: #1f2937;
  font-weight: 700;
  line-height: 1.3;

  @media (min-width: 640px) {
    font-size: 1.375rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.5rem;
  }
`;

const EventDescription = styled.p`
  color: #4b5563;
  line-height: 1.6;
  font-size: 0.9375rem; /* Mobile-first */

  @media (min-width: 640px) {
    font-size: 1rem;
  }
`;

const AdminButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem; /* space-x-2 */
  margin-top: 1rem; /* mt-4 */
`;

const EventsSection = ({ data, isEditing, onUpdate }) => {
  const [tempEvents, setTempEvents] = useState(data);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '', date: '', time: '', location: '', description: ''
  });

  useEffect(() => {
    setTempEvents(data);
  }, [data]);

  const startEdit = (event) => {
    setEditingEvent(event);
  };

  const cancelEdit = () => {
    setEditingEvent(null);
  };

  const handleUpdateEvent = () => {
    if (editingEvent) {
      const updatedEvents = tempEvents.map(e =>
        e.id === editingEvent.id ? editingEvent : e
      );
      setTempEvents(updatedEvents);
      onUpdate('events', updatedEvents);
      setEditingEvent(null);
    }
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.time) {
      const eventToAdd = { ...newEvent, id: `event-${Date.now()}` };
      const updatedEvents = [...tempEvents, eventToAdd];
      setTempEvents(updatedEvents);
      onUpdate('events', updatedEvents);
      setNewEvent({ title: '', date: '', time: '', location: '', description: '' });
    }
  };

  const handleDeleteEvent = (id) => {
    const updatedEvents = tempEvents.filter(e => e.id !== id);
    setTempEvents(updatedEvents);
    onUpdate('events', updatedEvents, 'delete');
  };

  // Sort events by date (assuming date is sortable, like YYYY-MM-DD or full date string)
  const sortedEvents = [...tempEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const [sectionRef, isSectionVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <EventsSectionContainer id="events" role="region" aria-labelledby="events-title">
      <ContentWrapper ref={sectionRef}>
        <SectionTitle id="events-title">Upcoming Events</SectionTitle>
        <EventsList>
          {sortedEvents.map((event, index) => (
            <EventItem 
              key={event.id}
              isVisible={isSectionVisible}
              index={index}
            >
            {isEditing && editingEvent?.id === event.id ? (
              <FormSpace>
                <Input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                />
                <Input
                  type="text" // Keep as text for flexible date input (e.g., "July 15-19")
                  value={editingEvent.date}
                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  placeholder="Date (e.g., July 15-19)"
                />
                <Input
                  type="text"
                  value={editingEvent.time}
                  onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                />
                <Input
                  type="text"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                />
                <TextArea
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  rows="3"
                />
                <AdminButtonsContainer>
                  <Button onClick={handleUpdateEvent} className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1">Save</Button>
                  <Button onClick={cancelEdit} className="bg-gray-400 hover:bg-gray-500 text-white flex-1">Cancel</Button>
                </AdminButtonsContainer>
              </FormSpace>
            ) : (
              <>
                <EventDate>{event.date}</EventDate>
                <EventTitle>{event.title}</EventTitle>
                <EventDescription>{event.description}</EventDescription>
                {isEditing && (
                  <AdminButtonsContainer>
                    <Button onClick={() => startEdit(event)} className="bg-yellow-500 hover:bg-yellow-600 text-white flex-1">
                      <Icon name="edit" className="mr-1" /> Edit
                    </Button>
                    <Button onClick={() => handleDeleteEvent(event.id)} className="bg-red-500 hover:bg-red-600 text-white flex-1">
                      <Icon name="trash2" className="mr-1" /> Delete
                    </Button>
                  </AdminButtonsContainer>
                )}
              </>
            )}
          </EventItem>
        ))}

        {isEditing && (
          <EventItem>
            <EventTitle>Add New Event</EventTitle>
            <FormSpace>
              <Input
                type="text"
                placeholder="Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Date (e.g., July 15-19)"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
              <TextArea
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                rows="3"
              />
              <Button onClick={handleAddEvent} className="bg-green-600 hover:bg-green-700 text-white">
                <Icon name="plusCircle" className="mr-1" /> Add Event
              </Button>
            </FormSpace>
          </EventItem>
        )}
        </EventsList>
      </ContentWrapper>
    </EventsSectionContainer>
  );
};

export default EventsSection;
