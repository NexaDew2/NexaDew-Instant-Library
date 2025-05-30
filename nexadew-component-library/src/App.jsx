
import React, { useState } from 'react';
import Dashboard from './dashboard-components/Dashboard';
import Navbar from './components/Navbar/Navbar';


const App = () => {

  return (
    <div>
      <Navbar  />
      <Dashboard />
    </div>
  );
};

export default App;