from fastapi import FastAPI, File, UploadFile, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image, UnidentifiedImageError
import numpy as np
import io
import uvicorn

app = FastAPI()

# Statik dosyaları ve şablonları sunma
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Modeli yükleyin
model = load_model("./models/model2.h5")

# Sınıf isimlerini tanımlayın
class_names = ['001.Nimitz-class_aircraft_carrier', '002.KittyHawk-class_aircraft_carrier',
               '003.Midway-class_aircraft_carrier',
               '004.Kuznetsov-class_aircraft_carrier', '005.Charles_de_Gaulle_aricraft_carrier',
               '006.INS_Virrat_aircraft_carrier',
               '007.INS_Vikramaditya_aircraft_carrier', '008.Ticonderoga-class_cruiser',
               '009.Arleigh_Burke-class_destroyer',
               '010.Akizuki-class_destroyer', '011.Asagiri-class_destroyer', '012.Kidd-class_destroyer',
               '013.Type_45_destroyer',
               '014.Wasp-class_assault_ship', '015.Osumi-class_landing_ship', '016.Hyuga-class_helicopter_destroyer',
               '017.Lzumo-class_helicopter_destroyer', '018.Whitby_Island-class_dock_landing_ship',
               '019.San_Antonio-class_transport_dock', '020.Freedom-class_combat_ship',
               '021.Independence-class_combat_ship',
               '022.Sacramento-class_support_ship', '023.Crane_ship', '024.Abukuma-class_frigate', '025.Megayacht',
               '026.Cargo_ship',
               '027.Murasame-class_destroyer', '028.Container_ship', '029.Towing_vessel', '030.Civil_yacht',
               '031.Medical_ship',
               '032.Sand_carrier', '033.Tank_ship', '034.Garibaldi_aircraft_carrier', '035.Zumwalt-class_destroyer',
               '036.Kongo-class_destroyer', '037.Horizon-class_destroyer', '038.Atago-class_destroyer',
               '039.Mistral-class_amphibious_assault_ship', '040.Juan_Carlos_I_Strategic_Projection_Ship',
               '041.Maestrale-class_frigate',
               '042.San_Giorgio-class_transport_dock']  # Kendi sınıf isimlerinizi ekleyin


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()

    try:
        image = Image.open(io.BytesIO(contents))
    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="Invalid image file. Please upload a valid image file.")

    try:
        image = image.resize((400, 400))
        image = img_to_array(image)
        image = np.expand_dims(image, axis=0)
        image = image / 255.0  # Scale the image

        predictions = model.predict(image)
        predicted_class_idx = np.argmax(predictions)
        predicted_class = class_names[predicted_class_idx]
        confidence = predictions[0][predicted_class_idx] * 100  # Confidence in percentage

        return {"predicted_class": predicted_class, "confidence": confidence}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the image: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
