import React from "react";
import CropForm from "./CropForm";
import PestForm from "./PestForm";

export default function Predictions() {
  return (
    <section className="predictions" id="predict">
      <h2>Make Predictions</h2>
      <CropForm />
      <PestForm />
    </section>
  );
}
