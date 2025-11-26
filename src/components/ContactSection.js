import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Input, TextArea, FormSpace, SectionContainer, SectionTitle } from './UtilityComponents';
import { MapPin, Calendar, Mail, Phone, ArrowUp } from 'lucide-react';
import isEqual from 'lodash.isequal';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useFirebase } from '../context/FirebaseContext';


// Reusing SectionContainer and SectionTitle from UtilityComponents
const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* Mobile: single column */
  gap: 2rem;
  margin-top: 3rem;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
  }
`;

const MapContainer = styled.div`
  grid-column: 1 / -1; /* Span full width on all screen sizes */
  margin-top: 2rem;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: translateY(${({ isVisible }) => (isVisible ? 0 : '30px')});
  transition: opacity 0.8s ease, transform 0.8s ease;
  
  @media (min-width: 768px) {
    margin-top: 1rem;
  }
`;

const MapWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #f3f4f6;

  @media (min-width: 640px) {
    border-radius: 15px;
  }

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const MapTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  text-align: center;

  @media (min-width: 640px) {
    font-size: 1.5rem;
    text-align: left;
  }
`;

const ScrollToTopButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #1A365D;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  margin: 2rem 0 0 auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 10;
  font-weight: 600;
  font-size: 0.9375rem;
  white-space: nowrap;

  &:hover {
    background: #2a4a6d;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid #1A365D;
    outline-offset: 2px;
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  @media (min-width: 640px) {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
    
    svg {
      width: 22px;
      height: 22px;
    }
  }
`;

const ContactInfoCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* from HTML */
  color: white;
  padding: 2rem;
  border-radius: 20px;
`;

const ContactFormCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
`;

const CardTitle = styled.h3`
  font-size: 1.5rem; /* from HTML */
  margin-bottom: 1rem;
  color: white; /* For ContactInfoCard */

  ${ContactFormCard} & {
    color: #333; /* For ContactFormCard */
  }
`;

const InfoText = styled.p`
  font-size: 1.125rem; /* text-lg */
  margin-bottom: 1rem;

  strong {
    font-weight: bold;
  }

  span {
    display: block; /* For new lines in address/hours */
  }
`;

const Form = styled.form`
  .form-group {
    margin-bottom: 1.5rem;
  }
`;

const ContactSection = ({ data, isEditing, onUpdate, onShowToast }) => {
  const {db} = useFirebase();
  const [tempContact, setTempContact] = useState(data);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapRef, isMapVisible] = useScrollAnimation({ threshold: 0.1 });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if(!isEditing && !isEqual(data, tempContact)){
        setTempContact(data);
    }
  }, [data, tempContact, isEditing]);

  const handleSaveContact = () => {
    onUpdate('contact', tempContact);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!db) {
      if (onShowToast) {
        onShowToast("Database not ready. Please try again.", 'error');
      } else {
        alert("Database not ready. Please try again.");
      }
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "contactMessages"), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        createdAt: serverTimestamp(),
      });

      // Show success toast notification
      if (onShowToast) {
        onShowToast("Thank you for your message! We'll get back to you soon.", 'success');
      } else {
        alert("Thank you for your message! We'll get back to you soon.");
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

    } catch (error) {
      console.error("Error sending message:", error);
      // Show error toast notification
      if (onShowToast) {
        onShowToast("There was an issue sending your message. Please try again.", 'error');
      } else {
        alert("There was an issue sending your message. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <SectionContainer id="contact">
      <SectionTitle>Get in Touch</SectionTitle>
      <ContactGrid>
        {/* Contact Info Section */}
        <ContactInfoCard>
          <CardTitle>Visit Us</CardTitle>
          {isEditing ? (
            <FormSpace>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <MapPin size={24} style={{ marginRight: '0.5rem', color: '#E0E7FF' }} /> {/* indigo-200 */}
                <TextArea
                  value={tempContact.address}
                  onChange={(e) => setTempContact({ ...tempContact, address: e.target.value })}
                  placeholder="Address"
                  rows="3"
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <Phone size={24} style={{ marginRight: '0.5rem', color: '#E0E7FF' }} /> {/* indigo-200 */}
                <Input
                  type="tel"
                  value={tempContact.phone}
                  onChange={(e) => setTempContact({ ...tempContact, phone: e.target.value })}
                  placeholder="Phone"
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <Mail size={24} style={{ marginRight: '0.5rem', color: '#E0E7FF' }} /> {/* indigo-200 */}
                <Input
                  type="email"
                  value={tempContact.email}
                  onChange={(e) => setTempContact({ ...tempContact, email: e.target.value })}
                  placeholder="Email"
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <Calendar size={24} style={{ marginRight: '0.5rem', color: '#E0E7FF' }} /> {/* indigo-200 */}
                <TextArea
                  value={tempContact.officeHours}
                  onChange={(e) => setTempContact({ ...tempContact, officeHours: e.target.value })}
                  placeholder="Office Hours"
                  rows="3"
                />
              </div>
              <div style={{ marginTop: '1rem' }}>
                <label style={{ color: '#E0E7FF', marginBottom: '0.5rem', display: 'block', fontSize: '0.875rem' }}>
                  Map Embed URL (Google Maps)
                </label>
                <Input
                  type="text"
                  value={tempContact.mapEmbedUrl || ''}
                  onChange={(e) => setTempContact({ ...tempContact, mapEmbedUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  style={{ color: '#1f2937' }}
                />
                <p style={{ fontSize: '0.75rem', color: '#E0E7FF', marginTop: '0.25rem' }}>
                  Get embed URL: Google Maps → Share → Embed a map
                </p>
              </div>
              <Button onClick={handleSaveContact} className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Contact Info</Button>
            </FormSpace>
          ) : (
            <div className="space-y-4 text-white text-lg">
              <h3 className="text-2xl font-semibold mb-4">Visit Us</h3>
              <InfoText><strong>Address:</strong><br />{data.address.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</InfoText>
              <InfoText><strong>Phone:</strong><br />{data.phone}</InfoText>
              <InfoText><strong>Email:</strong><br />{data.email}</InfoText>
              <InfoText><strong>Office Hours:</strong><br />{data.officeHours.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</InfoText>
            </div>
          )}
        </ContactInfoCard>

        {/* Send Us a Message Section (Form) */}
        <ContactFormCard>
          <CardTitle>Send Us a Message</CardTitle>
          <Form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <Input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <TextArea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleFormChange}
                rows="5"
                required
              ></TextArea>
            </div>
            <Button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </Form>
        </ContactFormCard>
      </ContactGrid>
      
      {/* Map Section */}
      {data?.mapEmbedUrl && (
        <MapContainer ref={mapRef} isVisible={isMapVisible}>
          <MapTitle>Find Us</MapTitle>
          {isEditing ? (
            <FormSpace>
              <Input
                type="text"
                placeholder="Google Maps Embed URL"
                value={tempContact.mapEmbedUrl || ''}
                onChange={(e) => setTempContact({ ...tempContact, mapEmbedUrl: e.target.value })}
              />
              <Button onClick={handleSaveContact} className="bg-indigo-600">Save Map</Button>
            </FormSpace>
          ) : (
            <MapWrapper>
              <iframe
                src={data.mapEmbedUrl}
                title="Church Location Map"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </MapWrapper>
          )}
        </MapContainer>
      )}
      
      {/* Show map input in edit mode even if no map exists */}
      {isEditing && !data?.mapEmbedUrl && (
        <MapContainer>
          <MapTitle>Add Map for Directions</MapTitle>
          <FormSpace>
            <Input
              type="text"
              placeholder="Paste Google Maps Embed URL here"
              value={tempContact.mapEmbedUrl || ''}
              onChange={(e) => setTempContact({ ...tempContact, mapEmbedUrl: e.target.value })}
            />
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '-0.5rem' }}>
              To get the embed URL: Go to Google Maps → Search for your location → Click "Share" → Choose "Embed a map" → Copy the iframe src URL
            </p>
            <Button onClick={handleSaveContact} className="bg-indigo-600">Save Map</Button>
          </FormSpace>
        </MapContainer>
      )}

      {/* Scroll to Top Button */}
      {!isEditing && (
        <ScrollToTopButton
          onClick={scrollToTop}
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUp />
          <span>Back to Top</span>
        </ScrollToTopButton>
      )}
    </SectionContainer>
  );
};

export default ContactSection;
