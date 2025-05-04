import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MatsIMeningarPage } from './pages/MatsIMeningarPage/index.tsx';

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
           <Route path="/matsimeningar" element={<MatsIMeningarPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 