// Import from "@inrupt/solid-client-authn-browser"
import {
  login,
  handleIncomingRedirect,
  getDefaultSession,
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

import {FOAF, VCARD } from '@inrupt/vocab-common-rdf';



let droppedFiles = [];
let MY_POD_URL = null;
let urlParentStack = [];



const buttonLogin = document.querySelector("#btnLogin");
const buttonRead = document.querySelector("#btnRead");
const buttonGetFiles = document.querySelector('#get-files-btn');
const explorerGoBackBtn = document.querySelector('#go-back');

// 1a. Start Login Process. Call login() function.
function loginToInruptDotCom() {
  let chosenIssuer = document.querySelector("#pod-issuer").value;
  return login({
    //oidcIssuer: "https://broker.pod.inrupt.com",
    oidcIssuer: chosenIssuer,

    redirectUrl: window.location.href,
    clientName: "Getting started app"
  });
}

// 1b. Login Redirect. Call handleIncomingRedirect() function.
// When redirected after login, finish the process by retrieving session information.
async function handleRedirectAfterLogin() {
  await handleIncomingRedirect();

  const session = getDefaultSession();
  if (session.info.isLoggedIn) {
    // Update the page with the status.
    // TODO: find a way to display the proper issuer after the redirect
    // document.getElementById("labelStatus").textContent = "You are connected to " + chosenIssuer;
      document.getElementById("labelStatus").textContent = "You are connected.";
    document.getElementById("labelStatus").setAttribute("role", "alert");
  }
}

// The example has the login redirect back to the index.html.
// This calls the function to process login information.
// If the function is called when not part of the login redirect, the function is a no-op.
handleRedirectAfterLogin();

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


async function getFilesFromResourceURL(url)
{
    const fetchedFiles = await getSolidDataset(url, { fetch: fetch });
    console.log("fetched files:");
    console.log(fetchedFiles,'\n');

    let fileViewerDiv = document.querySelector("#file-viewer");
    let children = getThingAll(fetchedFiles);

    // the first child element is self
    if (children.length > 1)
    {
        fileViewerDiv.innerHTML = "";
        urlParentStack.push(url);
    }
    for (let item of children.slice(1, children.length))
    {
        console.log(item);
        let parNode = document.createElement("P");
        parNode.classList.add('pod-resource');
        let textNode = document.createTextNode(item.url + "\n\n");
        parNode.appendChild(textNode);
        parNode.addEventListener('click', 
            function(){getFilesFromResourceURL(parNode.textContent)}
        );
        fileViewerDiv.appendChild(parNode);
    }
}



/** Fetch all files from the given path given relative to the root */
async function getFiles() {
  const webID = document.getElementById("webID").value;
  MY_POD_URL = getPODUrl(webID);

  // Parse ProfileDocument URI from the `webID` value.
  const profileDocumentURI = webID.split('#')[0];
  document.getElementById("labelProfile").textContent = profileDocumentURI;

  getFilesFromResourceURL(MY_POD_URL);

  // Use `getSolidDataset` to get the Profile document.
  // Profile document is public and can be read w/o authentication; i.e.: 
  // - You can either omit `fetch` or 
  // - You can pass in `fetch` with or without logging in first. 
  //   If logged in, the `fetch` is authenticated.
  // For illustrative purposes, the `fetch` is passed in.
  // const rootFiles = await getSolidDataset(MY_POD_URL, { fetch: fetch });
  // console.log("root files var:");
  // console.log(rootFiles,'\n');

  // getFilesFromResourceURL(rootFiles);

  // let fileViewerDiv = document.querySelector("#file-viewer");
  // let children = getThingAll(rootFiles);

  // // the first child element is self
  // if (children.length > 1)
  // {
  //   fileViewerDiv.innerHTML = "";
  // }
  // for (let item of children.slice(1, children.length))
  // {
  //   console.log(item);
  //   let parNode = document.createElement("P");
  //   parNode.classList.add('pod-resource');
  //   let textNode = document.createTextNode(item.url + "\n\n");
  //   parNode.appendChild(textNode);                              // Append the text to <li>
  //   fileViewerDiv.appendChild(parNode);                              // Append the text to <li>
  // }
  

  // // Get the Profile data from the retrieved SolidDataset
  // const profile = getThing(rootFiles, webID);

  // // Get the formatted name using `VCARD.fn` convenience object.
  // // `VCARD.fn` includes the identifier string "http://www.w3.org/2006/vcard/ns#fn".
  // // As an alternative, you can pass in the "http://www.w3.org/2006/vcard/ns#fn" string instead of `VCARD.fn`.
 
  // const fn = getStringNoLocale(profile, VCARD.fn);

  // // Get the role using `VCARD.role` convenience object.
  // // `VCARD.role` includes the identifier string "http://www.w3.org/2006/vcard/ns#role"
  // // As an alternative, you can pass in the "http://www.w3.org/2006/vcard/ns#role" string instead of `VCARD.role`.

  // const role = getStringNoLocale(profile, VCARD.role);

  // // Update the page with the retrieved values.
  // document.getElementById("labelFN").textContent = fn;
  // document.getElementById("labelRole").textContent = role;
}


// 2. Read profile
async function readProfile() {
  const webID = document.getElementById("webID").value;
  MY_POD_URL = getPODUrl(webID);

  // The example assumes the WebID has the URI <profileDocumentURI>#<fragment> where
  // <profileDocumentURI> is the URI of the SolidDataset
  // that contains profile data.
  
  // Parse ProfileDocument URI from the `webID` value.
  const profileDocumentURI = webID.split('#')[0];
  document.getElementById("labelProfile").textContent = profileDocumentURI;


  // Use `getSolidDataset` to get the Profile document.
  // Profile document is public and can be read w/o authentication; i.e.: 
  // - You can either omit `fetch` or 
  // - You can pass in `fetch` with or without logging in first. 
  //   If logged in, the `fetch` is authenticated.
  // For illustrative purposes, the `fetch` is passed in.
  const myDataset = await getSolidDataset(profileDocumentURI, { fetch: fetch });

  // Get the Profile data from the retrieved SolidDataset
  const profile = getThing(myDataset, webID);

  // Get the formatted name using `VCARD.fn` convenience object.
  // `VCARD.fn` includes the identifier string "http://www.w3.org/2006/vcard/ns#fn".
  // As an alternative, you can pass in the "http://www.w3.org/2006/vcard/ns#fn" string instead of `VCARD.fn`.
 
  const fn = getStringNoLocale(profile, VCARD.fn);

  // Get the role using `VCARD.role` convenience object.
  // `VCARD.role` includes the identifier string "http://www.w3.org/2006/vcard/ns#role"
  // As an alternative, you can pass in the "http://www.w3.org/2006/vcard/ns#role" string instead of `VCARD.role`.

  const role = getStringNoLocale(profile, VCARD.role);

  // Update the page with the retrieved values.
  document.getElementById("labelFN").textContent = fn;
  document.getElementById("labelRole").textContent = role;
}



let uploadBtn = document.querySelector("#upload-file-btn");
uploadBtn.onclick = function(){
    uploadFiles();
}



const solidwebPattern = "https:\/\/(\w+\.)solidweb.org\/";
const podInruptPattern = "https:\/\/pod\.inrupt\.com\/\w+\/";

const tempPodPattern = /https:\/\/(\w+\.)solidweb.org\/|https:\/\/pod\.inrupt\.com\/\w+\//;

 function getPODUrl(provider)
{

  const podURL = provider.match(tempPodPattern)[0];
  return podURL;
    // TODO: create enums for provider types and urls
    /*
    if (provider == "https://pod.inrupt.com")
    {
        return provider + "/" + pseudo + "/";
    }
    */

}


// Upload selected files to Pod
function uploadFiles() 
{
    console.log("uploading files ...");
    // const fileList = document.getElementById('file-drop-zone').files;
    for (let file of droppedFiles)
    {
      placeFileInContainer(file, `${MY_POD_URL}`);
        //writeFileToPod(file, `${MY_POD_URL}/${file.name}`, fetch);
    }
}

// Upload File to the targetFileURL.
// If the targetFileURL exists, overwrite the file.
// If the targetFileURL does not exist, create the file at the location.
async function writeFileToPod(file, targetFileURL, fetch ) 
{
    console.log("writing", file.name, "to the POD ...");
    try 
    {
        const savedFile = await overwriteFile(  
            targetFileURL,                              // URL for the file.
            file,                                       // File
            { contentType: file.type, fetch: fetch }    // mimetype if known, fetch from the authenticated session
        );
        console.log(`File saved at ${getSourceUrl(savedFile)}`);
    } 
    catch (error) 
    {
        console.error(error);
    }
}

// Upload file into the targetContainer.
async function placeFileInContainer(file, targetContainerURL) {
  try {
  const savedFile = await saveFileInContainer(
      targetContainerURL,           // Container URL
      file,                         // File 
      { slug: file.name.split('.')[0], 
        contentType: file.type, fetch: fetch }
  );
  console.log(`File saved at ${getSourceUrl(savedFile)}`);
  } catch (error) {
  console.error(error);
  }
}

let dropArea = document.querySelector("#file-drop-zone");
dropArea.addEventListener('drop', handleFileDrop, false);


function handleFileDrop(e)
{
    // e.preventDefault();
    if(e.dataTransfer && e.dataTransfer.files.length != 0)
    {
        droppedFiles = e.dataTransfer.files; //Array of filenames
        console.log("dropped file(s):");
        for (let file of droppedFiles)
        {
            console.log(file.name);
        }
    }
    else
    {
        console.error("drag and drop not supported");
    }

    console.log(e);
    // return false;
}

['dragenter', 'dragover', 'dragleave'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)
});

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight()
{
  dropArea.classList.add('drop-zone-hover');
}

function unhighlight()
{
  dropArea.classList.remove('drop-zone-hover');
}

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

buttonGetFiles.onclick = function() {
  getFiles();
}

explorerGoBackBtn.onclick = function() {
    fileExplorerGoBack()
}

buttonLogin.onclick = function() {  
  loginToInruptDotCom();
};

buttonRead.onclick = function() {  
  readProfile();
};


// const uploadBtn = document.querySelector("#upload-file-btn");

