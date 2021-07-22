

import { useState,React, useEffect } from "react";
import rdfParser from "rdf-parse";
import { Store } from "n3";
import {executeQuery, printBindings} from "./rdf";
import {
    useSession,
  } from "@inrupt/solid-ui-react";


const contactsWebIdSource = "https://pod.inrupt.com/wepodrom/contacts/Person/eafe09c7-4741-4251-91e3-90b0ea2aa043/index.ttl#this";
const contactsWebIdQuery= "SELECT * WHERE { ?s http://www.w3.org/2006/vcard/ns#fn ?o }";

const defaultSource= "https://pod.inrupt.com/wepodrom/profile/card#me";
const defaultQuery = "SELECT * WHERE {?s ?p ?o}";

function Contacts(props)
{
	let webId = props.webId;
	const { session } = useSession();
	const [bindings, setBindings] = useState([]);


	async function fetchContacts(){
		console.log(`fetching contacts of webid:'${webId}'`);
		let resBindings = await executeQuery(defaultQuery,[defaultSource]);
		// let contactWebIds = await executeQuery();
		await setBindings(resBindings);
	}
	
	useEffect(() => {
		fetchContacts();
	}, [webId])
	

	function bindingsView(binding) {
	    const boundVariables = binding['_root'].entries.map(e => e[0]);
		console.log("Bound variables:\n", boundVariables);

	    return (
	      <>
	      { boundVariables.map(variable => (
	          <p>
	              <span>{variable}</span> <span>{binding.get(variable).value}</span>
	          </p>
	        ))}
	      </>
	    );
	  }
	
	return (
		<div>
          {bindings.map(binding => {
          		console.log("Binding:", binding);return bindingsView(binding)
          	}) }
      </div>
	);
}

export default Contacts;