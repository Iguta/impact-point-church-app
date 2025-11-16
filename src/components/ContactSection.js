import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Input, TextArea, FormSpace, SectionContainer, SectionTitle } from './UtilityComponents';
import { MapPin, Calendar, Mail, Phone } from 'lucide-react';
import isEqual from 'lodash.isequal'

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useFirebase } from '../context/FirebaseContext';


// Reusing SectionContainer and SectionTitle from UtilityComponents
const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem; /* gap-8 */
  margin-top: 3rem;
  max-width: 100%; /* Ensure it fits within SectionContainer */
  margin-left: auto;
  margin-right: auto;
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

const ContactSection = ({ data, isEditing, onUpdate }) => {
  const {db} = useFirebase();
  const [tempContact, setTempContact] = useState(data);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    if(!isEditing && !isEqual(data, tempContact)){
        setTempContact(data);
        console.log(tempContact)
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
    alert("Database not ready. Please try again.");
    return;
  }

  try {
    await addDoc(collection(db, "contactMessages"), {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      createdAt: serverTimestamp(),
    });

    alert("Thank you for your message! We'll get back to you soon.");

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

  } catch (error) {
    console.error("Error sending message:", error);
    alert("There was an issue sending your message. Please try again.");
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
            <Button type="submit" className="btn-primary">
              Send Message
            </Button>
          </Form>
        </ContactFormCard>
      </ContactGrid>
    </SectionContainer>
  );
};

export default ContactSection;
