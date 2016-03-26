import React, { Component, PropTypes } from 'react'

import { PICTURE } from '../constants/dragTypes'


import {
  addPict2Collection,
  dragEnd
} from '../actions/librairy'


import { Link } from 'react-router'

import LibrairyLeftPanelCollectionsSet from './LibrairyLeftPanelCollectionsSet'
import LibrairyLeftPanelCollectionsEnsemblesSet from './LibrairyLeftPanelCollectionsEnsemblesSet'


export default class LibrairyLeftPanelCollections extends Component {


  handleDrop(collection) {
    if (! this.props.drag.type == PICTURE) {
      return this.props.dispatch(dragEnd())
    }
    this.props.drag.data.map(picture => {
      this.props.dispatch(addPict2Collection(collection, picture))
    })
  }


  render() {
    console.log('librairyLeftPanelCollections', this.props)
    if (this.props.user.is_librairy_member && this.props.collections) {
      return (
        <div>
          <h6>Collections</h6>
          <LibrairyLeftPanelCollectionsEnsemblesSet
            ensembles={this.props.collections.children}
            handleDrop={this.handleDrop.bind(this)}
          />
          <LibrairyLeftPanelCollectionsSet
            collections={this.props.collections.collection_set}
            handleDrop={this.handleDrop.bind(this)}
          />
        </div>
      )
    }
    return null
  }
}
