import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import TopBar from '../components/TopBar';
import License from '../components/License';

import './prismjs-vs.css';
import './index.css';
import './site.css';

const TemplateWrapper = ({ children }) => (
  <main>
    <Helmet
      title="Jeff Kwak's Technical Journal"
      meta={[
        { name: 'description', content: 'A place to keep notes on all those Yaks I have to shave' },
        { name: 'keywords', content: 'technical journal, blog, code' },
      ]} >
      </Helmet>
      <link href="https://fonts.googleapis.com/css?family=Eczar:400,600" rel="stylesheet"></link>
      <link href="https://fonts.googleapis.com/css?family=Comfortaa" rel="stylesheet"></link>
    <TopBar></TopBar>
    {children()}
    <License></License>
  </main>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
