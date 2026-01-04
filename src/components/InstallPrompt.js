import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Download, X } from 'lucide-react';

const InstallBanner = styled.div`
  position: fixed;
  bottom: ${props => props.isAdmin ? '80px' : '20px'};
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #4f46e5 0%, #667eea 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
  z-index: 1000;
  max-width: 90%;
  width: 100%;
  max-width: 500px;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: slideInUp 0.3s ease-out;

  @media (min-width: 640px) {
    padding: 1.25rem 2rem;
  }
`;

const InstallContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InstallTitle = styled.div`
  font-weight: 600;
  font-size: 1rem;

  @media (min-width: 640px) {
    font-size: 1.125rem;
  }
`;

const InstallSubtitle = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;

  @media (min-width: 640px) {
    font-size: 0.9375rem;
  }
`;

const InstallButton = styled.button`
  background: white;
  color: #4f46e5;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:disabled:hover {
    transform: none;
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
  opacity: 0.8;
  transition: opacity 0.2s ease;
  min-width: 32px;
  min-height: 32px;

  &:hover {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const InstallPrompt = ({ isAdmin = false, onShowToast }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Check if prompt was dismissed before (using localStorage)
    const promptDismissed = localStorage.getItem('pwa-install-dismissed');
    const promptDismissedTime = promptDismissed ? parseInt(promptDismissed, 10) : 0;
    const daysSinceDismissed = (Date.now() - promptDismissedTime) / (1000 * 60 * 60 * 24);

    // Show prompt if:
    // 1. Not dismissed in last 7 days
    // 2. User has been on site for at least 30 seconds
    // 3. Not already installed
    if (!promptDismissed || daysSinceDismissed > 7) {
      // Wait 30 seconds before showing prompt
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Listen for beforeinstallprompt event (Chrome/Edge)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        // Show the install prompt (this triggers the native browser install dialog)
        await deferredPrompt.prompt();

        // Wait for the user to respond
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
          if (onShowToast) {
            onShowToast('Installing app...', 'success');
          }
          // The app will install, banner will disappear automatically
        } else {
          console.log('User dismissed the install prompt');
        }

        // Clear the deferredPrompt
        setDeferredPrompt(null);
        setShowPrompt(false);
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
      } catch (error) {
        console.error('Error showing install prompt:', error);
        // If prompt fails, show manual instructions
        const instructions = 'To install: Look for the install icon (+) in your browser\'s address bar, or go to Menu → Install Impact Point Church';
        if (onShowToast) {
          onShowToast(instructions, 'success');
        } else {
          alert(instructions);
        }
        setShowPrompt(false);
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
      }
    } else {
      // Fallback: Show manual instructions if native prompt isn't available
      const instructions = 'To install: Look for the install icon (+) in your browser\'s address bar, or go to Menu → Install Impact Point Church';
      if (onShowToast) {
        onShowToast(instructions, 'success');
      } else {
        alert(instructions);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed or prompt shouldn't be shown
  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <InstallBanner isAdmin={isAdmin} role="banner" aria-label="Install app prompt">
      <Download size={24} />
      <InstallContent>
        <InstallTitle>
          {isIOS ? 'Install Impact Point Church' : 'Install Our App'}
        </InstallTitle>
        <InstallSubtitle>
          {isIOS
            ? 'Tap the share button, then "Add to Home Screen"'
            : 'Get quick access and a better experience'}
        </InstallSubtitle>
      </InstallContent>
      {!isIOS && (
        <InstallButton onClick={handleInstallClick} disabled={!deferredPrompt}>
          {deferredPrompt ? 'Install' : 'How to Install'}
        </InstallButton>
      )}
      <CloseButton onClick={handleDismiss} aria-label="Dismiss install prompt">
        <X size={20} />
      </CloseButton>
    </InstallBanner>
  );
};

export default InstallPrompt;

