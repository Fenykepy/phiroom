import  React, { Component, PropTypes } from 'react'

import LibrairyLeftPanelCollectionEnsembleItem from './LibrairyLeftPanelCollectionEnsembleItem'

export default class LibrairyLeftPanelCollectionsEnsemblesSet extends Component {
  render() {
    //console.log('collectionsEnsemblesSet',this.props)
    if (this.props.ensembles) {
      return (
        <ul>
          {this.props.ensembles.map(ensemble =>
            <LibrairyLeftPanelCollectionEnsembleItem
              key={ensemble.pk}
              handleDrop={this.props.handleDrop}
              {...ensemble}
            />
          )}
        </ul>
      )
    }
    return null
  }
}
