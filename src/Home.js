
import FileExplorer from "./FileExplorer";
import FileUpload from "./FileUpload";
import Profile from "./Profile";
import Contacts from "./Contacts";
import Albums from "./Albums";
import ContactDetails from "./ContactDetails";
import BottomNavBar from "./BottomNavBar";
import MenuBar from "./MenuBar";
import Notification from "./Notification";

import React, {useState} from "react";
import CircularProgress from '@material-ui/core/CircularProgress';

import { Switch, Route } from "react-router-dom";


function Home(props) {
    let [notifMsg, setNotifMsg] = useState("");
    let [notifType, setNotifType] = useState("info");
    let [loadingAnim, setLoadingAnim] = useState(false); // when first loading, show anim
    let [urlHiddenParams, setUrlHiddenParams] = useState([]);

    let webId = props.webId;
    let podUrl = props.podUrl;
    let explorerPath = props.explorerPath;
    let setExplorerPath = props.setExplorerPath;
    let history = props.history;

    const classes = props.classes;

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    async function gotoScreen(screenPath, hiddenParams = null, updateHiddenParamsBefore = true) {
        // By default, we update the hidden params before redirecting.
        // This way, the newpage will have the proper parameters set before rendering
        if (updateHiddenParamsBefore) {
            await setUrlHiddenParams(hiddenParams);
        }
        await setLoadingAnim(false); // always cancel loading anim when switching screen
        history.push(`${screenPath}`);

        // Some screens rely on hidden params as props, hence they will show an error
        // if we change the hidden param before changing location (since everything is reference in JS).
        // In that case, we can avoid the problem by setting updateHiddenParamsBefore to false,
        // hence updating such prop after the screen change.
        if (!updateHiddenParamsBefore) {
            await setUrlHiddenParams(hiddenParams);
        }
    }

    function showLoadingAnimation() {
        if (loadingAnim) {
            return <CircularProgress color="secondary" size={100}
                                     style={{zIndex: 1700, opacity: ".7", position: "fixed", top: "45vh"}}/>
        }
    }


    return (<>
        {showLoadingAnimation()}
        <MenuBar classes={classes} history={history} gotoScreen={gotoScreen}/>
        <Notification setNotifMsg={setNotifMsg} notifMsg={notifMsg} notifType={notifType}/>
        <div className="content">
            <Switch>
                <Route exact path="/upload">
                    <FileUpload explorerPath={explorerPath} setNotifMsg={setNotifMsg}
                                setNotifType={setNotifType} setLoadingAnim={setLoadingAnim}/>
                </Route>
                <Route exact path="/profile">
                    <Profile webId={webId} podUrl={podUrl}/>
                </Route>
                <Route exact path="/contacts">
                    <Contacts gotoScreen={gotoScreen} podUrl={podUrl}/>
                </Route>
                <Route path="/contacts/:username"
                       render={(props) => <ContactDetails urlHiddenParams={urlHiddenParams} realProps={props}/>}/>
                <Route exact path="/albums">
                    <Albums/>
                </Route>
                <Route exact path="/">
                    <FileExplorer podUrl={podUrl} explorerPath={explorerPath}
                                  setExplorerPath={setExplorerPath} setLoadingAnim={setLoadingAnim}/>
                </Route>
            </Switch>
        </div>
        <BottomNavBar classes={classes} gotoScreen={gotoScreen}/>
    </>);
}

export default Home;