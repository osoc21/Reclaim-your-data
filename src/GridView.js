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

import {Container,
Box,
ImageList,
ImageListItem,
ImageListItemBar,
IconButton} from '@material-ui/core';


import InfoIcon from '@material-ui/icons/Info';

import "./GridView.css";


function GridView(props){
    let files = props.files;
    let folderIcons = [];
    let openLink = props.openLink;
    const [folderImages, setFolderImages] = useState([]);



    function isFolder(url){
        return url.endsWith("/");
    }

    function isImage(url){
        let imageBoolean = url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".png");
        return imageBoolean;
    }

    function getName(url){
        let regex = /^https:\/\/pod\.inrupt\.com(\/\w+)*\/(\w+)/;
        const match = url.match(regex);
        console.log(match);
        return match[match.length - 1];
    }

    async function fetchSomeData(files) {
        console.log("Fetching");
        console.log(files);
        let processedUrls = [];
    
        for (const entry of files) {
          console.log(entry);
          let processedEntry = {
            url: entry.url,
            shortName: getName(entry.url),
            isFolderBoolean: isFolder(entry.url),
            imageUrl: null,
          };
          processedUrls.push(processedEntry);
    
          if (isImage(processedEntry.url)) {
            let raw = await getFile(processedEntry.url, { fetch: fetch });
            let imageUrl = URL.createObjectURL(raw);
            processedEntry.imageUrl = imageUrl;
          }
        }
        setFolderImages(processedUrls);
      }

      useEffect(() => {
        fetchSomeData(props.files)
      }, [props.files]);
    


    function renderEntry(folderEntry){
        let result = null;

        console.log("imageUrl: " + folderEntry.imageUrl);

        if(folderEntry.isFolderBoolean || !isImage(folderEntry.url)){
            result = <p onClick={() => openLink(folderEntry.url)}>
            <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" class="bi bi-folder" viewBox="0 0 16 16">
                <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4H2.19zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707z"/>
            </svg></p>
        } else if(folderEntry.imageUrl){
            result = <img src={folderEntry.imageUrl} alt={folderEntry.imageUrl}/>
            
        } else {
            result =
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-card-image" viewBox="0 0 16 16">
                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z"/>
            </svg>

        }
        return result;
    }

    return(
        <div className="grid-view">
            <ImageList cols={2}>
                {folderImages.map((folderEntry, index) => (
                    <ImageListItem key={index}>
                        {renderEntry(folderEntry)}
                        <ImageListItemBar
                            title={folderEntry.shortName}
                            // subtitle={<span>url: {folderEntry.url}</span>}
                            // actionIcon={
                            // <IconButton aria-label={`info about ${folderEntry.shortName}`}>
                            //     <InfoIcon/>
                            // </IconButton>
                            // }
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </div>  
    );
}


export default GridView;