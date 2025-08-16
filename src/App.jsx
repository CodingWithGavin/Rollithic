//import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppNavbar from './Navbar';
import Home from './pages/Home';
import Room from './pages/Room';

function App() {

  return (
    <>
      <AppNavbar />
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/room/:roomCode' element={<Room />} />
        </Routes>
      </Router>
    </>
  );
}

export default App
