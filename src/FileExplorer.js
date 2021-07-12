
import React, {useState} from "react";

import "./FileExplorer.css"

// Import from "@inrupt/solid-client-authn-browser"
import {
  fetch
} from '@inrupt/solid-client-authn-browser';

// Import from "@inrupt/solid-client"
import {
  getSolidDataset,
  getThing,
  getThingAll,
  getStringNoLocale,
  // write data
  setThing,
  saveSolidDatasetAt,
  // added to upload image to pod
  saveFileInContainer, 
  getSourceUrl,
  setStringNoLocale
} from '@inrupt/solid-client';




function FileExplorer(props) {

    let [files, setFiles] = useState([]);
    let MY_POD_URL = null;
    let urlParentStack = [];
    let webId = props.webId;

    console.log(webId);

    const solidwebPattern = "https:\/\/(\w+\.)solidweb.org\/";
    const podInruptPattern = "https:\/\/pod\.inrupt\.com\/\w+\/";
    const tempPodPattern = /https:\/\/(\w+\.)solidweb.org\/|https:\/\/pod\.inrupt\.com\/\w+\//;
    
    function getPODUrl(provider)
    {
        console.log(provider);
        const podURL = provider.match(tempPodPattern)[0];
        console.log(podURL);
        return podURL;
    }

    async function fileExplorerGoBack()
    {
        console.log("*******");
        console.log(urlParentStack);
        if (urlParentStack.length > 0)
        {
            urlParentStack.pop(); // remove the current dir from the stack
            let url = urlParentStack[urlParentStack.length-1];
            console.log("going back to " + url + " ...");
            getFilesFromResourceURL(url);
        }
        else
        {
            console.log("Cannot go back from POD root.");
        }
    } 


    function resourceLink(itemURL)
    {
        let url = itemURL;

        function open()
        {
            getFilesFromResourceURL(url).then((fileArray) => {
                setFiles(fileArray);
            });
        }

        return (
           <p class="resource-link" 
           onClick={open}>{url}</p>
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
                reactElems.push(resourceLink(item.url));
            }

            return reactElems;
        }

        return <p>Nothing to display</p>;
    }



    async function getFilesFromResourceURL(url)
    {
        console.log("get files from URL");
        const fetchedFiles = await getSolidDataset(url, { fetch: fetch });
        // console.log("fetched files:");
        // console.log(fetchedFiles,'\n');

        let children = await getThingAll(fetchedFiles);

        // console.log("children: ");
        // console.log(children);

        // the first child element is self
        if (children.length > 1)
        {
            return children.slice(1, children.length)
        }

        return [];

    }



    /** Fetch all files from the given path given relative to the root */
    async function getFiles() 
    {
        console.log("plain get files");
        // TODO: remove hardcoded stuff
        const HARDCODE_URL = "https://pod.inrupt.com/wepodrom/profile/card#me";
        MY_POD_URL = getPODUrl(HARDCODE_URL); // webId
        console.log("podURL: " + MY_POD_URL);

        // Parse ProfileDocument URI from the `webID` value.
        // const profileDocumentURI = webId.split('#')[0];
        // document.getElementById("labelProfile").textContent = profileDocumentURI;

        getFilesFromResourceURL(MY_POD_URL).then((fileArray) => {
            setFiles(fileArray);
        });
    }

    // let files = getFiles();
    // console.log(files);

    if (files.length === 0)
    {
        getFiles();
    }

    return (
        <div>
          <h1> You are logged in to your POD </h1>
          <div id="file-explorer">
            <button id="go-back">Go back</button>
            <p>Your files:</p>
            <div id="file-viewer">
              <p><i>Web id: {webId}</i></p>
              <ul>{fileArrayToReact()}</ul>
            </div>
          </div>
        </div>
    );
}

export default FileExplorer;