
import {IMAGE_RELATIVE_PATH} from "./constants"
import React, {useEffect, useState} from "react";
import GridView from "./GridView";
import "./FileExplorer.css"
import {fetch} from '@inrupt/solid-client-authn-browser';
import {getSolidDataset, getThingAll, createContainerAt} from '@inrupt/solid-client';
import {Container} from '@material-ui/core';


/**
 * The FileExplorer component fetches images and updates it's state
 * once done. This allows a GridView to display the images, and can also be used
 * to implement a files and folder navigation system.
 * 
 * @param {[type]} props [description]
 */
function FileExplorer(props) {
    const POD_URL = props.podUrl;

    let [files, setFiles] = useState([]);

    let setLoadingAnim = props.setLoadingAnim;
    let currentPath = props.explorerPath;
    let setCurrentPath = props.setExplorerPath;
    let fileSelectMode = props.fileSelectMode;
    let fileDeleteTriggered = props.fileDeleteTriggered;
    let setFileDeleteTriggered = props.setFileDeleteTriggered;
    let setNotifMsg = props.setNotifMsg;
    let setNotifType = props.setNotifType;

    function openFolder(url) {
        setLoadingAnim(true);
        // its important to set the current path first !!
        getFilesFromResourceURL(url).then((fileArray) => {
            setCurrentPath(url);
            setFiles(fileArray);
            setLoadingAnim(false);
        });
    }

    

    /**
     * Takes an url and fetches all the files and containers at that location if possible.
     * @param  {[type]} url The url of the container
     * @return {[type]}     A list of file urls
     */
    async function getFilesFromResourceURL(url) {
        const fetchedFiles = await getSolidDataset(url, {fetch: fetch});
        let children = await getThingAll(fetchedFiles);

        let res = []

        // note: the first child element is self
        if (children.length > 1) {
            res = children.slice(1, children.length)
        }

        return res;
    }




    /** 
     * Fetch all files from the given path given relative to the root
     * @return void
     */
    async function getRootFiles() {
        let folderUrl = POD_URL + IMAGE_RELATIVE_PATH;
        await setLoadingAnim(true);
        try {
            let fileArray = await getFilesFromResourceURL(folderUrl);
            await setCurrentPath(folderUrl);
            await setFiles(fileArray);
            // if no files were obtained (empty folder)
            // then stop loading animation directly
            if (files.length === 0)
            {
                await setLoadingAnim(false);
            } 
        }
        catch(error)
        {
            console.log("Creating container at:", folderUrl);
            // the create container function is automatically called when overwriting
            // files with overwriteFile(). However, here we have only read files, so we have to
            // call createContainerAt() manually.
            createContainerAt(POD_URL + IMAGE_RELATIVE_PATH, {fetch: fetch});
            await setLoadingAnim(false);
        }
    }

    useEffect(() => {
        if (POD_URL !== "") {
            getRootFiles();
        }
    }, [POD_URL]);


    return (
        <Container id="file-explorer" disableGutters="true">
            <GridView files={files} openFolder={openFolder}
            setLoadingAnim={setLoadingAnim} currentPath={currentPath}
            fileSelectMode={fileSelectMode}
            fileDeleteTriggered={fileDeleteTriggered} setFileDeleteTriggered={setFileDeleteTriggered}
            setNotifMsg={setNotifMsg} setNotifType={setNotifType}/>
        </Container>
    );
}

export default FileExplorer;
