import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from '../components/App';
import Index from '../components/Index';
import Result from '../components/Result';
import NotFound from '../components/NotFound';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Index}/>
    <Route path="/search/:term" component={Result} />  
    <Route path="*" component={NotFound} />  
  </Route>
);
