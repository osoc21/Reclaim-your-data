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

/**
 * The file upload component allows the user to select files, and once done,
 * display the upload button that can be clicked on the send the files on the POD.
 *
 * @component
 * @param {[type]} props The current path url (string), the notification message and type (strings)
 * and the loading animation status (bool).
 * @returns {JSX.Element}
 */
function FileUpload(props) {
    let currentPath = props.explorerPath;
    let [selectedFiles, setSelectedFiles] = useState([]);
    let setNotifMsg = props.setNotifMsg;
    let setNotifType = props.setNotifType;
    let setLoadingAnim = props.setLoadingAnim;

    /**
     * Calls placeFileInContainer for each selected file,
     * placing all the Promises in an array before waiting for them to 
     * finish. Once all async operations are completed, the function checks if any of them
     * failed, and if so, displays an error notification. If every operation succeeds, displays
     * a success notification.
     * 
     * @async
     */
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

            // promise is undefined if the upload wasn't successful
            if (!res) {
                errorMsg += "'" + selectedFiles[i].name + "'";
            }
        }

        await setLoadingAnim(false);

        // there is an error or more
        if (errorMsg !== "") {
            await setNotifType("error");
            await setNotifMsg("Could not upload file(s). The file(s) might already exist: " + errorMsg);
        } else if (selectedFiles.length > 0) {
            await setNotifType("success");
            await setNotifMsg("Files successfully uploaded !!");
            await updateMetadataFile(selectedFiles);
        } else if (selectedFiles.length === 0) {
            await setNotifType("info");
            await setNotifMsg("Nothing to upload.");
        }
    }

    /**
     * Return an object with keys **date**, **isFolder**, **imageUrl**, **shortName**, **url**.
     *
     * @param file {File} `File object.`
     * @returns {{date: Date, isFolder: boolean, imageUrl: string, shortName: string, url: string}} `JS Object`
     */
    function makeMetaDataEntry(file) {
        /**
         * Return the name of the file associated with the provided URL.
         *
         * @param url {string} `URL to the file.`
         * @returns {string} `Name of file.`
         */
        function getName(url) {
            let regex = /^https:\/\/pod\.inrupt\.com(\/\w+)*\/(\w+)/;
            const match = url.match(regex);
            return match[match.length - 1];
        }

        /**
         * Checks whether or not the provided URL is a folder.
         *
         * @param url {string} `URL`
         * @returns {boolean} boolean
         */
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

    /**
     * Return a metadata.json file containing the entries of the files in the pod.
     *
     * @param jsObjects {Object[]}
     * @returns {File} File
     */
    function makeMetadataFile(jsObjects) {
        // parse the incoming JS objects to a string for the File API
        const jsonString = `${JSON.stringify(jsObjects)}`;
        return new File([jsonString], "metadata.json", {
            type: "application/json"
        });
    }

    /**
     * Update the entries in metadata.json file with newly uploaded files to the pod.
     *
     * @async
     * @returns {void} void
     * @param {[File]} newFileEntries `Array of File to add.`
     */
    async function updateMetadataFile(newFileEntries) {
        let processedEntries = Array.from(newFileEntries).map(entry => makeMetaDataEntry(entry));
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
     * 
     * @async
     * @param  {[type]} file               A javascript File object
     * @param  {[type]} targetContainerURL The url of the POD container where the file should be placed
     * @return {[string]}                  The name of the file
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

    /**
     * Triggers a click event on the input[type="file"] element so that
     * the associated file selecion dialog can open.
     * @returns void
     */
    function openFileSelectionWindow() {
        document.querySelector("#file-input").click();
    }

    /**
     * Convert the selected files to upload to an array of JSX.Element.
     * Note that the `<li>` is **NOT** HTML, but a JSX.Element.
     *
     * @returns {[JSX.Element]} Array of JSX.Element.
     */
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

    /**
     * Displays the list of selected files as well as a button to send them
     * to the POD. This returned component will be displayed only if
     * file(s) were selected beforehand.
     * @return {JSX.Element} A div element containing the selected file(s) list and the upload button
     */
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
