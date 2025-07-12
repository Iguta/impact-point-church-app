import React from 'react';
import styled from 'styled-components';
import { Church, Calendar, Mic, Users, MapPin, Mail, Phone, PlusCircle, Trash2, Edit, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

// Styled Button component
const StyledButton = styled.button`
  padding: 1rem 2rem; /* btn padding */
  border: none;
  border-radius: 30px; /* btn border-radius */
  font-size: 1.1rem; /* btn font-size */
  font-weight: bold; /* btn font-weight */
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block; /* btn display */

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
  }

  /* Primary Button Style */
  &.btn-primary {
    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
    color: white;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  }

  /* Secondary Button Style */
  &.btn-secondary {
    background: rgba(255,255,255,0.2);
    color: white;
    border: 2px solid white;
    backdrop-filter: blur(10px);
  }

  /* Admin Toggle Button specific styles */
  &.btn-primary-green {
    background: linear-gradient(45deg, #22C55E, #16A34A); /* Green gradient */
    color: white;
    padding: 0.75rem 1.5rem; /* px-6 py-3 */
    border-radius: 9999px; /* rounded-full */
    font-size: 1.125rem; /* text-lg */
    font-weight: 600; /* font-semibold */
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
    border: none; /* Override potential secondary border */
  }
  &.btn-primary-green:hover {
    background: linear-gradient(45deg, #16A34A, #15803D);
  }

  &.btn-primary-red {
    background: linear-gradient(45deg, #EF4444, #DC2626); /* Red gradient */
    color: white;
    padding: 0.75rem 1.5rem; /* px-6 py-3 */
    border-radius: 9999px; /* rounded-full */
    font-size: 1.125rem; /* text-lg */
    font-weight: 600; /* font-semibold */
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
    border: none; /* Override potential secondary border */
  }
  &.btn-primary-red:hover {
    background: linear-gradient(45deg, #DC2626, #B91C1C);
  }

  /* General edit/delete/add buttons */
  &.bg-indigo-600 { background-color: #4F46E5; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; }
  &.bg-indigo-600:hover { background-color: #4338CA; }

  &.bg-green-600 { background-color: #16A34A; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; }
  &.bg-green-600:hover { background-color: #15803D; }

  &.bg-red-600 { background-color: #DC2626; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; }
  &.bg-red-600:hover { background-color: #B91C1C; }

  &.bg-yellow-500 { background-color: #F59E0B; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; }
  &.bg-yellow-500:hover { background-color: #D97706; }

  &.bg-gray-400 { background-color: #9CA3AF; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; }
  &.bg-gray-400:hover { background-color: #6B7280; }

  &.flex { display: flex; }
  &.items-center { align-items: center; }
  &.justify-center { justify-content: center; }
  &.flex-1 { flex: 1; }
`;

// Reusable Button component (now wraps StyledButton)
export const Button = ({ children, onClick, className = '', ...props }) => (
  <StyledButton onClick={onClick} className={className} {...props}>
    {children}
  </StyledButton>
);

// Icon mapping for Lucide-React
export const Icon = ({ name, className = '' }) => {
  const icons = {
    church: <Church className={className} />,
    calendar: <Calendar className={className} />,
    mic: <Mic className={className} />,
    users: <Users className={className} />,
    mappin: <MapPin className={className} />,
    mail: <Mail className={className} />,
    phone: <Phone className={className} />,
    plusCircle: <PlusCircle className={className} />,
    trash2: <Trash2 className={className} />,
    edit: <Edit className={className} />,
    externalLink: <ExternalLink className={className} />,
    chevronLeft: <ChevronLeft className={className} />,
    chevronRight: <ChevronRight className={className} />,
  };
  return icons[name] || null;
};

// Common styled components for inputs and textareas
export const Input = styled.input`
  padding: 0.5rem;
  border: 2px solid #e0e0e0; /* from HTML form-group */
  border-radius: 10px; /* from HTML form-group */
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
  color: #333; /* Default text color */
  background-color: white;

  &:focus {
    outline: none;
    border-color: #3498db; /* Blue from HTML */
    box-shadow: 0 0 10px rgba(52, 152, 219, 0.2);
  }

  .dark & { /* Basic dark mode support if needed */
    background-color: #1F2937;
    color: white;
    border-color: #4B5563;
  }
`;

export const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
  color: #333;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 10px rgba(52, 152, 219, 0.2);
  }

  .dark & { /* Basic dark mode support if needed */
    background-color: #1F2937;
    color: white;
    border-color: #4B5563;
  }
`;

export const FormSpace = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* space-y-3 */
`;

export const SectionContainer = styled.section`
  padding: 5rem 2rem; /* py-16 */
  max-width: 1200px;
  margin: 0 auto;
`;

export const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2c3e50; /* Dark blue-gray from HTML */
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: linear-gradient(45deg, #3498db, #9b59b6); /* Blue to purple gradient */
    margin: 1rem auto;
    border-radius: 2px;
  }
`;
