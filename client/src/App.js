//==   I M P O R T S   ==||
import React, { useState } from 'react';
import './App.css';
import { Router, Link } from '@reach/router';
import { Container, Divider } from '@material-ui/core';

//==   C O M P O N E N T S   ==||
import Map from './components/Map';
import Map2 from './components/Map2';

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
      
      <Container>
        <Map markerPosition={markerPosition}/>
      </Container>

      <div>
        Current markerPosition: lat: {lat}, lng: {lng}
      </div>
      <button onClick={moveMarker}>Move marker</button>
      
      <Container>
        <Map2 />
      </Container>


      <Router>
      </Router>
    </Container>
  );
}

export default App;