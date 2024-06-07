
async function loadModels() {
    await Promise.all([
        window.faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        window.faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        window.faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        window.faceapi.nets.ageGenderNet.loadFromUri('./models'),
    ])
}

async function drawBoundingBoxesOnID() {
    let faceToCheck = document.getElementById('id_img');

    let facesToCheckAIData = await window.faceapi.detectAllFaces(faceToCheck).withFaceLandmarks().withFaceDescriptors();

    const canvas = document.getElementById('canvas');
    canvas.style.left = faceToCheck.offsetLeft;
    canvas.style.top = faceToCheck.offsetTop;
    canvas.height = faceToCheck.height;
    canvas.width = faceToCheck.width;

    facesToCheckAIData = window.faceapi.resizeResults(facesToCheckAIData, faceToCheck);
    facesToCheckAIData.forEach((face) => {
        const { detection } = face;
        let options = { label: 'Detected face', boxColor: 'green' };
        const drawBox = new window.faceapi.draw.DrawBox(detection.box, options);
        drawBox.draw(canvas);
    });
}

async function startFacialRecognition() {
    const refFace = document.getElementById('ref_img');
    let faceToCheck = document.getElementById('id_img');
    let faceRecognized = false;

    let refFaceAIData = await window.faceapi.detectAllFaces(refFace).withFaceLandmarks().withFaceDescriptors();
    let facesToCheckAIData = await window.faceapi.detectAllFaces(faceToCheck).withFaceLandmarks().withFaceDescriptors();

    if (!refFaceAIData.length) return { faceRecognized };

    const canvas = document.getElementById('canvas');
    canvas.style.left = faceToCheck.offsetLeft;
    canvas.style.top = faceToCheck.offsetTop;
    canvas.height = faceToCheck.height;
    canvas.width = faceToCheck.width;
    // window.faceapi.matchDimensions(canvas, faceToCheck);


    // Feed the AI data of reference image to the face matcher
    let facematcher = new window.faceapi.FaceMatcher(refFaceAIData, 0.4);

    facesToCheckAIData = window.faceapi.resizeResults(facesToCheckAIData, faceToCheck);

    // Looping through the faces in the imageToCheck and compare to reference image data
    let closestScore = 10000;
    facesToCheckAIData.forEach((face) => {
        const { descriptor } = face;
        const comparisonData = facematcher.findBestMatch(descriptor);
        let label = facematcher.findBestMatch(descriptor).toString();
        console.log('face: ', label);
        if (comparisonData.distance < closestScore) {
            closestScore = comparisonData.distance;
            faceRecognized = true;
        }
    });

    if (faceRecognized) {
        facesToCheckAIData.forEach((face) => {
            /* 
             * Detection has the data I'm using to draw the bounding box on the recognized face
             * Descriptor has the data points for 
            */
            const { detection, descriptor } = face;
            const comparisonData = facematcher.findBestMatch(descriptor);
            if (comparisonData.distance === closestScore) {
                let options = { label: 'Recognized person' };
                const drawBox = new window.faceapi.draw.DrawBox(detection.box, options);

                drawBox.draw(canvas);
            }
        });
    }

    return { faceRecognized: true };
}


export { loadModels, startFacialRecognition, drawBoundingBoxesOnID };