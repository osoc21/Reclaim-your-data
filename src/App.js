import './App.css';
import Login from "./Login";
import FileExplorer from "./FileExplorer";
import FileUpload from "./FileUpload";

import React, {useState, useEffect} from "react";
import {AppBar, Toolbar} from '@material-ui/core';

import { makeStyles } from "@material-ui/core/styles";

import {Menu, MenuItem, Fab} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

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
  HamburgerMenu: {
    marginLeft: 'auto',
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

    return(
        <AppBar position="static">
            <Toolbar>
                <ArrowBackIcon color="inherit" onClick={() => history.goBack()}/>
                {/*<Button variant="contained" color="secondary" onClick={() => history.goBack()}>
                    Go Back
                </Button>*/}
                <IconButton className={classes.HamburgerMenu} edge="start" color="inherit" aria-label="menu">
                    <MenuIcon/>
                </IconButton>
                {/*<Typography variant="h6">
                    WePOD
                </Typography>*/}
            </Toolbar>
        </AppBar>
    );
}

function Home(props)
{
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

    return [
            <MenuBar key="1" classes={classes} history={history}/>,
            <div key="2" className="content">
                <Switch>
                    <Route exact path="/upload">
                        <FileUpload explorerPath={explorerPath}/>
                    </Route>
                    <Route path="/">
                        <h1>Home</h1>
                        {/*<h3>webID: {webId}</h3>*/}
                        <FileExplorer podUrl={podUrl} explorerPath={explorerPath}
                        setExplorerPath={setExplorerPath}/>
                        <Fab className={classes.fab} color="primary" 
                        aria-label="add" aria-controls="simple-menu"
                        onClick={handleClick} aria-haspopup="true">
                          <AddIcon/>
                        </Fab>
                        <Menu id="simple-menu" anchorEl={anchorEl}
                          keepMounted open={Boolean(anchorEl)}
                          onClose={handleClose}>
                            <MenuItem onClick={gotoFileUpload}>Upload files</MenuItem>
                            <MenuItem onClick={handleClose}>New folder</MenuItem>
                        </Menu>
                    </Route>
                </Switch>
            </div>
    ];
}


function _HomeOLD(props)
{
    let webId = props.webId;
    let match = useRouteMatch();
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
        props.history.replace(`${match.url}/upload`);
    }

    return (
        <div>
            <h1>Home</h1>
            {/*<h3>webID: {webId}</h3>*/}
            <FileExplorer webId={webId} explorerPath={props.explorerPath}
            setExplorerPath={props.setExplorerPath}/>
            <Fab className={classes.fab} color="primary" 
            aria-label="add" aria-controls="simple-menu"
            onClick={handleClick} aria-haspopup="true">
              <AddIcon/>
            </Fab>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
                <MenuItem onClick={gotoFileUpload}>Upload files</MenuItem>
                <MenuItem onClick={handleClose}>New folder</MenuItem>
            </Menu>
        </div>
    );
}

export default App;
