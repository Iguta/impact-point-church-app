import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Icon } from './UtilityComponents';
import { MapPin, Calendar, Mail, Phone } from 'lucide-react';

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

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem; /* gap-8 */
  max-width: 48rem; /* max-w-4xl */
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr); /* md:grid-cols-2 */
  }
`;

const VisitUsCard = styled.div`
  background-color: white;
  padding: 2rem; /* p-8 */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadow-md */
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .dark & {
    background-color: #4F46E5; /* indigo-700 */
  }

  h3 {
    font-size: 1.5rem; /* text-2xl */
    font-weight: 600; /* font-semibold */
    color: #1F2937; /* gray-900 */
    margin-bottom: 1rem; /* mb-4 */

    .dark & {
      color: white;
    }
  }

  p {
    color: #374151; /* gray-700 */
    font-size: 1.125rem; /* text-lg */
    margin-bottom: 1rem;

    .dark & {
      color: white;
    }

    strong {
      font-weight: 600;
    }
  }
`;

const ContactFormCard = styled.div`
  background-color: white;
  padding: 2rem; /* p-8 */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadow-md */

  .dark & {
    background-color: #1F2937; /* gray-900 */
  }

  h3 {
    font-size: 1.5rem; /* text-2xl */
    font-weight: 600; /* font-semibold */
    color: #1F2937; /* gray-900 */
    margin-bottom: 1rem; /* mb-4 */

    .dark & {
      color: white;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.75rem; /* p-3 */
  border: 1px solid #D1D5DB; /* gray-300 */
  border-radius: 0.375rem; /* rounded-md */
  background-color: #F9FAFB; /* gray-100 */
  color: #1F2937;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #6366F1; /* ring-2 ring-indigo-500 */
  }

  .dark & {
    border-color: #374151; /* gray-700 */
    background-color: #1F2937; /* gray-800 */
    color: white;
  }
`;

const TextAreaField = styled.textarea`
  width: 100%;
  padding: 0.75rem; /* p-3 */
  border: 1px solid #D1D5DB; /* gray-300 */
  border-radius: 0.375rem; /* rounded-md */
  background-color: #F9FAFB; /* gray-100 */
  color: #1F2937;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #6366F1; /* ring-2 ring-indigo-500 */
  }

  .dark & {
    border-color: #374151; /* gray-700 */
    background-color: #1F2937; /* gray-800 */
    color: white;
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  font-size: 1.125rem; /* text-lg */
  font-weight: 600; /* font-semibold */
  padding: 0.75rem 0; /* py-3 */
`;

// Added this styled component definition, which was missing
const FormSpace = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* space-y-3 */
`;


const ContactSection = ({ data, isEditing, onUpdate }) => {
  const [tempContact, setTempContact] = useState(data);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    setTempContact(data);
  }, [data]);

  const handleSaveContact = () => {
    onUpdate('contact', tempContact);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Message sent successfully! (This is a demo, no actual email was sent.)");
    setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
  };

  return (
    <SectionContainer id="contact">
      <ContentWrapper>
        <SectionTitle>
          <Icon name="mappin" className="mr-3" /> Get in Touch
        </SectionTitle>
        <ContactGrid>
          {/* Visit Us Section */}
          <VisitUsCard>
            {isEditing ? (
              <FormSpace> {/* This was undefined */}
                <h3 className="text-2xl font-semibold text-white mb-4">Edit Visit Us Info</h3>
                <div className="flex items-center space-x-2">
                  <MapPin size={24} className="text-indigo-200" />
                  <TextAreaField // This was undefined
                    value={tempContact.address}
                    onChange={(e) => setTempContact({ ...tempContact, address: e.target.value })}
                    placeholder="Address"
                    rows="3"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={24} className="text-indigo-200" />
                  <InputField // This was undefined
                    type="tel"
                    value={tempContact.phone}
                    onChange={(e) => setTempContact({ ...tempContact, phone: e.target.value })}
                    placeholder="Phone"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={24} className="text-indigo-200" />
                  <InputField // This was undefined
                    type="email"
                    value={tempContact.email}
                    onChange={(e) => setTempContact({ ...tempContact, email: e.target.value })}
                    placeholder="Email"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={24} className="text-indigo-200" />
                  <TextAreaField // This was undefined
                    value={tempContact.officeHours}
                    onChange={(e) => setTempContact({ ...tempContact, officeHours: e.target.value })}
                    placeholder="Office Hours"
                    rows="3"
                  />
                </div>
                <Button onClick={handleSaveContact} className="bg-indigo-600 hover:bg-indigo-700 text-white mt-4">Save Visit Info</Button>
              </FormSpace>
            ) : (
              <div className="space-y-4 text-white text-lg">
                <h3 className="text-2xl font-semibold mb-4">Visit Us</h3>
                <p><strong>Address:</strong><br />{data.address.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</p>
                <p><strong>Phone:</strong><br />{data.phone}</p>
                <p><strong>Email:</strong><br />{data.email}</p>
                <p><strong>Office Hours:</strong><br />{data.officeHours.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</p>
              </div>
            )}
          </VisitUsCard>

          {/* Send Us a Message Section (Form) */}
          <ContactFormCard>
            <h3>Send Us a Message</h3>
            <Form onSubmit={handleFormSubmit}>
              <div>
                <label htmlFor="name" className="sr-only">Your Name</label>
                <InputField
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Your Email</label>
                <InputField
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="sr-only">Subject</label>
                <InputField
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Your Message</label>
                <TextAreaField
                  id="message"
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleFormChange}
                  rows="5"
                  required
                ></TextAreaField>
              </div>
              <SubmitButton type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Send Message
              </SubmitButton>
            </Form>
          </ContactFormCard>
        </ContactGrid>
      </ContentWrapper>
    </SectionContainer>
  );
};

export default ContactSection;
