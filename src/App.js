import logo from './logo.svg';
import './App.css';
import Login from "./Login";
import FileExplorer from "./FileExplorer";
import React, {useState} from "react";

function App() {
  let [loggedIn, setLoggedIn] = useState(false);
  let [webId, setWebId] = useState("");

  console.log("App webId: "+ webId);
  return (
    <div>
      {webId !== "" && loggedIn ? <div><h1> You are logged in !!!</h1><h3>webID: {webId}</h3> <FileExplorer webId={webId}/> </div> :
      <Login setLoggedIn={setLoggedIn} setWebId={setWebId}/>
      }
    </div>
  );
}

export default App;
