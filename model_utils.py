import os
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
import numpy as np

models = {}


def load_all_models(models_directory):
    global models
    models = {}
    for model_file in os.listdir(models_directory):
        if model_file.endswith(".h5"):
            model_name = model_file.split(".")[0]
            models[model_name] = load_model(os.path.join(models_directory, model_file))


def predict_image(model, image, class_names):
    image = image.resize((400, 400))
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    image = image / 255.0  # Scale the image

    predictions = model.predict(image)
    predicted_class_idx = np.argmax(predictions)
    predicted_class = class_names[predicted_class_idx]
    confidence = predictions[0][predicted_class_idx] * 100

    return predicted_class, confidence
