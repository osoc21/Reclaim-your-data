
import React, {useState} from "react";

// Import from "@inrupt/solid-client-authn-browser"
import {
  login,
  handleIncomingRedirect,
  getDefaultSession,
  fetch
} from '@inrupt/solid-client-authn-browser';


function Login() {
	let [loggedIn, setLoggedIn] = useState(false);
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
	    // Update the page with the status.
	    // TODO: find a way to display the proper issuer after the redirect
	    // document.getElementById("labelStatus").textContent = "You are connected to " + chosenIssuer;
	    setLoggedIn(true);
	    // document.getElementById("labelStatus").setAttribute("role", "alert");
	  }
	}

	handleRedirectAfterLogin();

	function getLoginText()
	{
		if (loggedIn)
		{
			return "You're logged in !!!";
		}
		return "You're disconnected."
	}

	console.log(loggedIn);

	return (
	    <div>
	      {loggedIn ? <h1> You are logged in to your POD </h1> :
	      <button onClick={loginToInruptDotCom}>Log-in</button>}
	      <p id="labelStatus">{getLoginText()}</p>
	    </div>
	);
}


export default Login;