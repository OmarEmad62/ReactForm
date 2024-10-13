import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Your global CSS file

// Create a root for rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the main App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

