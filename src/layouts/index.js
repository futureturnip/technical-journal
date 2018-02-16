import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import TopBar from '../components/TopBar';
import License from '../components/License';
import './index.css';
import './site.css';

const TemplateWrapper = ({ children }) => (
  <main>
    <Helmet
      title="Coffee Driven Developer"
      meta={[
        { name: 'description', content: 'A place to keep notes on all those Yaks I have to shave' },
        { name: 'keywords', content: 'technical journal, blog, code' },
      ]}
    />
    <TopBar></TopBar>
    <div className="content">
      {children()}
    </div>
    <License></License>
  </main>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
