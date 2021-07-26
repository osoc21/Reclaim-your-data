
import React, {useState} from "react";
import {BottomNavigation, BottomNavigationAction} from '@material-ui/core';
import PhotoIcon from '@material-ui/icons/Photo';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import FolderIcon from '@material-ui/icons/Folder';
import GroupIcon from '@material-ui/icons/Group';

function BottomNavBar(props) {
    let classes = props.classes;
    let btnClass = classes.bottomNavBtn;
    let gotoScreen = props.gotoScreen;
    let [location, setLocation] = useState("/");

    // NOTICE: we false as last parameter of gotoScreen, because we consider all the navigation tabs independent
    // and as such we want hidden parameters to be updated after the screen change to not cause errors
    const handleChange = async (event, newValue) => {
        await setLocation(newValue);
        await gotoScreen(newValue, null, false)
    };

    return (
        <BottomNavigation className={classes.appBar} value={location} onChange={handleChange}
                          showLabels style={{position: 'fixed', width: "100%", bottom: 0}}>
            <BottomNavigationAction className={btnClass} value="/" label="Photos" icon={<PhotoIcon/>}/>
            <BottomNavigationAction className={btnClass} value="/albums" label="Albums" icon={<FolderIcon/>}/>
            <BottomNavigationAction className={btnClass} value="/profile" label="Profile" icon={<AccountBoxIcon/>}/>
            <BottomNavigationAction className={btnClass} value="/contacts" label="Contacts" icon={<GroupIcon/>}/>
        </BottomNavigation>
    );
}

export default BottomNavBar;