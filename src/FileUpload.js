
import React, {useState} from "react"

// Import from "@inrupt/solid-client"
import {
  saveFileInContainer,
  getSourceUrl
} from '@inrupt/solid-client';

// Import from "@inrupt/solid-client-authn-browser"
import {
  fetch
} from '@inrupt/solid-client-authn-browser';


function FileUpload(props)
{
	let currentPath = props.currentPath;
	let [selectedFiles, setSelectedFiles] = useState([]);


	function upload() 
	{
	    if(selectedFiles.length != 0)
	    {
	        console.log("selected file(s):");
	        for (let file of selectedFiles)
	        {
	            console.log(file.name);
	        }
	    }

	    console.log("uploading files ...");
	    for (let file of selectedFiles)
	    {
	      	placeFileInContainer(file, currentPath);
	    }
	}


	/**
	 * Upload file into the targetContainer.
	 * @param  {[type]} file               [description]
	 * @param  {[type]} targetContainerURL [description]
	 * @return {[type]}                    [description]
	 */
	async function placeFileInContainer(file, targetContainerURL) {
	  try 
	  {
  		const savedFile = await saveFileInContainer(
	      targetContainerURL,           // Container URL
	      file,                         // File 
	      { slug: file.name, // file.name.split('.')[0]
	        contentType: file.type, fetch: fetch }
	  	);
	  	console.log(`File saved at ${getSourceUrl(savedFile)}`);
	  } 

	  catch (error) 
	  {
	  	console.error(error);
	  	alert("file '" + file.name + "' already exists.");
	  }
	}

	function openFileSelectionWindow()
	{
		document.querySelector("#file-input").click();
	}


	function selectedFilesToReact()
	{
		let res = [];

		if (selectedFiles.length > 0)
		{
			for (let file of selectedFiles)
			{
				res.push(file.name);
			}
		}

		return res;
	}



	function showSelectedFiles()
	{
		return (
			<div className="SelectedFilesDiv">
				<p>Selected files:</p>
				<ul>{selectedFilesToReact()}</ul>
			</div>
		);
	}


	return (
		<div>
			<button className="Button" onClick={openFileSelectionWindow}>Add file(s)</button>
			{showSelectedFiles()}
			<button className="Button" onClick={upload}>Upload</button>
			<input id="file-input" type="file" name="fileUploadInput"
			className="file-selection"
			onChange={(e) => {setSelectedFiles(e.target.files);
				console.log("target files:");
				console.log(e.target.files);} }/>
		</div>
	);
}


export default FileUpload;
