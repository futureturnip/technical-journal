import React from 'react';
import Link from 'gatsby-link';
import logo from './logo.svg';
import feed from './feed.svg';

const TopBar = () => (
  <div id="topbar" className="top-bar">
    <div className="top-bar-left" >
      <Link to="/"><img src={logo} alt="this sites logo, an astronaut helmet" className="logo" /></Link>
    </div>
    <div className="top-bar-middle">
      <h1 className="site-title">technical notes</h1>
    </div>
    <div className="top-bar-right">
      {/* I don't want the feed to go through the react router. Just using good old anchor tag (POAT)*/}
      <a href="feed.xml" className="nav-icon"><img src={feed} alt="clickable icon representing an rss feed for this site" /></a>
    </div>
    <div className="top-bar-menu">
      <Link to="/about" className="top-bar-menu-item">About</Link>
    </div>
  </div>
);

export default TopBar;
