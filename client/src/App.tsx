import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';

// ROUTES
import Home from './components/home'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={ <Home /> } />
      </Routes>
    </>
  );
}

export default App;
