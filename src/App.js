import './App.css';
import Login from "./Login";
import FileExplorer from "./FileExplorer";
import FileUpload from "./FileUpload";

import React, {useState, useEffect} from "react";
import {AppBar, Toolbar} from '@material-ui/core';

import { makeStyles } from "@material-ui/core/styles";

import {Menu, MenuItem, Fab, BottomNavigation, BottomNavigationAction} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import HomeIcon from '@material-ui/icons/Home';
import ViewCarouselIcon from '@material-ui/icons/ViewCarousel';
import PhotoIcon from '@material-ui/icons/Photo';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';


import {
  // Import Router and not BrowserRouter, otherwise history.push()
  // will update the url displayed in the browser but will not re-render afterwards
  // Router,
  Switch,
  Route,
  // Link,
  // Redirect,
  useHistory,
  useRouteMatch
} from "react-router-dom";



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
    background: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
  },
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
    }, [podUrl])

    function isLoggedIn()
    {
        return (webId !== "") && loggedIn;
    }

    function getLoginComponent()
    {
        return (<Login setWebId={setWebId} setLoggedIn={setLoggedIn} setPodUrl={setPodUrl}/>);
    }

    function getHomeComponent()
    {
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

    // return (
    //     <div className="app-div">
    //         <Switch>
    //             <Route path="/login">
    //                 <Login setWebId={setWebId} setLoggedIn={setLoggedIn}/>
    //                 {/* We execute this separately and after the login, this allows
    //                 an automatic redirect to '/home' when we come back from login form. */}
    //                 {isLoggedIn() ? <Redirect to="/"/> : null} 
    //             </Route>
    //             <Route path="/home/upload">
    //                 {isLoggedIn() ? [<MenuBar classes={classes} history={history}/>,
    //                     <FileUpload explorerPath={explorerPath}/>] : <Redirect to={"/"} />
    //                 }
    //             </Route>
    //             <Route path="/home">
    //                 <MenuBar classes={classes} history={history}/>
    //                 {isLoggedIn() ? <Home classes={classes} webId={webId}
    //                 history={history}
    //                 explorerPath={explorerPath}
    //                 setExplorerPath={setExplorerPath}/> : <Redirect to="/"/>}
    //             </Route>
    //             <Route exact path="/">
    //                 {isLoggedIn() ? <Redirect push to="/home"/> : <Redirect push to="/login"/>}
    //             </Route>
    //         </Switch>
    //     </div>
    // );

}


function MenuBar(props)
{
    let history = props.history;
    let classes = props.classes;

    function gotoFileUpload()
    {
        console.log("goto file upload screen ...");
        history.push(`/upload`);
    }

    return(
        <AppBar position="static" className={classes.appBar}>
            <Toolbar>
                <IconButton style={{color: "white"}} className={classes.topBarRightElem} edge="start"
                aria-label="menu" onClick={gotoFileUpload}>
                    <AddIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}


function BottomNavBar(props)
{
    let classes = props.classes;

    return(
        <BottomNavigation className={classes.appBar}
        showLabels style={{position: 'fixed', bottom: 0, width: "300px", borderRadius: "10px", bottom: "10px"}}>
            <BottomNavigationAction style={{color: "white"}} label="Photos" icon={<PhotoIcon/>} />
            <BottomNavigationAction style={{color: "white"}} label="Albums" icon={<ViewCarouselIcon/>} />
        </BottomNavigation>
    );
}



function Home(props)
{
    let [notifMsg, setNotifMsg] = useState("");
    let [notifType, setNotifType] = useState("");

    let webId = props.webId;
    let podUrl = props.podUrl;
    let explorerPath = props.explorerPath;
    let setExplorerPath = props.setExplorerPath;
    let history = props.history;
    // let match = useRouteMatch();
    const classes = props.classes;

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function gotoFileUpload()
    {
        console.log("goto file upload screen ...");
        history.push(`/upload`);
    }

    function Notification(props)
    {
        let notifMsg = props.notifMsg;
        let notifType = props.notifType;

        return (<Collapse in={notifMsg !== ""}>
                    <Alert key="2" severity={notifType} action={
                            <IconButton
                              aria-label="close"
                              color="inherit"
                              size="small"
                              onClick={() => {setNotifMsg("");}}>
                              <CloseIcon fontSize="inherit" />
                            </IconButton>}>
                        {notifMsg}
                    </Alert>
                </Collapse>);
    }

    return [<MenuBar key="1" classes={classes} history={history}/>,
            <Notification notifMsg={notifMsg} notifType={notifType}/>,
            <div key="3" className="content">
                <Switch>
                    <Route exact path="/upload">
                        <FileUpload explorerPath={explorerPath} setNotifMsg={setNotifMsg}
                        setNotifType={setNotifType}/>
                    </Route>
                    <Route exact path="/">
                        {/*<h1>Home</h1>*/}
                        {/*<h3>webID: {webId}</h3>*/}
                        <FileExplorer podUrl={podUrl} explorerPath={explorerPath}
                        setExplorerPath={setExplorerPath}/>
                    </Route>
                </Switch>
            </div>,
            <BottomNavBar classes={classes} key="4"/>
    ];
}


function _HomeOLD(props)
{
    let webId = props.webId;
    let match = useRouteMatch();
    const classes = props.classes;

    const [anchorEl, setAnchorEl] = useState(null);

    const handleFabClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFabClose = () => {
        setAnchorEl(null);
    };

    function gotoFileUpload()
    {
        console.log("goto file upload screen ...");
        props.history.replace(`${match.url}/upload`);
        handleFabClose();
    }

    return (
        <div>
            <h1>Home</h1>
            {/*<h3>webID: {webId}</h3>*/}
            <FileExplorer webId={webId} explorerPath={props.explorerPath}
            setExplorerPath={props.setExplorerPath}/>
            <Fab className={classes.fab} color="primary" 
            aria-label="add" aria-controls="simple-menu"
            onClick={handleFabClick} aria-haspopup="true">
              <AddIcon/>
            </Fab>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleFabClose}
            >
                <MenuItem onClick={gotoFileUpload}>Upload files</MenuItem>
                <MenuItem onClick={handleFabClose}>New folder</MenuItem>
            </Menu>
        </div>
    );
}

export default App;
