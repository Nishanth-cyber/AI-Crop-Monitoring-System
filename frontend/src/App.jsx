import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Hero from "./components/Hero";
import DiseaseDetection from "./components/Predictions/Disease";
import Predictions from "./components/Predictions";
import PestAnalysis from "./components/Predictions/PestForm";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Crophealth from "./components/Predictions/Cropheath";
import "./styles/global.css";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Hero />} />
        <Route path="predict" element={<Predictions />} />
        <Route path="pest" element={<PestAnalysis />} />
        <Route path="disease" element={<DiseaseDetection />} />
        <Route path="crophea" element={<Crophealth />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;