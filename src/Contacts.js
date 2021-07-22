

import { useState,React, useEffect } from "react";
import rdfParser from "rdf-parse";
import { Store } from "n3";
import {executeQuery, printBindings} from "./rdf";
import {
    useSession,
  } from "@inrupt/solid-ui-react";


const contactsWebIdQuery= "SELECT * WHERE { ?s http://www.w3.org/2006/vcard/ns#fn ?o }";
const contactsWebIdSource = "https://pod.inrupt.com/wepodrom/contacts/Person/eafe09c7-4741-4251-91e3-90b0ea2aa043/index.ttl#this"
const  defaultSource= "https://pod.inrupt.com/wepodrom/profile/card#me"
const defaultQuery = "SELECT * WHERE {?s ?p ?o}"
function Contacts(props)
{
	let webId = props.webId;
	
	useEffect(() => {
		let res = executeQuery(defaultQuery,defaultSource);
		for (let binding of res){
			printBindings(binding);
		}
	}, [webId])
	
	
	return (
		<ul>
			<li>Romain</li>
			<li>Jerry</li>
			<li>Lin De</li>
			<li>Cyrille</li>
		</ul>
	);
}

export default Contacts;