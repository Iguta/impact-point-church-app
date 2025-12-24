import React, { useRef } from 'react';
import styled from 'styled-components';
import { Church, Calendar, Mic, Users, MapPin, Mail, Phone, PlusCircle, Trash2, Edit, ExternalLink, ChevronLeft, ChevronRight, PlayCircle, Wifi, Video, Upload, Clock, Share2, Bold, Italic} from 'lucide-react';

// --- Custom Social Media SVG Icons (as React Components) ---
// These are simple SVG paths for common social media logos
const FacebookIconSVG = ({ size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.04C6.5 2.04 2 6.54 2 12.04c0 5.04 3.66 9.24 8.44 9.96v-7.04H7.16v-2.92h3.28V9.04c0-3.24 1.98-5.04 4.88-5.04 1.4 0 2.6.12 2.96.16v3.2h-1.92c-1.52 0-1.84.76-1.84 1.8v2.32h3.6l-.52 3.2h-3.08v7.04c4.78-.72 8.44-4.92 8.44-9.96 0-5.5-4.5-10-10-10z"/>
  </svg>
);

const InstagramIconSVG = ({ size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07c1.265.057 1.954.236 2.599.481.65.254 1.154.545 1.607.999.453.453.744.957.999 1.607.245.645.424 1.334.481 2.599.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.057 1.265-.236 1.954-.481 2.599-.254.65-.545 1.154-.999 1.607-.453.453-.957.744-1.607.999-.645.245-1.334.424-2.599.481-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.265-.057-1.954-.236-2.599-.481-.65-.254-1.154-.545-1.607-.999-.453-.453-.744-.957-.999-1.607-.245-.645-.424-1.334-.481-2.599-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.057-1.265.236-1.954.481-2.599.254-.65.545-1.154.999-1.607.453-.453.957-.744 1.607-.999.645-.245 1.334-.424 2.599-.481 1.266-.058 1.646-.07 4.85-.07zm0 2.163c-3.204 0-3.584.012-4.85.07c-1.173.053-1.685.22-2.02.355-.335.135-.589.308-.85.569-.261.261-.434.515-.569.85-.135.335-.302.847-.355 2.02-.058 1.266-.07 1.646-.07 4.85s.012 3.584.07 4.85c.053 1.173.22 1.685.355 2.02.135.335.308.589.569.85.261.261.515.434.85.569.335.135.847.302 2.02.355 1.266.058 1.646.07 4.85.07s3.584-.012 4.85-.07c1.173-.053 1.685-.22 2.02-.355.335-.135.589-.308.85-.569.261-.261.434-.515.569-.85.135-.335.302-.847.355-2.02.058-1.266.07-1.646.07-4.85s-.012-3.584-.07-4.85c-.053-1.173-.22-1.685-.355-2.02-.135-.335-.308-.589-.569-.85-.261-.261-.515-.434-.85-.569-.335-.135-.847-.302-2.02-.355-1.266-.058-1.646-.07-4.85-.07zm0 3.65c-2.453 0-4.437 1.984-4.437 4.437s1.984 4.437 4.437 4.437 4.437-1.984 4.437-4.437-1.984-4.437-4.437-4.437zm0 2.163c1.266 0 2.274 1.008 2.274 2.274s-1.008 2.274-2.274 2.274-2.274-1.008-2.274-2.274 1.008-2.274 2.274-2.274zm6.406-7.143c-.58 0-1.05.47-1.05 1.05s.47 1.05 1.05 1.05 1.05-.47 1.05-1.05-.47-1.05-1.05-1.05z"/>
  </svg>
);

const TwitterIconSVG = ({ size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.37-.83.49-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.25 5.4 7.72 3.53 5.03c-.36.62-.56 1.35-.56 2.13 0 1.49.75 2.81 1.91 3.59-.7-.02-1.36-.22-1.93-.53v.03c0 2.08 1.48 3.82 3.44 4.22-.36.1-.74.15-1.13.15-.28 0-.55-.03-.81-.08 1.48 1.81 3.64 3.13 6.1 3.17-1.48 1.16-3.34 1.86-5.37 1.86-.35 0-.7-.02-1.04-.06C3.96 20.3 6.39 21 9 21c7.2 0 11.15-5.96 11.15-11.15 0-.17-.01-.34-.01-.51.77-.55 1.44-1.23 1.97-2.01z"/>
  </svg>
);

const YouTubeIconSVG = ({ size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M21.54 6.54a3.17 3.17 0 0 0-2.24-2.24C17.77 4 12 4 12 4s-5.77 0-7.3 0C3.43 4.32 2.72 5.03 2.4 6.54A3.17 3.17 0 0 0 2 9.28v5.44a3.17 3.17 0 0 0 .4 2.74c.32 1.51 1.03 2.22 2.54 2.54 1.53.32 7.3.32 7.3.32s5.77 0 7.3-.32c1.51-.32 2.22-1.03 2.54-2.54a3.17 3.17 0 0 0 .4-2.74v-5.44a3.17 3.17 0 0 0-.4-2.74zM9.98 15.15V8.85l5.04 3.15z"/>
  </svg>
);

// Styled Button component - Mobile-first
const StyledButton = styled.button`
  padding: 0.875rem 1.5rem; /* Mobile padding */
  border: none;
  border-radius: 8px; /* Modern, subtle radius */
  font-size: 1rem; /* Mobile font size */
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 44px; /* Touch target size */
  min-width: 44px;
  line-height: 1.5;

  @media (min-width: 640px) {
    padding: 1rem 2rem;
    font-size: 1.0625rem;
    border-radius: 12px;
  }

  @media (min-width: 1024px) {
    padding: 1rem 2.5rem;
    font-size: 1.125rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  /* Primary Button Style */
  &.btn-primary {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);

    &:hover {
      background: linear-gradient(135deg, #4338ca, #6d28d9);
      box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
    }
  }

  /* Secondary Button Style */
  &.btn-secondary {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.5);
    }
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

// Icon mapping for Lucide-React and custom SVGs
export const Icon = ({ name, className = '', size = 24 }) => {
  const icons = {
    church: <Church className={className} size={size} />,
    calendar: <Calendar className={className} size={size} />,
    mic: <Mic className={className} size={size} />,
    users: <Users className={className} size={size} />,
    mappin: <MapPin className={className} size={size} />,
    mail: <Mail className={className} size={size} />,
    phone: <Phone className={className} size={size} />,
    plusCircle: <PlusCircle className={className} size={size} />,
    trash2: <Trash2 className={className} size={size} />,
    edit: <Edit className={className} size={size} />,
    externalLink: <ExternalLink className={className} size={size} />,
    chevronLeft: <ChevronLeft className={className} size={size} />,
    chevronRight: <ChevronRight className={className} size={size} />,
    playCircle: <PlayCircle className={className} size={size} />, // Added for LiveStreamSection
    wifi: <Wifi className={className} size={size} />, // Added for LiveStreamSection
    video: <Video className={className} size={size} />, // Added for Zoom links
    upload: <Upload className={className} size={size} />, // Added for file uploads
    clock: <Clock className={className} size={size} />, // Added for event time
    share2: <Share2 className={className} size={size} />, // Added for social sharing
    bold: <Bold className={className} size={size} />, // Added for rich text editor
    italic: <Italic className={className} size={size} />, // Added for rich text editor
    // Custom Social Media SVG Icons
    facebook: <FacebookIconSVG className={className} size={size} />,
    instagram: <InstagramIconSVG className={className} size={size} />,
    twitter: <TwitterIconSVG className={className} size={size} />,
    youtube: <YouTubeIconSVG className={className} size={size} />,
  };
  return icons[name] || null;
};

// Common styled components for inputs and textareas - Mobile-first
export const Input = styled.input`
  padding: 0.75rem 1rem; /* Mobile padding */
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  color: #1f2937;
  background-color: white;
  min-height: 44px; /* Touch target */

  @media (min-width: 640px) {
    padding: 0.875rem 1.125rem;
    border-radius: 10px;
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .dark & {
    background-color: #1f2937;
    color: white;
    border-color: #4b5563;

    &::placeholder {
      color: #6b7280;
    }
  }
`;

export const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  color: #1f2937;
  background-color: white;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  line-height: 1.5;

  @media (min-width: 640px) {
    padding: 0.875rem 1.125rem;
    border-radius: 10px;
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .dark & {
    background-color: #1f2937;
    color: white;
    border-color: #4b5563;

    &::placeholder {
      color: #6b7280;
    }
  }
`;

export const FormSpace = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* space-y-3 */
`;

export const SectionContainer = styled.section`
  padding: 3rem 1rem; /* Mobile-first: smaller padding */
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: 640px) {
    padding: 4rem 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 5rem 2rem;
  }
`;

export const SectionTitle = styled.h2`
  text-align: center;
  font-size: 1.875rem; /* Mobile-first: 30px */
  line-height: 1.2;
  margin-bottom: 2rem; /* Mobile spacing */
  color: #1f2937;
  position: relative;
  font-weight: 700;

  @media (min-width: 640px) {
    font-size: 2.25rem; /* 36px */
    margin-bottom: 2.5rem;
  }

  @media (min-width: 1024px) {
    font-size: 2.5rem; /* 40px */
    margin-bottom: 3rem;
  }

  &::after {
    content: '';
    display: block;
    width: 60px; /* Mobile size */
    height: 3px;
    background: linear-gradient(90deg, #4f46e5, #7c3aed);
    margin: 1rem auto 0;
    border-radius: 2px;

    @media (min-width: 640px) {
      width: 80px;
      height: 4px;
    }

    @media (min-width: 1024px) {
      width: 100px;
      margin: 1.25rem auto 0;
    }
  }
`;

// Rich Text Editor Component with Bold and Italic buttons
const FormatToolbar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
  border: 2px solid #d1d5db;
  border-bottom: none;
`;

const FormatButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  color: #4f46e5;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    border-color: #4f46e5;
  }

  &:active {
    background: #e5e7eb;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const RichTextArea = styled(TextArea)`
  border-radius: 0 0 8px 8px;
  border-top: none;
`;

export const RichTextEditor = ({ value, onChange, placeholder, rows = 3, ...props }) => {
  const textareaRef = useRef(null);

  const insertFormatting = (openTag, closeTag) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    let newText;
    if (selectedText) {
      // If text is selected, wrap it
      newText = beforeText + openTag + selectedText + closeTag + afterText;
    } else {
      // If no text selected, insert tags and place cursor between them
      newText = beforeText + openTag + closeTag + afterText;
    }

    onChange({ target: { value: newText } });

    // Set cursor position after the opening tag
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + openTag.length, end + openTag.length);
      } else {
        textarea.setSelectionRange(start + openTag.length, start + openTag.length);
      }
    }, 0);
  };

  const insertLineBreak = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    const newText = beforeText + '<br>' + afterText;
    onChange({ target: { value: newText } });

    // Set cursor position after the line break
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 4, start + 4); // 4 is length of '<br>'
    }, 0);
  };

  const handleBold = () => {
    insertFormatting('<b>', '</b>');
  };

  const handleItalic = () => {
    insertFormatting('<i>', '</i>');
  };

  const handleLineBreak = () => {
    insertLineBreak();
  };

  const handleKeyDown = (e) => {
    // Handle Enter key to insert line break
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      insertLineBreak();
    }
  };

  return (
    <div>
      <FormatToolbar>
        <FormatButton
          type="button"
          onClick={handleBold}
          aria-label="Bold"
          title="Bold"
        >
          <Icon name="bold" size={18} />
        </FormatButton>
        <FormatButton
          type="button"
          onClick={handleItalic}
          aria-label="Italic"
          title="Italic"
        >
          <Icon name="italic" size={18} />
        </FormatButton>
        <FormatButton
          type="button"
          onClick={handleLineBreak}
          aria-label="Line Break"
          title="Insert Line Break (or press Enter)"
        >
          <span style={{ fontSize: '14px', fontWeight: 600 }}>↵</span>
        </FormatButton>
      </FormatToolbar>
      <RichTextArea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        {...props}
      />
    </div>
  );
};

// Helper component to safely render HTML content
export const RichTextContent = ({ content, className = '' }) => {
  if (!content) return null;

  // Simple HTML sanitization - only allow basic formatting tags
  const sanitizeHTML = (html) => {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/<[^>]*>/g, (match) => {
        // Only allow specific tags
        const allowedTags = ['b', 'strong', 'i', 'em', 'u', 'br', 'p'];
        // Extract tag name, handling both <tag> and <tag/> formats
        const tagName = match.replace(/[<>\/]/g, '').split(' ')[0].toLowerCase();
        if (allowedTags.includes(tagName)) {
          // Normalize self-closing tags
          if (tagName === 'br' && !match.includes('</')) {
            return '<br>';
          }
          return match;
        }
        return '';
      });
  };

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }}
    />
  );
};


