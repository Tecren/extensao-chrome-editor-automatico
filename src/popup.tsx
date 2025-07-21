import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
//styles imports
import './styles/base.css';
import './styles/header.css';
import './styles/others.css';
import './styles/scrollbar.css';
import './styles/signatureSelector.css';
import './styles/templatePreview.css';
import './styles/templateEditor.css';
import './styles/TemplateList.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

