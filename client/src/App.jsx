import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PromptForm from './pages/PromptForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/promptform" element={<PromptForm />} />
      </Routes>
    </Router>
  );
}

export default App;
