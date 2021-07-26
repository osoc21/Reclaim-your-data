import "./FileUpload.css"
import React, {useState} from "react"
import {
    saveFileInContainer,
    getFile,
    overwriteFile
} from '@inrupt/solid-client';

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

        for (let file of selectedFiles) {
            promiseArray.push(placeFileInContainer(file, currentPath));
        }
        let promiseResults = await Promise.all(promiseArray);
        let errorMsg = "";

        for (let i = 0; i < promiseResults.length; ++i) {
            let res = promiseResults[i];

            // promise is undefined if the upload wasn't sucessful
            if (!res) {
                errorMsg += "'" + selectedFiles[i].name + "'";
            }

        }
        await setLoadingAnim(false);

        // there is an error or more
        if (errorMsg !== "") {
            await setNotifType("error");
            await setNotifMsg(errorMsg);
        } else if (selectedFiles.length > 0) {
            await setNotifType("success");
            await setNotifMsg("Files successfully uploaded !!");
            await updateMetadataFile(selectedFiles);
        } else if (selectedFiles.length === 0) {
            await setNotifType("info");
            await setNotifMsg("Nothing to upload.");
        }
    }

    function makeMetaDataEntry(file) {
        function getName(url) {
            let regex = /^https:\/\/pod\.inrupt\.com(\/\w+)*\/(\w+)/;
            const match = url.match(regex);
            return match[match.length - 1];
        }

        function isFolder(url) {
            return url.endsWith("/");
        }

        let fileUrl = currentPath + file.name;
        let metadataEntry = {
            url: fileUrl,
            shortName: getName(fileUrl),
            isFolder: isFolder(fileUrl),
            imageUrl: null,
            date: null
        };
        return metadataEntry;
    }

    function makeMetadataFile(jsObjects) {
        const jsonString = `${JSON.stringify(jsObjects)}`;
        return new File([jsonString], "metadata.json", {
            type: "application/json"
        });
    }

    async function updateMetadataFile(contentToAdd) {
        let processedEntries = Array.from(contentToAdd).map(entry => makeMetaDataEntry(entry));
        let metadataFile = makeMetadataFile(processedEntries);
        let file = await getFile(currentPath + metadataFile.name, {fetch: fetch});
        let fileContent = await file.text();

        const prevContent = JSON.parse(fileContent);
        const newContent = [...prevContent, ...processedEntries];
        const resContent = await Promise.all(newContent);
        const newMetadataFile = makeMetadataFile(resContent);
        const savedFile = await overwriteFile(
            currentPath + newMetadataFile.name,
            newMetadataFile,
            {
                slug: newMetadataFile.name,
                contentType: newMetadataFile.type,
                fetch: fetch
            });
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
                    slug: file.name,
                    contentType: file.type, fetch: fetch
                }
            );
            return file.name;
        } catch (error) {
            //console.log("ERROR CAUGHT:", error);
            // Any error is handled in the UI, no need to print it to the console.
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
