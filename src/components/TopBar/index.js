import React from 'react';
import logo from './test.svg';

const TopBar = () => (
  <div id="topbar" className="top-bar headroom">
    <div className="top-bar-left" >
      <a href="/"><img src={logo} alt="Technical Notes Site Icon" className="logo"/></a>
    </div>
    <div className="top-bar-middle">
      <h1 className="site-title">technical notes</h1>
    </div>
    <div className="top-bar-right"></div>
  </div>
);

export default TopBar;
