
import {IMAGE_RELATIVE_PATH} from "./constants"
import React, {useEffect, useState} from "react";
import GridView from "./GridView";
import "./FileExplorer.css"
import {fetch} from '@inrupt/solid-client-authn-browser';
import {getSolidDataset, getThingAll} from '@inrupt/solid-client';
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
        getFilesFromResourceURL(folderUrl).then((fileArray) => {
            setCurrentPath(folderUrl);
            setFiles(fileArray);
            // if no files were obtained (empty folder)
            // then stop loading animation directly
            if (files.length === 0)
            {
                setLoadingAnim(false);
            } 
        });
    }

    useEffect(() => {
        if (POD_URL !== "") {
            getRootFiles();
        }
    }, [POD_URL]);


    return (
        <Container id="file-explorer" disableGutters="true">
            <GridView files={files} openFolder={openFolder} setLoadingAnim={setLoadingAnim} currentPath={currentPath}/>
        </Container>
    );
}

export default FileExplorer;
