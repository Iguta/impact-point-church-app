import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Icon, Input, TextArea, FormSpace, SectionContainer, SectionTitle } from './UtilityComponents';

const EventsSectionContainer = styled(SectionContainer)`
  background: #f8f9fa; /* from HTML */
  margin: 0 -2rem; /* Extend full width */
`;

const EventsList = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const EventItem = styled.div`
  background: white;
  padding: 2rem;
  margin-bottom: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  border-left: 5px solid #3498db; /* Blue border from HTML */
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(10px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  }
`;

const EventDate = styled.div`
  color: #3498db; /* Blue from HTML */
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const EventTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const EventDescription = styled.p`
  color: #555; /* from HTML */
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
    onUpdate('events', updatedEvents);
  };

  // Sort events by date (assuming date is sortable, like YYYY-MM-DD or full date string)
  const sortedEvents = [...tempEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <EventsSectionContainer id="events">
      <SectionTitle >Upcoming Events</SectionTitle>
      <EventsList>
        {sortedEvents.map((event) => (
          <EventItem key={event.id}> {/* Apply fade-in class */}
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
    </EventsSectionContainer>
  );
};

export default EventsSection;
