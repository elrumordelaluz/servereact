import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, RouterContext, browserHistory } from 'react-router';
import routes from '../shared/routes/index';

render(
  <Router history={browserHistory} routes={routes} />,
  document.querySelector( '.container' )
);
