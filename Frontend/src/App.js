import './App.css';
import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import Navbar from './Navbar';
import Routes from './Routes'
import { Container } from '@material-ui/core';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Container maxWidth="lg">
          <Routes />
        </Container>
      </BrowserRouter>
    </div>
  );
}

export default App;
