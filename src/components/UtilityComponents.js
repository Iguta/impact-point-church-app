import React from 'react';
import styled from 'styled-components';
import { Church, Calendar, Mic, Users, MapPin, Mail, Phone, PlusCircle, Trash2, Edit, ExternalLink } from 'lucide-react';

// Styled Button component
const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem; /* rounded-md */
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;
  border: none;
  font-weight: 500;

  &.bg-indigo-600 { background-color: #4F46E5; color: white; }
  &.bg-indigo-600:hover { background-color: #4338CA; } /* Darker indigo */

  &.bg-green-500 { background-color: #22C55E; color: white; }
  &.bg-green-500:hover { background-color: #16A34A; }

  &.bg-red-500 { background-color: #EF4444; color: white; }
  &.bg-red-500:hover { background-color: #DC2626; }

  &.bg-yellow-500 { background-color: #F59E0B; color: white; }
  &.bg-yellow-500:hover { background-color: #D97706; }

  &.bg-gray-400 { background-color: #9CA3AF; color: white; }
  &.bg-gray-400:hover { background-color: #6B7280; }

  /* Specific styles for admin toggle button */
  &.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
  &.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
  &.rounded-full { border-radius: 9999px; }
  &.text-lg { font-size: 1.125rem; }
  &.font-semibold { font-weight: 600; }
  &.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }

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
  };
  return icons[name] || null;
};
