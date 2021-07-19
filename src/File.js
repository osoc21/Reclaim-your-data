import React, {useEffect, useState} from "react";

function File(props) {
    function getName(url){
        let regex = /^https:\/\/pod\.inrupt\.com(\/\w+)*\/(\w+)/;
        const match = url.match(regex);
        //console.log(match);
        return match[match.length - 1];
    }
}

export default File;