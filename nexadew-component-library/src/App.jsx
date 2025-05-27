
import React, { useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
// import {Button} from './components/Button/Button';
import Navbar from './components/Navbar/Navbar';

const App = () => {

  return (
    <div>
      <Navbar />
      <Dashboard />
    </div>
  );
};

export default App;