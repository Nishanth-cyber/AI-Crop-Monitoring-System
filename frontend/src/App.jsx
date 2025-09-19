import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Predictions from "./components/Predictions/index.jsx";
import Login from "./components/login.jsx";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles.css";

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Predictions />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
