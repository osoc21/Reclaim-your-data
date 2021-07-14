import React, {useState} from "react";

import {Shape, Card, Row, Col, CardGroup, Image, Container} from 'react-bootstrap';

import "./grid-view.css";


function GridView(props){
    let files = props.files;
    let folderIcons = [];
    let openLink = props.openLink;


    function isFolder(url){
        return url.endsWith("/");
    }

    function isImage(url){
        let imageBoolean = url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".png");
        return imageBoolean;
    }

    function getName(url){
        let regex = /^https:\/\/pod\.inrupt\.com(\/\w+)*\/(\w+)/;
        const match = url.match(regex);
        console.log(match);
        return match[match.length - 1];
    }


    console.log("GridView: ");
    console.log(files);

    for(const [index, value] of files.entries()){
        folderIcons.push(
            <Card>
                {isFolder(value.url) || !isImage(value.url) ? 
                <p onClick={() => openLink(value.url)}>
                    <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" class="bi bi-folder" viewBox="0 0 16 16">
                        <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4H2.19zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707z"/>
                    </svg> 

                </p>
                    
                    :  
                     <Image variant="top" src={value.url} rounded/>
                }      
                  
                    <Card.Body>
                        <Card.Title>
                            <p onClick={() => openLink(value.url)}>
                            {getName(value.url)}
                            </p>
                        </Card.Title> 
                    </Card.Body>
     
            </Card> 
        )
    }

    return(
       
            <Row xs={3} className="g-4">
                {folderIcons}
            </Row>

        
    );
}


export default GridView;