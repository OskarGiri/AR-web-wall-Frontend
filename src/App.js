import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ARpage from "./pages/ARpage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import FavoritePage from "./pages/FavoritePage";
function AppRoutes() {
  const location = useLocation(); 

  return (
    <Routes>
      {/* ✅ Default route is Login page */}
      <Route path="/" element={<LoginPage />} />

      {/* ✅ Signup page */}
      <Route path="/signup" element={<SignupPage />} />

      
      <Route path="/forget-password" element={<ForgetPasswordPage />} />
      <Route path="/profile" element={<ProfilePage />} />

      {/* ✅ Homepage now moved to /home */}
      <Route path="/home" element={<Homepage key={location.key} />} />

      {/* ✅ AR page */}
      <Route path="/Arpage" element={<ARpage key={location.key} />} />
      {/* ✅ Favorites page */}
      <Route path="/Favorites" element={<FavoritePage key={location.key} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
