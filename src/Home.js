
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


/**
 * The Home component handles the application logic and UI once logged-in to access the POD. The component
 * relies on react router to switch between pages, with the root being the image gallery. The component
 * also contains menu bars to interact with the content, and can display notifications and loading animations.
 *
 * @component
 * @param {[type]} props [description]
 */
function Home(props) {
    /**
     * State containing notification messages.
     */
    let [notifMsg, setNotifMsg] = useState("");

    /**
     * State containing the notification type, which should be a string value accepted
     * by the material UI Alert component ("error", "info", "warning", "success").
     *
     * @see {@link https://material-ui.com/components/alert/}
     * 
     */
    let [notifType, setNotifType] = useState("info");

    /**
     * Boolean state telling whether or not a loading animation is to be displayed.
     */
    let [loadingAnim, setLoadingAnim] = useState(false);

    /**
     * State containing hidden routing parameters.
     */
    let [routingHiddenParams, setRoutingHiddenParams] = useState([]);

    let webId = props.webId;
    let podUrl = props.podUrl;
    let explorerPath = props.explorerPath;
    let setExplorerPath = props.setExplorerPath;
    let history = props.history;

    const classes = props.classes;

   
    /**
     * This function changes the route that should be taken by the router by appending
     * the new path to the browser history, and cancels any loading animation running.
     * Hidden parameters can also be passed to the function
     * without being exposed in the url (displayed in the browser). This is particularly useful
     * when the data contains sepcial characters that could mess with the routing (e.g. ':', '#' or '/')
     * or when the parameter is too long and makes it difficult to debug the routing by looking at the 
     * browser url. Notice that if hiddenParams is not empty, it means that the page we want to load
     * expects these parameters to be set beforehand, hence we first set the hidden parameters
     * before initiating the page switch. On the other hand, if the hiddenParams is null,
     * then we first want to render the new page before assigning null to the routingHiddenParams state.
     * This is because the previous page might have a prop that references the routingHiddenParam state,
     * hence setting it to null while the component is still there would generate an error.
     * @param  {[type]}  screenPath               [description]
     * @param  {[type]}  hiddenParams             [description]
     * @param  {Boolean} updateHiddenParamsBefore [description]
     * @return {[type]}                           [description]
     */
    async function gotoScreen(screenPath, hiddenParams = null) {
        // hiddenParams is defined and not null
        // ==> update the state before moving to the new page
        if (hiddenParams) {
            await setRoutingHiddenParams(hiddenParams);
        }

        await setLoadingAnim(false); // always cancel loading anim when switching screen
        history.push(`${screenPath}`);

        // hiddenParams is null, so we set it after the page change
        if (! hiddenParams) {
            await setRoutingHiddenParams(null);
        }
    }

    /**
     * Displays a loading animation centered on the screen if the loadingAnim state is set to true.
     * The animation is top level, hence it has a z-index higher than the other components.
     */
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
                       render={(props) => <ContactDetails routingHiddenParams={routingHiddenParams} realProps={props}/>}/>
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