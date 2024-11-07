import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <Sidebar />
      <div className="content">
        <h1>Benvingut a la HomePage</h1>
        <p>Aquesta és la pàgina principal després diniciar sessió.</p>
      </div>
    </div>
  );
};

export default HomePage;
