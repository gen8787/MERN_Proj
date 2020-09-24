//==   I M P O R T S   ==||
import React, { useState } from 'react';
import './App.css';
import { Router, Link } from '@reach/router';
import { Container, Divider } from '@material-ui/core';
import { Card, CardTitle, CardText, Button } from 'reactstrap';

//==   C O M P O N E N T S   ==||
import MainMap from './components/MainMap';
import LeafMap from './components/LeafMap';
import ReactLeafMap from './components/ReactLeafMap';
import TestMap from './components/TestMap';
import MapBox from './components/MapBox';

function App() {

  const [markerPosition, setMarkerPosition] = useState({
    lat: 46.8427,
    lng: -121.7382
  });

  const { lat, lng } = markerPosition;

  function moveMarker() {
    setMarkerPosition({
      lat: lat + 0.0001,
      lng: lng + 0.0001
    });
  }

//==   R E T U R N   ==||
  return (
    <Container>
      <Container>
        <h1 className="mt-1">MERN Proj</h1>
        <Link to="/">some link</Link>
          <span> | </span>
        <Link to="/">other link</Link>
        <Divider/>
      </Container>
      
      {/* <Container>
        <LeafMap markerPosition={markerPosition}/>
      </Container>

      <div>
        Current markerPosition: lat: {lat}, lng: {lng}
      </div>
      <button onClick={moveMarker}>Move marker</button> */}

      {/* <Container>
        <ReactLeafMap />
      </Container> */}

      {/* <Container>
        <TestMap />
      </Container> */}

      <Container>
        <MapBox />
      </Container>



      <Router>
      </Router>
    </Container>
  );
}

export default App;