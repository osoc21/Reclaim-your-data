
import React, {useState, useEffect} from "react";
import {executeQuery} from "./rdf";
import {getPODUrlFromWebId} from './pod';
import {useSession} from "@inrupt/solid-ui-react";

// using person file as source
const getWebIdFromPersonFileQuery = "SELECT ?o WHERE { ?s <http://www.w3.org/2006/vcard/ns#value> ?o }";
// using webid as source
const getRoleQuery = "SELECT ?o WHERE { ?s <http://www.w3.org/2006/vcard/ns#role> ?o }";
const getPODProviderUrlQuery = "SELECT ?o WHERE { ?s <http://www.w3.org/ns/solid/terms#oidcIssuer> ?o }";
const getEmailCardUrlQuery = "SELECT ?o WHERE { ?s <http://www.w3.org/2006/vcard/ns#hasEmail> ?o }";
// using email card url
const getEmailFromEmailCardUrlQuery = "SELECT ?o WHERE { ?s <http://www.w3.org/2006/vcard/ns#value> ?o }";

function ContactDetails(props)
{
	console.log("data:", props);
	let contactUsername = props.realProps.match.params.username; //data.public;
	let contactPersonFileUrl = props.urlHiddenParams[0]; //data.hidden;
	let [contactWebId,setContactWebId] = useState("");
	let [contactPodUrl, setContactPodUrl] = useState("");
	let [role, setRole] = useState("");
	let [email, setEmail] = useState("");

	const { session } = useSession();

	function parseSingleResult(bindings)
	{
		return bindings[0]['_root'].entries[0][1]['id'].replace(/['"]+/g, '');
	}

	async function getContactDetailsFromPersonFile()
	{
		let resBindings = await executeQuery(getWebIdFromPersonFileQuery, [contactPersonFileUrl], session);
		let parsedWebId = parseSingleResult(resBindings);
		console.log("parsed contact webid:", parsedWebId);
		setContactWebId(parsedWebId);
		let newContactPodUrl =  getPODUrlFromWebId(parsedWebId);
		setContactPodUrl(newContactPodUrl);
		resBindings = await executeQuery(getRoleQuery, [parsedWebId], session);
		console.log("role res:", resBindings);
		if (resBindings.length > 0)
		{
			let parsedRole = parseSingleResult(resBindings);
			setRole(parsedRole);
		}
		resBindings = await executeQuery(getEmailCardUrlQuery, [parsedWebId], session);
		console.log("email card url res:", resBindings);
		if (resBindings.length > 0)
		{
			let parsedEmailCardUrl = parseSingleResult(resBindings);
			resBindings = await executeQuery(getEmailFromEmailCardUrlQuery, [parsedEmailCardUrl], session);
			console.log("email res:", resBindings);
			if (resBindings.length > 0)
			{
				let parsedEmail = parseSingleResult(resBindings);
				setEmail(parsedEmail);
			}
		}
		// let email = 
	}

	useEffect(() => {
		getContactDetailsFromPersonFile();
	}, [contactPersonFileUrl]);

	
	function showField(field)
	{
		return (<p>{field ? field : "-"}</p>);
	}


	return (
		<>
			<h1>Contact page of {contactUsername}</h1>
			<h4>Person file url:</h4>
			{showField(contactPersonFileUrl)}
			<h4>WebId:</h4>
			{showField(contactWebId)}
			<h4>POD url</h4>
			{showField(contactPodUrl)}
			<h4>Email:</h4>
			{showField(email)}
			<h4>Role</h4>
			{showField(role)}
		</>
	);
}

export default ContactDetails;