import { useState,React } from "react";
import rdfParser from "rdf-parse";
import { Store } from "n3";
import {
    useSession,
  } from "@inrupt/solid-ui-react";

import {
	getDefaultSession,
	} from "@inrupt/solid-client-authn-browser";

const newEngine = require('@comunica/actor-init-sparql').newEngine;

const queryEngine = newEngine();

function printBindings(binding) {
    const boundVariables = binding['_root'].entries.map(e => e[0]);
    for (let variable of boundVariables){
        console.log(variable, " | " ,binding.get(variable).value)
    }
}
const executeQuery = async (query, sources) => {   
    const comunicaSources = []

    for (let sourceFile of sources) {
        const store = new Store();
        const response = await fetch(sourceFile, { method: 'get' })
        const textStream = require('streamify-string')(await response.text());
        const contentType = response.headers.get('Content-Type')
        await new Promise((resolve, reject) => {
        rdfParser.parse(textStream, { contentType: contentType.split(';')[0], baseIRI: 'http://example.org' })
        .on('data', (quad) => { console.log('QUAD', quad, store); store.addQuad(quad) })
        .on('error', (error) => reject(error))
        .on('end', async () => {resolve()})
        })
        comunicaSources.push({ type: 'rdfjsSource', value: store })
    }
    
    const result = await queryEngine.query(query, {sources: comunicaSources});

    // Consume results as an array (easier)
    const bindings = await result.bindings();

    // Log metadata containing source-level provenance information
    const metadata = await result.metadata();
    console.log(metadata)

    return bindings


}
export  {printBindings, executeQuery};