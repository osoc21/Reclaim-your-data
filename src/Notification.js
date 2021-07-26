
import React from "react";
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

function Notification(props) {
    let notifMsg = props.notifMsg;
    let notifType = props.notifType;
    let setNotifMsg = props.setNotifMsg;

    return (<Collapse style={{overflowY: "scroll"}} in={(notifMsg !== "" && notifType !== "")}>
        <Alert severity={notifType} action={
            <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                    setNotifMsg("");
                }}>
                <CloseIcon fontSize="inherit"/>
            </IconButton>}>
            {notifMsg}
        </Alert>
    </Collapse>);
}

export default Notification;