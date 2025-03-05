import React, { useState, useEffect } from 'react';
import './home.css';

const Home = () => {
  const [animateHeader, setAnimateHeader] = useState(false);

  useEffect(() => {
    setAnimateHeader(true);
  }, []);

  return (
    <div className="home-container">
      <header className={`home-header ${animateHeader ? 'animate' : ''}`}>
        <div className="header-content">
          <h1>DrugSeek</h1>
          <h2>Revolutionizing Healthcare with AI</h2>
          <p>Advanced AI Solutions for Medical Diagnostics and Drug Discovery</p>
          <div className="header-cta">
            <a href="/about" className="btn btn-primary">Learn More</a>
            <a href="/contact" className="btn btn-secondary">Contact Us</a>
          </div>
        </div>
      </header>

      <section className="key-features">
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🧬</div>
            <h3>AI-Powered Diagnostics</h3>
            <p>Cutting-edge machine learning algorithms for precise medical imaging analysis and early disease detection.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔬</div>
            <h3>Drug Discovery Acceleration</h3>
            <p>Innovative computational tools that streamline protein interaction analysis and molecular design processes.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">☁️</div>
            <h3>Scalable Cloud Infrastructure</h3>
            <p>Secure, flexible cloud solutions powered by AWS to support advanced medical research and diagnostics.</p>
          </div>
        </div>
      </section>

      <section className="technology-overview">
        <div className="tech-content">
          <h2>Our Technological Edge</h2>
          <div className="tech-details">
            <div className="tech-item">
              <h3>Generative AI</h3>
              <p>Leveraging state-of-the-art generative models to transform medical research and diagnostics.</p>
            </div>
            <div className="tech-item">
              <h3>Machine Learning</h3>
              <p>Advanced ML algorithms that continuously improve diagnostic accuracy and drug discovery processes.</p>
            </div>
            <div className="tech-item">
              <h3>Cloud Computing</h3>
              <p>Robust AWS infrastructure ensuring secure, scalable, and high-performance computational capabilities.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-metrics">
        <div className="metrics-content">
          <h2>Our Impact</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>99%</h3>
              <p>Diagnostic Accuracy Improvement</p>
            </div>
            <div className="metric-card">
              <h3>60%</h3>
              <p>Faster Drug Discovery Timeline</p>
            </div>
            <div className="metric-card">
              <h3>10+</h3>
              <p>Research Collaborations</p>
            </div>
          </div>
        </div>
      </section>

      <section className="call-to-action">
        <div className="cta-content">
          <h2>Transform Healthcare with AI</h2>
          <p>Join us in pushing the boundaries of medical technology and drug research.</p>
          <a href="/contact" className="btn btn-primary">Get Started</a>
        </div>
      </section>
    </div>
  );
};

export default Home;