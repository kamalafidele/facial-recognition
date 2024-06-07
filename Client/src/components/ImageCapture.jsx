import React from "react";
import { useState } from "react";
import styled from "styled-components";

function ImageCapture({ setImageCaptured }) {
    const [image, setImage] = useState('');
    const [camInitialized, setCamInitialized] = useState(false);

    const openCamera = () => {
        window.Webcam.set({
            width: 350,
            height: 350,
            image_format: 'jpeg',
            jpeg_quality: 90
        });
        window.Webcam.attach('#camera');
        setCamInitialized(true);
    }

    const takeSnapshot = () => {
        window.Webcam.snap((data_uri) => {
            setImage(data_uri);
            setImageCaptured(data_uri);
            setCamInitialized(false);
            window.Webcam.reset();
        });
    };

    return (
        <CamContainer>
            <div>
                {!camInitialized && <button onClick={openCamera}>Open camera</button>}
                {camInitialized && <button onClick={takeSnapshot} style={{ backgroundColor: 'green'}}>Take Picture</button>}
            </div>
            <div className="main">
                <div id="camera" style={{ width: '350px', height: '350px', border: '1px solid black' }} hidden={!camInitialized}></div>
                <div id="results" style={{ width: '350px', height: '350px' }}>
                    {image && <img src={image} alt="Snapshot" id="ref_img" />}
                </div>
            </div>
        </CamContainer>
    )
}

const CamContainer = styled.div`
width: 100%;
div.main {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    margin-top: 27px;
}

button {
    background-color: dodgerblue;
    color: white;
    border: none;
    border-radius: 25px;
    box-shadow: 0 4px 7px rgba(0, 0, 0, 0.4);
    height: 40px;
    padding: 13px;
    font-weight: bold;
    cursor: pointer;
}
`
export default ImageCapture;