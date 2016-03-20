import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

import LibrairyLeftPanelCollectionsSet from './LibrairyLeftPanelCollectionsSet'
import LibrairyLeftPanelCollectionsEnsemblesSet from './LibrairyLeftPanelCollectionsEnsemblesSet'


export default class LibrairyLeftPanelCollections extends Component {

  render() {
    //console.log('librairyLeftPanelCollections', this.props)
    if (this.props.user.is_librairy_member && this.props.collections) {
      return (
        <div>
          <h6>Collections</h6>
          <LibrairyLeftPanelCollectionsEnsemblesSet
            ensembles={this.props.collections.children}
          />
          <LibrairyLeftPanelCollectionsSet
            collections={this.props.collections.collection_set}
          />
        </div>
      )
    }
    return null
  }
}
