import { React } from "react";
import rdfParser from "rdf-parse";
import { Store } from "n3";

const newEngine = require('@comunica/actor-init-sparql').newEngine;
const queryEngine = newEngine();

/**
 * Takes a RDF query and a list of source urls, and executes the query on them
 * before returning bindings for the results.
 * The session object is needed to avoid errors with the header content type.
 * @param  {[type]} query   The query to execute
 * @param  {[type]} sources The source urls, pointing to turtle files
 * @param  {[type]} session A session object reference
 * @return {[type]}         The result bindings
 */
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


export  {executeQuery};