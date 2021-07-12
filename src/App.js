import logo from './logo.svg';
import './App.css';
import Login from "./Login";
import React, {useState} from "react";

function App() {
  let [loggedIn, setLoggedIn] = useState(false);
  let [webID, setWebID] = useState("");

  return (
    <div>
      {loggedIn ? <div><h1> You are logged in !!!</h1><h3>webID: {webID}</h3></div> :
      <Login setLoggedIn={setLoggedIn} setWebID={setWebID}/>
      }
    </div>
  );
}

export default App;
