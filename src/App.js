// import logo from './logo.svg';
import './App.css';
import Login from "./Login";
import FileExplorer from "./FileExplorer";
import FileUpload from "./FileUpload";
import React, {useState} from "react";

import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useRouteMatch
} from "react-router-dom";

// import { createBrowserHistory } from 'history';

// const history = useRouterHistory(createBrowserHistory)({basename: "/login"});

function App() {
    let [loggedIn, setLoggedIn] = useState(false);
    let [webId, setWebId] = useState("");
    let [explorerPath, setExplorerPath] = useState("");
    let history = useHistory();
    // history.push("/login");
    

    function isLoggedIn()
    {
        return (webId !== "") && loggedIn;
    }

    return (
        <BrowserRouter history={history}>
          <div className="app-div">
            <Switch>
                <Route path="/login">
                    <Login setWebId={setWebId} setLoggedIn={setLoggedIn}/>
                    {/* We execute this separately and after the login, this allows
                    an automatic redirect to '/home' when we come back from login form. */}
                    {isLoggedIn() ? <Redirect to="/"/> : null} 
                </Route>
                <Route path="/home/upload">
                    <button className="Button" onClick={() => history.goBack()}>Go back</button>
                    <FileUpload explorerPath={explorerPath}/>
                </Route>
                <Route path="/home">
                    <button className="Button" onClick={() => history.goBack()}>Go back</button>
                    {isLoggedIn() ? <Home webId={webId}
                    explorerPath={explorerPath}
                    setExplorerPath={setExplorerPath}/> : <Redirect to="/"/>}
                </Route>
                <Route path="/">
                    {isLoggedIn() ? <Redirect push to="/home"/> : <Redirect push to="/login"/>}
                </Route>
            </Switch>
          </div>
        </BrowserRouter>
    );
}

function Home(props)
{
    let webId = props.webId;
    let match = useRouteMatch();

    return (
        <div>
            <h1>You are logged in !!!</h1>
            <h3>webID: {webId}</h3>
            <button className="Button">
                <Link to={`${match.url}/upload`}>
                    Upload files
                </Link>
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
