import express from 'express';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Router, RouterContext, match } from 'react-router';
import { Provider } from 'react-redux';
import createLocation from 'history/lib/createLocation';
import { fetchComponentDataBeforeRender } from '../shared/api/fetchComponentDataBeforeRender';

import Helm from 'react-helmet';
import { StyleSheetServer } from 'aphrodite';

import webpack from 'webpack';
import webpackConfig from '../../webpack.config';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import routes from '../shared/routes/index';
import configureStore from '../shared/store/configureStore';
import packagejson from '../../package.json';

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOSTNAME || "localhost");

const renderFullPage = (html, css, initialState) => {
  const head = Helm.rewind();
  return `
    <!doctype html>
    <html lang="utf-8">
      <head>
        <style data-aphrodite>${css.content}</style>
        ${head.title.toString()}
        ${head.meta.toString()}
        ${head.link.toString()}
      </head>
      <body>
        <div class="container">${html}</div>
        <script>
          window.renderedClassNames = ${JSON.stringify(css.renderedClassNames)};
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
        </script>
        <script src="/assets/bundle.js"></script>
      </body>
    </html>
  `;
};

if (process.env.NODE_ENV !== 'production') {
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use('/assets', express.static(path.join(__dirname, '../client/assets')));
}


// SSR Logic
app.get('*', (req, res) => {

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
    // TODO: Make a way more generic to manage params instead of `renderProps.params.id`,
    //      now returns an error in the path without params
    fetchComponentDataBeforeRender(store.dispatch, renderProps.components, renderProps.params.id)
      .then(() => {
        // const componentHTML = renderToString(initialView);

        const {html, css} = StyleSheetServer.renderStatic(() => {
            return renderToString(initialView);
        });
        const initialState = store.getState();
        res.status(200).end(renderFullPage(html, css, initialState));
      })
      .catch(err => {
        console.log(err)
        res.end(renderFullPage("",{}))
      });

  });
});



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

app.listen(app.get('port'), () => {
	console.info("==> ✅  Server is listening");
	console.info("==> 🌎  Go to http://%s:%s", app.get('host'), app.get('port'));
});
