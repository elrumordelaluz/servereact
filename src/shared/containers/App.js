import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class App extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className='my-app'>
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
