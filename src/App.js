import './App.css';
import Login from "./Login";
import FileExplorer from "./FileExplorer";
import FileUpload from "./FileUpload";
import Profile from "./Profile";
import Contacts from "./Contacts";
import Albums from "./Albums";
import ContactDetails from "./ContactDetails";


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
                aria-label="menu" onClick={async () => {await props.gotoScreen('/upload', null, false)}}>
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

    // NOTICE: we false as last parameter of gotoScreen, because we consider all the navigation tabs independent
    // and as such we want hidden parameters to be updated after the screen change to not cause errors
    const handleChange = async (event, newValue) => {await setLocation(newValue); await gotoScreen(newValue, null, false)};

    return(
        <BottomNavigation className={classes.appBar} value={location} onChange={handleChange}
        showLabels style={{position: 'fixed', width: "100%", bottom: 0}}>
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
    let [notifType, setNotifType] = useState("info");
    let [loadingAnim, setLoadingAnim] = useState(false); // when first loading, show anim
    let [urlHiddenParams, setUrlHiddenParams] = useState([]);

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


    async function gotoScreen(screenPath, hiddenParams = null, updateHiddenParamsBefore=true)
    {
        console.log(`goto ${screenPath} ...`);
        console.log(`hidden params:\n`, hiddenParams);

        // By default, we update the hidden params before redirecting.
        // This way, the newpage will have the proper parameters set before rendering
        if (updateHiddenParamsBefore)
        {
            await setUrlHiddenParams(hiddenParams);
        }
        await setLoadingAnim(false); // always cancel loading anim when switching screen
        history.push(`${screenPath}`);

        // Some screens rely on hidden params as props, hence they will show an error
        // if we change the hidden param before changing location (since everything is reference in JS).
        // In that case, we can avoid the problem by setting updateHiddenParamsBefore to false,
        // hence updating such prop after the screen change.
        if (! updateHiddenParamsBefore)
        {
            await setUrlHiddenParams(hiddenParams);
        }
    }

    function showLoadingAnimation()
    {
        if (loadingAnim)
        {
            return <CircularProgress color="secondary" size={100} style={{zIndex: 1700, opacity: ".7", position: "fixed", top: "45vh"}}/>
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
            {showLoadingAnimation()}
            <MenuBar classes={classes} history={history} gotoScreen={gotoScreen}/>
            <Notification notifMsg={notifMsg} notifType={notifType}/>
            <div className="content">
                {/*</div>*/}
                <Switch>
                    <Route exact path="/redirect">
                        <h1>Redirecting...</h1>
                    </Route>
                    <Route exact path="/upload">
                        <FileUpload explorerPath={explorerPath} setNotifMsg={setNotifMsg}
                        setNotifType={setNotifType} setLoadingAnim={setLoadingAnim}/>
                    </Route>
                    <Route exact path="/profile">
                        <Profile/>
                    </Route>
                    <Route exact path="/contacts">
                        <Contacts gotoScreen={gotoScreen}/>
                    </Route>
                    <Route path="/contacts/:username" render={(props) => <ContactDetails urlHiddenParams={urlHiddenParams} realProps={props} /> } />
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
