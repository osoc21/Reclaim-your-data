
import React from "react";

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
        return (
           <p class="pod-resource-link" 
           onClick={getFilesFromResourceURL(this.textContent)}>{itemURL}</p>
        );
    }


    async function getFilesFromResourceURL(url)
    {
        const fetchedFiles = await getSolidDataset(url, { fetch: fetch });
        console.log("fetched files:");
        console.log(fetchedFiles,'\n');

        let children = await getThingAll(fetchedFiles);

        console.log("children: ");
        console.log(children);

        // the first child element is self
        if (children.length > 1)
        {
              // fileViewerDiv.innerHTML = "";
              urlParentStack.push(url);
        }
        for (let item of children.slice(1, children.length))
        {
            //<resourceLink/>
            resourceLink(item);
            /*
              console.log(item);
              let parNode = document.createElement("P");
              parNode.classList.add('pod-resource');
              let textNode = document.createTextNode(item.url + "\n\n");
              parNode.appendChild(textNode);
              parNode.addEventListener('click', 
                  function(){getFilesFromResourceURL(parNode.textContent)}
              );
              fileViewerDiv.appendChild(parNode);
              */
              
        }
    }



    /** Fetch all files from the given path given relative to the root */
    async function getFiles() 
    {
        // TODO: remove hardcoded stuff
        
        MY_POD_URL = getPODUrl(webId);
        console.log("podURL: "+MY_POD_URL);

        // Parse ProfileDocument URI from the `webID` value.
        const profileDocumentURI = webId.split('#')[0];
        // document.getElementById("labelProfile").textContent = profileDocumentURI;

        getFilesFromResourceURL(MY_POD_URL);
    }

    function getFileViewerContent()
    {
        if (urlParentStack.length > 0)
        {
            let currentPath = urlParentStack[urlParentStack.length-1];
            getFiles();
        }

        return "Nothing to display"
    }

    let files = getFiles();

    console.log(files);

    return (
        <div>
          <h1> You are logged in to your POD </h1>
          <div id="file-explorer">
            <button id="go-back">Go back</button>
            <p>Your files:</p>
            <div id="file-viewer">
              <p><i>{webId}</i></p>
             
            </div>
          </div>
        </div>
    );
}

export default FileExplorer;