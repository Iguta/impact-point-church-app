import React, { useState } from 'react';
import styled from 'styled-components';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { Button, Input, FormSpace } from './UtilityComponents';
// Import specific icons from react-icons
import { FaSignInAlt, FaSignOutAlt, FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';

const LoginContainer = styled.div`
  background-color: white; /* Card background */
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  max-width: 400px;
  margin: 2rem auto;
  text-align: center;
  color: #333; /* Default text color */
`;

const LoginTitle = styled.h2`
  font-size: 1.5rem; /* h2-font-size */
  margin-bottom: 1.5rem; /* mb-1-5 */
  color: #1F2937; /* title-color */
`;

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 1rem;
`;

const AdminLogin = ({ auth, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(); // Notify parent (App) that login was successful
    } catch (err) {
      console.error("Email/Password login error:", err);
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onLoginSuccess(); // Notify parent (App) that login was successful
    } catch (err) {
      console.error("Google login error:", err);
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    setError(null);
    try {
      await signOut(auth);
      // onAuthStateChanged in FirebaseContext will handle setting userId to null
    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message);
    }
  };

  // If user is already logged in (e.g., if they refreshed the page)
  if (auth?.currentUser) {
    return (
      <LoginContainer>
        <LoginTitle>Welcome, {auth.currentUser.email || "Admin"}!</LoginTitle>
        <Button onClick={handleLogout} className="btn-primary-red" style={{marginTop: '1rem', width: '100%'}}>
          <FaSignOutAlt size={20} style={{marginRight: '0.5rem'}} /> Log Out
        </Button>
      </LoginContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginTitle>Admin Login</LoginTitle>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <FormSpace as="form" onSubmit={handleEmailLogin}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <FaEnvelope size={20} style={{color: 'var(--first-color)'}} />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          <FaLock size={20} style={{color: 'var(--first-color)'}} />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="bg-indigo-600" style={{width: '100%'}}>
          <FaSignInAlt size={20} style={{marginRight: '0.5rem'}} /> Login with Email
        </Button>
      </FormSpace>
      <p style={{margin: '1rem 0', color: 'var(--text-color-light)'}}>OR</p>
      <Button onClick={handleGoogleLogin} className="btn-secondary" style={{width: '100%', border: '1px solid var(--text-color-light)', color: 'var(--text-color)'}}>
        <FaGoogle size={20} style={{marginRight: '0.5rem'}} /> Login with Google
      </Button>
    </LoginContainer>
  );
};

export default AdminLogin;
