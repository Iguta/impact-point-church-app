import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Input, TextArea, FormSpace, SectionContainer, SectionTitle } from './UtilityComponents';
import { isEqual } from 'lodash';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useFirebase } from '../context/FirebaseContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

// Reusing SectionContainer and SectionTitle from UtilityComponents
const AboutContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: translateY(${({ isVisible }) => (isVisible ? 0 : '30px')});
  transition: opacity 0.8s ease, transform 0.8s ease;
`;

const MissionVisionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* Mobile: single column */
  gap: 2rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
  }
`;

const MissionVisionCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: left;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  @media (min-width: 640px) {
    padding: 2.5rem;
    border-radius: 15px;
  }

  @media (min-width: 1024px) {
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  text-align: center;

  @media (min-width: 640px) {
    font-size: 1.75rem;
  }

  @media (min-width: 1024px) {
    font-size: 2rem;
  }
`;

const AboutText = styled.p`
  font-size: 1rem; /* Mobile-first */
  line-height: 1.7;
  margin-bottom: 1.5rem;
  color: #374151;
  text-align: left;

  @media (min-width: 640px) {
    font-size: 1.0625rem;
    margin-bottom: 2rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.125rem;
    line-height: 1.8;
  }
`;

const AboutImageWrapper = styled.div`
  margin-top: 2rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  @media (min-width: 1024px) {
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
    }
  }

  img {
    width: 100%;
    height: auto;
    display: block;
  }
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

const AboutSectionContainer = styled(SectionContainer)`
  background: linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%);
  max-width: none;
  margin: 0;
  padding: 3rem 1rem;
  width: 100%;

  @media (min-width: 640px) {
    padding: 4rem 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 5rem 2rem;
  }

  ${AboutContent} {
    padding: 0;

    @media (min-width: 640px) {
      padding: 0 1rem;
    }

    @media (min-width: 1024px) {
      padding: 0 2rem;
    }
  }
`;

const AboutSection = ({ data, isEditing, onUpdate }) => {
  const { storage, db } = useFirebase();
  const [tempData, setTempData] = useState(data);
  const [contentRef, isVisible] = useScrollAnimation({ threshold: 0.1 });
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    // When not editing, sync local state from props only if changed
    if (!isEditing && !isEqual(data, tempData)) {
      setTempData(data);
    }
  }, [data, isEditing, tempData]);

  const handleSave = () => {
    onUpdate('about', tempData);
  };

  // Helper function to calculate file hash using Web Crypto API
  const calculateFileHash = async (file) => {
    try {
      // Clone the file slice to avoid consuming the original file
      const fileSlice = file.slice(0);
      const arrayBuffer = await fileSlice.arrayBuffer();
      
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      console.log('About image hash calculated:', hashHex.substring(0, 16) + '...');
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
      console.log('Checking for duplicate about image with hash:', fileHash.substring(0, 16) + '...');
      const fileHashesRef = collection(db, 'fileHashes');
      const q = query(fileHashesRef, where('hash', '==', fileHash));
      const querySnapshot = await getDocs(q);
      
      console.log('Query result:', querySnapshot.empty ? 'No duplicates found' : `${querySnapshot.size} duplicate(s) found`);
      
      if (!querySnapshot.empty) {
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
      console.log('Storing about image hash:', fileHash.substring(0, 16) + '...');
      const fileHashesRef = collection(db, 'fileHashes');
      await addDoc(fileHashesRef, {
        hash: fileHash,
        url: fileUrl,
        fileName: fileName,
        uploadedAt: new Date().toISOString(),
        storagePath: `about/${fileName}`
      });
      console.log('File hash stored successfully');
    } catch (error) {
      console.error('Error storing file hash:', error);
    }
  };

  // Handle file upload for about image
  const handleFileUpload = async (file) => {
    if (!storage || !file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadStatus({ status: 'error', message: 'Please upload an image file' });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus({ status: 'error', message: 'File size must be less than 10MB' });
      return;
    }

    // Set uploading status
    setUploadStatus({ status: 'uploading', message: 'Checking for duplicates...' });

    try {
      console.log('Starting duplicate check for about image:', file.name, 'Size:', file.size);
      // Calculate file hash to check for duplicates
      const fileHash = await calculateFileHash(file);
      console.log('Hash calculated:', fileHash.substring(0, 32) + '...');
      
      // Check if file already exists in Storage
      const existingUrl = await checkDuplicateFile(fileHash);
      console.log('Duplicate check result:', existingUrl ? 'DUPLICATE FOUND' : 'NO DUPLICATE');
      
      if (existingUrl) {
        // Duplicate found - use existing URL
        setUploadStatus({ status: 'success', message: 'File already exists, reusing existing URL!' });
        setTempData({ ...tempData, imageUrl: existingUrl });
        
        // Clear status after 3 seconds
        setTimeout(() => {
          setUploadStatus(null);
        }, 3000);
        return;
      }

      // No duplicate found - proceed with upload
      setUploadStatus({ status: 'uploading', message: 'Uploading...' });

      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `about-image-${timestamp}-${file.name}`;
      const storageRef = ref(storage, `about/${fileName}`);

      // Upload file
      await uploadBytes(storageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Store file hash for future duplicate detection
      console.log('About to store hash after upload:', fileHash.substring(0, 16) + '...');
      await storeFileHash(fileHash, downloadURL, fileName);
      console.log('Hash storage completed');

      // Update the imageUrl
      setTempData({ ...tempData, imageUrl: downloadURL });
      setUploadStatus({ status: 'success', message: 'Upload successful!' });

      // Clear status after 3 seconds
      setTimeout(() => {
        setUploadStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus({ status: 'error', message: 'Upload failed. Please try again.' });
    }
  };

  // Ensure we have the right data structure (support both old and new format)
  const missionData = data?.mission || (data?.title ? { title: data.title, text: data.text } : { title: "Our Mission", text: "" });
  const visionData = data?.vision || { title: "Our Vision", text: "" };

  return (
    <AboutSectionContainer id="about" role="region" aria-labelledby="about-title">
      <AboutContent ref={contentRef} isVisible={isVisible}>
        <SectionTitle id="about-title">About Us</SectionTitle>
        {isEditing ? (
          <FormSpace>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#1f2937' }}>Mission</h3>
            <Input
              type="text"
              placeholder="Mission Title"
              value={tempData?.mission?.title || tempData?.title || ''}
              onChange={(e) => setTempData({ 
                ...tempData, 
                mission: { ...tempData.mission, title: e.target.value },
                title: e.target.value // Support old format
              })}
              aria-label="Mission title"
            />
            <TextArea
              placeholder="Mission Text"
              value={tempData?.mission?.text || tempData?.text || ''}
              onChange={(e) => setTempData({ 
                ...tempData, 
                mission: { ...tempData.mission, text: e.target.value },
                text: e.target.value // Support old format
              })}
              rows="6"
              aria-label="Mission description"
            />
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '1rem', color: '#1f2937' }}>Vision</h3>
            <Input
              type="text"
              placeholder="Vision Title"
              value={tempData?.vision?.title || ''}
              onChange={(e) => setTempData({ 
                ...tempData, 
                vision: { ...tempData.vision, title: e.target.value }
              })}
              aria-label="Vision title"
            />
            <TextArea
              placeholder="Vision Text"
              value={tempData?.vision?.text || ''}
              onChange={(e) => setTempData({ 
                ...tempData, 
                vision: { ...tempData.vision, text: e.target.value }
              })}
              rows="6"
              aria-label="Vision description"
            />

            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '1rem', color: '#1f2937' }}>Upload Image</h3>
            <FileUploadContainer>
              <FileInput
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file);
                  }
                }}
              />
              {uploadStatus && (
                <UploadStatus status={uploadStatus.status}>
                  {uploadStatus.status === 'uploading' && '⏳'}
                  {uploadStatus.status === 'success' && '✓'}
                  {uploadStatus.status === 'error' && '✗'}
                  {uploadStatus.message}
                </UploadStatus>
              )}
              {tempData?.imageUrl && (
                <ImagePreview>
                  <img src={tempData.imageUrl} alt="Preview" />
                </ImagePreview>
              )}
            </FileUploadContainer>
            <OrDivider>OR</OrDivider>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
              Image URL (Alternative)
            </label>
            <Input
              type="text"
              placeholder="Paste image URL here"
              value={tempData?.imageUrl || ''}
              onChange={(e) => setTempData({ ...tempData, imageUrl: e.target.value })}
              aria-label="About image URL"
            />
            
            <Button onClick={handleSave} className="bg-indigo-600">Save About</Button>
          </FormSpace>
        ) : (
          <>
            <MissionVisionGrid>
              {/* Mission Card */}
              <MissionVisionCard>
                <CardTitle>{missionData.title}</CardTitle>
                <AboutText>
                  {missionData.text ? missionData.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < missionData.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  )) : 'Our mission is to make a lasting impact in our community through faith and purpose.'}
                </AboutText>
              </MissionVisionCard>

              {/* Vision Card */}
              <MissionVisionCard>
                <CardTitle>{visionData.title}</CardTitle>
                <AboutText>
                  {visionData.text ? visionData.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < visionData.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  )) : 'Our vision is to be a beacon of hope and transformation in our community.'}
                </AboutText>
              </MissionVisionCard>
            </MissionVisionGrid>

            {/* Image below Mission and Vision */}
            {(data?.imageUrl || tempData?.imageUrl) && (
              <AboutImageWrapper>
                <img
                  src={data?.imageUrl || tempData?.imageUrl}
                  alt="About Impact Point Church"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover'
                  }}
                  loading="lazy"
                  onError={(e) => {
                    if (e.target.src !== "https://firebasestorage.googleapis.com/v0/b/impact-point-church.firebasestorage.app/o/IMG-20250810-WA0012.jpg?alt=media&token=16d6924b-3eea-4197-8899-f40b7d5933a6") {
                      e.target.onerror = null;
                      e.target.src = "https://firebasestorage.googleapis.com/v0/b/impact-point-church.firebasestorage.app/o/IMG-20250810-WA0012.jpg?alt=media&token=16d6924b-3eea-4197-8899-f40b7d5933a6";
                    }
                  }}
                />
              </AboutImageWrapper>
            )}
          </>
        )}
      </AboutContent>
    </AboutSectionContainer>
  );
};

export default AboutSection;
