
import './App.css';
import Login from "./Login";
import Home from "./Home";

import React, {useState, useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";

import {useHistory} from "react-router-dom";

// Style I want for fab, can add more - it's just a JS object
const useStyles = makeStyles({
    fab: {
        position: "fixed",
        right: "10px",
        bottom: "10px",
    },
    topBarRightFirstElem: {
        marginLeft: 'auto',
    },
    appBar: {
        background: 'rgba(0,0,0,0.9)',
    },
    bottomNavBtn: {
        color: "grey",
        "&$selected": {
            color: "red"
        }
    }
});


/**
 * The App component displays a Login page from which the user can login to a POD.
 * One logged-in, the App will display the home screen instead.
 *
 * @component
 */
function App() {
    /**
     * State telling if the user is logged in or not.
     */
    let [loggedIn, setLoggedIn] = useState(false);

    /**
     * The web id of the user.
     */
    let [webId, setWebId] = useState("");

    /**
     * The url of the user's POD.
     */
    let [podUrl, setPodUrl] = useState("");

    /**
     * Current path in the file explorer, which can be used when sub-folders
     * can be navigated.
     */
    let [explorerPath, setExplorerPath] = useState("");

    let history = useHistory();
    const classes = useStyles();

    useEffect(() => {
        setExplorerPath(podUrl);
    }, [podUrl]);

    /**
     * Returns true if the user is logged in and the web id is set.
     * @return {Boolean} The login status
     */
    function isLoggedIn() {
        return (webId !== "") && loggedIn;
    }

    /**
     * Convenience function that creates the login component.
     * @return {[type]} The login component
     */
    function getLoginComponent() {
        return (<Login setWebId={setWebId} setLoggedIn={setLoggedIn} setPodUrl={setPodUrl}/>);
    }

    /**
     * Convenience function that creates the home component.
     * @return {[type]} [description]
     */
    function getHomeComponent() {
        return <Home classes={classes}
                     webId={webId} podUrl={podUrl}
                     history={history}
                     explorerPath={explorerPath}
                     setExplorerPath={setExplorerPath}/>;
    }


    return (
        <div className="app-div">
            {isLoggedIn() ? getHomeComponent() : getLoginComponent()}
        </div>
    );
}



export default App;
