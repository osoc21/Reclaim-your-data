
import {GITHUB_PAGE_LINK} from "./constants";

import React from "react";
import {AppBar, Toolbar, Typography} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import GitHubIcon from '@material-ui/icons/GitHub';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

/**
 * The MenuBar component represent a sticky bar at the top of the app, including
 * a label and ideally a logo in the future. The bar should also include quick access 
 * functionnalities, which are currently limited to a button opening the file upload page.
 * @param {[type]} props [description]
 */
function MenuBar(props) {
    let classes = props.classes;
    let gotoScreen = props.gotoScreen;
    let fileSelectMode = props.fileSelectMode;
    let setFileSelectMode = props.setFileSelectMode;
    let setFileDeleteTriggered = props.setFileDeleteTriggered;

    /* The anchor code was taken from material-ui Menu component examples */

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="sticky" className={classes.appBar}>
            <Toolbar>
                <Typography variant="h6" color="inherit">
                    WePod
                </Typography>
                <GitHubIcon style={{cursor: "pointer"}} className={classes.topBarRightFirstElem} 
                onClick={event =>  window.open(GITHUB_PAGE_LINK, '_blank', "", false) }/>
                <IconButton style={{color: "white", marginLeft:"10px"}} edge="start"
                    aria-label="menu" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                  <MoreVertIcon/>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => {handleClose(); gotoScreen('/upload');}}>Upload</MenuItem>
                  <MenuItem onClick={() => {handleClose(); setFileSelectMode(! fileSelectMode)}}>Modify</MenuItem>
                </Menu>
                {fileSelectMode ? <IconButton style={{color: "white"}} edge="start"
                            aria-label="menu" onClick = {() => {setFileSelectMode(false);
                                setFileDeleteTriggered(true);}}>
                    <DeleteIcon/>
                </IconButton> : null}
                {/*<IconButton style={{color: "white", marginLeft: "10px"}} edge="start"
                            aria-label="menu" onClick={async () => {
                    await gotoScreen('/upload')
                }}>
                    <AddIcon/>
                </IconButton>
                <IconButton style={{color: "white"}} edge="start"
                            aria-label="menu" onClick = {() => {setFileSelectMode(! fileSelectMode)}}>
                    <DeleteIcon/>
                </IconButton>*/}
            </Toolbar>
        </AppBar>
    );
}

export default MenuBar;