import React, {useState} from "react"

// Import from "@inrupt/solid-client"
import {
    saveFileInContainer
} from '@inrupt/solid-client';

// Import from "@inrupt/solid-client-authn-browser"
import {
    fetch
} from '@inrupt/solid-client-authn-browser';


function FileUpload(props) {
    let currentPath = props.explorerPath;
    let [selectedFiles, setSelectedFiles] = useState([]);
    let setNotifMsg = props.setNotifMsg;
    let setNotifType = props.setNotifType;

    async function upload() {
        let promiseArray = [];
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
                errorMsg += "Could not upload '" + selectedFiles[i].name + "', the file might already exist.\n";
            }
           
        }

        // there is an error or more
        if (errorMsg !== "")
        {
            await setNotifType("error");
            await setNotifMsg(errorMsg);
        }
        else
        {
            await setNotifType("success");
            await setNotifMsg("Files successfully uploaded !!");
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

        // selectedFiles is iterable but not an array, 
        // so map() and forEach() functions don't work
        for (let file of selectedFiles) {
            res.push(<li>{file.name}</li>);
        }

        return res;
    }

    function showSelectedFiles() {
        return (
            <div className="SelectedFilesDiv">
                <p>Selected files:</p>
                <ul>{selectedFilesToReact()}</ul>
            </div>
        );
    }

    return (
        <div>
            <h1>Upload files</h1>
            <p>Current path: {currentPath}</p>
            <button className="Button" onClick={openFileSelectionWindow}>Add file(s)</button>
            {showSelectedFiles()}
            <button className="Button" onClick={upload}>Upload</button>
            <input id="file-input" type="file" multiple="multiple"
                name="fileUploadInput"
                className="file-selection"
                onChange={(e) => {
                       setSelectedFiles(e.target.files);
                }}/>
        </div>
    );
}

export default FileUpload;
