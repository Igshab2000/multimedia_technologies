import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { routes } from './configs/router.config';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const applications = (
  // <React.StrictMode>
    <BrowserRouter>
      {renderRoutes(routes)}
    </BrowserRouter>
  // </React.StrictMode>
);

root.render(applications);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
