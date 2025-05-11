import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MatsIMeningarPage } from './pages/MatsIMeningarPage/index.tsx';
import EntryList from './components/EntryList.tsx';
import Heading from './components/Heading';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Router>
      <div className="app">
        <Heading onSearch={setSearchQuery} />
        <main>
          <EntryList searchQuery={searchQuery} />
          <Routes>          
            <Route path="/matsimeningar" element={<MatsIMeningarPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 