

import { useState,React, useEffect } from "react";
import rdfParser from "rdf-parse";
import { Store } from "n3";
import {executeQuery, printBindings} from "./rdf";
import {
    useSession,
  } from "@inrupt/solid-ui-react";


const contactsWebIdSource = "https://pod.inrupt.com/wepodrom/contacts/Person/eafe09c7-4741-4251-91e3-90b0ea2aa043/index.ttl#this";
const contactsWebIdQuery= "SELECT * WHERE { ?s http://www.w3.org/2006/vcard/ns#fn ?o }";

const defaultSource= "https://pod.inrupt.com/wepodrom/";
const defaultQuery = "SELECT * WHERE {?s ?p ?o}";

function Contacts(props)
{
	let webId = props.webId;
	const { session } = useSession();
	const [bindings, setBindings] = useState([]);


	const newEngine = require('@comunica/actor-init-sparql').newEngine;


	function printBindings(binding) {
		const boundVariables = binding['_root'].entries.map(e => e[0]);
		for (let variable of boundVariables){
			console.log(variable, " | " ,binding.get(variable).value);
		}
	}
	async function executeQuery (query, sources) {   
		const comunicaSources = []
		const queryEngine = newEngine();
		for (let sourceFile of sources) {
			console.log("fetching", sourceFile, "...");
			const store = new Store();
			const response = await session.fetch(sourceFile, { method: 'get' })
			const textStream = require('streamify-string')(await response.text());
			const contentType = response.headers.get('Content-Type');
			await new Promise((resolve, reject) => {
				rdfParser.parse(textStream, { contentType: contentType.split(';')[0], baseIRI: 'http://example.org' })
				.on('data', (quad) => { console.log('QUAD', quad, store); store.addQuad(quad) })
				.on('error', (error) => reject(error))
				.on('end', async () => {resolve()})
			});
			comunicaSources.push({ type: 'rdfjsSource', value: store })
		}
		
		const result = await queryEngine.query(query, {sources: comunicaSources});
	
		// Consume results as an array (easier)
		const bindings = await result.bindings();
	
		// Log metadata containing source-level provenance information
		const metadata = await result.metadata();
		console.log(metadata)
	
		return bindings;
	}

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