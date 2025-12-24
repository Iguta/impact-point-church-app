import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Icon, Input, TextArea, FormSpace, SectionContainer, SectionTitle, RichTextEditor, RichTextContent } from './UtilityComponents';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useFirebase } from '../context/FirebaseContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import LazyImage from './LazyImage';

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
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;

  @media (min-width: 640px) {
    padding: 0;
  }
`;

const EventItem = styled.article`
  background: white;
  margin-bottom: 2rem;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: translateY(${({ isVisible }) => (isVisible ? 0 : '20px')});
  animation: ${({ isVisible, index }) => 
    isVisible ? `fadeInUp 0.6s ease-out ${index * 0.1}s both` : 'none'};
  display: flex;
  flex-direction: column;

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

  @media (min-width: 768px) {
    flex-direction: row;
    min-height: 300px;
  }

  @media (min-width: 1024px) {
    &:hover {
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
      transform: translateY(-4px);
    }
  }
`;

// Date Badge Component
const DateBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  min-width: 70px;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  margin-bottom: 1rem;

  @media (min-width: 640px) {
    min-width: 80px;
    padding: 1rem 1.25rem;
  }
`;

const DateMonth = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  line-height: 1.2;
  margin-bottom: 0.25rem;

  @media (min-width: 640px) {
    font-size: 0.875rem;
  }
`;

const DateDay = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1;

  @media (min-width: 640px) {
    font-size: 2rem;
  }
`;

const EventContentWrapper = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (min-width: 640px) {
    padding: 2rem;
  }

  @media (min-width: 768px) {
    padding: 2.5rem;
  }
`;

const EventHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const EventHeaderText = styled.div`
  flex: 1;
`;

const EventTitle = styled.h3`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  font-size: 1.375rem;
  margin-bottom: 0.75rem;
  color: #1f2937;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;

  @media (min-width: 640px) {
    font-size: 1.625rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.875rem;
  }
`;

const EventMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const EventTime = styled.div`
  color: #4f46e5;
  font-weight: 600;
  font-size: 0.9375rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    flex-shrink: 0;
  }

  @media (min-width: 640px) {
    font-size: 1rem;
  }
`;

const EventLocation = styled.div`
  color: #4f46e5;
  font-weight: 600;
  font-size: 0.9375rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;

  svg {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  @media (min-width: 640px) {
    font-size: 1rem;
  }
`;

const LocationLink = styled.a`
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #4338ca;
    text-decoration: underline;
  }
`;

const EventDescription = styled.div`
  font-family: Georgia, 'Times New Roman', serif;
  color: #4b5563;
  line-height: 1.75;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  flex: 1;

  @media (min-width: 640px) {
    font-size: 1.0625rem;
  }

  /* Style HTML tags within rich text */
  b, strong {
    font-weight: 700;
  }

  i, em {
    font-style: italic;
  }
`;

const EventActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;

  @media (min-width: 640px) {
    flex-direction: row;
    gap: 1rem;
  }
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
  min-height: 44px;

  &.primary {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);

    &:hover {
      background: linear-gradient(135deg, #4338ca, #6d28d9);
      box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
      transform: translateY(-2px);
    }
  }

  &.secondary {
    background: white;
    color: #4f46e5;
    border: 2px solid #4f46e5;

    &:hover {
      background: #f8f9fa;
      transform: translateY(-2px);
    }
  }

  @media (min-width: 640px) {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
`;

const SocialShare = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const ShareLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const ShareIcons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #4f46e5;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
    border-color: #4f46e5;
    transform: translateY(-2px);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const FlyerImage = styled.div`
  width: 100%;
  overflow: hidden;
  background: #f3f4f6;
  position: relative;

  @media (min-width: 768px) {
    width: 45%;
    height: auto;
    min-height: 300px;
    flex-shrink: 0;
  }

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
    display: block;
  }
`;

const AdminButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem; /* space-x-2 */
  margin-top: 1rem; /* mt-4 */
`;

const FileUploadContainer = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    background: linear-gradient(135deg, #4338ca, #6d28d9);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }

  input[type="file"] {
    display: none;
  }
`;

const UploadStatus = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: ${props => {
    if (props.status === 'success') return '#d1fae5';
    if (props.status === 'error') return '#fee2e2';
    return '#dbeafe';
  }};
  color: ${props => {
    if (props.status === 'success') return '#065f46';
    if (props.status === 'error') return '#991b1b';
    return '#1e40af';
  }};
`;

// Helper function to parse date and extract month/day
const parseDateBadge = (dateString) => {
  if (!dateString) return { month: '', day: '' };
  
  try {
    // Try parsing various date formats
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return {
        month: months[date.getMonth()],
        day: date.getDate().toString()
      };
    }
    
    // Try parsing formats like "12/31/2025" or "December 31"
    const dateMatch = dateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (dateMatch) {
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return {
        month: months[parseInt(dateMatch[1]) - 1],
        day: dateMatch[2]
      };
    }
    
    // Fallback: try to extract numbers
    const numbers = dateString.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const monthIndex = parseInt(numbers[0]) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        return {
          month: months[monthIndex],
          day: numbers[1]
        };
      }
    }
  } catch (e) {
    // If parsing fails, return empty
  }
  
  return { month: '', day: '' };
};

// Helper function to generate Google Calendar URL
const generateCalendarUrl = (event) => {
  const title = encodeURIComponent(event.title || 'Event');
  const dateStr = event.date || '';
  const timeStr = event.time || '';
  const location = encodeURIComponent(event.location || '');
  const description = encodeURIComponent(event.description || '');
  
  // Try to parse date and time for proper format
  let startDate, endDate;
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      // Default to 2 hours duration if time not specified
      startDate = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      endDate = new Date(date.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }
  } catch (e) {
    // If date parsing fails, use current date
    startDate = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    endDate = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${description}&location=${location}`;
};

// Helper function to generate Google Maps URL
const generateMapsUrl = (location) => {
  // Always use the church's physical address for directions
  const churchAddress = '546 E 17th St #100, Indianapolis, IN 46202';
  const encoded = encodeURIComponent(churchAddress);
  return `https://www.google.com/maps/search/?api=1&query=${encoded}`;
};

// Helper function to share on social media
const shareEvent = (platform, event) => {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(event.title || 'Event');
  const text = encodeURIComponent(`${event.title} - ${event.date} ${event.time ? `at ${event.time}` : ''}`);
  
  let shareUrl = '';
  
  switch (platform) {
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      break;
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
      break;
    case 'whatsapp':
      shareUrl = `https://wa.me/?text=${text}%20${url}`;
      break;
    default:
      // Use Web Share API if available
      if (navigator.share) {
        navigator.share({
          title: event.title,
          text: `${event.title} - ${event.date} ${event.time ? `at ${event.time}` : ''}`,
          url: window.location.href
        }).catch(() => {});
        return;
      }
      return;
  }
  
  window.open(shareUrl, '_blank', 'width=600,height=400');
};

const EventsSection = ({ data, isEditing, onUpdate }) => {
  const { storage, db } = useFirebase();
  const [tempEvents, setTempEvents] = useState(data);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '', date: '', time: '', location: '', description: '', flyerUrl: ''
  });
  const [uploadStatus, setUploadStatus] = useState({});
  const [newEventUploadStatus, setNewEventUploadStatus] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  useEffect(() => {
    setTempEvents(data);
  }, [data]);

  // Helper function to calculate file hash using Web Crypto API
  const calculateFileHash = async (file) => {
    try {
      const fileSlice = file.slice(0);
      const arrayBuffer = await fileSlice.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch (error) {
      console.error('Error calculating file hash:', error);
      throw error;
    }
  };

  // Check if file hash already exists in Firestore
  const checkDuplicateFile = async (fileHash) => {
    if (!db) return null;
    try {
      const appId = typeof window !== 'undefined' && typeof window.__app_id !== 'undefined' ? window.__app_id : 'local-dev-app-id';
      const fileHashesRef = collection(db, 'artifacts', appId, 'public', 'file_hashes');
      const q = query(fileHashesRef, where('hash', '==', fileHash));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        console.log('Duplicate file found:', docData.url);
        return docData.url;
      }
      return null;
    } catch (error) {
      console.error('Error checking duplicate file:', error);
      return null;
    }
  };

  // Store file hash in Firestore for future duplicate detection
  const storeFileHash = async (fileHash, downloadURL, fileName) => {
    if (!db) return;
    try {
      const appId = typeof window !== 'undefined' && typeof window.__app_id !== 'undefined' ? window.__app_id : 'local-dev-app-id';
      const fileHashesRef = collection(db, 'artifacts', appId, 'public', 'file_hashes');
      await setDoc(doc(fileHashesRef, fileHash), {
        hash: fileHash,
        url: downloadURL,
        fileName: fileName,
        uploadedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error storing file hash:', error);
    }
  };

  // Handle file upload for event flyer
  const handleFileUpload = async (file, eventId = null) => {
    if (!storage || !file) return;

    const statusKey = eventId || 'new';
    const isNewEvent = !eventId;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      if (isNewEvent) {
        setNewEventUploadStatus({ status: 'error', message: 'Please upload an image file' });
      } else {
        setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'error', message: 'Please upload an image file' } });
      }
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      if (isNewEvent) {
        setNewEventUploadStatus({ status: 'error', message: 'File size must be less than 10MB' });
      } else {
        setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'error', message: 'File size must be less than 10MB' } });
      }
      return;
    }

    // Set uploading status
    if (isNewEvent) {
      setNewEventUploadStatus({ status: 'uploading', message: 'Checking for duplicates...' });
    } else {
      setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'uploading', message: 'Checking for duplicates...' } });
    }

    try {
      // Calculate file hash to check for duplicates
      const fileHash = await calculateFileHash(file);
      
      // Check if file already exists in Storage
      const existingUrl = await checkDuplicateFile(fileHash);
      
      if (existingUrl) {
        // Duplicate found - use existing URL
        if (isNewEvent) {
          setNewEventUploadStatus({ status: 'success', message: 'File already exists, reusing existing URL!' });
          setNewEvent({ ...newEvent, flyerUrl: existingUrl });
        } else {
          setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'success', message: 'File already exists, reusing existing URL!' } });
          const updatedEditingEvent = { ...editingEvent, flyerUrl: existingUrl };
          setEditingEvent(updatedEditingEvent);
          setTempEvents(prevEvents => 
            prevEvents.map(e =>
              e.id === eventId ? updatedEditingEvent : e
            )
          );
        }

        setTimeout(() => {
          if (isNewEvent) {
            setNewEventUploadStatus(null);
          } else {
            setUploadStatus({ ...uploadStatus, [statusKey]: null });
          }
        }, 3000);
        return;
      }

      // No duplicate found - proceed with upload
      if (isNewEvent) {
        setNewEventUploadStatus({ status: 'uploading', message: 'Uploading...' });
      } else {
        setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'uploading', message: 'Uploading...' } });
      }

      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `event-flyer-${timestamp}-${file.name}`;
      const storageRef = ref(storage, `events/${fileName}`);

      // Upload file
      await uploadBytes(storageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Store file hash for future duplicate detection
      await storeFileHash(fileHash, downloadURL, fileName);

      // Update the event's flyerUrl
      if (isNewEvent) {
        setNewEvent({ ...newEvent, flyerUrl: downloadURL });
        setNewEventUploadStatus({ status: 'success', message: 'Upload successful!' });
      } else {
        const updatedEditingEvent = { ...editingEvent, flyerUrl: downloadURL };
        setEditingEvent(updatedEditingEvent);
        setTempEvents(prevEvents => 
          prevEvents.map(e =>
            e.id === eventId ? updatedEditingEvent : e
          )
        );
        setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'success', message: 'Upload successful!' } });
      }

      // Clear status after 3 seconds
      setTimeout(() => {
        if (isNewEvent) {
          setNewEventUploadStatus(null);
        } else {
          setUploadStatus({ ...uploadStatus, [statusKey]: null });
        }
      }, 3000);
    } catch (error) {
      console.error('Error uploading file:', error);
      if (isNewEvent) {
        setNewEventUploadStatus({ status: 'error', message: 'Upload failed. Please try again.' });
      } else {
        setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'error', message: 'Upload failed. Please try again.' } });
      }
    }
  };

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
      setNewEvent({ title: '', date: '', time: '', location: '', description: '', flyerUrl: '' });
      setNewEventUploadStatus(null);
      setFileInputKey(prev => prev + 1);
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
                  placeholder="Title"
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
                  placeholder="Time"
                  value={editingEvent.time}
                  onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                />
                <Input
                  type="text"
                  placeholder="Location"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                />
                <RichTextEditor
                  placeholder="Description (use Bold and Italic buttons to format text)"
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  rows="3"
                />
                <FileUploadContainer>
                  <FileInputLabel>
                    <Icon name="upload" className="mr-1" /> Upload Flyer Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleFileUpload(file, event.id);
                        }
                      }}
                    />
                  </FileInputLabel>
                  {editingEvent.flyerUrl && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Current flyer:</p>
                      <LazyImage 
                        src={editingEvent.flyerUrl} 
                        alt="Event flyer"
                        style={{ maxWidth: '100%', borderRadius: '8px' }}
                      />
                    </div>
                  )}
                  {uploadStatus[event.id] && (
                    <UploadStatus status={uploadStatus[event.id].status}>
                      {uploadStatus[event.id].message}
                    </UploadStatus>
                  )}
                </FileUploadContainer>
                <Input
                  type="url"
                  placeholder="Or enter image URL"
                  value={editingEvent.flyerUrl || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, flyerUrl: e.target.value })}
                />
                <AdminButtonsContainer>
                  <Button onClick={handleUpdateEvent} className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1">Save</Button>
                  <Button onClick={cancelEdit} className="bg-gray-400 hover:bg-gray-500 text-white flex-1">Cancel</Button>
                </AdminButtonsContainer>
              </FormSpace>
            ) : (
              <>
                {event.flyerUrl && (
                  <FlyerImage>
                    <LazyImage 
                      src={event.flyerUrl} 
                      alt={event.title}
                      objectFit="cover"
                    />
                  </FlyerImage>
                )}
                <EventContentWrapper>
                  <EventHeader>
                    {(() => {
                      const dateBadge = parseDateBadge(event.date);
                      return dateBadge.month ? (
                        <DateBadge>
                          <DateMonth>{dateBadge.month}</DateMonth>
                          <DateDay>{dateBadge.day}</DateDay>
                        </DateBadge>
                      ) : null;
                    })()}
                    <EventHeaderText>
                      <EventTitle>{event.title}</EventTitle>
                      <EventMeta>
                        {event.time && (
                          <EventTime>
                            <Icon name="clock" size={18} />
                            {event.time}
                          </EventTime>
                        )}
                        {event.location && (
                          <EventLocation>
                            <Icon name="mappin" size={18} />
                            <LocationLink 
                              href={generateMapsUrl(event.location)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              {event.location}
                            </LocationLink>
                          </EventLocation>
                        )}
                      </EventMeta>
                    </EventHeaderText>
                  </EventHeader>
                  
                  {event.description && (
                    <EventDescription>
                      <RichTextContent content={event.description} />
                    </EventDescription>
                  )}
                  
                  <EventActions>
                    <CTAButton 
                      href={generateCalendarUrl(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="primary"
                    >
                      <Icon name="calendar" size={18} />
                      Add to Calendar
                    </CTAButton>
                    {event.location && (
                      <CTAButton 
                        href={generateMapsUrl(event.location)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="secondary"
                      >
                        <Icon name="mappin" size={18} />
                        Get Directions
                      </CTAButton>
                    )}
                  </EventActions>
                  
                  <SocialShare>
                    <ShareLabel>Share:</ShareLabel>
                    <ShareIcons>
                      <ShareButton 
                        onClick={() => shareEvent('facebook', event)}
                        aria-label="Share on Facebook"
                      >
                        <Icon name="facebook" size={18} />
                      </ShareButton>
                      <ShareButton 
                        onClick={() => shareEvent('twitter', event)}
                        aria-label="Share on Twitter"
                      >
                        <Icon name="twitter" size={18} />
                      </ShareButton>
                      <ShareButton 
                        onClick={() => shareEvent('whatsapp', event)}
                        aria-label="Share on WhatsApp"
                      >
                        <Icon name="share2" size={18} />
                      </ShareButton>
                    </ShareIcons>
                  </SocialShare>
                  
                  {isEditing && (
                    <AdminButtonsContainer style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                      <Button onClick={() => startEdit(event)} className="bg-yellow-500 hover:bg-yellow-600 text-white flex-1">
                        <Icon name="edit" className="mr-1" /> Edit
                      </Button>
                      <Button onClick={() => handleDeleteEvent(event.id)} className="bg-red-500 hover:bg-red-600 text-white flex-1">
                        <Icon name="trash2" className="mr-1" /> Delete
                      </Button>
                    </AdminButtonsContainer>
                  )}
                </EventContentWrapper>
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
              <RichTextEditor
                placeholder="Description (use Bold and Italic buttons to format text)"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                rows="3"
              />
              <FileUploadContainer>
                <FileInputLabel>
                  <Icon name="upload" className="mr-1" /> Upload Flyer Image
                  <input
                    key={fileInputKey}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleFileUpload(file);
                      }
                    }}
                  />
                </FileInputLabel>
                {newEvent.flyerUrl && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Uploaded flyer:</p>
                    <LazyImage 
                      src={newEvent.flyerUrl} 
                      alt="Event flyer preview"
                      style={{ maxWidth: '100%', borderRadius: '8px' }}
                    />
                  </div>
                )}
                {newEventUploadStatus && (
                  <UploadStatus status={newEventUploadStatus.status}>
                    {newEventUploadStatus.message}
                  </UploadStatus>
                )}
              </FileUploadContainer>
              <Input
                type="url"
                placeholder="Or enter image URL"
                value={newEvent.flyerUrl}
                onChange={(e) => setNewEvent({ ...newEvent, flyerUrl: e.target.value })}
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
