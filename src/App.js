import './App.css';
import Login from "./Login";
import FileExplorer from "./FileExplorer";
import FileUpload from "./FileUpload";
import Profile from "./Profile";
import Contacts from "./Contacts";
import Albums from "./Albums";


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
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import FolderIcon from '@material-ui/icons/Folder';
import CircularProgress from '@material-ui/core/CircularProgress';


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
    background: 'black',
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
    let gotoScreen = props.gotoScreen;

    return(
        <AppBar position="static" className={classes.appBar}>
            <Toolbar>
                <IconButton style={{color: "white"}} className={classes.topBarRightElem} edge="start"
                aria-label="menu" onClick={() => {props.gotoScreen('/upload')}}>
                    <AddIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}


function BottomNavBar(props)
{
    let classes = props.classes;
    let btnClass = classes.bottomNavBtn;
    let gotoScreen = props.gotoScreen;
    let [location, setLocation] = useState("/");

    const handleChange = (event, newValue) => {setLocation(newValue); gotoScreen(newValue)};


    return(
        <BottomNavigation className={classes.appBar} value={location} onChange={handleChange}
        showLabels style={{position: 'fixed', width: "300px", borderRadius: "10px", bottom: "10px"}}>
            <BottomNavigationAction className={btnClass} value="/" label="Photos" icon={<PhotoIcon/>} />
            <BottomNavigationAction className={btnClass} value="/albums" label="Albums" icon={<FolderIcon/>} />
            <BottomNavigationAction className={btnClass} value="/profile" label="Profile" icon={<AccountBoxIcon/>} />
            <BottomNavigationAction className={btnClass} value="/contacts" label="Contacts" icon={<GroupIcon/>} />
        </BottomNavigation>
    );
}



function Home(props)
{
    let [notifMsg, setNotifMsg] = useState("");
    let [notifType, setNotifType] = useState("");
    let [loadingAnim, setLoadingAnim] = useState(false); // when first loading, show anim

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

    function gotoScreen(screenPath)
    {
        console.log(`goto ${screenPath} ...`);
        history.push(`${screenPath}`);
    }

    function showLoadingAnimation()
    {
        if (loadingAnim)
        {
            return <CircularProgress size={100} 
            style={{zIndex: 1600, position: "absolute", left:"50%", top:"50%",color: '#1a90ff'}}/>
        }
    }


    function Notification(props)
    {
        let notifMsg = props.notifMsg;
        let notifType = props.notifType;

        return (<Collapse style={{overflowY: "scroll"}} in={(notifMsg !== "" && notifType !== "")}>
                    <Alert severity={notifType} action={
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

    return (<>
            <MenuBar classes={classes} history={history} gotoScreen={gotoScreen}/>
            {showLoadingAnimation()}
            <Notification notifMsg={notifMsg} notifType={notifType}/>
            <div className="content">
                <Switch>
                    <Route exact path="/upload">
                        <FileUpload explorerPath={explorerPath} setNotifMsg={setNotifMsg}
                        setNotifType={setNotifType} setLoadingAnim={setLoadingAnim}/>
                    </Route>
                    <Route exact path="/profile">
                        <Profile/>
                    </Route>
                    <Route exact path="/contacts">
                        <Contacts/>
                    </Route>
                    <Route exact path="/albums">
                        <Albums/>
                    </Route>
                    <Route exact path="/">
                        {/*<h1>Home</h1>*/}
                        {/*<h3>webID: {webId}</h3>*/}
                        <FileExplorer podUrl={podUrl} explorerPath={explorerPath}
                        setExplorerPath={setExplorerPath} setLoadingAnim={setLoadingAnim}/>
                    </Route>
                </Switch>
            </div>
            <BottomNavBar classes={classes} gotoScreen={gotoScreen}/>
        </>);
}


export default App;
