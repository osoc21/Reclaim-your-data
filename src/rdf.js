import { React } from "react";
import rdfParser from "rdf-parse";
import { Store } from "n3";

const newEngine = require('@comunica/actor-init-sparql').newEngine;
const queryEngine = newEngine();

function printBindings(binding) {
    const boundVariables = binding['_root'].entries.map(e => e[0]);
    for (let variable of boundVariables){
        console.log(variable, " | " ,binding.get(variable).value);
    }
}


async function executeQuery (query, sources, session) {
    const comunicaSources = [];

    for (let sourceFile of sources) {
        const store = new Store();
        const response = await session.fetch(sourceFile, { method: 'get' });
        const textStream = require('streamify-string')(await response.text());
        const contentType = response.headers.get('Content-Type');
        console.log("Content type:", contentType);
        // const strippedUrl = sourceFile.split("#")[0];
        await new Promise((resolve, reject) => {
            rdfParser.parse(textStream, { contentType: contentType.split(';')[0], baseIRI: sourceFile })
            .on('data', (quad) => { console.log('QUAD', quad, store); store.addQuad(quad) })
            .on('error', (error) => reject(error))
            .on('end', async () => {resolve()})
        });
        comunicaSources.push({ type: 'rdfjsSource', value: store });
    }

    const result = await queryEngine.query(query, {sources: comunicaSources});

    // Consume results as an array (easier)
    const bindings = await result.bindings();

    // Log metadata containing source-level provenance information
    const metadata = await result.metadata();
    console.log(metadata)

    return bindings;
}


export  {printBindings, executeQuery};