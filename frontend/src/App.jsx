import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Predictions from "./components/Predictions/index.jsx";
import "./styles.css";
function App() {
  return (
    <>
      <Header />  
      <Hero />
      <Features />
      <Predictions />
    </>
  );
}

export default App;
