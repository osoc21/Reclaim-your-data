import React, {useEffect, useState} from "react";
import GridView from "./GridView";
import "./FileExplorer.css"
import {fetch} from '@inrupt/solid-client-authn-browser';
import {getSolidDataset, getThingAll} from '@inrupt/solid-client';
import {Container} from '@material-ui/core';

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


    /** Fetch all files from the given path given relative to the root */
    async function getRootFiles() {
        await setLoadingAnim(true);
        getFilesFromResourceURL(POD_URL).then((fileArray) => {
            setCurrentPath(POD_URL);
            setFiles(fileArray);
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
