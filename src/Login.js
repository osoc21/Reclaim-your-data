
import React, {useState} from "react";

// Import from "@inrupt/solid-client-authn-browser"
import {
  login,
  handleIncomingRedirect,
  getDefaultSession,
  fetch
} from '@inrupt/solid-client-authn-browser';


function Login(props) {
	// let [loggedIn, setLoggedIn] = useState(false);
	// 
	let setLoggedIn = props.setLoggedIn;
	let setWebID = props.setWebID;

	// let MY_POD_URL = null;
	let urlParentStack = [];
	let session = null;

	// 1a. Start Login Process. Call login() function.
	function loginToInruptDotCom() {
	  // document.querySelector("#pod-issuer").value
	  let chosenIssuer = "https://broker.pod.inrupt.com";
	  return login({
	    //oidcIssuer: "https://broker.pod.inrupt.com",
	    oidcIssuer: chosenIssuer,

	    redirectUrl: window.location.href,
	    clientName: "Getting started app"
	  });
	}

	// 1b. Login Redirect. Call handleIncomingRedirect() function.
	// When redirected after login, finish the process by retrieving session information.
	async function handleRedirectAfterLogin() {
	  await handleIncomingRedirect();

	  session = getDefaultSession();

	  if (session.info.isLoggedIn) {
	    console.log("logged in");
	    console.log(session);
	    // Update the page with the status.
	    // TODO: find a way to display the proper issuer after the redirect
	    // document.getElementById("labelStatus").textContent = "You are connected to " + chosenIssuer;
	    setLoggedIn(true);
	    setWebID(session.info.webId);
	    // document.getElementById("labelStatus").setAttribute("role", "alert");
	  }
	}

	handleRedirectAfterLogin();

	// function getLoginText()
	// {
	// 	if (loggedIn)
	// 	{
	// 		return "You're logged in !!!";
	// 	}
	// 	return "You're disconnected."
	// }

	// console.log(loggedIn);

	return (
	    <button onClick={loginToInruptDotCom}>Log-in</button>
	);
}


export default Login;