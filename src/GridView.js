
import {METADATA_FILE_NAME} from "./constants";

import React, {useEffect, useState, useRef} from "react";

import {fetch} from '@inrupt/solid-client-authn-browser';
import {getFile, overwriteFile, deleteFile} from '@inrupt/solid-client';

import {ImageList, ImageListItem} from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Container from '@material-ui/core/Container';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Grow from '@material-ui/core/Grow';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';

import dms2dec from "dms2dec";
import "./GridView.css";
import exif from 'exif-js';


/**
 * The GridView component takes care of fetching images from the pod, getting
 * their EXIF data at the same time, and display them in a grid.
 * 
 * @param {[type]} props [description]
 * @returns {JSX.Element}
 */
function GridView(props) {
    let files = props.files;
    let setLoadingAnim = props.setLoadingAnim;
    let fileSelectMode = props.fileSelectMode;
    let fileDeleteTriggered = props.fileDeleteTriggered;
    let setFileDeleteTriggered = props.setFileDeleteTriggered;
    let currentPath = props.currentPath;
    let setNotifMsg = props.setNotifMsg;
    let setNotifType= props.setNotifType;

    const [entries, setEntries] = useState([]);
    let [entriesToDelete, setEntriesToDelete] = useState([]);
    let [openImageEntryIdx, setOpenImageEntryIdx] = useState(null);
    let [parsedMetadata, setParsedMetadata] = useState(null);
    let loadedImagesCounter = useRef(0);
    let nbImages = useRef(0);

    useEffect(() => {
        nbImages.current = 0;
        loadedImagesCounter.current = 0;

        if (currentPath !== "")
        {
            readMetadataFile();
        }
    }, [files]);

    useEffect(() => {
        if (fileDeleteTriggered)
        {
            deleteSelectedFiles();
        }
    }, [fileDeleteTriggered]);

    async function deleteFileFromUrl(fileUrl) {
        try {
            await deleteFile(fileUrl, { fetch: fetch });
            return true;
        } catch (error) {
            console.log("could not delete '", fileUrl, "'");
            //console.log("ERROR CAUGHT:", error);
            // Any error is handled in the UI, no need to print it to the console.
        }
        return false;
    }

    async function deleteSelectedFiles()
    {
        console.log("deleting selected files ...");

        await setLoadingAnim(true);

        let promiseArray = [];

        for (let entry of entries)
        {
            if (entry.isSelected)
            {
                promiseArray.push(deleteFileFromUrl(entry.url));
            }
        }

        let promiseResults = await Promise.all(promiseArray);

        let errorMsg = "";

        for (let i = 0; i < promiseResults.length; ++i) {
            let res = promiseResults[i];

            // promise is false if the delete wasn't successful
            if (!res) {
                errorMsg += "'" + entries[i].shortName + "'";
            }
        }

        await setLoadingAnim(false);

        //there is an error or more
        if (errorMsg !== "") {
            await setNotifType("error");
            await setNotifMsg("Could not delete the following file(s): " + errorMsg);
        } else if (entries.length > 0) {
            await setNotifType("success");
            await setNotifMsg("Files successfully deleted !!");
            // await updateMetadataFile(selectedFiles);
        } else if (entries.length === 0) {
            await setNotifType("info");
            await setNotifMsg("Nothing to delete.");
        }

        // now we set back the flag to false
        await setFileDeleteTriggered(false);

        // remove the elements from the metadata file (which will be updated
        // on the POD afterwards). Requires the parsedMetadata array to be sorted
        // exactly the same way as the entries, otherwise the indexes don't match !!!!!!!!!!
        await setParsedMetadata(parsedMetadata.filter((elem, idx) => {
            return ! entries[idx].isSelected;
        }));

        // remove deleted entries from the array !!
        await setEntries(entries.filter((entry) => {return ! entry.isSelected}));

        let metadataFile = new File(["[]"], METADATA_FILE_NAME, {
            type: "application/json"
        }); 

        // overwrite the old metadata file
        const savedFile = await overwriteFile(
            currentPath + METADATA_FILE_NAME,
            metadataFile,
            {
                slug: METADATA_FILE_NAME,
                contentType: metadataFile.type,
                fetch: fetch
            }
        );

    }


    /**
     * Checks if a url is the url of a folder.
     * @param {String} url 
     * @returns {Boolean}
     */
    function isFolder(url) {
        return url.endsWith("/");
    }

    /**
     * Checks if a url is the url of an image.
     * It currently supports .jpg/.jpeg/.png extentions.
     * @param {String} url 
     * @returns {Boolean}
     */
    function isImage(url) {
        return url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".png");
    }

    /*
     *
     * Gets the name of the deepest folder or file in the url.
     * @param {String} url 
     * @returns {String} name of the deepest folder or file in the url
     */
    // function getName(url) {
    //     let regex = /^https:\/\/pod\.inrupt\.com(\/\w+)*\/(\w+)/;
    //     const match = url.match(regex);
    //     // get last matched part in order to support nested folders
    //     return match[match.length - 1];
    // }


    /**
     * Sorts files by descending dates
     * @param {FileList} files - list of files
     * @returns {FileList} sorted list of files
     */
    function sortByDate(files) {
        return files.sort((a, b) => b.date - a.date);
    }


    async function readMetadataFile(){
        // initialize the file with '[]' as text content so that
        // the file is a valid JSON file
        let dummyMetadataFile = new File(["[]"], METADATA_FILE_NAME, {
            type: "application/json"
        }); 
        console.log(currentPath + dummyMetadataFile.name);
        let metadataFile = dummyMetadataFile;

        try
        {
            metadataFile = await getFile(currentPath + dummyMetadataFile.name, {fetch: fetch});
            let fileContent = await metadataFile.text();
            const parsedContent = JSON.parse(fileContent);

            if(parsedContent.length > 0){
                console.log("fetchingImageData");
                await fetchImageData(parsedContent);
                let sortedContent = sortByDate(parsedContent);
                // use same order as entries, but don't include the isSelected field !!
                await setParsedMetadata(sortedContent);
                // add the isSelected field to each entry before storing the array
                initEntrySelectStatus(sortedContent);
                await setEntries(sortedContent);
            } 
     
        }
        // the metadata file does not exist, so we use the dummy
        // metadata file and write it to the POD
        catch(error)
        {
            const savedFile = await overwriteFile(currentPath + metadataFile.name,
            metadataFile,
            {
                slug: metadataFile.name,
                contentType: metadataFile.type,
                fetch: fetch
            });
        }

    }

    /**
     * Sets a isSelected attribute to each entry of the array passed as argument.
     * @param  {[Object]} processedEntries Array containing entries, objects to which we can add attributes
     * @return {void} Nothing
     */
    function initEntrySelectStatus(processedEntries)
    {
        for (const entry of processedEntries) {
            if (isImage(entry.url)) {
                entry.isSelected = false;
            }
        }
    }

    /**
     * Gets image file URL (Blob) and data like EXIF DateTime and potentially location from images stored on the Solid pod.
     * @param {Object} processedEntries 
     */
    async function fetchImageData(processedEntries) {
        for (const entry of processedEntries) {
            if (isImage(entry.url)) {
                let raw = await getFile(entry.url, {fetch: fetch});
                entry.imageUrl = URL.createObjectURL(raw);
                

                // console.log("fetching EXIF");
                if(entry.date === null){
                    let arrayBuffer = await new Response(raw).arrayBuffer();
                    let exifData = exif.readFromBinaryFile(arrayBuffer);
                    if (exifData) {
                        let dateTime = exifData.DateTime ? exifData.DateTime.replace(":", "/").replace(":", "/") : undefined

                        /*
                        This is also the place where you would extract other EXIF data like location.
                         */

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
    }

    /** If called with a counter of loaded images higher than the size of the entries array,
     * stops the loading animation.
     */
    function updateLoadingAnim() {
        loadedImagesCounter.current += 1;
        if (loadedImagesCounter >= nbImages) {
            setLoadingAnim(false);
        }
    }


    /**
     * Makes an ImageListItem for each image.
     * @param {Object} folderEntry - entry that needs to be rendered.
     * @param {Number} idx - index of entry in array is used as key for React list item.
     * @returns {ReactComponent} 
     */
    function renderEntry(folderEntry, idx) {
        function toggleSelectedEntryAt(idx)
        {
            let prevEntries = [ ...entries]; // shallow copy
            prevEntries[idx].isSelected = ! prevEntries[idx].isSelected;
            setEntries(prevEntries);
        }

        function handleRenderedEntryClick()
        {
            if (fileSelectMode)
            {
                toggleSelectedEntryAt(idx);
            }
            else
            {
                setOpenImageEntryIdx(idx);
            }
        }

        if ((!folderEntry.isFolder) && folderEntry.imageUrl) {

            let url = folderEntry.imageUrl;
            let selected = folderEntry.isSelected;
            let borderStyle = (selected ? "4px solid cyan" : "4px solid transparent");

            return (
                    <ImageListItem key={idx} style={{border: borderStyle}} >
                        <img onLoad={updateLoadingAnim} loading="lazy" src={url} 
                        alt={url} onClick={handleRenderedEntryClick}/>
                    </ImageListItem>
                   );
        }

        return null;
    }


    const styles = (theme) => ({
      root: {
        margin: 0,
        padding: theme.spacing(2),
      },
      closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
      },
    });

    const DialogTitle = withStyles(styles)((props) => {
      const { children, classes, onClose, ...other } = props;
      return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
          <Typography variant="h6">{children}</Typography>
          {onClose ? (
            <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
              <CloseIcon color="secondary"/>
            </IconButton>
          ) : null}
        </MuiDialogTitle>
      );
    });

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Grow timeout={6000} ref={ref} {...props} />;
    });


    /**
     * Sets the image entry index state to null, closing the image details view.
     * @return {[type]} [description]
     */
    async function handleImageModalClose()
    {
        await setOpenImageEntryIdx(null);
    }

    /**
     * Simple convenience function that returns true if openImageEntryIdx
     * is defined and not null.
     * @return {[type]} A boolean telling if openImageEntryIdx is defined and not null
     */
    function canOpenImageDetail()
    {
        // zero is implicitely converted to false
        // but zero is a valid index !!! so check for that particular case too
        if (openImageEntryIdx || openImageEntryIdx === 0)
        {
            return true;
        }
        return false;
    }


    function showOpenImage()
    {
        if (canOpenImageDetail())
        {
            let entry = entries[openImageEntryIdx];
            let imgUrl = entry.imageUrl;
            let imgName = entry.shortName;
            let imgDate = entry.date;

            return (<Dialog style={{margin: "auto", 
                    display: "flex", justifyContent: "center", 
                    width:"100vw", height:"100vh"}}
                    TransitionComponent={Transition}
                    open={() => {return canOpenImageDetail()}}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description">
                        <DialogTitle onClose={handleImageModalClose}>
                            {imgName ? <p>{imgName}</p> : <>&nbsp;</>}
                        </DialogTitle>
                        <DialogContent style={{display:"flex", justifyContent:"center"}}>
                            <img src={imgUrl} alt={imgUrl} style={{maxWidth:"80%", maxHeight: "80%"}}/>
                        </DialogContent>
                        <DialogContent dividers style={{overflow: "hidden"}}>
                            {imgDate ? <p>Date: {imgDate.toString()}</p> : <p>No date</p>}
                        </DialogContent>
                    </Dialog>);
        }

        return null;
    }

    /**
     * Renders the ImageList with ImageListItems to be shown in the app.
     */
    return (
        <div className="grid-view">
            <ImageList rowHeight={160} cols={4}>
                {console.log("entries before render:", entries)}
                {entries.length > 0 ? entries.map((folderEntry, index) => renderEntry(folderEntry, index)) :
                    <h4><i>Nothing to display</i></h4>}
                {showOpenImage()}
            </ImageList>
        </div>
    );
}

export default GridView;