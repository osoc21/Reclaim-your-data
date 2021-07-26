import React, {useState, useEffect} from "react";
import {executeQuery} from "./rdf";
import {getPODUrlFromWebId} from './pod';
import {useSession} from "@inrupt/solid-ui-react";

// using person file as source
const getWebIdFromPersonFileQuery = "SELECT ?o WHERE { ?s <http://www.w3.org/2006/vcard/ns#value> ?o }";
// using webid as source
const getRoleQuery = "SELECT ?o WHERE { ?s <http://www.w3.org/2006/vcard/ns#role> ?o }";
// const getPODProviderUrlQuery = "SELECT ?o WHERE { ?s <http://www.w3.org/ns/solid/terms#oidcIssuer> ?o }";
const getEmailCardUrlQuery = "SELECT ?o WHERE { ?s <http://www.w3.org/2006/vcard/ns#hasEmail> ?o }";
// using email card url
const getEmailFromEmailCardUrlQuery = "SELECT ?o WHERE { ?s <http://www.w3.org/2006/vcard/ns#value> ?o }";

/**
 * The ContactDetails component gathers information about a given contact.
 * The data is fetched from the POD using a 'person-file' url received from the parent
 * Contacts component. Note that this file url is not received as a prop of the router which
 * has to pass by the url, but as a hidden state variable of the app.
 *
 * @component
 * @param {[type]} props [description]
 */
function ContactDetails(props)
{
	let contactUsername = props.realProps.match.params.username; //data.public;
	let contactPersonFileUrl = props.routingHiddenParams[0]; //data.hidden;
	let [contactWebId,setContactWebId] = useState("");
	let [contactPodUrl, setContactPodUrl] = useState("");
	let [role, setRole] = useState("");
	let [email, setEmail] = useState("");

	const { session } = useSession();

	/**
	 * Simple convenience function that parses a single result in the bindings of a query.
	 * Ideally, this function should be replaced by functions from the inrupt client API (e.g. getThing).
	 * @param  {[type]} bindings The results of the query, from which the result should be parsed
	 * @return {[type]}          The parsed result
	 */
	function parseSingleResult(bindings)
	{
		return bindings[0]['_root'].entries[0][1]['id'].replace(/['"]+/g, '');
	}

	/**
	 * This function use hardcoded predicates to query the person file and get information
	 * like the role, email or webid of a contact. This function could be refactored
	 * to use functions and vocabulary (e.g. VCARD) from the inrupt library.
	 * @return {[type]} [description]
	 */
	async function getContactDetailsFromPersonFile()
	{
		let resBindings = await executeQuery(getWebIdFromPersonFileQuery, [contactPersonFileUrl], session);
		let parsedWebId = parseSingleResult(resBindings);
		//console.log("parsed contact webid:", parsedWebId);
		setContactWebId(parsedWebId);
		let newContactPodUrl =  getPODUrlFromWebId(parsedWebId);
		setContactPodUrl(newContactPodUrl);
		resBindings = await executeQuery(getRoleQuery, [parsedWebId], session);
		//console.log("role res:", resBindings);
		if (resBindings.length > 0)
		{
			let parsedRole = parseSingleResult(resBindings);
			setRole(parsedRole);
		}
		resBindings = await executeQuery(getEmailCardUrlQuery, [parsedWebId], session);
		//console.log("email card url res:", resBindings);
		if (resBindings.length > 0)
		{
			let parsedEmailCardUrl = parseSingleResult(resBindings);
			resBindings = await executeQuery(getEmailFromEmailCardUrlQuery, [parsedEmailCardUrl], session);
			//console.log("email res:", resBindings);
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
	
	/**
	 * This functions displays a <p> element containing the argument if defined,
	 * otherwise returns a <p> element containing a dash character.
	 * @param  {[type]} field [description]
	 * @return {[type]}       [description]
	 */
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