function blobCreationFromURL(dataURI) { 

    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);


    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ia], {type:'image/jpeg'});
    const file = new File( [blob], 'capturedImg.jpg', { type: 'image/jpeg' } );
    return file;
}

export { blobCreationFromURL };