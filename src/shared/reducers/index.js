import { combineReducers } from 'redux';

import version from './version';
import { selectedReddit, postsByReddit } from './reddit';

const rootReducer = combineReducers({
  version: version,
  selectedReddit: selectedReddit,
  postsByReddit: postsByReddit,
});

export default rootReducer;
