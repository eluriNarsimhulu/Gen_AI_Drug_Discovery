import React, { useState, useEffect, useRef } from 'react';
import './home.css';
import pc from "../pages/ligand.png";

const Home = ({ setActiveSection }) => {
  const [animateHeader, setAnimateHeader] = useState(false);
  const contactRef = useRef(null);

  useEffect(() => {
    setAnimateHeader(true);
  }, []);

  const scrollToContact = () => {
    contactRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-container">
      <header className={`home-header ${animateHeader ? 'animate' : ''}`}>
        <div className="header-content">
          <h1>DrugSeek</h1>
          <h2>Revolutionizing Healthcare with AI</h2>
          <p>Advanced AI Solutions for Medical Diagnostics and Drug Discovery</p>
          <div className="header-cta">
            <a className="btn btn-primary" onClick={() => setActiveSection("about")}>
              Learn More
            </a>
            <a className="btn btn-secondary" onClick={scrollToContact}>Contact Us</a>
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
          <div className='img-con'><img src={pc} className='ligand hover-effect' alt='Ligand' /></div>
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
          {/* Navigate to Brain_Tumor_Segm Section */}
          <a onClick={() => setActiveSection("brain")} className="btn btn-primary">Get Started</a>
        </div>
      </section>

      <section className="contact-section" ref={contactRef} id="contact">
        <div className="contact-content">
          <h2>Contact Us</h2>
          <p>Have questions or want to collaborate? Reach out to our team.</p>
          
          <div className="contact-grid">
            <div className="contact-form">
              <h3>Send Us a Message</h3>
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <select>
                    <option value="">Select Inquiry Type</option>
                    <option value="partnership">Partnership</option>
                    <option value="research">Research Collaboration</option>
                    <option value="support">Technical Support</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" rows="4" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </div>
            
            <div className="contact-info">
              <div className="info-item">
                <div className="info-icon">📍</div>
                <div>
                  <h4>Address</h4>
                  <p>Udaan Block-F, Keshav Memorial Institute Of Technology, Narayanaguda 500029, Telangana, India.</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📞</div>
                <div>
                  <h4>Phone</h4>
                  <p>+91 9030180427</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">✉️</div>
                <div>
                  <h4>Email</h4>
                  <p>drugseek.med@gmail.com</p>
                </div>
              </div>
              <div className="social-links">
                <a href="#" className="social-icon">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-github"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>DrugSeek</h3>
            <p>Revolutionizing Healthcare with AI</p>
          </div>
          <div className="footer-links">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Services</a>
            <a href="#">Blog</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div className="footer-copyright">
            <p>&copy; 2025 DrugSeek AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;