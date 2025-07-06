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

const EventsGrid = styled.div`
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

const EventCard = styled.div`
  background-color: white;
  padding: 1.5rem; /* p-6 */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadow-md */
  display: flex;
  flex-direction: column;

  .dark & {
    background-color: #1F2937; /* gray-900 */
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
    onUpdate('events', updatedEvents);
  };

  // Sort events by date in ascending order
  const sortedEvents = [...tempEvents].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <SectionContainer id="events">
      <ContentWrapper>
        <SectionTitle>
          <Icon name="calendar" className="mr-3" /> Upcoming Events
        </SectionTitle>
        <EventsGrid>
          {sortedEvents.map((event) => (
            <EventCard key={event.id}>
              {isEditing && editingEvent?.id === event.id ? (
                // Edit form for event
                <FormSpace>
                  <Input
                    type="text"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  />
                  <Input
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
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
                // Display event details
                <>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDetail><strong>Date:</strong> {event.date}</CardDetail>
                  <CardDetail><strong>Time:</strong> {event.time}</CardDetail>
                  <CardDetail><strong>Location:</strong> {event.location}</CardDetail>
                  <CardDescription>{event.description}</CardDescription>
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
            </EventCard>
          ))}

          {isEditing && (
            <EventCard>
              <CardTitle>Add New Event</CardTitle>
              <FormSpace>
                <Input
                  type="text"
                  placeholder="Title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
                <Input
                  type="date"
                  placeholder="Date (YYYY-MM-DD)"
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
            </EventCard>
          )}
        </EventsGrid>
      </ContentWrapper>
    </SectionContainer>
  );
};

export default EventsSection;
