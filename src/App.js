import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ARpage from "./pages/ARpage";
import Homepage from "./pages/Homepage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Arpage" element={<ARpage />} />
        

      </Routes>
    </Router>
  );
}

export default App;
