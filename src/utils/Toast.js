import React, { useEffect } from 'react';
import styled from 'styled-components';
import { CheckCircle, Trash2, XCircle, X } from 'lucide-react';

const ToastContainer = styled.div`
  position: fixed;
  top: 1rem; /* Mobile-first positioning */
  right: 1rem;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
  max-width: calc(100% - 2rem); /* Prevent overflow on mobile */

  @media (min-width: 640px) {
    top: 2rem;
    right: 2rem;
    max-width: 500px;
  }
`;

const Toast = styled.div`
  background: ${props => {
    if (props.type === 'delete' || props.type === 'error') {
      return 'linear-gradient(135deg, #EF4444, #DC2626)';
    }
    return 'linear-gradient(135deg, #22C55E, #16A34A)';
  }};
  color: white;
  padding: 1rem 1.25rem; /* Mobile-first padding */
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 280px;
  max-width: 100%;
  animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-in ${props => (props.duration / 1000) - 0.3}s;
  pointer-events: auto;
  opacity: 1;

  @media (min-width: 640px) {
    padding: 1rem 1.5rem;
    min-width: 300px;
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  svg {
    flex-shrink: 0;
  }
`;

const ToastMessage = styled.span`
  font-weight: 500;
  font-size: 0.9375rem; /* Mobile-first */

  @media (min-width: 640px) {
    font-size: 1rem;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  opacity: 0.8;
  transition: opacity 0.2s ease;
  min-width: 24px;
  min-height: 24px;

  &:hover {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export const ToastNotification = ({ message, onClose, duration = 4000, type = 'success' }) => {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, duration]); // Removed onClose from dependencies to prevent timer reset

  if (!message) return null;

  const IconComponent = type === 'delete' || type === 'error' ? XCircle : CheckCircle;

  return (
    <ToastContainer>
      <Toast type={type} duration={duration}>
        <IconComponent size={24} />
        <ToastMessage>{message}</ToastMessage>
        <CloseButton
          onClick={onClose}
          aria-label="Close notification"
          type="button"
        >
          <X size={18} />
        </CloseButton>
      </Toast>
    </ToastContainer>
  );
};

