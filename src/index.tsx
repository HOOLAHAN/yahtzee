// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Amplify }from 'aws-amplify';
import awsConfig from './aws-exports';

// Configure Amplify with configuration file
Amplify.configure(awsConfig);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
