import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

import ImageUploader from "../components/ImageUploader";
import ImageCapture from "../components/ImageCapture";
import Loader from "../components/Loader";

import { loadModels, drawBoundingBoxesOnID } from '../ai-processing/facial-recognition';
import { blobCreationFromURL } from "../utls/custom-files";

function Home() {
    const [idUploaded, setIdUploaded] = useState(false);
    const [capturedImg, setCapturedImg] = useState(null);
    const [uploadedImg, setUploadedImg] = useState(null);
    const [isPictureCaptured, setIsPictureCaptured] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isfaceRecognized, setIsFaceRecognized] = useState(false);

    const successMessage = 'The image matches with your national ID';
    const failMessage = 'You image didn\'t match with the one on ID';

    useEffect(() => {
        loadModels();
    }, []);

    const getUploadedImg = img_uploaded => {
        setUploadedImg(img_uploaded);
        setIdUploaded(true);
    }

    const getCapturedImg = (img_captured_uri) => {
        setCapturedImg(img_captured_uri);
        setIsPictureCaptured(true);
    }

    const getFacialRecognitionResults = async () => {
        setIsFaceRecognized(false);
        setIsLoading(true);
        try {
            await drawBoundingBoxesOnID();
            const formData = new FormData();
            formData.append('ref_image', blobCreationFromURL(capturedImg));
            formData.append('img_to_check', uploadedImg);

            const { data } = await axios.post('http://localhost:8080/recognize_face', formData, { headers: { "Content-Type": "multipart/form-data" }});
            if (data.matched) {
                setIsFaceRecognized(true);
            }
            console.log(data);
        } catch (e) {
            console.log('BE Error: ', e);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Container>
            <h2>ID Facial Recognition</h2>
            <Wrapper>
                <ImageUploader setUploadedImg={getUploadedImg} />
                {idUploaded && <ImageCapture setImageCaptured={getCapturedImg} />}
            </Wrapper>
            {isLoading && <Loader/>}
            {idUploaded && isPictureCaptured && !isLoading && <button onClick={getFacialRecognitionResults} className="process-btn">Start process</button>}
            {isLoading && <p className="process-msg">Processing your national id......</p>}
            {hasError && <p className="error-msg">We're having issues to process your ID. Try again!</p>}
            {!hasError && !isLoading && !isfaceRecognized && isPictureCaptured && <p>{failMessage}</p>}
            {!hasError && !isLoading && isfaceRecognized && isPictureCaptured && <p style={{ color: 'green'}}>{successMessage}</p>}
        </Container>
    )
}

const Container = styled.div`
p {
    font-weight: bold;
}

p.error-msg {
    /* text-align: center; */
    color: red;
}
p.process-msg {
    /* text-align: center; */
    color: green;
}
.process-btn {
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

const Wrapper = styled.div`
display: flex;
flex-direction: row;
justify-content: space-around;
`
export default Home;
