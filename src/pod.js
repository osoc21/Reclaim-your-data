
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

/**
 * Checks whether or not the provided URL is a folder.
 *
 * @param url {string} `URL`
 * @returns {boolean} boolean
 */
function isFolderUrl(url) {
    return url.endsWith("/");
}

/**
 * Return the name of a file or folder associated with the provided URL.
 *
 * @param url {string} `URL to the file or folder.`
 * @returns {string} `Name of file.`
 */
function getFileNameFromUrl(url) {
    // let regex = /^https:\/\/pod\.inrupt\.com(\/\w+)*\/(\w+)/;
    let name = "";
    if (isFolderUrl(url))
    {
        console.log("folder!!");
        let slashPos = url.slice(0, url.length - 2).lastIndexOf("/");
        name = url.slice(slashPos + 1, url.length-2);
    }
    else
    {
        console.log("file!!");
        let slashPos = url.lastIndexOf("/");
        name = url.slice(slashPos + 1, url.length-1);
    }
    
    return name;
}


export {getPODUrlFromWebId, isFolderUrl, getFileNameFromUrl};
export default getPODUrlFromWebId;