
import React from "react";

// Import from "@inrupt/solid-client-authn-browser"
import {
  login,
  handleIncomingRedirect,
  getDefaultSession,
  fetch
} from '@inrupt/solid-client-authn-browser';


let MY_POD_URL = null;
let urlParentStack = [];


// 1a. Start Login Process. Call login() function.
function loginToInruptDotCom() {
  let chosenIssuer = document.querySelector("#pod-issuer").value;
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

  const session = getDefaultSession();
  if (session.info.isLoggedIn) {
    // Update the page with the status.
    // TODO: find a way to display the proper issuer after the redirect
    // document.getElementById("labelStatus").textContent = "You are connected to " + chosenIssuer;
      document.getElementById("labelStatus").textContent = "You are connected.";
    document.getElementById("labelStatus").setAttribute("role", "alert");
  }
}

function FileExplorer {

	return (

	);
}