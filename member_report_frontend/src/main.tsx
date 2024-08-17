import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import { ModalContextProvider } from './context/modalContext';
import { MemberInfoProvider } from './context/FetchMembers';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <ModalContextProvider>
        <MemberInfoProvider>
          <App />
        </MemberInfoProvider>
      </ModalContextProvider>
    </Router>
  </React.StrictMode>,
);
