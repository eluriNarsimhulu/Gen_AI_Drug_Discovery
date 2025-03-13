










import os
import numpy as np
import cv2
import tensorflow as tf
from patchify import patchify
from flask import Flask, request, render_template, url_for, flash, redirect, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS
import traceback


app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:3000"}})
app.secret_key = "brain_tumor_segmentation_demo"

# Create necessary directories
UPLOAD_FOLDER = 'static/uploads'
RESULT_FOLDER = 'static/results'
MODEL_FOLDER = 'files'

for folder in [UPLOAD_FOLDER, RESULT_FOLDER, MODEL_FOLDER]:
    os.makedirs(folder, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['RESULT_FOLDER'] = RESULT_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# UNETR Configuration
cf = {
    "image_size": 256,
    "num_channels": 3,
    "patch_size": 16,
    "num_patches": (256 ** 2) // (16 ** 2),
    "flat_patches_shape": ((256 ** 2) // (16 ** 2), 16 * 16 * 3)
}

# Dice coefficient and dice loss
smooth = 1e-15

def dice_coef(y_true, y_pred):
    y_true = tf.keras.layers.Flatten()(y_true)
    y_pred = tf.keras.layers.Flatten()(y_pred)
    intersection = tf.reduce_sum(y_true * y_pred)
    return (2. * intersection + smooth) / (tf.reduce_sum(y_true) + tf.reduce_sum(y_pred) + smooth)

def dice_loss(y_true, y_pred):
    return 1.0 - dice_coef(y_true, y_pred)

# Load model globally
model = None

def load_model():
    global model
    if model is None:
        model_path = os.path.join(MODEL_FOLDER, "model256.keras")
        if not os.path.exists(model_path):
            print(f"Model not found at {model_path}")
            return None
        print(f"Loading model from: {model_path}")
        model = tf.keras.models.load_model(model_path, custom_objects={"dice_loss": dice_loss, "dice_coef": dice_coef})
    return model

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_image(file_path):
    print(f"Processing image: {file_path}")
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Image not found: {file_path}")
    
    image = cv2.imread(file_path, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError(f"Failed to read image: {file_path}")
    
    original_image = image.copy()
    image = cv2.resize(image, (cf["image_size"], cf["image_size"]))
    x = image / 255.0

    # Ensure model is loaded
    model = load_model()
    if model is None:
        raise ValueError("Model not loaded, cannot make prediction")

    # Convert image to patches
    patch_shape = (cf["patch_size"], cf["patch_size"], cf["num_channels"])
    patches = patchify(x, patch_shape, cf["patch_size"])
    patches = np.reshape(patches, cf["flat_patches_shape"])
    patches = patches.astype(np.float32)
    patches = np.expand_dims(patches, axis=0)

    print(f"Input patch shape: {patches.shape}")

    # Model prediction
    pred = model.predict(patches, verbose=0)[0]

    # Ensure mask has correct dimensions
    pred_binary = (pred > 0.5).astype(np.uint8)
    pred_binary = cv2.resize(pred_binary, (cf["image_size"], cf["image_size"]))

    # Create red mask overlay
    pred_colored = np.zeros_like(image)
    pred_colored[:, :, 2] = pred_binary * 255

    # Ensure all images are the same size before overlaying
    image_resized = cv2.resize(original_image, (cf["image_size"], cf["image_size"]))
    pred_colored = cv2.resize(pred_colored, (cf["image_size"], cf["image_size"]))

    print(f"Image shape: {image_resized.shape}, Mask shape: {pred_colored.shape}")

    # Overlay mask on the image
    overlay = cv2.addWeighted(pred_colored, 0.5, image_resized, 0.5, 0)

    # Concatenate original and overlay for comparison
    separator = np.ones((cf["image_size"], 10, 3), dtype=np.uint8) * 255
    result = np.concatenate([image_resized, separator, overlay], axis=1)

    return result

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        try:
            result_image = process_image(file_path)

            result_filename = f"result_{filename}"
            result_path = os.path.join(app.config['RESULT_FOLDER'], result_filename)
            cv2.imwrite(result_path, result_image)

            # Return JSON response for React frontend
            return jsonify({
                "result_image": url_for('static', filename=f'results/{result_filename}')
            })

        except Exception as e:
            print(f"Error: {e}")
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Invalid file type"}), 400

@app.route('/check_model', methods=['GET'])
def check_model():
    model_path = os.path.join(MODEL_FOLDER, "model256.keras")
    return jsonify({
        'model_exists': os.path.exists(model_path),
        'model_path': model_path,
        'cwd': os.getcwd(),
        'files_dir_contents': os.listdir(MODEL_FOLDER) if os.path.exists(MODEL_FOLDER) else []
    })

if __name__ == '__main__':
    print(f"Starting application. Working directory: {os.getcwd()}")
    # app.run(debug=True)
    app.run(debug=True, port=5000)
