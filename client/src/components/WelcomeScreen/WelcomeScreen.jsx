import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie  from 'lottie-react'
import "./index.css"
import ani1 from "../pages/ani1.json"
import home2 from "../pages/home2.json"
import home1 from "../pages/home1.json"

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="bg">
      <div><Lottie animationData={ani1} className='animations'/></div>
      <h1 className="wel-text">Welcome to </h1>
      <h1 className="head">DRUGSeek</h1>
      <p className="para">An AI-driven platform revolutionizing lung disease diagnosis and drug discovery. Our mission is to enhance patient care by integrating advanced machine learning with medical imaging and molecular modeling, accelerating the development of effective treatments.</p>
      <button 
        onClick={() => navigate("/mobile-verification")}
        className="get-start-btn"
      >
        GET START
      </button>
      <div className="d-f">
        <div className="ani-con"><Lottie animationData={home1} className='animations'/></div>
        <div className="ani-con"><Lottie animationData={home2} className='animations'/></div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
