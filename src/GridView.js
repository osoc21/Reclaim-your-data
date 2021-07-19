import React, {useEffect, useState} from "react";

// Import from "@inrupt/solid-client-authn-browser"
import {fetch} from '@inrupt/solid-client-authn-browser';

// Import from "@inrupt/solid-client"
import {getFile, overwriteFile, saveFileInContainer,} from '@inrupt/solid-client';

// import {Shape, Card, Row, Col, CardGroup, Image, Container} from 'react-bootstrap';
import {ImageList, ImageListItem} from '@material-ui/core';


// import InfoIcon from '@material-ui/icons/Info';
import dms2dec from "dms2dec";
import "./GridView.css";
import exif from 'exif-js';


function GridView(props) {
    let files = props.files;
    let openFolder = props.openFolder;
    let setLoadingAnim = props.setLoadingAnim;
    const [entries, setEntries] = useState([]);
    let currentPath = props.currentPath;
    const [metadataFileExists, setMetadataFileExists] = useState(false);

    function isFolder(url) {
        return url.endsWith("/");
    }

    function isImage(url) {
        return url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".png");
    }

    function getName(url) {
        let regex = /^https:\/\/pod\.inrupt\.com(\/\w+)*\/(\w+)/;
        const match = url.match(regex);
        return match[match.length - 1];
    }

    async function getEntriesFromFiles(files) {
        // console.log("Fetching");
        // console.log(files);
        let processedEntries = [];

        for (const entry of files) {
            // console.log(entry);

            if (entry.url.endsWith("metadata.json")) {
                await setMetadataFileExists(true);
            }

            let processedEntry = {
                url: entry.url,
                shortName: getName(entry.url),
                isFolder: isFolder(entry.url),
                imageUrl: null,
                date: null
            };

            processedEntries.push(processedEntry);
        }
        await getExifData(processedEntries);
        await setEntries(processedEntries);
        sortByDate(processedEntries);
    }

    async function getExifData(processedEntries) {
        for (const entry of processedEntries) {
            if (isImage(entry.url)) {
                let raw = await getFile(entry.url, {fetch: fetch});
                entry.imageUrl = URL.createObjectURL(raw);

                let arrayBuffer = await new Response(raw).arrayBuffer();
                let exifData = exif.readFromBinaryFile(arrayBuffer);
                if (exifData) {
                    let dateTime = exifData.DateTime ? exifData.DateTime.replace(":", "/").replace(":", "/") : undefined
                    //let latitude = exifData.GPSLatitude && exifData.GPSLatitude[0] ? exifData.GPSLatitude : null
                    //let longitude = exifData.GPSLongitude && exifData.GPSLongitude[0] ? exifData.GPSLongitude : null
                    console.log(`exifdata`);
                    console.log(dateTime);
                    entry.date = new Date(dateTime);
                    if (exifData.latitude != null && exifData.longitude != null) {
                        // note: the dms2dec lib expects 4 parameters, but we haven't found a way to parse if the picture
                        // was taken in the NESW direction, so at the moment it's hardcoded
                        // TODO: extract NESW direction from EXIF data
                        console.log(dms2dec(exifData.latitude, "N", exifData.longitude, "E"));
                    }
                }
            }
        }
    }

    function sortByDate(files) {
        return files.sort((a, b) => b.date - a.date);
    }

    function metadataFile() {
        return new File(["Lorem Ipsum"], "metadata.json", {
            type: "application/json"
        });
    }

    async function updateMedataFile() {
        //
    }

    async function uploadMetadataFile(file, url) {
        console.log(url);

        // TODO: Add check for metadatFileExists here instead

        if (url !== "") {
            if (!metadataFileExists) {
                const savedFile = await saveFileInContainer(
                    url,
                    file,
                    {
                        slug: file.name,
                        contentType: file.type, fetch: fetch
                    }
                );
            } else {
                console.log("wanting to overwrite");
                const savedFile = await overwriteFile(
                    url,
                    file,
                    {
                        slug: file.name,
                        contentType: file.type,
                        fetch: fetch
                    });
                console.log("overwritten");
            }
        }
    }

    useEffect(() => {
        getEntriesFromFiles(files).then(() =>
            uploadMetadataFile(metadataFile(), currentPath));
        console.log(currentPath);
    }, [files, currentPath]);

    function renderEntry(folderEntry, idx) {
        if ((!folderEntry.isFolder) && folderEntry.imageUrl) {
            return (<ImageListItem>
                <img src={folderEntry.imageUrl} alt={folderEntry.imageUrl}/>
            </ImageListItem>);
        }
        return null;
    }

    return (
        <div className="grid-view">
            <ImageList rowHeight={160} cols={3}>
                {entries.map((folderEntry, index) => renderEntry(folderEntry, index))}
            </ImageList>
        </div>
    );
}


export default GridView;