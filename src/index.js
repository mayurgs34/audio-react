//  Node.js v18.18.0 npm 10.2.1
//  File: index.js
//  Author: Mayur Chavan (GSLab Pvt. Ltd. Pune)
//  Date: 2023-11-21 18:49:59
//  Functionality: Launch the stryker's audio data capturing tool application. 
// 
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';

/**
 * The Root ELement which renders all of the application screens.
 */
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
