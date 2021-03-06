import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, RouterContext, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { StyleSheet } from 'aphrodite';

import routes from '../shared/routes';
import configureStore from '../shared/store/configureStore';

const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState);
const rootElement = document.querySelector('.container');

StyleSheet.rehydrate(window.renderedClassNames);

render(
  <Provider store={store}>
    <Router routes={routes} history={browserHistory} />
  </Provider>,
  rootElement
);
