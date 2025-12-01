import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PCBuilder } from './PCBuilder';
import { PartLeaderboard } from './PartLeaderboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PCBuilder />} />
        <Route path="/leaderboard" element={<PartLeaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;