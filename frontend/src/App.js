import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomForm from "./components/RoomForm";
import Whiteboard from "./components/Whiteboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoomForm />} />
        <Route path="/whiteboard/:roomId" element={<Whiteboard />} /> {/* Route for the Whiteboard */}
      </Routes>
    </Router>
  );
};

export default App;
