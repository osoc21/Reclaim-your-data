
import "./Login.css"
import React from "react";

import {Button} from '@material-ui/core';

// Import from "@inrupt/solid-client-authn-browser"
import {
  login,
  handleIncomingRedirect,
  getDefaultSession,
} from '@inrupt/solid-client-authn-browser';


function Login(props) {
	let setLoggedIn = props.setLoggedIn;
	let setWebId = props.setWebId;

	let session = null;

	// 1a. Start Login Process. Call login() function.
	function loginToInruptDotCom() {
	  let chosenIssuer = "https://broker.pod.inrupt.com";
	  return login({
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
	    // Update the page with the status.
	    setLoggedIn(true);
	    setWebId(session.info.webId);
	  }
	}

	handleRedirectAfterLogin();

	return (
		<div className="login-frame">
	    	<Button size="large" variant="contained" color="primary" onClick={loginToInruptDotCom}>Log-in</Button>
    	</div>
	);
}


export default Login;