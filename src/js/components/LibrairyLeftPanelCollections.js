import React, { Component, PropTypes } from 'react'

import { PICTURE } from '../constants/dragTypes'


import {
  addPict2Collection,
  dragEnd
} from '../actions/librairy'

import CollectionOrEnsembleCreationButton from './CollectionOrEnsembleCreationButton'
import LibrairyLeftPanelCollectionsSet from './LibrairyLeftPanelCollectionsSet'
import LibrairyLeftPanelCollectionsEnsemblesSet from './LibrairyLeftPanelCollectionsEnsemblesSet'


export default class LibrairyLeftPanelCollections extends Component {

  constructor(props) {
    super(props)

    this.state = {
      show: false,
    }
  }

  handleDrop(collection) {
    if (! this.props.drag.type == PICTURE) {
      return this.props.dispatch(dragEnd())
    }
    this.props.drag.data.map(picture => {
      this.props.dispatch(addPict2Collection(collection, picture))
    })
  }

  handleClick() {
    this.setState({show: ! this.state.show})
  }

  render() {
    //console.log('librairyLeftPanelCollections', this.props)
    if (this.props.user.is_librairy_member && this.props.collections) {
      return (
        <div>
          <h6><span
              onClick={this.handleClick.bind(this)}
            >Collections</span>
            <CollectionOrEnsembleCreationButton
              className="plus"
              dispatch={this.props.dispatch}
            />
          </h6>
          <div
            style={{display: this.state.show ? "block" : "none"}}
          >
            <LibrairyLeftPanelCollectionsEnsemblesSet
              ensembles={this.props.collections.children}
              handleDrop={this.handleDrop.bind(this)}
            />
            <LibrairyLeftPanelCollectionsSet
              collections={this.props.collections.collection_set}
              handleDrop={this.handleDrop.bind(this)}
            />
          </div>
        </div>
      )
    }
    return null
  }
}
