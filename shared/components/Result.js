import React, { Component } from 'react';

class Result extends Component {
  constructor (props) {
    super(props);
    this.state = {
      result: []
    }
  }

  renderResults () {
    return this.state.result.map(icon => {
      return (
        <div 
          style={{ display: 'inline-block', padding: 10 }}
          key={icon.iconSlug}>
          <h3>{icon.name}</h3>
          <p>{icon.package}</p>
        </div>
      )
    })
  }

  render () {
    return (
      <div>
        <h2>Result for: {this.props.params.term}</h2>
        {this.renderResults()}
      </div>
    );
  }
}

export default Result;
