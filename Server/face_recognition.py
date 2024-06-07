from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from deepface import DeepFace
import cv2
import numpy as np
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app, support_credentials=True)

UPLOAD_FOLDER = './uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def save_file(file, prefix):
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], f'{prefix}_{filename}')
    file.save(file_path)
    return file_path

# Detectors: [opencv, ssd, mtcnn, dlib, retinaface]
# Recognizers [VGG-Face]

def find_face(file_path, prefix):
    try:
        faces = DeepFace.extract_faces(img_path=file_path, detector_backend='mtcnn')
        if faces:
            face = faces[0]['face']
            face_img_uint8 = cv2.normalize(face, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
            face_img_bgr = cv2.cvtColor(face_img_uint8, cv2.COLOR_RGB2BGR)
            face_img_path = os.path.join(app.config['UPLOAD_FOLDER'], f'{prefix}_face.jpg')
            cv2.imwrite(face_img_path, face_img_bgr)
            return face_img_path
        return None
    except Exception as e:
        return None


@app.route('/recognize_face', methods=['POST'])
@cross_origin(origin='*')
def recognize_face():
    if 'ref_image' not in request.files or 'img_to_check' not in request.files:
        return jsonify({'error': 'Missing file(s)'}), 400

    ref_image = request.files['ref_image']
    img_to_check = request.files['img_to_check']

    img_to_check_path = save_file(img_to_check, 'check')
    ref_image_path = save_file(ref_image, 'ref')

    ref_face_path = find_face(ref_image_path, 'ref')
    check_face_path = find_face(img_to_check_path, 'check')

    if ref_face_path and check_face_path:
        verification = DeepFace.verify(img1_path=ref_face_path, img2_path=check_face_path, enforce_detection=False)
        result = verification['distance'] < 0.5
        # Clean up temporary files
        os.remove(ref_image_path)
        os.remove(img_to_check_path)
        os.remove(ref_face_path)
        os.remove(check_face_path)
        return jsonify({'matched': result, 'distance': verification['distance']})
    else:
        return jsonify({'error': 'Face not detected in one or both images'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=8080)
