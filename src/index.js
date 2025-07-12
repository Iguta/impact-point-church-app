    import React from 'react';
    import ReactDOM from 'react-dom/client'; // Import createRoot from 'react-dom/client'
    import './index.css'; // Import your Tailwind CSS
    import App from './App'; // Import the main App component
import { FirebaseProvider } from './context/FirebaseContext';

    // For React 18+
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <FirebaseProvider>
          <App />
        </FirebaseProvider>
      </React.StrictMode>
    );
    