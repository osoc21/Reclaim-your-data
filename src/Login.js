
import {GITHUB_PAGE_LINK} from "./constants";
import "./Login.css";
import {getPODUrlFromWebId} from './pod';
import React from "react";
import {Button} from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
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

	/**
	 * Function taken from the inrupt examples.
	 * Starts the login process by calling the login() function.
	 * @return {[type]} The result of the login
	 */
	function loginToInruptDotCom() {
	  let chosenIssuer = "https://broker.pod.inrupt.com";
	  return login({
	    oidcIssuer: chosenIssuer,
	    redirectUrl: window.location.href,
	    clientName: "Getting started app"
	  });
	}

	/** 
	 * Function taken from the inrupt examples.
	 * When redirected after login, finish the process by retrieving session information.
	 * This is done with the handleIncomingRedirect() function, and then using a session object.
	 */
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
	    	<Button size="large" variant="contained" color="primary" onClick={loginToInruptDotCom}>Log in</Button>
	    	<Button size="small" variant="outlined" color="default" style={{marginTop:"10px"}}
          onClick={event =>  window.location.href=GITHUB_PAGE_LINK}
          startIcon={<GitHubIcon/>}>
          Go to Github page
        </Button>
    	</div>
	);
}


export default Login;