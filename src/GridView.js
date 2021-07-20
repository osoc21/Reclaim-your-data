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
    let setLoadingAnim = props.setLoadingAnim;
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        // here we use props prefix, otherwise setLoadingAnim is not recognized
        getEntriesFromFiles(files);
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

        await setEntries(processedUrls);
    }

    // TODO: move this to utils.js or other appropriate file
    function renderEntry(folderEntry, idx)
    {
        if((! folderEntry.isFolder) && folderEntry.imageUrl)
        {
            return (<ImageListItem>
                        <img loading="lazy" src={folderEntry.imageUrl} alt={folderEntry.imageUrl}/>
                    </ImageListItem>);
        }
        return null;
    }

    function _renderEntryOLD(folderEntry){
        let result = null;
        // console.log("imageUrl: " + folderEntry.imageUrl);
        
        // folders
        if(folderEntry.isFolder)
        {
            // use ...background: 'grey'.. for debugging
            result = [<FolderIcon key="1" style={{margin: "-20px", color: '#ffdd99', fontSize: 160 }}
            onClick={() => openFolder(folderEntry.url)}/>, 
            <p key="2">{folderEntry.shortName}</p>];
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
            <ImageList rowHeight={122} cols={4}>
                {entries.map( (folderEntry, index) => renderEntry(folderEntry, index) )}
            </ImageList>
        </div>  
    );
}


export default GridView;