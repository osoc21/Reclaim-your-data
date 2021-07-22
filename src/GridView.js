import React, {useEffect, useState} from "react";
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

    useEffect(() => {
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
        await getExifData(processedEntries);
        await setEntries(processedEntries);
        sortByDate(processedEntries);
        //await uploadMetadataFile(processedEntries, currentPath);
    }

    async function getExifData(processedEntries) {
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
            }
        }
    }

    function sortByDate(files) {
        return files.sort((a, b) => b.date - a.date);
    }

    function makeMetadataFile(jsObjects) {
        const jsonString = `${JSON.stringify(jsObjects)}`;
        return new File([jsonString], "metadata.json", {
            type: "application/json"
        });
    }

    async function updateMedataFile(path, metadataFile, contentToAdd) {
        // FOR SOME LOVELY REASON, YOU HAVE TO PASS path + file.name to getFile, instead of a string consisting of the resource you want to access
        // THUS, file PARAMETER IS MANDATORY HERE
        let file = await getFile(path + metadataFile.name, {fetch: fetch});
        let fileContent = [];
        file.text().then(text => {fileContent = JSON.parse(text)});
        // TODO: fileContent.push(contentToAdd);
    }

    async function uploadMetadataFile(processedEntries, url) {
        if (url !== "" && processedEntries.length > 0) {
            let file = makeMetadataFile(processedEntries);
            //await updateMedataFile(url, file);
            const savedFile = await overwriteFile(
                url + file.name,
                file,
                {
                    slug: file.name,
                    contentType: file.type,
                    fetch: fetch
                });
        }
    }

    useEffect(() => {
        getEntriesFromFiles(files)
    }, [files]);


    function renderEntry(folderEntry, idx) {
        if ((!folderEntry.isFolder) && folderEntry.imageUrl) {
            return (<ImageListItem>
                <img loading="lazy" src={folderEntry.imageUrl} alt={folderEntry.imageUrl}/>
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