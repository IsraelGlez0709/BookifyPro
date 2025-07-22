// App.jsx
import Auth from "./components/Auth";
import Home from "./components/Home";
import BusinessPlans from "./components/BusinessPlans";
import BusinessDetail from "./components/BusinessDetail";
import RegistroNegocio from "./components/BusinessRegister";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const token = localStorage.getItem("token");
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/home" replace /> : <Auth />}
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/details/:id"
          element={
            <ProtectedRoute>
              <BusinessDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/planes" element={<BusinessPlans />} />
        <Route path="/registro-negocio" element={<RegistroNegocio />} />
        <Route
          path="*"
          element={
            token ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
