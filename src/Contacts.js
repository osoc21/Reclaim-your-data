

import { useState,React, useEffect } from "react";
import {executeQuery} from "./rdf";
import "./Contacts.css";
import {
    useSession,
  } from "@inrupt/solid-ui-react";

import PersonIcon from '@material-ui/icons/Person';



// const getPersonFilesQuery = "SELECT * WHERE { ?s http://www.w3.org/2006/vcard/ns#fn ?o }";

const getContactsBasicInfoSource = "https://pod.inrupt.com/wepodrom/contacts/people.ttl#this";
const getContactsBasicInfoQuery = "SELECT ?s ?o WHERE {?s <http://www.w3.org/2006/vcard/ns#fn> ?o}";

// const contactsWebIdSource = "https://pod.inrupt.com/wepodrom/contacts/Person/eafe09c7-4741-4251-91e3-90b0ea2aa043/index.ttl#this";
// const contactsWebIdQuery= "";

const defaultSource= "https://pod.inrupt.com/wepodrom/profile/card#me";
const defaultQuery = "SELECT * WHERE {?s ?p ?o}";

function Contacts(props)
{
	let webId = props.webId;
	let gotoScreen = props.gotoScreen;

	const { session } = useSession();
	const [bindings, setBindings] = useState([]);


	async function fetchContacts(){
		console.log(`fetching contacts of webid:'${webId}'`);
		let resBindings = await executeQuery(getContactsBasicInfoQuery,[getContactsBasicInfoSource], session);
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

  	function Contact(props)
  	{
  		let binding = props.binding;
  		const boundVariables = binding['_root'].entries.map(e => e[0]);

  		let username = binding['_root'].entries[1][1]['id'].replace(/['"]+/g, '');
  		// username = username.replace("/(\"|\"$)/", '');
  		console.log("username:", username)
  		let turtleFileUrl = binding['_root'].entries[0][1]['id'].replace(/['"]+/g, '');
  		// let turtleFileId = turtleFileUrl.slice(0, turtleFileUrl.findLastOf('/'));
  		// turtleFileId = turtleFileId.slice(turtleFileId.findLastOf('/'), -1);
  		// turtleFileUrl = turtleFileUrl.replace("/(\"|\"$)/", '');

  		return (
	      	<div className="contact">
	      		<PersonIcon/>
	          	<p className="contact-name" onClick={() => gotoScreen(`/contacts/${username}`, [turtleFileUrl])}>{username}</p>
	        </div>
  		);
  	}
	
	return (
		<div>
          {bindings.map(binding => {
          		console.log("Binding:", binding); return (<Contact binding={binding}/>)
          	}) }
      	</div>
	);
}

export default Contacts;