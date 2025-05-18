import { useState } from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import EntryList from './components/EntryList.tsx';
import Heading from './components/Heading';
import ContactFormComponent from './components/ContactFormComponent';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Router>
      <div className="app">
        <Heading onSearch={setSearchQuery} />
        <main>
          <EntryList searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <ContactFormComponent />
        </main>
      </div>
    </Router>
  );
}

export default App; 