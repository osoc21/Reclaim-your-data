import React, {useState} from "react";

import {Shape, Card, Row, Col, CardGroup, Image, Container} from 'react-bootstrap';

import "./grid-view.css";


function GridView(props){
    //let filePaths = props.filePaths;
    let filePaths = ["path1", "path2", "path3", "path4", "path5"];
    let folderIcons = [];



    console.log("GridView: " + filePaths);

    for(const [index, value] of filePaths.entries()){
        folderIcons.push(
            <Card>      
                    <Image variant="top" src="https://pod.inrupt.com/wepodrom/WePod/food/panCakes.jpg" rounded/>
                    <Card.Body>
                        <Card.Title>Card title</Card.Title> 
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