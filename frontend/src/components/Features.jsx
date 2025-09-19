import React from "react";
import img2 from "../assets/Img_2.jpeg";
import img3 from "../assets/Img_3.jpeg";
import img4 from "../assets/Img_4.jpeg";
import img5 from "../assets/Img_5.jpeg";

export default function Features() {
  const features = [
    { title: "🌱 Harvest Date Prediction", desc: "Get the best time to harvest based on crop lifecycle & environmental data.", img: img2 },
    { title: "💧 Water Requirement", desc: "AI recommends irrigation amounts using soil, crop, and climate data.", img: img3 },
    { title: "🐛 Pest Detection", desc: "Upload pest images to identify threats using deep learning.", img: img4 },
    { title: "🧪 Pesticide Recommendation", desc: "Find effective pesticides tailored to the detected pest type.", img: img5 }
  ];

  return (
    <section className="features" id="features">
      {features.map((f, i) => (
        <div className="card" key={i}>
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
          <img src={f.img} alt={f.title} />
        </div>
      ))}
    </section>
  );
}
