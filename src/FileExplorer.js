
import React, {useState} from "react";

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
    // console.log("webid:", webId);
    const MY_POD_URL = getPODUrl(webId);
    // console.log("podURL: " + MY_POD_URL);

    let [files, setFiles] = useState([]);
    let [currentPath, setCurrentPath] = useState(MY_POD_URL);
    

    function getPODUrl(myWebId)
    {
        const podURL = myWebId.match(tempPodPattern)[0];
        return podURL;
    }

    /** Splits the current path using the last '/' if it's a file,
     * or the second last '/' if it's a folder.
     */
    // function getCurrentPathSplit()
    // {
    //     let res = null;

    //     //Find the second-last '/', then keep the substring until that '/'
    //     // this gives the new path url
    //     if (currentPath.length > 1)
    //     {
    //         let searchUpperBound = currentPath.length;
    //         if (currentPath[currentPath.length - 1] === '/')
    //         {
    //             searchUpperBound = currentPath.length - 1
    //         }
    //         let slashPos = currentPath.slice(0, searchUpperBound).lastIndexOf('/');
    //         let left = currentPath.slice(slashPos + 1, searchUpperBound);
    //         let right = currentPath.slice(0, slashPos + 1);
    //         res = {parentPath: left, currentFolder: right};
    //     }

    //     return res;

    // }

    function fileExplorerGoBack()
    {
        console.log("*******");
        console.log("current path:", currentPath);
        if (currentPath.length > MY_POD_URL.length && currentPath !== MY_POD_URL)
        {
            // urlParentStack.pop(); // remove the current dir from the stack
            // let url = urlParentStack[urlParentStack.length-1];
            
            // find the second-last '/', then keep the substring until that '/'
            // this gives the new path url
            let lastSlashPos = currentPath.slice(0, -1).lastIndexOf('/');
            let newPath = currentPath.slice(0, lastSlashPos + 1)
            console.log("going back to " + newPath + " ...");

            // its important to set the current path first !!
            getFilesFromResourceURL(newPath).then((fileArray) => {
                setCurrentPath(newPath);
                setFiles(fileArray);
            });
        }
        else
        {
            alert("Cannot go back from POD root.");
        }
    } 


    function resourceLink(itemURL, setCurrentPath)
    {
        let url = itemURL;

        function open()
        {
            // its important to set the current path first !!
            getFilesFromResourceURL(url).then((fileArray) => {
                setCurrentPath(url);
                setFiles(fileArray);
            });
        }

        return (
           <p className="resource-link" 
           onClick={open}><i>{url}</i></p>
        );
    }

    /** Iteraetes on the file urls and returns an array of react components
     * in the form of resourceLink elements  */
    function fileArrayToReact()
    {
        console.log("file array to react");

        // the first child element is self
        if (files.length > 0)
        {
            let reactElems = [];

            for (let item of files)
            {
                reactElems.push(resourceLink(item.url, setCurrentPath));
            }

            return reactElems;
        }

        return <p><i>Nothing to display</i></p>;
    }


    async function getFilesFromResourceURL(url)
    {
        console.log("get files from " + url);
        const fetchedFiles = await getSolidDataset(url, { fetch: fetch });
        // console.log("fetched files:");
        // console.log(fetchedFiles,'\n');

        let children = await getThingAll(fetchedFiles);

        // console.log("children: ");
        // console.log(children);

        let res = []

        // note: the first child element is self
        if (children.length > 1)
        {
            res = children.slice(1, children.length)
        }

        console.log("files obtained:");
        console.log(res);
        return res;

    }



    /** Fetch all files from the given path given relative to the root */
    async function getFiles() 
    {
        console.log("GETTING FILES");
        // console.log("plain get files");
        // TODO: remove hardcoded stuff
        // const HARDCODE_URL = "https://pod.inrupt.com/wepodrom/profile/card#me";
        // MY_POD_URL = getPODUrl(webId); // webId
        

        // Parse ProfileDocument URI from the `webID` value.
        // const profileDocumentURI = webId.split('#')[0];
        // document.getElementById("labelProfile").textContent = profileDocumentURI;

        getFilesFromResourceURL(MY_POD_URL).then((fileArray) => {
            setCurrentPath(MY_POD_URL);
            setFiles(fileArray);
        });
    }


    // only read files if not already in the array (avoid infinite refreshes !!!)
    // but also if the current path is the root (it's possible that we're not in the
    // root but the current path contains no file e.g. empty folder)
    if ((files.length === 0) && (currentPath === MY_POD_URL))
    {
        getFiles();
    }

    return (
        <div>
          <h1> You are logged in to your POD </h1>
          <div id="file-explorer">
            <button className="Button" id="go-back" onClick={fileExplorerGoBack}>Go back</button>
            <p>Files for current path ({currentPath}):</p>
            <div id="file-viewer">
              <ul>{fileArrayToReact()}</ul>
            </div>
          </div>
        </div>
    );
}

export default FileExplorer;