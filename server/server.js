import express from 'express';
import path from 'path';

import React from 'react';
import { renderToString } from 'react-dom/server';

import { Router, RouterContext, match } from 'react-router';
import { Provider } from 'react-redux';
import createLocation from 'history/lib/createLocation';
import routes from '../shared/routes/index';

import configureStore from '../shared/store/configureStore';
import { fetchComponentDataBeforeRender } from '../shared/api/fetchComponentDataBeforeRender';

import packagejson from '../package.json';

const ROOT_URL = 'https://orion-api.herokuapp.com';
const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiTGlvbmVsIFQiLCJwYXNzd29yZCI6ImVscnVtb3JkZWxhbHV6IiwiaWF0IjoxNDU5MjQ1Nzc0LCJleHAiOjE0NjE4Mzc3NzR9.PYcKG04L9ZWUJc6f5neseU-g5O-vS-keBVNJCtW3cVw';

const app = express();

app.use('/assets', express.static(path.join(__dirname, '../client/assets')))

var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')

var config = require('../webpack.config')
var compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.get('/', (req, res) => {

  const location = createLocation(req.url);

  match ({ routes, location }, ( err, redirectLocation, renderProps ) => {

    if(err) {
      console.error(err);
      return res.status(500).end('Internal server error');
    }

    if(!renderProps) {
      return res.status(404).end('Not found');
    }

    const store = configureStore({ version: packagejson.version });

    const initialView = (
      <Provider store={store}>
        <RouterContext {...renderProps} />
      </Provider>
    );

    //This method waits for all render component promises to resolve before returning to browser
    fetchComponentDataBeforeRender(store.dispatch, renderProps.components, renderProps.params)
      .then(html => {
        const componentHTML = React.renderToString(initialView);
        const initialState = store.getState();
        res.status(200).end(renderFullPage(componentHTML,initialState))
      })
      .catch(err => {
        console.log(err)
        res.end(renderFullPage("",{}))
      });

  });
});

function renderFullPage(html, initialState) {
  return `
  <!doctype html>
  <html lang="utf-8">
    <head>
    <title>ServeReact</title>
    </head>
    <body>
    <div class="container">${html}</div>
    <script>
      window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
      console.log(__INITIAL_STATE__)
    </script>
    <script src="/static/bundle.js"></script>
    </body>
  </html>
  `
};

// example of handling 404 pages
app.get('*', function(req, res) {
  res.status(404).send('Server.js > 404 - Page Not Found');
})

// global error catcher, need four arguments
app.use((err, req, res, next) => {
  console.error("Error on request %s %s", req.method, req.url);
  console.error(err.stack);
  res.status(500).send("Server error");
});

process.on('uncaughtException', evt => {
  console.log( 'uncaughtException: ', evt );
})

app.listen(3000, function(){
  console.log('Listening on port 3000');
});
