import React, { useState } from 'react';
import axios from 'axios';
import './Brain.css';

const Brain = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [resultImage, setResultImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setPreview(URL.createObjectURL(uploadedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!file) {
            alert("Please upload an image.");
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.post('http://localhost:5000/predict', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
    
            if (response.status === 200 && response.data.result_image) {
                setResultImage(response.data.result_image);
            } else {
                setError("Failed to process image.");
            }
        } catch (err) {
            setError("Error processing image. Please try again.");
            console.error("Error: ", err);
        } finally {
            setLoading(false);
        }
    };

    const resetAnalysis = () => {
        setFile(null);
        setPreview(null);
        setResultImage(null);
        setError(null);
    };

    const handleDownload = () => {
        if (resultImage) {
            const link = document.createElement('a');
            link.href = `http://localhost:5000${resultImage}`;
            link.download = 'segmented_image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className='brain-bg-con'>
        <div className="brain-container">
            <div className="brain-header">
                <h1 className="brain-title">Brain Tumor Segmentation</h1>
                <p className="brain-subtitle">AI-powered tumor detection</p>
            </div>

            <div className="brain-content">
                <div className="brain-upload-panel">
                    <div className="brain-upload-box">
                        <h3 className="brain-upload-title">Upload MRI Scan</h3>

                        <div 
                            className="brain-drop-zone" 
                            onClick={() => document.getElementById('file-input').click()}
                        >
                            {!preview ? (
                                <>
                                    <svg className="brain-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                    <span className="brain-drop-text">Click to upload MRI image</span>
                                </>
                            ) : (
                                <img src={preview} alt="Preview" className="brain-preview-image" />
                            )}
                        </div>

                        <input 
                            id="file-input" 
                            type="file" 
                            accept=".png, .jpg, .jpeg" 
                            onChange={handleFileChange} 
                            className="brain-file-input"
                        />

                        <div className="brain-controls">
                            {preview && (
                                <button 
                                    onClick={resetAnalysis} 
                                    className="brain-reset-button"
                                >
                                    Clear
                                </button>
                            )}

                            <button 
                                onClick={handleSubmit} 
                                className={file ? "brain-action-button" : "brain-action-button brain-disabled-button"} 
                                disabled={!file || loading}
                            >
                                {loading ? 'Processing...' : 'Analyze Scan'}
                            </button>
                        </div>

                        {error && (
                            <div className="brain-error-message">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                <div className="brain-result-panel">
                    {resultImage ? (
                        <>
                            <div className="brain-result-header">
                                <h3 className="brain-result-title">Segmentation Results</h3>
                            </div>

                            <div className="brain-result-image">
                                <img 
                                    src={`http://localhost:5000${resultImage}`} 
                                    alt="Segmentation Result" 
                                    className="brain-segmentation-image" 
                                />
                            </div>

                            <div className="brain-result-note">
                                Highlighted areas indicate potential tumor regions.
                                Please consult with a medical professional for diagnosis.
                            </div>

                            <button onClick={handleDownload} className="brain-download-button">Download Result</button>
                        </>
                    ) : (
                        <div className="brain-empty-result">
                            <div className="brain-empty-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 8v4M12 16h.01"></path>
                                </svg>
                            </div>
                            <p className="brain-empty-text">
                                {preview ? 'Click "Analyze Scan" to process the image' : 'Upload an MRI scan to view analysis results'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </div>
    );
};

export default Brain;