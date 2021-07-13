import React, {useState} from "react";

import "./grid-view.scss";

<link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet"></link>


function GridView(props){
    //let filePaths = props.filePaths;
    let filePaths = ["path1", "path2", "path3", "path4"];
    let folderIcons = [];



    console.log("GridView: " + filePaths);

    for(const [index, value] of filePaths.entries()){
        folderIcons.push(
            <li class="mdc-image-list__item">
                <div class="mdc-image-list__image-aspect-container">
                    <img class="mdc-image-list__image" src="https://pod.inrupt.com/wepodrom/WePod/food/panCakes.jpg" />
                </div>
                <div class="mdc-image-list__supporting">
                    <span class="mdc-image-list__label">Text label</span>
                </div>
             
            </li> 
        )
    }

    return(
       <ul class = "mdc-image-list custom-image-list">
        {folderIcons}
       </ul>
    );
}


export default GridView;