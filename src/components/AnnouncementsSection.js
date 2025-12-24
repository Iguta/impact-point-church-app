import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Icon, Input, TextArea, FormSpace, SectionContainer, SectionTitle } from './UtilityComponents';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useFirebase } from '../context/FirebaseContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import LazyImage from './LazyImage';

const AnnouncementsSectionContainer = styled(SectionContainer)`
  background: #f8f9fa;
  max-width: none;
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AnnouncementsList = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;

  @media (min-width: 640px) {
    padding: 0;
  }
`;

const AnnouncementItem = styled.article`
  background: white;
  padding: 1.5rem; /* Mobile-first */
  margin-bottom: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #4f46e5;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: translateY(${({ isVisible }) => (isVisible ? 0 : '20px')});
  animation: ${({ isVisible, index }) => 
    isVisible ? `fadeInUp 0.6s ease-out ${index * 0.1}s both` : 'none'};

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (min-width: 640px) {
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-left-width: 5px;
  }

  @media (min-width: 1024px) {
    &:hover {
      transform: translateX(8px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
  }
`;

const AnnouncementTitle = styled.h3`
  font-size: 1.25rem; /* Mobile-first */
  margin-bottom: 0.75rem;
  color: #1f2937;
  font-weight: 700;
  line-height: 1.3;

  @media (min-width: 640px) {
    font-size: 1.375rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.5rem;
  }
`;

const AnnouncementDescription = styled.p`
  color: #4b5563;
  line-height: 1.6;
  font-size: 0.9375rem; /* Mobile-first */
  margin-bottom: 1rem;

  @media (min-width: 640px) {
    font-size: 1rem;
  }
`;

const FlyerImage = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: auto;
    display: block;
    max-height: 500px;
    object-fit: contain;
  }
`;

const AdminButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem; /* space-x-2 */
  margin-top: 1rem; /* mt-4 */
`;

const FileUploadContainer = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    background: linear-gradient(135deg, #4338ca, #6d28d9);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }

  input[type="file"] {
    display: none;
  }
`;

const UploadStatus = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: ${props => {
    if (props.status === 'success') return '#d1fae5';
    if (props.status === 'error') return '#fee2e2';
    return '#dbeafe';
  }};
  color: ${props => {
    if (props.status === 'success') return '#065f46';
    if (props.status === 'error') return '#991b1b';
    return '#1e40af';
  }};
`;

const AnnouncementsSection = ({ data, isEditing, onUpdate }) => {
  const { storage, db } = useFirebase();
  const [tempAnnouncements, setTempAnnouncements] = useState(data || []);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '', description: '', flyerUrl: ''
  });
  const [uploadStatus, setUploadStatus] = useState({});
  const [newAnnouncementUploadStatus, setNewAnnouncementUploadStatus] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  useEffect(() => {
    setTempAnnouncements(data || []);
  }, [data]);

  // Helper function to calculate file hash using Web Crypto API
  const calculateFileHash = async (file) => {
    try {
      const fileSlice = file.slice(0);
      const arrayBuffer = await fileSlice.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch (error) {
      console.error('Error calculating file hash:', error);
      throw error;
    }
  };

  // Check if file hash already exists in Firestore
  const checkDuplicateFile = async (fileHash) => {
    if (!db) return null;
    try {
      const appId = typeof window !== 'undefined' && typeof window.__app_id !== 'undefined' ? window.__app_id : 'local-dev-app-id';
      const fileHashesRef = collection(db, 'artifacts', appId, 'public', 'file_hashes');
      const q = query(fileHashesRef, where('hash', '==', fileHash));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        console.log('Duplicate file found:', docData.url);
        return docData.url;
      }
      return null;
    } catch (error) {
      console.error('Error checking duplicate file:', error);
      return null;
    }
  };

  // Store file hash in Firestore for future duplicate detection
  const storeFileHash = async (fileHash, downloadURL, fileName) => {
    if (!db) return;
    try {
      const appId = typeof window !== 'undefined' && typeof window.__app_id !== 'undefined' ? window.__app_id : 'local-dev-app-id';
      const fileHashesRef = collection(db, 'artifacts', appId, 'public', 'file_hashes');
      await setDoc(doc(fileHashesRef, fileHash), {
        hash: fileHash,
        url: downloadURL,
        fileName: fileName,
        uploadedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error storing file hash:', error);
    }
  };

  // Handle file upload for announcement flyer
  const handleFileUpload = async (file, announcementId = null) => {
    if (!storage || !file) return;

    const statusKey = announcementId || 'new';
    const isNewAnnouncement = !announcementId;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      if (isNewAnnouncement) {
        setNewAnnouncementUploadStatus({ status: 'error', message: 'Please upload an image file' });
      } else {
        setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'error', message: 'Please upload an image file' } });
      }
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      if (isNewAnnouncement) {
        setNewAnnouncementUploadStatus({ status: 'error', message: 'File size must be less than 10MB' });
      } else {
        setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'error', message: 'File size must be less than 10MB' } });
      }
      return;
    }

    // Set uploading status
    if (isNewAnnouncement) {
      setNewAnnouncementUploadStatus({ status: 'uploading', message: 'Checking for duplicates...' });
    } else {
      setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'uploading', message: 'Checking for duplicates...' } });
    }

    try {
      // Calculate file hash to check for duplicates
      const fileHash = await calculateFileHash(file);
      
      // Check if file already exists in Storage
      const existingUrl = await checkDuplicateFile(fileHash);
      
      if (existingUrl) {
        // Duplicate found - use existing URL
        if (isNewAnnouncement) {
          setNewAnnouncementUploadStatus({ status: 'success', message: 'File already exists, reusing existing URL!' });
          setNewAnnouncement({ ...newAnnouncement, flyerUrl: existingUrl });
        } else {
          setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'success', message: 'File already exists, reusing existing URL!' } });
          const updatedEditingAnnouncement = { ...editingAnnouncement, flyerUrl: existingUrl };
          setEditingAnnouncement(updatedEditingAnnouncement);
          setTempAnnouncements(prevAnnouncements => 
            prevAnnouncements.map(a =>
              a.id === announcementId ? updatedEditingAnnouncement : a
            )
          );
        }

        setTimeout(() => {
          if (isNewAnnouncement) {
            setNewAnnouncementUploadStatus(null);
          } else {
            setUploadStatus({ ...uploadStatus, [statusKey]: null });
          }
        }, 3000);
        return;
      }

      // No duplicate found - proceed with upload
      if (isNewAnnouncement) {
        setNewAnnouncementUploadStatus({ status: 'uploading', message: 'Uploading...' });
      } else {
        setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'uploading', message: 'Uploading...' } });
      }

      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `announcement-flyer-${timestamp}-${file.name}`;
      const storageRef = ref(storage, `announcements/${fileName}`);

      // Upload file
      await uploadBytes(storageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Store file hash for future duplicate detection
      await storeFileHash(fileHash, downloadURL, fileName);

      // Update the announcement's flyerUrl
      if (isNewAnnouncement) {
        setNewAnnouncement({ ...newAnnouncement, flyerUrl: downloadURL });
        setNewAnnouncementUploadStatus({ status: 'success', message: 'Upload successful!' });
      } else {
        const updatedEditingAnnouncement = { ...editingAnnouncement, flyerUrl: downloadURL };
        setEditingAnnouncement(updatedEditingAnnouncement);
        setTempAnnouncements(prevAnnouncements => 
          prevAnnouncements.map(a =>
            a.id === announcementId ? updatedEditingAnnouncement : a
          )
        );
        setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'success', message: 'Upload successful!' } });
      }

      // Clear status after 3 seconds
      setTimeout(() => {
        if (isNewAnnouncement) {
          setNewAnnouncementUploadStatus(null);
        } else {
          setUploadStatus({ ...uploadStatus, [statusKey]: null });
        }
      }, 3000);
    } catch (error) {
      console.error('Error uploading file:', error);
      if (isNewAnnouncement) {
        setNewAnnouncementUploadStatus({ status: 'error', message: 'Upload failed. Please try again.' });
      } else {
        setUploadStatus({ ...uploadStatus, [statusKey]: { status: 'error', message: 'Upload failed. Please try again.' } });
      }
    }
  };

  const startEdit = (announcement) => {
    setEditingAnnouncement({ ...announcement });
  };

  const cancelEdit = () => {
    setEditingAnnouncement(null);
  };

  const handleUpdateAnnouncement = () => {
    if (editingAnnouncement) {
      const updatedAnnouncements = tempAnnouncements.map(a =>
        a.id === editingAnnouncement.id ? editingAnnouncement : a
      );
      setTempAnnouncements(updatedAnnouncements);
      onUpdate('announcements', updatedAnnouncements);
      setEditingAnnouncement(null);
    }
  };

  const handleAddAnnouncement = () => {
    if (newAnnouncement.title) {
      const announcementToAdd = { ...newAnnouncement, id: `announcement-${Date.now()}` };
      const updatedAnnouncements = [...tempAnnouncements, announcementToAdd];
      setTempAnnouncements(updatedAnnouncements);
      onUpdate('announcements', updatedAnnouncements);
      setNewAnnouncement({ title: '', description: '', flyerUrl: '' });
      setNewAnnouncementUploadStatus(null);
      setFileInputKey(prev => prev + 1);
    }
  };

  const handleDeleteAnnouncement = (id) => {
    const updatedAnnouncements = tempAnnouncements.filter(a => a.id !== id);
    setTempAnnouncements(updatedAnnouncements);
    onUpdate('announcements', updatedAnnouncements, 'delete');
  };

  const [sectionRef, isSectionVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <AnnouncementsSectionContainer id="announcements" role="region" aria-labelledby="announcements-title">
      <ContentWrapper ref={sectionRef}>
        <SectionTitle id="announcements-title">Announcements</SectionTitle>
        <AnnouncementsList>
          {tempAnnouncements.map((announcement, index) => (
            <AnnouncementItem 
              key={announcement.id}
              isVisible={isSectionVisible}
              index={index}
            >
            {isEditing && editingAnnouncement?.id === announcement.id ? (
              <FormSpace>
                <Input
                  type="text"
                  placeholder="Title"
                  value={editingAnnouncement.title}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                />
                <TextArea
                  placeholder="Description"
                  value={editingAnnouncement.description}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, description: e.target.value })}
                  rows="3"
                />
                <FileUploadContainer>
                  <FileInputLabel>
                    <Icon name="upload" className="mr-1" /> Upload Flyer Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleFileUpload(file, announcement.id);
                        }
                      }}
                    />
                  </FileInputLabel>
                  {editingAnnouncement.flyerUrl && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Current flyer:</p>
                      <LazyImage 
                        src={editingAnnouncement.flyerUrl} 
                        alt="Announcement flyer"
                        style={{ maxWidth: '100%', borderRadius: '8px' }}
                      />
                    </div>
                  )}
                  {uploadStatus[announcement.id] && (
                    <UploadStatus status={uploadStatus[announcement.id].status}>
                      {uploadStatus[announcement.id].message}
                    </UploadStatus>
                  )}
                </FileUploadContainer>
                <Input
                  type="url"
                  placeholder="Or enter image URL"
                  value={editingAnnouncement.flyerUrl || ''}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, flyerUrl: e.target.value })}
                />
                <AdminButtonsContainer>
                  <Button onClick={handleUpdateAnnouncement} className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1">Save</Button>
                  <Button onClick={cancelEdit} className="bg-gray-400 hover:bg-gray-500 text-white flex-1">Cancel</Button>
                </AdminButtonsContainer>
              </FormSpace>
            ) : (
              <>
                <AnnouncementTitle>{announcement.title}</AnnouncementTitle>
                <AnnouncementDescription>{announcement.description}</AnnouncementDescription>
                {announcement.flyerUrl && (
                  <FlyerImage>
                    <LazyImage 
                      src={announcement.flyerUrl} 
                      alt={announcement.title}
                    />
                  </FlyerImage>
                )}
                {isEditing && (
                  <AdminButtonsContainer>
                    <Button onClick={() => startEdit(announcement)} className="bg-yellow-500 hover:bg-yellow-600 text-white flex-1">
                      <Icon name="edit" className="mr-1" /> Edit
                    </Button>
                    <Button onClick={() => handleDeleteAnnouncement(announcement.id)} className="bg-red-500 hover:bg-red-600 text-white flex-1">
                      <Icon name="trash2" className="mr-1" /> Delete
                    </Button>
                  </AdminButtonsContainer>
                )}
              </>
            )}
          </AnnouncementItem>
        ))}

        {isEditing && (
          <AnnouncementItem>
            <AnnouncementTitle>Add New Announcement</AnnouncementTitle>
            <FormSpace>
              <Input
                type="text"
                placeholder="Title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              />
              <TextArea
                placeholder="Description"
                value={newAnnouncement.description}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                rows="3"
              />
              <FileUploadContainer>
                <FileInputLabel>
                  <Icon name="upload" className="mr-1" /> Upload Flyer Image
                  <input
                    key={fileInputKey}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleFileUpload(file);
                      }
                    }}
                  />
                </FileInputLabel>
                {newAnnouncement.flyerUrl && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Uploaded flyer:</p>
                    <LazyImage 
                      src={newAnnouncement.flyerUrl} 
                      alt="Announcement flyer preview"
                      style={{ maxWidth: '100%', borderRadius: '8px' }}
                    />
                  </div>
                )}
                {newAnnouncementUploadStatus && (
                  <UploadStatus status={newAnnouncementUploadStatus.status}>
                    {newAnnouncementUploadStatus.message}
                  </UploadStatus>
                )}
              </FileUploadContainer>
              <Input
                type="url"
                placeholder="Or enter image URL"
                value={newAnnouncement.flyerUrl}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, flyerUrl: e.target.value })}
              />
              <Button onClick={handleAddAnnouncement} className="bg-green-600 hover:bg-green-700 text-white">
                <Icon name="plusCircle" className="mr-1" /> Add Announcement
              </Button>
            </FormSpace>
          </AnnouncementItem>
        )}
        </AnnouncementsList>
      </ContentWrapper>
    </AnnouncementsSectionContainer>
  );
};

export default AnnouncementsSection;

