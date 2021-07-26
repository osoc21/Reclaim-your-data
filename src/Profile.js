
import React, {useState, useEffect}from "react";
import {executeQuery} from "./rdf";
import {useSession} from "@inrupt/solid-ui-react";
import { VCARD, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";
import { fetch } from "@inrupt/solid-client-authn-browser";
// Import from "@inrupt/solid-client"
import {
  getSolidDataset,
  getThing,
  getStringNoLocale,
  getUrlAll
} from "@inrupt/solid-client";

const getRoleQuery = "SELECT ?o WHERE { ?s <http://www.w3.org/2006/vcard/ns#role> ?o }";
const getPODProviderUrlQuery = "SELECT ?o WHERE { ?s <http://www.w3.org/ns/solid/terms#oidcIssuer> ?o }";
const getEmailCardUrlQuery = "SELECT ?o WHERE { ?s <http://www.w3.org/2006/vcard/ns#hasEmail> ?o }";
// using email card url
const getEmailFromEmailCardUrlQuery = "SELECT ?o WHERE { ?s <http://www.w3.org/2006/vcard/ns#value> ?o }";

/**
 * The Profile component displays the information about the current logged-in user.
 * The information includes the web id, the pod url, the role, the username and the email.
 * Other information might be considered in the future, like the POD provider or phone numbers
 * and the like.
 *
 * @component
 * @param {[type]} props The webid (string) and the pod url (string)
 */
function Profile(props)
{
	const WEB_ID = props.webId;
	const POD_URL = props.podUrl;
	let [username, setUsername] = useState(""); //data.public;
	let [role, setRole] = useState("");
	let [email, setEmail] = useState("");

	const { session } = useSession();

	useEffect(() => {
		getProfileData();
	}, [POD_URL]);

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
	 * Fetch the data of the user using the web id. The function is currently a mixture
	 * of inrupt API functions and custom queries for the email.
	 * @return {[type]} [description]
	 */
	async function getProfileData()
	{
		const profileDocumentURI = WEB_ID.split('#')[0];

		// Use `getSolidDataset` to get the Profile document.
		// Profile document is public and can be read w/o authentication; i.e.: 
		// - You can either omit `fetch` or 
		// - You can pass in `fetch` with or without logging in first. 
		//   If logged in, the `fetch` is authenticated.
		// For illustrative purposes, the `fetch` is passed in.
		const myDataset = await getSolidDataset(profileDocumentURI, { fetch: session.fetch });

		console.log("dataset:", myDataset);
		// Get the Profile data from the retrieved SolidDataset
		const profile = getThing(myDataset, WEB_ID);
		console.log("profile:", profile);
		// Get the formatted name using `VCARD.fn` convenience object.
		// `VCARD.fn` includes the identifier string "http://www.w3.org/2006/vcard/ns#fn".
		// As an alternative, you can pass in the "http://www.w3.org/2006/vcard/ns#fn" string instead of `VCARD.fn`.
 
		const parsedUsername = getStringNoLocale(profile, VCARD.fn);

		// Get the role using `VCARD.role` convenience object.
		// `VCARD.role` includes the identifier string "http://www.w3.org/2006/vcard/ns#role"
		// As an alternative, you can pass in the "http://www.w3.org/2006/vcard/ns#role" string instead of `VCARD.role`.

		const parsedRole = getStringNoLocale(profile, VCARD.role);

		// let parsedEmail = getUrlAll(profile, SCHEMA_INRUPT.email);
		// console.log("parsed email:", parsedEmail);
		let parsedEmail = null;
		let resBindings = await executeQuery(getEmailCardUrlQuery, [WEB_ID], session);
		console.log("email card url res:", resBindings);
		if (resBindings.length > 0)
		{
			let parsedEmailCardUrl = parseSingleResult(resBindings);
			resBindings = await executeQuery(getEmailFromEmailCardUrlQuery, [parsedEmailCardUrl], session);
			console.log("email res:", resBindings);
			if (resBindings.length > 0)
			{
				parsedEmail = parseSingleResult(resBindings);
			}
		}
		setUsername(parsedUsername);
		setRole(parsedRole);
		setEmail(parsedEmail);
		// return {username: parsedUsername, role: parsedRole};
	}


	// async function getDetailsFromWebId()
	// {
	// 	let resBindings = await executeQuery(getRoleQuery, [WEB_ID], session);
	// 	console.log("role res:", resBindings);
	// 	if (resBindings.length > 0)
	// 	{
	// 		let parsedRole = parseSingleResult(resBindings);
	// 		setRole(parsedRole);
	// 	}
	// 	resBindings = await executeQuery(getEmailCardUrlQuery, [WEB_ID], session);
	// 	console.log("email card url res:", resBindings);
	// 	if (resBindings.length > 0)
	// 	{
	// 		let parsedEmailCardUrl = parseSingleResult(resBindings);
	// 		resBindings = await executeQuery(getEmailFromEmailCardUrlQuery, [parsedEmailCardUrl], session);
	// 		console.log("email res:", resBindings);
	// 		if (resBindings.length > 0)
	// 		{
	// 			let parsedEmail = parseSingleResult(resBindings);
	// 			setEmail(parsedEmail);
	// 		}
	// 	}
	// }

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
			<h1>Contact page of {username}</h1>
			<h4>WebId:</h4>
			{showField(WEB_ID)}
			<h4>POD url</h4>
			{showField(POD_URL)}
			<h4>Email:</h4>
			{showField(email)}
			<h4>Role</h4>
			{showField(role)}
		</>
	);
}

export default Profile;