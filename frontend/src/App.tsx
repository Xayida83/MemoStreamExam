import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MatsIMeningarPage } from './pages/MatsIMeningarPage/index.tsx';
import EntryList from './components/EntryList.tsx';
import Heading from './components/Heading';

function App() {
  return (
    <Router>
      <div className="app">
        <Heading />
        <main>
          <EntryList />
          <Routes>          
            <Route path="/matsimeningar" element={<MatsIMeningarPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 