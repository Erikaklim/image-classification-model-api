from flask import Flask, render_template, request, jsonify
from tensorflow.keras.models import load_model
import numpy as np
import tensorflow as tf

app = Flask(__name__)

MODEL_PATH = 'my_model7.h5'
model = load_model(MODEL_PATH)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    img_file = request.files['image']

    img = preprocess_image(img_file)
    
    prediction = model.predict(img)
    print(prediction)

    response = postprocess_prediction(prediction)
    
    return jsonify(response)

def preprocess_image(img_file):
    img = tf.io.decode_image(img_file.read())
    img = tf.image.resize(img, (128, 128))
    return np.expand_dims(img, axis=0) 

def postprocess_prediction(prediction):
    class_names = {
        0: 'Car',
        1: 'Drink',
        2: 'Flower',
    }
    predicted_class_number = int(np.argmax(prediction, axis=1))
    print(predicted_class_number)
    class_name = class_names.get(predicted_class_number, 'Unknown')
    print(class_name)
    probability = float(np.max(prediction))
    print(probability)
    response = {'class_name': class_name, 'probability': probability}
    return response

if __name__ == '__main__':
    app.run(debug=True)

