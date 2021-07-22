
import React, {useState, useEffect} from "react";
import {executeQuery} from "./rdf";


function ContactDetails(props)
{
	console.log("data:", props);
	let username = props.realProps.match.params.username; //data.public;
	let personFileUrl = props.urlHiddenParams[0]; //data.hidden;

	// TODO: set the web id of the contact in useEffect()
	// let [contactWebId, setContactWebId] = useState(""); 
	// useEffect(() => {

	// }, [username]);

	return (
		<>
			<h1>Contact page of {username}</h1>
			<h4>Person file url:</h4>
			<p>{personFileUrl}</p>
			<h4>WebId:</h4>
			<p>todo</p>
			<h4>Email:</h4>
			<p>todo</p>
			<h4>Nickname:</h4>
			<p>todo</p>
		</>
	);
}

export default ContactDetails;