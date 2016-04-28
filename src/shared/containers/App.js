import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

class App extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className='my-app'>
        <Helmet
          title="Home"
          titleTemplate="MySite.com - %s" />
        <span className="version">v{this.props.version}</span>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    version : state.version
  };
}

export default connect(mapStateToProps)(App);
