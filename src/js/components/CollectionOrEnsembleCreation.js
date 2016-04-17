import React, { Component, PropTypes } from 'react'

import CollectionEditionButton from './CollectionEditionButton'
//import EnsembleEditionButton from './EnsembleEditionButton'


export default class CollectionOrEnsembleCreation extends Component {
  render() {
    return (
      <footer className="adjoined-buttons-bar">
        <CollectionEditionButton
          dispatch={this.props.dispatch}
          title={"Collection"}
        />
        <button>Ensemble</button>
      </footer>
    )
  }
}
