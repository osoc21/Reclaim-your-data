
import "./FileUpload.css"

import React, {useState} from "react"

// Import from "@inrupt/solid-client"
import {
    saveFileInContainer
} from '@inrupt/solid-client';

// Import from "@inrupt/solid-client-authn-browser"
import {
    fetch
} from '@inrupt/solid-client-authn-browser';

import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SendIcon from '@material-ui/icons/Send';


function FileUpload(props) {
    let currentPath = props.explorerPath;
    let [selectedFiles, setSelectedFiles] = useState([]);
    let setNotifMsg = props.setNotifMsg;
    let setNotifType = props.setNotifType;
    let setLoadingAnim = props.setLoadingAnim;

    async function upload() {
        let promiseArray = [];
        await setLoadingAnim(true);
        console.log("uploading ...");
        for (let file of selectedFiles) {
            promiseArray.push(placeFileInContainer(file, currentPath));
        }
        let promiseResults = await Promise.all(promiseArray);
        let errorMsg = "";
        for (let i = 0 ; i < promiseResults.length ; ++i)
        {
            let res = promiseResults[i];
            // console.log(res)
             
            // promise is undefined if the upload wasn't sucessful
            if (! res)
            {
                errorMsg += "'" + selectedFiles[i].name + "'";
            }
           
        }
        await setLoadingAnim(false);
        // there is an error or more
        if (errorMsg !== "")
        {
            await setNotifType("error");
            await setNotifMsg("Could not upload file(s), they might already exist: " + errorMsg);
        }
        else if (selectedFiles.length > 0)
        {
            await setNotifType("success");
            await setNotifMsg("Files successfully uploaded !!");
        }
        else if (selectedFiles.length == 0)
        {
            await setNotifType("info");
            await setNotifMsg("Nothing to upload.");
        }


        //TODO: add success/failure notification of uploading file(s)
    }

    /**
     * Upload file into the targetContainer.
     * @param  {[type]} file               [description]
     * @param  {[type]} targetContainerURL [description]
     * @return {[type]}                    [description]
     */
    async function placeFileInContainer(file, targetContainerURL) {
        try {
            const savedFile = await saveFileInContainer(
                targetContainerURL,           // Container URL
                file,                         // File
                {
                    slug: file.name, // file.name.split('.')[0]
                    contentType: file.type, fetch: fetch
                }
            );
            return file.name;
            // await setNotifType("error");
            // await setNotifMsg("file '" + file.name + "' already exists.");
        } catch (error) {
            console.error("ERROR CAUGHT:", error);
            
        }
    }

    function openFileSelectionWindow() {
        document.querySelector("#file-input").click();
    }


    function selectedFilesToReact() {
        let res = [];
        let i = 0;
        // selectedFiles is iterable but not an array, 
        // so map() and forEach() functions don't work
        for (let file of selectedFiles) {
            res.push(<li key={i}>{file.name}</li>);
            ++i;
        }

        return res;
    }

    function showUploadSection() {
        return (
            <div className="upload-section">
                <h4>Selected files:</h4>
                <ul>{selectedFilesToReact()}</ul>
                <Button variant="contained" color="primary" onClick={upload}
                endIcon={<SendIcon/>}>Upload</Button>
            </div>
        );
    }

    return (
        <div>
            <h1>Upload files</h1>
            <h4>Destination:</h4>
            <p>{currentPath}</p>
            <Button variant="contained" color="primary" onClick={openFileSelectionWindow}
            startIcon={<CloudUploadIcon/>}>
                Select file(s)
            </Button>
            {selectedFiles.length > 0 ? showUploadSection() : null}
            <input id="file-input" type="file" multiple="multiple"
                name="fileUploadInput"
                className="file-selection"
                accept="image/*"
                onChange={(e) => {
                       setSelectedFiles(e.target.files);
                }}/>
        </div>
    );
}

export default FileUpload;
