import React, { useState } from 'react';
import axios from 'axios';
import './Lung.css';

const Lung = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);
    const [segmentationImage, setSegmentationImage] = useState(null);
    const [overlayImage, setOverlayImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setPreview(URL.createObjectURL(uploadedFile));
            // Reset results when a new file is uploaded
            setOriginalImage(null);
            setSegmentationImage(null);
            setOverlayImage(null);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!file) {
            alert("Please upload a lung CT image.");
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            setLoading(true);
            setError(null);
    
            const response = await axios.post('http://localhost:5001/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
    
            if (response.status === 200 && response.data) {
                setOriginalImage(response.data.original);
                setSegmentationImage(response.data.prediction);
                setOverlayImage(response.data.overlay);
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
        setOriginalImage(null);
        setSegmentationImage(null);
        setOverlayImage(null);
        setError(null);
    };

    const handleDownload = (imageUrl, filename) => {
        if (imageUrl) {
            const link = document.createElement('a');
            link.href = `http://localhost:5001${imageUrl}`;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    

    return (
        <div className='lung-bg-con'>
        <div className="lung-container">
            <div className="lung-header">
                <h1 className="lung-title">Lung Tumor Segmentation</h1>
                <p className="lung-subtitle">AI-powered tumor detection using UNETR model</p>
            </div>

            <div className="lung-content">
                <div className="lung-upload-panel">
                    <div className="lung-upload-box">
                        <h3 className="lung-upload-title">Upload Lung CT Scan</h3>

                        <div 
                            className="lung-drop-zone" 
                            onClick={() => document.getElementById('file-input').click()}
                        >
                            {!preview ? (
                                <>
                                    <svg className="lung-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                    <span className="lung-drop-text">Click to upload lung CT image</span>
                                </>
                            ) : (
                                <img src={preview} alt="Preview" className="lung-preview-image" />
                            )}
                        </div>

                        <input 
                            id="file-input" 
                            type="file" 
                            accept=".png, .jpg, .jpeg" 
                            onChange={handleFileChange} 
                            className="lung-file-input"
                        />

                        <div className="lung-controls">
                            {preview && (
                                <button 
                                    onClick={resetAnalysis} 
                                    className="lung-reset-button"
                                >
                                    Clear
                                </button>
                            )}

                            <button 
                                onClick={handleSubmit} 
                                className={file ? "lung-action-button" : "lung-action-button lung-disabled-button"} 
                                disabled={!file || loading}
                            >
                                {loading ? 'Processing...' : 'Analyze Scan'}
                            </button>
                        </div>

                        {error && (
                            <div className="lung-error-message">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lung-result-panel">
                    {segmentationImage ? (
                        <>
                            <div className="lung-result-header">
                                <h3 className="lung-result-title">Segmentation Results</h3>
                            </div>
                            <div className="lung-result-images">
                                {originalImage && (
                                    <div className="lung-result-image-item">
                                        <img src={`http://localhost:5001${originalImage}`} alt="Original" />
                                        <p>Original Image</p>
                                    </div>
                                )}

                                {segmentationImage && (
                                    <div className="lung-result-image-item">
                                        <img src={`http://localhost:5001${segmentationImage}`} alt="Segmentation" />
                                        <p>Tumor Segmentation</p>
                                    </div>
                                )}

                                {overlayImage && (
                                    <div className="lung-result-image-item">
                                        <img src={`http://localhost:5001${overlayImage}`} alt="Overlay" />
                                        <p>Overlay Visualization</p>
                                    </div>
                                )}
                            </div>

                            <div className="lung-result-note">
                                Highlighted areas indicate potential tumor regions.
                                Please consult with a medical professional for diagnosis.
                            </div>

                            <div className="lung-download-buttons">
                                <button 
                                    onClick={() => handleDownload(segmentationImage, 'tumor_segmentation.png')} 
                                    className="lung-download-button"
                                >
                                    Download Segmentation
                                </button>
                                <button 
                                    onClick={() => handleDownload(overlayImage, 'overlay_image.png')} 
                                    className="lung-download-button"
                                >
                                    Download Overlay
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="lung-empty-result">
                            <div className="lung-empty-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 8v4M12 16h.01"></path>
                                </svg>
                            </div>
                            <p className="lung-empty-text">
                                {preview ? 'Click "Analyze Scan" to process the image' : 'Upload a lung CT scan to view analysis results'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </div>
    );
};

export default Lung;