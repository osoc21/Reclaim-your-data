import React, {useEffect, useState, useRef} from "react";
import {fetch} from '@inrupt/solid-client-authn-browser';
import {getFile,    overwriteFile} from '@inrupt/solid-client';
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
    const [entries, setEntries] = useState([]);
    let [openImageUrl, setOpenImageUrl] = useState("");
    let currentPath = props.currentPath;
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

    /**
     * Gets the name of the deepest folder or file in the url.
     * @param {String} url 
     * @returns {String} name of the deepest folder or file in the url
     */
    function getName(url) {
        let regex = /^https:\/\/pod\.inrupt\.com(\/\w+)*\/(\w+)/;
        const match = url.match(regex);
        // get last matched part in order to support nested folders
        return match[match.length - 1];
    }

    /**
     * Sorts files by descending dates
     * @param {FileList} files - list of files
     * @returns {FileList} sorted list of files
     */
    function sortByDate(files) {
        return files.sort((a, b) => b.date - a.date);
    }


    async function readMetadataFile(){
        let dummyMetadataFile = new File([], "metadata.json", {
            type: "application/json"
        }); 
        console.log(currentPath + dummyMetadataFile.name);
        let metadataFile = await getFile(currentPath + dummyMetadataFile.name, {fetch: fetch});
        let fileContent = await metadataFile.text();
        const parsedContent = JSON.parse(fileContent);

        if(parsedContent.length > 0){
            console.log("fetchingImageData");
            await fetchImageData(parsedContent);
            await setEntries(parsedContent);
        } 
 
        sortByDate(parsedContent);
        

    }

    /**
     * Gets image file URL (Blob) and data like EXIF DateTime and potentially location from images stored on the Solid pod.
     * @param {Object} processedEntries 
     */
    async function fetchImageData(processedEntries) {
        for (const entry of processedEntries) {
            if (isImage(entry.url)) {
                console.log("fetching EXIF");
                let raw = await getFile(entry.url, {fetch: fetch});
                entry.imageUrl = URL.createObjectURL(raw);

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
        if ((!folderEntry.isFolder) && folderEntry.imageUrl) {

            let url = folderEntry.imageUrl;

            return (<ImageListItem key={idx}>
                <img onLoad={updateLoadingAnim} loading="lazy" src={url} 
                alt={url} onClick={(e) => {setOpenImageUrl(url)}}/>
            </ImageListItem>);
        }

        return null;
    }

    function handleImageModalClose()
    {
        setOpenImageUrl("");
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


    function showOpenImage()
    {
        if (openImageUrl)
        {
            return (<Dialog style={{margin: "auto", 
                    display: "flex", justifyContent: "center", 
                    width:"100vw", height:"100vh"}}
                    TransitionComponent={Transition}
                    open={() => {return openImageUrl !== ""}}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description">
                        <DialogTitle onClose={handleImageModalClose}>
                            &nbsp;
                        </DialogTitle>
                        <DialogContent style={{display:"flex", justifyContent:"center"}}>
                            <img src={openImageUrl} alt={openImageUrl} style={{maxWidth:"100%", maxHeight: "100%"}}/>
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
                {entries.map((folderEntry, index) => renderEntry(folderEntry, index))}
                {showOpenImage()}
            </ImageList>
        </div>
    );
}

export default GridView;