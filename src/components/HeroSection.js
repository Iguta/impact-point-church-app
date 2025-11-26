import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Icon, Input, TextArea, FormSpace } from "./UtilityComponents";
import isEqual from "lodash.isequal";
import { useFirebase } from "../context/FirebaseContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, query, where, getDocs, addDoc, doc, setDoc } from "firebase/firestore";

// ---------------- STYLED COMPONENTS - Mobile-first approach ----------------
const HeroSectionContainer = styled.section`
  position: relative;
  min-height: 100vh;
  height: 100vh;
  padding-top: 64px; /* Mobile header height */
  padding-left: 1rem; /* Mobile padding to ensure image visibility */
  padding-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  overflow: hidden;
  transition: background-image 0.8s ease-in-out;

  /* Background image using pseudo-element to position below header */
  &::before {
    content: '';
    position: absolute;
    top: 64px; /* Start below header on mobile */
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    z-index: 0;
    transition: background-image 0.8s ease-in-out;
    background-image: ${props => {
      if (!props.backgroundImage) return 'none';
      // Check if it's already a CSS value (gradient or url())
      if (props.backgroundImage.startsWith('linear-gradient') || props.backgroundImage.startsWith('url(')) {
        return props.backgroundImage;
      }
      // Otherwise, it's a URL string, wrap it in url()
      return `url(${props.backgroundImage})`;
    }};

    @media (min-width: 640px) {
      top: 72px; /* Start below header on tablet */
    }

    @media (min-width: 1024px) {
      top: 80px; /* Start below header on desktop */
    }
  }

  @media (min-width: 640px) {
    padding-top: 72px;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  @media (min-width: 1024px) {
    padding-top: 80px;
    padding-left: 2rem;
    padding-right: 2rem;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ overlayOpacity = 0.6 }) =>
    `linear-gradient(135deg, rgba(79, 70, 229, ${overlayOpacity}) 0%, rgba(118, 75, 162, ${overlayOpacity}) 100%)`};
  z-index: 1;
  transition: opacity 0.3s ease;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 1.5rem; /* Mobile padding */
  width: 100%;
  animation: fadeIn 1s ease-out;

  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem; /* Mobile-first */
  line-height: 1.2;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
  animation: slideInUp 1s ease-out;
  font-weight: 700;

  @media (min-width: 640px) {
    font-size: 2.5rem;
  }

  @media (min-width: 768px) {
    font-size: 3rem;
  }

  @media (min-width: 1024px) {
    font-size: 3.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem; /* Mobile-first */
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.95;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
  animation: slideInUp 1s ease-out 0.3s both;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 640px) {
    font-size: 1.125rem;
  }

  @media (min-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 2.5rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.375rem;
  }
`;

const CtaButtons = styled.div`
  display: flex;
  flex-direction: column; /* Mobile: stacked */
  gap: 1rem;
  justify-content: center;
  align-items: stretch;
  animation: slideInUp 1s ease-out 0.6s both;
  max-width: 500px;
  margin: 0 auto;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  @media (min-width: 768px) {
    gap: 1.5rem;
  }
`;

const CarouselControl = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem;
  cursor: pointer;
  z-index: 3;
  border-radius: 50%;
  width: 48px; /* Touch target size */
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover,
  &:focus {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-50%) scale(1.1);
  }

  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &.left {
    left: 0.5rem;

    @media (min-width: 768px) {
      left: 1rem;
    }
  }

  &.right {
    right: 0.5rem;

    @media (min-width: 768px) {
      right: 1rem;
    }
  }

  @media (max-width: 640px) {
    display: none; /* Hide on very small screens to save space */
  }
`;

const DotIndicators = styled.div`
  position: absolute;
  bottom: 1rem; /* Mobile spacing */
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;

  @media (min-width: 768px) {
    bottom: 2rem;
    gap: 0.75rem;
  }
`;

const Dot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  min-width: 10px;
  min-height: 10px;

  &:hover,
  &:focus {
    background: rgba(255, 255, 255, 0.6);
    transform: scale(1.2);
  }

  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }

  &.active {
    background: white;
    width: 12px;
    height: 12px;
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
  }
`;

const EditModeContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10;
  overflow-y: auto;
  padding: 2rem 1rem;
  
  @media (min-width: 640px) {
    padding: 3rem 2rem;
  }
`;

const EditFormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  color: #1f2937;
  
  @media (min-width: 640px) {
    padding: 2.5rem;
  }
`;

const EditFormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1f2937;
`;

const SlideEditorCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: #f9fafb;
`;

const SlideEditorTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
`;

const AdminButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const FileUploadContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    background: #f3f4f6;
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::file-selector-button {
    padding: 0.5rem 1rem;
    margin-right: 1rem;
    border: none;
    border-radius: 6px;
    background: #667eea;
    color: white;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s ease;

    &:hover {
      background: #5568d3;
    }
  }
`;

const UploadStatus = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => {
    if (props.status === 'uploading') return '#f59e0b';
    if (props.status === 'success') return '#22c55e';
    if (props.status === 'error') return '#ef4444';
    return '#6b7280';
  }};
`;

const ImagePreview = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  
  img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
    border: 2px solid #e5e7eb;
    object-fit: cover;
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e5e7eb;
  }

  &::before {
    margin-right: 0.5rem;
  }

  &::after {
    margin-left: 0.5rem;
  }
`;

// ---------------- MAIN COMPONENT ----------------
const HeroSection = ({ data = [], isEditing, onUpdate }) => {
  const { storage, db } = useFirebase();

  // Helper function to calculate file hash using Web Crypto API
  // Note: This creates a copy/clone of the file so it can still be used for upload
  const calculateFileHash = async (file) => {
    try {
      // Clone the file slice to avoid consuming the original file
      // We can read file.slice(0) which creates a copy without consuming the original
      const fileSlice = file.slice(0);
      const arrayBuffer = await fileSlice.arrayBuffer();
      
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      console.log('File hash calculated:', hashHex.substring(0, 16) + '...');
      return hashHex;
    } catch (error) {
      console.error('Error calculating file hash:', error);
      throw error;
    }
  };

  // Check if file hash already exists in Firestore
  const checkDuplicateFile = async (fileHash) => {
    if (!db) {
      console.log('DB not available for duplicate check');
      return null;
    }
    
    try {
      console.log('Checking for duplicate file with hash:', fileHash.substring(0, 16) + '...', 'Full hash length:', fileHash.length);
      const fileHashesRef = collection(db, 'fileHashes');
      
      // Query for the hash
      const q = query(fileHashesRef, where('hash', '==', fileHash));
      const querySnapshot = await getDocs(q);
      
      console.log('Query result:', querySnapshot.empty ? 'No duplicates found' : `${querySnapshot.size} duplicate(s) found`);
      
      // Also check all documents for debugging (remove this later)
      const allDocsSnapshot = await getDocs(fileHashesRef);
      console.log('Total documents in fileHashes collection:', allDocsSnapshot.size);
      if (allDocsSnapshot.size > 0) {
        console.log('Sample hashes in collection:');
        allDocsSnapshot.docs.slice(0, 3).forEach((doc, idx) => {
          const data = doc.data();
          console.log(`  Doc ${idx + 1}: hash=${data.hash?.substring(0, 16)}..., url=${data.url?.substring(0, 50)}...`);
        });
      }
      
      if (!querySnapshot.empty) {
        // Duplicate found, return existing URL
        const existingDoc = querySnapshot.docs[0];
        const existingUrl = existingDoc.data().url;
        console.log('✅ Duplicate found! Existing URL:', existingUrl);
        return existingUrl;
      }
      console.log('❌ No duplicate found - will proceed with upload');
      return null;
    } catch (error) {
      console.error('❌ Error checking duplicate file:', error);
      console.error('Error details:', error.message, error.code);
      // If query fails, we'll still proceed with upload to avoid blocking
      return null;
    }
  };

  // Store file hash and URL in Firestore for future duplicate detection
  const storeFileHash = async (fileHash, fileUrl, fileName) => {
    if (!db) {
      console.warn('DB not available for storing file hash');
      return;
    }
    
    try {
      console.log('Storing file hash:', fileHash.substring(0, 16) + '...');
      const fileHashesRef = collection(db, 'fileHashes');
      await addDoc(fileHashesRef, {
        hash: fileHash,
        url: fileUrl,
        fileName: fileName,
        uploadedAt: new Date().toISOString(),
        storagePath: `carousel/${fileName}`
      });
      console.log('File hash stored successfully');
    } catch (error) {
      console.error('Error storing file hash:', error);
      // Don't throw - hash storage failure shouldn't block upload
    }
  };

  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [tempSlides, setTempSlides] = useState([]);
  const [editingSlide, setEditingSlide] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({}); // Track upload status per slide
  const [newSlide, setNewSlide] = useState({
    imageUrl: '',
    title: '',
    subtitle: '',
    ctaPrimaryText: '',
    ctaPrimaryLink: '',
    ctaSecondaryText: '',
    ctaSecondaryLink: '',
    overlayOpacity: 0.6
  });
  const [newSlideUploadStatus, setNewSlideUploadStatus] = useState(null);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  // Use data directly from Firestore (no Storage fetching needed)
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setSlides(data);
      // Reset to first slide if current index is out of bounds
      setCurrentSlideIndex((prev) => (prev >= data.length ? 0 : prev));
      if (!isEditing) {
        setTempSlides(data);
      }
    }
  }, [data, isEditing]);

  // Sync tempSlides when entering edit mode
  useEffect(() => {
    if (isEditing && !isEqual(slides, tempSlides) && slides.length > 0) {
      setTempSlides(slides);
    }
  }, [isEditing, slides, tempSlides]);

  // Auto-play carousel with pause on hover
  useEffect(() => {
    // Only auto-play if: not editing, has multiple slides, and not paused
    if (isEditing || slides.length <= 1 || isCarouselPaused) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // Transition every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length, isEditing, isCarouselPaused]);

  // Admin editing functions
  const handleSaveSlides = () => {
    onUpdate('heroSlides', tempSlides);
  };

  const handleUpdateSlide = (updatedSlide) => {
    const updatedSlides = tempSlides.map(s =>
      s.id === updatedSlide.id ? updatedSlide : s
    );
    setTempSlides(updatedSlides);
    setEditingSlide(null);
  };

  const handleAddSlide = () => {
    if (newSlide.imageUrl && newSlide.title) {
      const slideToAdd = {
        ...newSlide,
        id: `slide-${Date.now()}`,
      };
      const updatedSlides = [...tempSlides, slideToAdd];
      setTempSlides(updatedSlides);
      setNewSlide({
        imageUrl: '',
        title: '',
        subtitle: '',
        ctaPrimaryText: '',
        ctaPrimaryLink: '',
        ctaSecondaryText: '',
        ctaSecondaryLink: '',
        overlayOpacity: 0.6
      });
    }
  };

  const handleDeleteSlide = (id) => {
    const updatedSlides = tempSlides.filter(s => s.id !== id);
    setTempSlides(updatedSlides);
    onUpdate('heroSlides', updatedSlides, 'delete');
    if (currentSlideIndex >= updatedSlides.length) {
      setCurrentSlideIndex(Math.max(0, updatedSlides.length - 1));
    }
  };

  // Handle file upload for editing slide
  const handleFileUpload = async (file, slideId = null) => {
    if (!storage || !file) return;

    const statusKey = slideId || 'new';
    const isNewSlide = !slideId;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      if (isNewSlide) {
        setNewSlideUploadStatus({ status: 'error', message: 'Please upload an image file' });
      } else {
        setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'error', message: 'Please upload an image file' } });
      }
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      if (isNewSlide) {
        setNewSlideUploadStatus({ status: 'error', message: 'File size must be less than 10MB' });
      } else {
        setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'error', message: 'File size must be less than 10MB' } });
      }
      return;
    }

    // Set uploading status (checking for duplicates first)
    if (isNewSlide) {
      setNewSlideUploadStatus({ status: 'uploading', message: 'Checking for duplicates...' });
    } else {
      setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'uploading', message: 'Checking for duplicates...' } });
    }

    try {
      // Calculate file hash to check for duplicates
      console.log('Starting duplicate check for file:', file.name, 'Size:', file.size);
      const fileHash = await calculateFileHash(file);
      console.log('Hash calculated:', fileHash.substring(0, 32) + '...');
      
      // Check if file already exists in Storage
      const existingUrl = await checkDuplicateFile(fileHash);
      console.log('Duplicate check result:', existingUrl ? 'DUPLICATE FOUND' : 'NO DUPLICATE');
      
      if (existingUrl) {
        // Duplicate found - use existing URL
        if (isNewSlide) {
          setNewSlideUploadStatus({ status: 'success', message: 'File already exists, reusing existing URL!' });
        } else {
          setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'success', message: 'File already exists, reusing existing URL!' } });
        }
        
        // Use existing URL
        const downloadURL = existingUrl;
        
        // Update the slide's imageUrl with existing URL
        if (isNewSlide) {
          setNewSlide({ ...newSlide, imageUrl: downloadURL });
        } else {
          const updatedEditingSlide = { ...editingSlide, imageUrl: downloadURL };
          setEditingSlide(updatedEditingSlide);
          setTempSlides(prevSlides => 
            prevSlides.map(s =>
              s.id === slideId ? updatedEditingSlide : s
            )
          );
        }

        // Clear status after 3 seconds
        setTimeout(() => {
          if (isNewSlide) {
            setNewSlideUploadStatus(null);
          } else {
            setUploadStatus({ ...uploadStatus, [statusKey]: null });
          }
        }, 3000);
        return; // Exit early since we're using existing file
      }

      // No duplicate found - proceed with upload
      if (isNewSlide) {
        setNewSlideUploadStatus({ status: 'uploading', message: 'Uploading...' });
      } else {
        setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'uploading', message: 'Uploading...' } });
      }

      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `hero-slide-${timestamp}-${file.name}`;
      const storageRef = ref(storage, `carousel/${fileName}`);

      // Upload file
      await uploadBytes(storageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Store file hash for future duplicate detection
      console.log('About to store hash after upload:', fileHash.substring(0, 16) + '...');
      await storeFileHash(fileHash, downloadURL, fileName);
      console.log('Hash storage completed');

      // Update the slide's imageUrl
      if (isNewSlide) {
        setNewSlide({ ...newSlide, imageUrl: downloadURL });
        setNewSlideUploadStatus({ status: 'success', message: 'Upload successful!' });
      } else {
        // Update both editingSlide and tempSlides immediately
        const updatedEditingSlide = { ...editingSlide, imageUrl: downloadURL };
        setEditingSlide(updatedEditingSlide);
        
        // Also update tempSlides using functional update to ensure we have latest state
        // This ensures the URL is saved when user clicks "Save All Changes"
        setTempSlides(prevSlides => 
          prevSlides.map(s =>
            s.id === slideId ? updatedEditingSlide : s
          )
        );
        
        setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'success', message: 'Upload successful!' } });
      }

      // Clear status after 3 seconds
      setTimeout(() => {
        if (isNewSlide) {
          setNewSlideUploadStatus(null);
        } else {
          setUploadStatus({ ...uploadStatus, [statusKey]: null });
        }
      }, 3000);
    } catch (error) {
      console.error('Error uploading file:', error);
      if (isNewSlide) {
        setNewSlideUploadStatus({ status: 'error', message: 'Upload failed. Please try again.' });
      } else {
        setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'error', message: 'Upload failed. Please try again.' } });
      }
    }
  };

  // Show edit mode UI
  if (isEditing) {
    return (
      <HeroSectionContainer
        id="home"
        backgroundImage={slides.length > 0 && slides[currentSlideIndex]?.imageUrl
          ? slides[currentSlideIndex].imageUrl
          : `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`}
      >
        <Overlay overlayOpacity={slides[currentSlideIndex]?.overlayOpacity ?? 0.6} />
        <EditModeContainer>
          <EditFormContainer>
            <EditFormTitle>Edit Hero Slides</EditFormTitle>
            
            {tempSlides.map((slide, index) => (
              <SlideEditorCard key={slide.id || index}>
                <SlideEditorTitle>Slide {index + 1}</SlideEditorTitle>
                {editingSlide?.id === slide.id ? (
                  <FormSpace>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
                      Upload Image
                    </label>
                    <FileUploadContainer>
                      <FileInput
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, editingSlide.id);
                          }
                        }}
                      />
                      {uploadStatus[editingSlide.id] && (
                        <UploadStatus status={uploadStatus[editingSlide.id].status}>
                          {uploadStatus[editingSlide.id].status === 'uploading' && '⏳'}
                          {uploadStatus[editingSlide.id].status === 'success' && '✓'}
                          {uploadStatus[editingSlide.id].status === 'error' && '✗'}
                          {uploadStatus[editingSlide.id].message}
                        </UploadStatus>
                      )}
                      {editingSlide.imageUrl && (
                        <ImagePreview>
                          <img src={editingSlide.imageUrl} alt="Hero slide preview" />
                        </ImagePreview>
                      )}
                    </FileUploadContainer>
                    <OrDivider>OR</OrDivider>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
                      Image URL (Alternative)
                    </label>
                    <Input
                      type="text"
                      value={editingSlide.imageUrl || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, imageUrl: e.target.value })}
                      placeholder="Paste image URL here"
                    />
                    <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
                      Title
                    </label>
                    <Input
                      type="text"
                      value={editingSlide.title || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                      placeholder="Slide Title"
                    />
                    <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
                      Subtitle
                    </label>
                    <TextArea
                      value={editingSlide.subtitle || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                      placeholder="Slide Subtitle"
                      rows="2"
                    />
                    <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
                      Primary CTA Text
                    </label>
                    <Input
                      type="text"
                      value={editingSlide.ctaPrimaryText || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, ctaPrimaryText: e.target.value })}
                      placeholder="e.g., Join Us This Sunday"
                    />
                    <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
                      Primary CTA Link
                    </label>
                    <Input
                      type="text"
                      value={editingSlide.ctaPrimaryLink || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, ctaPrimaryLink: e.target.value })}
                      placeholder="e.g., #services"
                    />
                    <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
                      Secondary CTA Text
                    </label>
                    <Input
                      type="text"
                      value={editingSlide.ctaSecondaryText || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, ctaSecondaryText: e.target.value })}
                      placeholder="e.g., Learn More"
                    />
                    <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
                      Secondary CTA Link
                    </label>
                    <Input
                      type="text"
                      value={editingSlide.ctaSecondaryLink || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, ctaSecondaryLink: e.target.value })}
                      placeholder="e.g., #about"
                    />
                    <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
                      Overlay Opacity (0-1)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={editingSlide.overlayOpacity ?? 0.6}
                      onChange={(e) => setEditingSlide({ ...editingSlide, overlayOpacity: parseFloat(e.target.value) })}
                      placeholder="0.6"
                    />
                    <AdminButtonsContainer>
                      <Button onClick={() => {
                        // Update tempSlides first
                        const updatedSlides = tempSlides.map(s =>
                          s.id === editingSlide.id ? editingSlide : s
                        );
                        setTempSlides(updatedSlides);
                        // Close edit mode
                        setEditingSlide(null);
                        // Save to Firestore immediately
                        onUpdate('heroSlides', updatedSlides);
                      }} className="bg-green-600 hover:bg-green-700 text-white">
                        Save
                      </Button>
                      <Button onClick={() => setEditingSlide(null)} className="bg-gray-500 hover:bg-gray-600 text-white">
                        Cancel
                      </Button>
                    </AdminButtonsContainer>
                  </FormSpace>
                ) : (
                  <div>
                    <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      <strong>Title:</strong> {slide.title || 'No title'}
                    </p>
                    <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      <strong>Image:</strong> {slide.imageUrl ? '✓ Set' : '✗ Missing'}
                    </p>
                    <AdminButtonsContainer>
                      <Button onClick={() => setEditingSlide({ ...slide })} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        <Icon name="edit" className="mr-1" /> Edit
                      </Button>
                      <Button onClick={() => handleDeleteSlide(slide.id)} className="bg-red-500 hover:bg-red-600 text-white">
                        <Icon name="trash2" className="mr-1" /> Delete
                      </Button>
                    </AdminButtonsContainer>
                  </div>
                )}
              </SlideEditorCard>
            ))}

            {/* Add New Slide Form */}
            <SlideEditorCard style={{ border: '2px dashed #9ca3af' }}>
              <SlideEditorTitle>Add New Slide</SlideEditorTitle>
              <FormSpace>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
                  Upload Image
                </label>
                <FileUploadContainer>
                  <FileInput
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, null); // null indicates new slide
                      }
                    }}
                  />
                  {newSlideUploadStatus && (
                    <UploadStatus status={newSlideUploadStatus.status}>
                      {newSlideUploadStatus.status === 'uploading' && '⏳'}
                      {newSlideUploadStatus.status === 'success' && '✓'}
                      {newSlideUploadStatus.status === 'error' && '✗'}
                      {newSlideUploadStatus.message}
                    </UploadStatus>
                  )}
                  {newSlide.imageUrl && (
                    <ImagePreview>
                      <img src={newSlide.imageUrl} alt="New hero slide preview" />
                    </ImagePreview>
                  )}
                </FileUploadContainer>
                <OrDivider>OR</OrDivider>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
                  Image URL (Alternative) *
                </label>
                <Input
                  type="text"
                  value={newSlide.imageUrl}
                  onChange={(e) => setNewSlide({ ...newSlide, imageUrl: e.target.value })}
                  placeholder="Paste image URL here (required)"
                />
                <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
                  Title *
                </label>
                <Input
                  type="text"
                  value={newSlide.title}
                  onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                  placeholder="Slide Title (required)"
                />
                <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
                  Subtitle
                </label>
                <TextArea
                  value={newSlide.subtitle}
                  onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                  placeholder="Slide Subtitle"
                  rows="2"
                />
                <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
                  Primary CTA Text
                </label>
                <Input
                  type="text"
                  value={newSlide.ctaPrimaryText}
                  onChange={(e) => setNewSlide({ ...newSlide, ctaPrimaryText: e.target.value })}
                  placeholder="e.g., Join Us This Sunday"
                />
                <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
                  Primary CTA Link
                </label>
                <Input
                  type="text"
                  value={newSlide.ctaPrimaryLink}
                  onChange={(e) => setNewSlide({ ...newSlide, ctaPrimaryLink: e.target.value })}
                  placeholder="e.g., #services"
                />
                <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
                  Secondary CTA Text
                </label>
                <Input
                  type="text"
                  value={newSlide.ctaSecondaryText}
                  onChange={(e) => setNewSlide({ ...newSlide, ctaSecondaryText: e.target.value })}
                  placeholder="e.g., Learn More"
                />
                <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
                  Secondary CTA Link
                </label>
                <Input
                  type="text"
                  value={newSlide.ctaSecondaryLink}
                  onChange={(e) => setNewSlide({ ...newSlide, ctaSecondaryLink: e.target.value })}
                  placeholder="e.g., #about"
                />
                <Button onClick={handleAddSlide} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Add Slide
                </Button>
              </FormSpace>
            </SlideEditorCard>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button onClick={handleSaveSlides} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Save All Changes
              </Button>
            </div>
          </EditFormContainer>
        </EditModeContainer>
      </HeroSectionContainer>
    );
  }

  if (slides.length === 0) {
    return (
      <HeroSectionContainer
        id="home"
        style={{
          backgroundImage: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
        }}
      >
        <Overlay overlayOpacity={0.6} />
        <ContentWrapper>
          <Title>Loading...</Title>
        </ContentWrapper>
      </HeroSectionContainer>
    );
  }

  const currentSlide = slides[currentSlideIndex];

  // Handle smooth scroll for anchor links
  const handleSmoothScroll = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  // Handle pause on hover
  const handleMouseEnter = () => {
    setIsCarouselPaused(true);
  };

  const handleMouseLeave = () => {
    setIsCarouselPaused(false);
  };

  // Handle pause on manual navigation
  const handleManualNavigate = (newIndex) => {
    setIsCarouselPaused(true);
    setCurrentSlideIndex(newIndex);
    // Resume after 5 seconds of inactivity
    setTimeout(() => {
      setIsCarouselPaused(false);
    }, 5000);
  };

  return (
    <HeroSectionContainer
      id="home"
      backgroundImage={currentSlide.imageUrl}
      role="banner"
      aria-label="Hero section"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Overlay overlayOpacity={currentSlide.overlayOpacity ?? 0.6} />
      <ContentWrapper key={currentSlide.id}>
        <Title>{currentSlide.title}</Title>
        <Subtitle>{currentSlide.subtitle}</Subtitle>
        <CtaButtons>
          {currentSlide.ctaPrimaryText && (
            <Button 
              as="a" 
              href={currentSlide.ctaPrimaryLink} 
              className="btn-primary"
              onClick={(e) => handleSmoothScroll(e, currentSlide.ctaPrimaryLink)}
              aria-label={currentSlide.ctaPrimaryText}
            >
              {currentSlide.ctaPrimaryText}
            </Button>
          )}
          {currentSlide.ctaSecondaryText && (
            <Button 
              as="a" 
              href={currentSlide.ctaSecondaryLink} 
              className="btn-secondary"
              onClick={(e) => handleSmoothScroll(e, currentSlide.ctaSecondaryLink)}
              aria-label={currentSlide.ctaSecondaryText}
            >
              {currentSlide.ctaSecondaryText}
            </Button>
          )}
        </CtaButtons>
      </ContentWrapper>

      {slides.length > 1 && (
        <>
          <CarouselControl 
            className="left" 
            onClick={() => handleManualNavigate((currentSlideIndex - 1 + slides.length) % slides.length)}
            aria-label="Previous slide"
          >
            <Icon name="chevronLeft" size={24} />
          </CarouselControl>
          <CarouselControl 
            className="right" 
            onClick={() => handleManualNavigate((currentSlideIndex + 1) % slides.length)}
            aria-label="Next slide"
          >
            <Icon name="chevronRight" size={24} />
          </CarouselControl>

          <DotIndicators role="tablist" aria-label="Slide indicators">
            {slides.map((_, index) => (
              <Dot
                key={index}
                className={index === currentSlideIndex ? "active" : ""}
                onClick={() => handleManualNavigate(index)}
                aria-label={`Go to slide ${index + 1}`}
                role="tab"
                aria-selected={index === currentSlideIndex}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleManualNavigate(index);
                  }
                }}
              />
            ))}
          </DotIndicators>
        </>
      )}
    </HeroSectionContainer>
  );
};

export default HeroSection;
