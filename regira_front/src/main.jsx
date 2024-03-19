import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Login from './Login.jsx';
import Projects from './Projects.jsx';
import Register from './Register.jsx';
import NouIssue from './NouIssue.jsx';
import Kanban from './Kanban.jsx';
import NouProjecte from './NouProjecte.jsx';

import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>

          <Route index path="/login" element={<Login />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/register" element={<Register />} />
          <Route path="/issue/new/:projectId" element={<NouIssue />} />
          <Route path="/project/new" element={<NouProjecte />} />
          <Route path="/kanban/:id" element={<Kanban />} />
         {/* <Route index element={<Inici />} />
           */}
        </Route>
      </Routes>
    </BrowserRouter>
)
