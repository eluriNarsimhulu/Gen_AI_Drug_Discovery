import os
import numpy as np
import cv2
import tensorflow as tf
from patchify import patchify
from flask import Flask, request, render_template, url_for, redirect, send_from_directory
from werkzeug.utils import secure_filename
from metrics import dice_loss, dice_coef
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/upload": {"origins": "http://localhost:3000"}})

# app = Flask(__name__)

# Configuration
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['RESULTS_FOLDER'] = 'static/results'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}

# Create directories if they don't exist
for folder in [app.config['UPLOAD_FOLDER'], app.config['RESULTS_FOLDER']]:
    if not os.path.exists(folder):
        os.makedirs(folder)

# UNETR Configuration
cf = {
    "image_size": 256,
    "num_channels": 3,
    "num_layers": 12,
    "hidden_dim": 128,
    "mlp_dim": 32,
    "num_heads": 6,
    "dropout_rate": 0.1,
    "patch_size": 16,
    "num_patches": (256**2) // (16**2),
    "flat_patches_shape": (
        (256**2) // (16**2),
        16 * 16 * 3
    )
}

# Load the trained model
model = None

def load_model():
    global model
    model_path = os.path.join("files", "models.keras")
    model = tf.keras.models.load_model(model_path, custom_objects={"dice_loss": dice_loss, "dice_coef": dice_coef})
    print("Model loaded successfully!")

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def preprocess_image(image_path):
    """Preprocess the input image for prediction"""
    image = cv2.imread(image_path, cv2.IMREAD_COLOR)
    # Save original image for display
    orig_image = cv2.resize(image, (cf["image_size"], cf["image_size"]))
    # Normalize image
    x = orig_image / 255.0
    
    # Convert image to patches
    patch_shape = (cf["patch_size"], cf["patch_size"], cf["num_channels"])
    patches = patchify(x, patch_shape, cf["patch_size"])
    patches = np.reshape(patches, cf["flat_patches_shape"])
    patches = patches.astype(np.float32)
    patches = np.expand_dims(patches, axis=0)
    
    return patches, orig_image

def predict_mask(patches):
    """Predict mask using the model"""
    pred = model.predict(patches, verbose=0)[0]
    return pred

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return {"error": "No file part"}, 400
    
    file = request.files['file']
    
    if file.filename == '':
        return {"error": "No selected file"}, 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        patches, orig_image = preprocess_image(file_path)
        
        # Predict mask
        pred_mask = predict_mask(patches)
        
        # Save segmentation and overlay
        result_filename = f"result_{filename}"
        overlay_filename = f"overlay_{filename}"
        
        result_path = os.path.join(app.config['RESULTS_FOLDER'], result_filename)
        overlay_path = os.path.join(app.config['RESULTS_FOLDER'], overlay_filename)
        
        pred_rgb = np.concatenate([pred_mask] * 3, axis=-1) * 255
        cv2.imwrite(result_path, pred_rgb.astype(np.uint8))
        
        # Create red overlay
        red_mask = np.zeros_like(orig_image)
        red_mask[:, :, 2] = pred_rgb[:, :, 0]
        overlay_result = cv2.addWeighted(orig_image, 1, red_mask, 0.5, 0)
        cv2.imwrite(overlay_path, overlay_result)

        return {
            "original": f"/static/uploads/{filename}",
            "prediction": f"/static/results/{result_filename}",
            "overlay": f"/static/results/{overlay_filename}"
        }, 200

    return {"error": "File not allowed"}, 400


if __name__ == '__main__':
    load_model()
    # app.run(debug=True)
    print(f"Starting Lung Tumor Segmentation. Working directory: {os.getcwd()}")
    app.run(debug=True, port=5001)