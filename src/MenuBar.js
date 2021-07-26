
import React from "react";
import {AppBar, Toolbar, Typography} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';

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
                    await gotoScreen('/upload', null, false)
                }}>
                    <AddIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default MenuBar;