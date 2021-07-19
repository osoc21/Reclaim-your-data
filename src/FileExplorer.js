import React, {useEffect, useState} from "react";
import GridView from "./GridView";

import {Container, Row} from 'react-bootstrap';

import "./FileExplorer.css"

// Import from "@inrupt/solid-client-authn-browser"
import {fetch} from '@inrupt/solid-client-authn-browser';

// Import from "@inrupt/solid-client"
import {getSolidDataset, getThingAll, saveFileInContainer} from '@inrupt/solid-client';

import {getPODUrlFromWebId} from './pod';


function FileExplorer(props) {
    let webId = props.webId;
    const MY_POD_URL = getPODUrlFromWebId(webId);

    let [files, setFiles] = useState([]);
    let [loading, setLoading] = useState(false);

    let currentPath = props.explorerPath;
    let setCurrentPath = props.setExplorerPath;

    if (currentPath === "") {
        setCurrentPath(MY_POD_URL);
    }

    function openFolder(myUrl) {
        setLoading(true);
        // its important to set the current path first !!
        getFilesFromResourceURL(myUrl).then((fileArray) => {
            setCurrentPath(myUrl);
            setFiles(fileArray);
            setLoading(false);
        });
    }


    function fileExplorerGoBack() {
        if (currentPath.length > MY_POD_URL.length && currentPath !== MY_POD_URL) {
            // find the second-last '/', then keep the substring until that '/'
            // this gives the new path url
            let lastSlashPos = currentPath.slice(0, -1).lastIndexOf('/');
            let newPath = currentPath.slice(0, lastSlashPos + 1)

            openFolder(newPath);

        } else {
            alert("Cannot go back from POD root.");
        }
    }


    function resourceLink(itemURL, setCurrentPath, uniqueKey) {
        let url = itemURL;
        let resourceName = stripURL(url);

        function open() {
            if (url.endsWith("/")) {
                console.log("opening " + url + " ...");
                openFolder(url);
            } else {
                alert("this is a file, handle it");
            }
        }

        return {"pathName": {url}, "open": {open}};
    }

    /** Iteraetes on the file urls and returns an array of react components */
    function stripURL(url) {
        //Find the second-last '/', then keep the substring until that '/'
        // this gives the new path url
        let searchUpperBound = url.length;
        if (url.endsWith('/')) {
            searchUpperBound = url.length - 1
        }
        let slashPos = url.slice(0, searchUpperBound).lastIndexOf('/');
        return url.slice(slashPos + 1, searchUpperBound);
    }


    function openLink(url) {
        // its important to set the current path first !!
        getFilesFromResourceURL(url).then((fileArray) => {
            setCurrentPath(url);
            setFiles(fileArray);
        });
    }


    /** Iterates on the file urls and returns an array of react components
     * in the form of resourceLink elements  */
    function fileArrayToReact() {
        if (loading) {
            return <div className="loader"></div>
        }

        // the first child element is self
        if (files.length > 0) {
            let reactElems = [];
            let i = 0;

            for (let item of files) {
                reactElems.push(resourceLink(item.url, setCurrentPath, i));
                i++;
            }

            return reactElems;
        }

        return <p><i>Nothing to display</i></p>;
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
    function getRootFiles() {
        getFilesFromResourceURL(MY_POD_URL).then((fileArray) => {
            setCurrentPath(MY_POD_URL);
            setFiles(fileArray);
        });
    }


    // only read files if not already in the array (avoid infinite refreshes !!!)
    // but also if the current path is the root (it's possible that we're not in the
    // root but the current path contains no file e.g. empty folder)
    if ((files.length === 0) && (currentPath === MY_POD_URL)) {
        // Don't use animation here as FileExplorer might already
        // be rendering and updating too many properties
        // at that time might cause 'too many rerenders'
        getRootFiles();
    }

    /*useEffect(() => {
        setCurrentPath(MY_POD_URL);
    }, [props.currentPath]);*/


    return (
        <Container>
            <Row>
                <div id="file-explorer">
                    <button className="Button" id="go-back" onClick={fileExplorerGoBack}>Go back</button>
                    <p>Files for current path ({currentPath}):</p>
                </div>
            </Row>
            <GridView files={files} openLink={openLink} currentPath={currentPath}/>
        </Container>
    );
}

export default FileExplorer;