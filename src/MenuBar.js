
import React from "react";
import {AppBar, Toolbar, Typography} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';

/**
 * The MenuBar component represent a sticky bar at the top of the app, including
 * a label and ideally a logo in the future. The bar should also include quick access 
 * functionnalities, which are currently limited to a button opening the file upload page.
 * @param {[type]} props [description]
 */
function MenuBar(props) {
    let classes = props.classes;
    let gotoScreen = props.gotoScreen;

    return (
        <AppBar position="sticky" className={classes.appBar}>
            <Toolbar>
                <Typography variant="h6" color="inherit">
                    WePod
                </Typography>
                <IconButton style={{color: "white"}} className={classes.topBarRightElem} edge="start"
                            aria-label="menu" onClick={async () => {
                    await gotoScreen('/upload')
                }}>
                    <AddIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default MenuBar;