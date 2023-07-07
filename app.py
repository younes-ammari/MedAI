from flask import render_template, jsonify, Flask, redirect, url_for, request, make_response
import os
import io
import numpy as np
from PIL import Image
import keras.utils as image
from keras.models import model_from_json

app = Flask(__name__)

SKIN_CLASSES = {
    0: 'Actinic Keratoses (Solar Keratoses) or intraepithelial Carcinoma (Bowen’s disease)',
    1: 'Basal Cell Carcinoma',
    2: 'Benign Keratosis',
    3: 'Dermatofibroma',
    4: 'Melanoma',
    5: 'Melanocytic Nevi',
    6: 'Vascular skin lesion'

}


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/signin')
def signin():
    return render_template('signin.html')


@app.route('/signup')
def signup():
    return render_template('signup.html')


@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    return render_template('dashboard.html')


@app.route('/detect', methods=['GET', 'POST'])
def detect():
    json_response = {}
    if request.method == 'POST':
        try:
            file = request.files['file']
        except KeyError:
            return make_response(jsonify({
                'error': 'No file part in the request',
                'code': 'FILE',
                'message': 'file is not valid'
            }), 400)


        # body = request.form
        # print(file)
        # return json_response({
        #     "result":file
        # })
        # f = request.files['file']

        imagePil = Image.open(io.BytesIO(file.read()))
        # Save the image to a BytesIO object
        imageBytesIO = io.BytesIO()
        imagePil.save(imageBytesIO, format='JPEG')
        imageBytesIO.seek(0)
        # path = 'static/data/'+f.filename
        print("detected ")
        path = imageBytesIO
        # return render_template('detect.html', title='Success', json_response=json_response, predictions=disease, acc=accuracy, img_file=f.filename)
        # return render_template('detect.html', title='Success')
        # f.save(path)
        j_file = open('model.json', 'r')
        loaded_json_model = j_file.read()
        j_file.close()
        model = model_from_json(loaded_json_model)
        model.load_weights('model.h5')
        # img1 = image.load_img(f, target_size=(224,224))
        img1 = image.load_img(path, target_size=(224, 224))
        img1 = np.array(img1)
        img1 = img1.reshape((1, 224, 224, 3))
        img1 = img1/255
        prediction = model.predict(img1)
        pred = np.argmax(prediction)
        disease = SKIN_CLASSES[pred]
        accuracy = prediction[0][pred]
        accuracy = round(accuracy*100, 2)
        # K.clear_session()
        json_response = {
            "detected": False if pred == 2 else True,
            "disease": disease,
            "accuracy": accuracy,
            "img_path": file.filename,
        }

        return make_response(jsonify(json_response), 200)

    # return render_template('detect.html', title='Success', json_response=json_response, predictions=disease, acc=accuracy)
    else:
        return render_template('detect.html')


if __name__ == "__main__":
    # app.run(debug=True, port=5500)
    app.run(debug=True, port=3000)
