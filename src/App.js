// import logo from './logo.svg';
import './App.css';
import Login from "./Login";
import FileExplorer from "./FileExplorer";
import React, {useState} from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory
} from "react-router-dom";

// import { createBrowserHistory } from 'history';

function App() {
    let [loggedIn, setLoggedIn] = useState(false);
    let [webId, setWebId] = useState("");
    // let history = useHistory();

    function isLoggedIn()
    {
        return (webId !== "") && loggedIn;
    }

    return (
        <Router>
          <div className="app-div">
            <Switch>
                <Route path="/login">
                    <Login setWebId={setWebId} setLoggedIn={setLoggedIn}/>
                    {/* We execute this separately and after the login, this allows
                    an automatic redirect to '/home' when we come back from login form. */}
                    {isLoggedIn() ? <Redirect to="/"/> : null} 
                </Route>
                <Route path="/home">
                    {isLoggedIn() ? <Home webId={webId}/> : <Redirect to="/"/>}
                </Route>
                <Route path="/">
                    {isLoggedIn() ? <Redirect to="/home"/> : <Redirect to="/login"/>}
                </Route>
            </Switch>
          </div>
        </Router>
    );
}

function Home(props)
{
    let webId = props.webId;

    return (
        <div>
            <h1>You are logged in !!!</h1>
            <h3>webID: {webId}</h3>
            <FileExplorer webId={webId}/> 
        </div>
    );
}


export default App;
