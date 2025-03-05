import React from 'react';
import './about.css';

const About = () => {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>About DrugSeek</h1>
        <p>Transforming Healthcare through Generative AI and Machine Learning</p>
      </header>

      <section className="mission-section">
        <div className="section-content">
          <h2>Our Mission</h2>
          <p>Our mission is to bridge the gap between technology and healthcare by providing intelligent, data-driven solutions that improve patient outcomes. We aim to empower medical professionals with AI-powered tools to make faster, more precise diagnoses and assist pharmaceutical researchers in discovering new drug molecules efficiently.</p>
        </div>
      </section>

      <section className="what-we-do-section">
        <div className="section-content">
          <h2>What We Do</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>Lung Disease Diagnosis with CT Imaging</h3>
              <ul>
                <li>Utilize advanced GenAI models to analyze and interpret CT scans</li>
                <li>Aid in early detection and diagnosis of lung diseases</li>
                <li>Improve diagnostic accuracy and reduce assessment time</li>
              </ul>
            </div>
            <div className="service-card">
              <h3>Drug Design & Discovery</h3>
              <ul>
                <li>Protein-Ligand Affinity Prediction</li>
                <li>Protein Structure Prediction</li>
                <li>AutoDocking Simulation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="technology-section">
        <div className="section-content">
          <h2>Our Technology</h2>
          <p>We use a robust MERN (MongoDB, Express.js, React, Node.js) stack combined with Generative AI and Machine Learning to deliver seamless, scalable, and efficient solutions. Our platform is powered by AWS for secure and scalable cloud infrastructure, and we integrate webhooks for real-time data processing and automation.</p>
        </div>
      </section>

      <section className="why-choose-section">
        <div className="section-content">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Innovation-Driven</h3>
              <p>We combine the latest advancements in GenAI and ML to offer cutting-edge diagnostic and drug design capabilities.</p>
            </div>
            <div className="feature-card">
              <h3>Accuracy & Efficiency</h3>
              <p>Our platform improves diagnostic precision and accelerates the drug discovery timeline.</p>
            </div>
            <div className="feature-card">
              <h3>Scalable Solutions</h3>
              <p>With a modern tech stack and cloud infrastructure, our platform is designed to scale with the evolving needs of the medical and pharmaceutical industries.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="about-footer">
        <p>Join us in reshaping the future of medical diagnostics and drug discovery through the power of Generative AI.</p>
      </footer>
    </div>
  );
};

export default About;