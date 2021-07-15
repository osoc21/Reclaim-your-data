
import "./Login.css"
import React from "react";

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
	    	<button className="login-btn" onClick={loginToInruptDotCom}>Log-in</button>
    	</div>
	);
}


export default Login;