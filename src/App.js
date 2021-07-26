
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
    topBarRightElem: {
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


function App() {
    let [loggedIn, setLoggedIn] = useState(false);
    let [webId, setWebId] = useState("");
    let [podUrl, setPodUrl] = useState("");
    let [explorerPath, setExplorerPath] = useState("");

    let history = useHistory();
    const classes = useStyles();

    useEffect(() => {
        setExplorerPath(podUrl);
    }, [podUrl]);

    function isLoggedIn() {
        return (webId !== "") && loggedIn;
    }

    function getLoginComponent() {
        return (<Login setWebId={setWebId} setLoggedIn={setLoggedIn} setPodUrl={setPodUrl}/>);
    }

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
