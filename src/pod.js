

const solidwebPattern = "https:\/\/(\w+\.)solidweb.org\/";
const podInruptPattern = "https:\/\/pod\.inrupt\.com\/\w+\/";
const tempPodPattern = /https:\/\/(\w+\.)solidweb.org\/|https:\/\/pod\.inrupt\.com\/\w+\//;

function getPODUrlFromWebId(webId) 
{
    return webId.match(tempPodPattern)[0];
}

export {getPODUrlFromWebId};
export default getPODUrlFromWebId;