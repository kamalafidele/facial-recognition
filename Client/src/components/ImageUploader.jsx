import React, { useState, useEffect } from 'react'
import styled from 'styled-components';

function ImageUploader({ setUploadedImg }) {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const canvas = document.getElementById('canvas');

    useEffect(() => {
        if (!file) {
            return
        }

        const reader = new FileReader()

        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        }

        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        reader.readAsDataURL(file);
        setUploadedImg(file);
    }, [file, canvas]);

    return (
        <UploaderContainer>
            <div className='file-input'>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} placeholder='Upload National Id Photo' id='file' />
                <label htmlFor="file">Upload National ID Image</label>
            </div>
            <div className='img-preview'>
                <canvas id="canvas"></canvas>
                {previewUrl && <img src={previewUrl} alt="Preview" width={500} height={350} id='id_img' />}
            </div>
        </UploaderContainer>
    )
}

const UploaderContainer = styled.div`
width: 100%;

input#file {
  opacity: 0;
  width: 0.1px;
  height: 0.1px;
  position: absolute;
}

.file-input label {
  display: block;
  position: relative;
  width: 200px;
  height: 50px;
  border-radius: 25px;
  background: dodgerblue;
  box-shadow: 0 4px 7px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: transform .2s ease-out;
}

.img-preview {
    margin-top: 20px;
    position: relative;
    canvas {
        position: absolute;
    }
}
`
export default ImageUploader;
