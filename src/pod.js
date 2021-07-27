
const tempPodPattern = /https:\/\/(\w+\.)solidweb.org\/|https:\/\/pod\.inrupt\.com\/\w+\//;

/**
 * Takes a web id as parameter, and returns the pod url associated to it.
 * For inrupt PODs, this comes down to isolating a prefix of the web id.
 * For other pod providers, this might be different.
 * @param  {[type]} webId The web id of the user
 * @return {[type]}       The pod url associated with the web id
 */
function getPODUrlFromWebId(webId) {
    return webId.match(tempPodPattern)[0];
}

export {getPODUrlFromWebId};
export default getPODUrlFromWebId;