import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import TopBar from '../components/TopBar';
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
    <div
      style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '0px 1.0875rem 1.45rem',
        paddingTop: 0,
      }}
    >
      {children()}
    </div>
    <div>
      <a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.
    </div>
  </main>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
