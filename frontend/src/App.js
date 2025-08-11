// App.jsx
import Auth from "./components/Auth";
import Home from "./components/Home";
import BusinessPlans from "./components/BusinessPlans";
import BusinessDetail from "./components/BusinessDetail";
import RegistroNegocio from "./components/BusinessRegister";
import BusinessPanel from "./components/BusinessPanel";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentCancel from "./components/PaymentCancel";
import ChatPage from "./components/Chat/ChatPage";

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
        <Route
          path="/business-panel"
          element={
            <ProtectedRoute>
              <BusinessPanel />
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
        <Route path="/pago-exitoso" element={<PaymentSuccess />} />
        <Route path="/pago-cancelado" element={<PaymentCancel />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
