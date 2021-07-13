import React, {useState} from "react";

import FileUpload from "./FileUpload"

import "./FileExplorer.css"

// Import from "@inrupt/solid-client-authn-browser"
import {
    fetch
} from '@inrupt/solid-client-authn-browser';

// Import from "@inrupt/solid-client"
import {
    getSolidDataset,
    getThingAll,
    // write data
    // setThing,
    // saveSolidDatasetAt,
    // added to upload image to pod
    // saveFileInContainer,
    // getSourceUrl,
    // setStringNoLocale
} from '@inrupt/solid-client';


function FileExplorer(props) {
    const solidwebPattern = "https:\/\/(\w+\.)solidweb.org\/";
    const podInruptPattern = "https:\/\/pod\.inrupt\.com\/\w+\/";
    const tempPodPattern = /https:\/\/(\w+\.)solidweb.org\/|https:\/\/pod\.inrupt\.com\/\w+\//;

    let webId = props.webId;
    const MY_POD_URL = getPODUrl(webId);

    let [files, setFiles] = useState([]);
    let [currentPath, setCurrentPath] = useState(MY_POD_URL);

    function getPODUrl(myWebId) {
        const podURL = myWebId.match(tempPodPattern)[0];
        return podURL;
    }

    function fileExplorerGoBack() {
        if (currentPath.length > MY_POD_URL.length && currentPath !== MY_POD_URL) {
            // find the second-last '/', then keep the substring until that '/'
            // this gives the new path url
            let lastSlashPos = currentPath.slice(0, -1).lastIndexOf('/');
            let newPath = currentPath.slice(0, lastSlashPos + 1)

            // its important to set the current path first !!
            getFilesFromResourceURL(newPath).then((fileArray) => {
                setCurrentPath(newPath);
                setFiles(fileArray);
            });
        } else {
            alert("Cannot go back from POD root.");
        }
    }


    function resourceLink(itemURL, setCurrentPath, uniqueKey) {
        let url = itemURL;

        function open() {
            if (url.endsWith("/")) {
                // its important to set the current path first !!
                getFilesFromResourceURL(url).then((fileArray) => {
                    setCurrentPath(url);
                    setFiles(fileArray);
                });
            } else {
                alert("this is a file, handle it");
            }
        }

        return (
            <p className="resource-link"
               onClick={open}
               key={uniqueKey}><i>{url}</i></p>
        );
    }

    /** Iterates on the file urls and returns an array of react components
     * in the form of resourceLink elements  */
    function fileArrayToReact() {
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
    async function getFiles() {
        getFilesFromResourceURL(MY_POD_URL).then((fileArray) => {
            setCurrentPath(MY_POD_URL);
            setFiles(fileArray);
        });
    }


    // only read files if not already in the array (avoid infinite refreshes !!!)
    // but also if the current path is the root (it's possible that we're not in the
    // root but the current path contains no file e.g. empty folder)
    if ((files.length === 0) && (currentPath === MY_POD_URL)) {
        getFiles();
    }

    return (
        <div>
            <h1> You are logged in to your POD </h1>
            <div id="file-explorer">
                <button className="Button" id="go-back" onClick={fileExplorerGoBack}>Go back</button>
                <FileUpload currentPath={currentPath}/>
                <p>Files for current path ({currentPath}):</p>
                <div id="file-viewer">
                    <ul>{fileArrayToReact()}</ul>
                </div>
            </div>
        </div>
    );
}

export default FileExplorer;