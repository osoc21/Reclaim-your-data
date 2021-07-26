import "./Login.css";
import {getPODUrlFromWebId} from './pod';
import React from "react";
import {Button} from '@material-ui/core';
import {
  login,
  handleIncomingRedirect,
  getDefaultSession,
} from '@inrupt/solid-client-authn-browser';


/**
 * The Login component takes care of going to the proper POD provider login page, and handles
 * the redirect after submitting the credentials. On success, the component initializes
 * the web id, the pod url and the loggin flag of the app.
 *
 * @component
 * @param {[type]} props [description]
 */
function Login(props) {
	let setLoggedIn = props.setLoggedIn;
	let setWebId = props.setWebId;
	let setPodUrl = props.setPodUrl;

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
	    await setLoggedIn(true);
	    await setWebId(session.info.webId);
	    let newPodUrl = getPODUrlFromWebId(session.info.webId);
	    await setPodUrl(newPodUrl);
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