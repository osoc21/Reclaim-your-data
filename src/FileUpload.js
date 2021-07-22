import React, {useState} from "react"

// Import from "@inrupt/solid-client"
import {
    saveFileInContainer,
    getFile, 
    overwriteFile
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
                errorMsg += "Could not upload '" + selectedFiles[i].name + "', the file might already exist.\n";
            }
           
        }
        await setLoadingAnim(false);
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
            await updateMetadataFile(currentPath, selectedFiles);
        }


        //TODO: add success/failure notification of uploading file(s)
    }

    function makeMetaDataEntry(file){
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

    async function updateMetadataFile(path, contentToAdd) {
        let processedEntries = Array.from(contentToAdd).map(entry => makeMetaDataEntry(entry));
        let metadataFile = makeMetadataFile(processedEntries);
        
        // FOR SOME LOVELY REASON, YOU HAVE TO PASS path + file.name to getFile, instead of a string consisting of the resource you want to access
        // THUS, file PARAMETER IS MANDATORY HERE
        let file = await getFile(path + metadataFile.name, {fetch: fetch});
        let fileContent = [];
        file.text().then(text => {fileContent = JSON.parse(text)});
        //fileContent.push(contentToAdd);
        processedEntries.forEach(entry => fileContent.push(entry));
        metadataFile = makeMetadataFile(fileContent);
        console.log(processedEntries);

        const savedFile = await overwriteFile(
            currentPath + metadataFile.name,
            metadataFile,
            {
                slug: metadataFile.name,
                contentType: metadataFile.type,
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
                accept="image/*"
                onChange={(e) => {
                       setSelectedFiles(e.target.files);
                }}/>
        </div>
    );
}

export default FileUpload;
