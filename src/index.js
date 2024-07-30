import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';

// get the publish key from the env

const key = process.env.REACT_APP_PUBLISH_KEY;

// console.log(key);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={key}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
