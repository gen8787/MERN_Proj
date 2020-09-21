//==   I M P O R T S   ==||
import React from 'react';
import './App.css';
import { Router, Link } from '@reach/router';
import { Container, Divider } from '@material-ui/core';

//==   C O M P O N E N T S   ==||

function App() {
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

      <Router>
      </Router>
    </Container>
  );
}

export default App;