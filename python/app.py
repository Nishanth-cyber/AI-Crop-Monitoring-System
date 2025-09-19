from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import joblib
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import pandas as pd
import os
import uvicorn
import tensorflow as tf
import io
import google.generativeai as genai
from dotenv import load_dotenv
import numpy as np
from scipy import ndimage
from scipy import ndimage
from datetime import datetime
import tempfile
import os
import cv2
from fastapi.responses import FileResponse

# ========== INIT APP ==========
app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== PATH SETUP ==========
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
MODEL_DIR = os.path.join(BASE_DIR, ".", "models")
DATA_DIR = os.path.join(BASE_DIR, ".", "data")

# ========== LOAD MODELS ==========
print("✅ Loading models...")
try:
    water_model = joblib.load(os.path.join(MODEL_DIR, "water_model.pkl"))
    harvest_model = joblib.load(os.path.join(MODEL_DIR, "harvest_model.pkl"))
    crop_encoder = joblib.load(os.path.join(MODEL_DIR, "le_crop.pkl"))
    season_encoder = joblib.load(os.path.join(MODEL_DIR, "le_season.pkl"))

    # Load CNN pest detection model
    pest_model = models.resnet18(weights=None)
    pest_model.fc = nn.Linear(pest_model.fc.in_features, 132)
    pest_model.load_state_dict(torch.load(
        os.path.join(MODEL_DIR, "pest_cnn_model.pth"),
        map_location=torch.device("cpu")
    ))
    pest_model.eval()

    # Load pest class names
    with open(os.path.join(DATA_DIR, "pest_classes.txt"), "r") as f:
        pest_classes = [line.strip() for line in f.readlines()]

    # Load pesticide mapping
    pesticide_df = pd.read_csv(os.path.join(DATA_DIR, "Pesticides.csv"))
    pest_map = {
        row['Pest Name'].lower().strip(): row['Most Commonly Used Pesticides']
        for _, row in pesticide_df.iterrows()
    }

    # Load TensorFlow disease prediction model
    disease_model_path = os.path.join(MODEL_DIR, "crop_disease.h5")
    model_disease = tf.keras.models.load_model(disease_model_path)

    # Disease class labels
    global disease_class_labels
    disease_class_labels = {
        0: "Apple Apple_scab", 1: "Apple Black rot", 2: "Apple Cedar_apple_rust", 3: "Apple healthy",
        4: "Blueberry healthy", 5: "Cherry (including sour) Powdery mildew", 6: "Cherry (including sour) healthy",
        7: "Corn (maize) Cercospora leaf spot Gray leaf spot", 8: "Corn (maize) Common rust", 9: "Corn (maize) Northern Leaf Blight",
        10: "Corn (maize) healthy", 11: "Grape Black rot", 12: "Grape Leaf blight (Isariopsis Leaf Spot)", 13: "Grape healthy",
        14: "Orange Haunglongbing (Citrus greening)", 15: "Peach Bacterial spot", 16: "Peach healthy",
        17: "Pepper (bell) Bacterial spot", 18: "Pepper (bell) healthy", 19: "Potato Early blight",
        20: "Potato Late blight", 21: "Potato healthy", 22: "Raspberry healthy", 23: "Soybean healthy",
        24: "Squash Powdery mildew", 25: "Strawberry Leaf scorch", 26: "Strawberry healthy",
        27: "Tomato Bacterial spot", 28: "Tomato Late blight", 29: "Tomato Leaf Mold",
        30: "Tomato Septoria leaf spot", 31: "Tomato Spider mites (Two-spotted spider mite)",
        32: "Tomato Target Spot", 33: "Tomato Yellow Leaf Curl Virus", 34: "Tomato Mosaic Virus",
        35: "Tomato healthy"
    }

    # Initialize Gemini AI model for disease explanation
    load_dotenv()
    API_KEY = os.getenv("API_KEY")
    genai.configure(api_key=API_KEY)
    aimodel = genai.GenerativeModel('gemini-2.0-flash')
    chat = aimodel.start_chat()

    print("✅ All models loaded successfully!")
except Exception as e:
    print("❌ Error loading models:", str(e))
    raise RuntimeError(f"Error loading models: {str(e)}")

# ========== REQUEST MODELS ==========
class CropRequest(BaseModel):
    crop: str
    season: str
    temperature: float
    humidity: float
    ph: float
    avg_water: float

# ========== ROUTES ==========

import requests
from fastapi import Query

load_dotenv()


# ✅ Predict crop water and harvest date
@app.post("/predict_crop")
async def predict_crop(request: CropRequest):
    try:
        # Encode categorical inputs
        crop_encoded = crop_encoder.transform([request.crop])[0]
        season_encoded = season_encoder.transform([request.season])[0]

        # ---------------- WATER MODEL ----------------
        water_features = [[
            crop_encoded,
            season_encoded,
            request.temperature,
            request.humidity,
            request.ph,
            request.avg_water
        ]]
        water_pred = water_model.predict(water_features)[0]

        # ---------------- HARVEST MODEL ----------------
        harvest_features = [[
            crop_encoded,
            season_encoded,
            request.temperature,
            request.humidity,
            request.ph,
            water_pred  # Predicted water requirement is input for harvest model
        ]]
        harvest_pred = harvest_model.predict(harvest_features)[0]

        return JSONResponse(content={
            "water_required": round(float(water_pred), 2),
            "days_until_harvest": round(float(harvest_pred), 0)
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




# ✅ Predict pest and recommend pesticide
@app.post("/predict_pest")
async def predict_pest(image: UploadFile = File(...)):
    try:
        img = Image.open(image.file).convert("RGB")
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406],
                                 [0.229, 0.224, 0.225])
        ])
        img_tensor = transform(img).unsqueeze(0)

        with torch.no_grad():
            outputs = pest_model(img_tensor)
            _, predicted = torch.max(outputs.data, 1)
            pest = pest_classes[predicted.item()]
            pest_key = pest.lower().strip()

            pesticide = pest_map.get(pest_key, "No Recommendation")

        return JSONResponse(content={"pest": pest, "pesticide": pesticide})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Predict nutrient deficiency


@app.post("/predict_nutrient_deficiency")
async def predict_nutrient_deficiency_video(video: UploadFile = File(...)):
    try:
        import subprocess
        # Save uploaded video temporarily
        temp_input = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
        temp_input.write(await video.read())
        temp_input.close()

        # Generate timestamped output filename
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        temp_output_name = f"processed_video_{timestamp}.mp4"
        temp_output_path = os.path.join(tempfile.gettempdir(), temp_output_name)

        # Open video
        cap = cv2.VideoCapture(temp_input.name)
        fourcc = cv2.VideoWriter_fourcc(*'avc1')  # Try H.264 for browser compatibility
        fps = cap.get(cv2.CAP_PROP_FPS)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        out = cv2.VideoWriter(temp_output_path, fourcc, fps, (width, height))

        if not out.isOpened():
            # Fallback to mp4v if avc1 fails
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(temp_output_path, fourcc, fps, (width, height))

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # Convert frame to grayscale
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            img_norm = (gray - gray.min()) / (gray.max() - gray.min())

            # Medium-red mask (normalized 0.75-0.9)
            mask = (img_norm >= 0.75) & (img_norm <= 0.9)

            # Label connected regions
            labeled, num_features = ndimage.label(mask)
            slices = ndimage.find_objects(labeled)

            # Draw black boxes on original frame
            for sl in slices:
                y, x = sl
                cv2.rectangle(frame, (x.start, y.start), (x.stop, y.stop), (0,0,0), 2)

            # Write processed frame to output video
            out.write(frame)

        cap.release()
        out.release()

        # Check if output video is valid
        if not os.path.exists(temp_output_path) or os.path.getsize(temp_output_path) == 0:
            raise HTTPException(status_code=500, detail="Processed video is empty or corrupted.")

        # Re-encode with ffmpeg to H.264 for browser compatibility
        ffmpeg_output_path = os.path.join(tempfile.gettempdir(), f"ffmpeg_{temp_output_name}")
        ffmpeg_cmd = [
            "ffmpeg", "-y", "-i", temp_output_path,
            "-c:v", "libx264", "-preset", "fast", "-pix_fmt", "yuv420p",
            ffmpeg_output_path
        ]
        try:
            subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            final_output_path = ffmpeg_output_path
        except Exception as ffmpeg_error:
            print("ffmpeg re-encode failed:", ffmpeg_error)
            final_output_path = temp_output_path

        # Return processed video with timestamped filename
        return FileResponse(final_output_path, media_type='video/mp4', filename=os.path.basename(final_output_path))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    

# ✅ Predict disease and provide explanation
@app.post("/disease-prediction")
async def predict_disease(image: UploadFile = File(...)):
    try:
        # Validate file type
        if not image.filename.lower().endswith(("png", "jpg", "jpeg")):
            raise HTTPException(status_code=400, detail="Invalid file type")

        # Read image file into memory
        img_bytes = await image.read()
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        img = img.resize((100, 100))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0).astype("float32")

        prediction = model_disease.predict(img_array)
        predicted_class = int(np.argmax(prediction))
        predicted_label = disease_class_labels.get(predicted_class, "Unknown Disease")
        explain = chat_bot(predicted_label)

        return JSONResponse(content={"disease": predicted_label, "explain": explain})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def chat_bot(dis):
    query = f"Explain about disease {dis} and give the precaution in 5 lines clearly in simple way"
    response = chat.send_message(query)
    result = response.text
    return result

# ========== RUN ==========
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
