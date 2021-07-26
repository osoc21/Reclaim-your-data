
import React from "react";
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

/**
 * The Notification component implements the UI and logic for notifications,
 * displaying the proper notification message prop depending on the notification type prop.
 * Note that the notification type should be a string accepted by the material-ui Alert component.
 *
 * @see {@link https://material-ui.com/components/alert/}
 * @param {[type]} props A valid Alert type (string), a notification message (string) and a setter function
 * for the message.
 */
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