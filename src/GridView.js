import React, {useEffect, useState} from "react";

// Import from "@inrupt/solid-client-authn-browser"
import {
    fetch
  } from '@inrupt/solid-client-authn-browser';

  // Import from "@inrupt/solid-client"
import {
    getFile,
  } from '@inrupt/solid-client';

// import {Shape, Card, Row, Col, CardGroup, Image, Container} from 'react-bootstrap';

import {
ImageList,
ImageListItem,
ImageListItemBar} from '@material-ui/core';


// import InfoIcon from '@material-ui/icons/Info';
import FolderIcon from '@material-ui/icons/Folder';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

import "./GridView.css";


function GridView(props){
    let files = props.files;
    let openFolder = props.openFolder;
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        getEntriesFromFiles(files)
    }, [files]);

    function isFolder(url){
        return url.endsWith("/");
    }

    function isImage(url){
       return url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".png");
    }

    function getName(url){
        let regex = /^https:\/\/pod\.inrupt\.com(\/\w+)*\/(\w+)/;
        const match = url.match(regex);
        // console.log(match);
        return match[match.length - 1];
    }

    async function getEntriesFromFiles(files) 
    {
        // console.log("Fetching");
        // console.log(files);
        let processedUrls = [];

        for (const entry of files) 
        {
            // console.log(entry);
            let processedEntry = {
                url: entry.url,
                shortName: getName(entry.url),
                isFolder: isFolder(entry.url),
                imageUrl: null,
            };

            processedUrls.push(processedEntry);

            if (isImage(processedEntry.url)) 
            {
                let raw = await getFile(processedEntry.url, { fetch: fetch });
                let imageUrl = URL.createObjectURL(raw);
                processedEntry.imageUrl = imageUrl;
            }
        }

        setEntries(processedUrls);
    }


    function renderEntry(folderEntry){
        let result = null;
        // console.log("imageUrl: " + folderEntry.imageUrl);
        
        // folders
        if(folderEntry.isFolder)
        {
            // use ...background: 'grey'.. for debugging
            result = [<FolderIcon key="1" style={{margin: "-20px", color: '#ffdd99', fontSize: 160 }}
            onClick={() => openFolder(folderEntry.url)}/>, 
            <p key="2">{folderEntry.shortName}</p>];
            // <div className="folder" ></div>;
        }
        // only image files
        else if(folderEntry.imageUrl)
        {
            result = [<img key="1" src={folderEntry.imageUrl} alt={folderEntry.imageUrl}/>,
                      <ImageListItemBar key="2" title={folderEntry.shortName}
                            // subtitle={<span>url: {folderEntry.url}</span>}
                            // actionIcon={
                            // <IconButton aria-label={`info about ${folderEntry.shortName}`}>
                            //     <InfoIcon/>
                            // </IconButton>
                            // }
                       />];
            
        }
        // any other file aside of folders and images
        else
        {
            result = [<InsertDriveFileIcon key="1" color="action" style={{ margin: "-10px" , fontSize: 140 }}
            onClick={() => alert("Can't open this file type.")}/>,
            <p key="2">{folderEntry.shortName}</p>];
        }

        return result;
    }

    return(
        <div className="grid-view">
            <ImageList style={{textAlign: "center"}} cols={2}>
                {entries.map((folderEntry, index) => (
                    <ImageListItem key={index}>
                        {renderEntry(folderEntry)}
                    </ImageListItem>
                ))}
            </ImageList>
        </div>  
    );
}


export default GridView;