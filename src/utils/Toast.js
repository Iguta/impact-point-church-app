import React, { useEffect } from 'react';
import styled from 'styled-components';
import { CheckCircle, Trash2 } from 'lucide-react';

const ToastContainer = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
`;

const Toast = styled.div`
  background: ${props => 
    props.type === 'delete' 
      ? 'linear-gradient(135deg, #EF4444, #DC2626)' 
      : 'linear-gradient(135deg, #22C55E, #16A34A)'};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 300px;
  max-width: 500px;
  animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-in ${props => (props.duration / 1000) - 0.3}s;
  pointer-events: auto;
  opacity: 1;

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
  font-size: 1rem;
`;

export const ToastNotification = ({ message, onClose, duration = 3000, type = 'success' }) => {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, duration]); // Removed onClose from dependencies to prevent timer reset

  if (!message) return null;

  const IconComponent = type === 'delete' ? Trash2 : CheckCircle;

  return (
    <ToastContainer>
      <Toast type={type} duration={duration}>
        <IconComponent size={24} />
        <ToastMessage>{message}</ToastMessage>
      </Toast>
    </ToastContainer>
  );
};

