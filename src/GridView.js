import React, {useEffect, useState, useRef} from "react";
import {fetch} from '@inrupt/solid-client-authn-browser';
import {getFile, overwriteFile, saveFileInContainer, deleteFile} from '@inrupt/solid-client';
import {ImageList, ImageListItem} from '@material-ui/core';
import dms2dec from "dms2dec";
import "./GridView.css";
import exif from 'exif-js';

function GridView(props) {
    let files = props.files;
    let openFolder = props.openFolder;
    let setLoadingAnim = props.setLoadingAnim;
    const [entries, setEntries] = useState([]);
    let currentPath = props.currentPath;
    let loadedImagesCounter = useRef(0);
    let nbImages = useRef(0);

    useEffect(() => {
        nbImages.current = 0;
        loadedImagesCounter.current = 0;
        // here we use props prefix, otherwise setLoadingAnim is not recognized
        getEntriesFromFiles(files);
    }, [files]);

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

    function sortByDate(files) {
        return files.sort((a, b) => b.date - a.date);
    }

    async function getEntriesFromFiles(files) {
        let processedEntries = [];

        for (const entry of files) {
            let processedEntry = {
                url: entry.url,
                shortName: getName(entry.url),
                isFolder: isFolder(entry.url),
                imageUrl: null,
                date: null
            };

            processedEntries.push(processedEntry);
        }
        await fetchImageData(processedEntries);
        await setEntries(processedEntries);
        sortByDate(processedEntries);
        //await uploadMetadataFile(processedEntries, currentPath);
    }

    async function fetchImageData(processedEntries) {
        for (const entry of processedEntries) {
            if (isImage(entry.url)) {
                console.log(entry.url);
                let raw = await getFile(entry.url, {fetch: fetch});
                entry.imageUrl = URL.createObjectURL(raw);

                let arrayBuffer = await new Response(raw).arrayBuffer();
                let exifData = exif.readFromBinaryFile(arrayBuffer);
                if (exifData) {
                    let dateTime = exifData.DateTime ? exifData.DateTime.replace(":", "/").replace(":", "/") : undefined
                    //let latitude = exifData.GPSLatitude && exifData.GPSLatitude[0] ? exifData.GPSLatitude : null
                    //let longitude = exifData.GPSLongitude && exifData.GPSLongitude[0] ? exifData.GPSLongitude : null
                    //console.log(`exifdata`);
                    //console.log(dateTime);
                    entry.date = new Date(dateTime);
                    if (exifData.latitude != null && exifData.longitude != null) {
                        // note: the dms2dec lib expects 4 parameters, but we haven't found a way to parse if the picture
                        // was taken in the NESW direction, so at the moment it's hardcoded
                        // TODO: extract NESW direction from EXIF data
                        //console.log(dms2dec(exifData.latitude, "N", exifData.longitude, "E"));
                    }
                }
                // sortByDate(processedEntries);
            }
        }
    }

    /** If called with a counter of loaded images higher than the size of the entries array,
     * stops the loading animation. */
    function updateLoadingAnim() {
        loadedImagesCounter.current += 1;
        if (loadedImagesCounter >= nbImages) {
            setLoadingAnim(false);
        }
    }

    function renderEntry(folderEntry, idx) {
        if ((!folderEntry.isFolder) && folderEntry.imageUrl) {
            return (<ImageListItem key={idx}>
                <img onLoad={updateLoadingAnim} loading="lazy" src={folderEntry.imageUrl} alt={folderEntry.imageUrl}/>
            </ImageListItem>);
        }
        return null;
    }

    return (
        <div className="grid-view">
            <ImageList rowHeight={160} cols={4}>
                {entries.map((folderEntry, index) => renderEntry(folderEntry, index))}
            </ImageList>
        </div>
    );
}

export default GridView;