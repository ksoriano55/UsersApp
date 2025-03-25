import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

const Login = React.lazy(() => import("./Pages/Auth/Login1"));
const App = React.lazy(() => import("./Layout/App"));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.Fragment>
    <BrowserRouter>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>     
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<App />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  </React.Fragment>
);
