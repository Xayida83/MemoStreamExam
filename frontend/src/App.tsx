import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserPage } from './components/UserPage';
import './components/styles/UserPage.css';
import './components/styles/AudioPlayer.css';
import './components/styles/ImageGallery.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <h1>MemoStream</h1>
          <p>Välkommen till MemoStream - ditt verktyg för att publicera innehåll via e-post.</p>
        </header>
        <main>
          <Routes>
            <Route path="/user/:userId" element={<UserPage />} />
            <Route path="/customer/:customerId" element={<UserPage />} />
            <Route path="/" element={
              <div className="welcome">
                <h2>Välkommen</h2>
                <p>Ange ditt användar-ID i URL:en för att se ditt innehåll.</p>
                <p>Exempel: /user/ditt-användar-id</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 