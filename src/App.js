// import logo from './logo.svg';
import './App.css';
import Login from "./Login";
import FileExplorer from "./FileExplorer";
import FileUpload from "./FileUpload";
import React, {useState} from "react";


import {
  // Import Router and not BrowserRouter, otherwise history.push()
  // will update the url displayed in the browser but will not re-render afterwards
  Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useRouteMatch
} from "react-router-dom";


function App() {
    let [loggedIn, setLoggedIn] = useState(false);
    let [webId, setWebId] = useState("");
    let [explorerPath, setExplorerPath] = useState("");
    let history = useHistory();

    function isLoggedIn()
    {
        return (webId !== "") && loggedIn;
    }

    return (
        <Router history={history}>
          <div className="app-div">
            <Switch>
                <Route path="/login">
                    <Login setWebId={setWebId} setLoggedIn={setLoggedIn}/>
                    {/* We execute this separately and after the login, this allows
                    an automatic redirect to '/home' when we come back from login form. */}
                    {isLoggedIn() ? <Redirect to="/"/> : null} 
                </Route>
                <Route path="/home/upload">
                    {isLoggedIn() ? <div><button className="Button" onClick={() => history.goBack()}>Go back</button>
                        <FileUpload explorerPath={explorerPath}/></div> : <Redirect to={"/"} />
                    }
                </Route>
                <Route path="/home">
                    <button className="Button" onClick={() => history.goBack()}>Go back</button>
                    {isLoggedIn() ? <Home webId={webId}
                    history={history}
                    explorerPath={explorerPath}
                    setExplorerPath={setExplorerPath}/> : <Redirect to="/"/>}
                </Route>
                <Route path="/">
                    {isLoggedIn() ? <Redirect push to="/home"/> : <Redirect push to="/login"/>}
                </Route>
            </Switch>
          </div>
        </Router>
    );
}

function Home(props)
{
    let webId = props.webId;
    let match = useRouteMatch();

    function gotoFileUpload()
    {
        console.log("goto file upload screen ...");
        props.history.replace(`${match.url}/upload`);
        // props.history.goForward();
    }

    return (
        <div>
            <h1>You are logged in !!!</h1>
            <h3>webID: {webId}</h3>
            <button className="Button" onClick={gotoFileUpload}>
                Upload files
                {/*<Link to={`${match.url}/upload`}>
                </Link>*/}
            </button>
            <FileExplorer webId={webId} explorerPath={props.explorerPath}
            setExplorerPath={props.setExplorerPath}/>
            {/**/}
            {/*<Switch>
                <Route path={`${match.url}/upload`}>
                    <FileUpload explorerPath={props.explorerPath}/>
                </Route>
            </Switch>*/}
        </div>
    );
}



export default App;
