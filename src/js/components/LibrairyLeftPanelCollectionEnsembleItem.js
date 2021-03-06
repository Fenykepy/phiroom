import  React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

import LibrairyLeftPanelCollectionsSet from './LibrairyLeftPanelCollectionsSet'
import LibrairyLeftPanelCollectionsEnsemblesSet from './LibrairyLeftPanelCollectionsEnsemblesSet'

export default class LibrairyLeftPanelCollectionEnsembleItem extends Component {

  
  render() {
    //console.log('collectionEnsembleItem', this.props)
    return (
      <li
        className="collection-ensemble"
        title={'Collection\'s ensemble: ' + this.props.name}
      >
        <Link to={`/librairy/collection-ensemble/${this.props.pk}/`}
          activeClassName="selected"
        >{this.props.name}</Link>
        <LibrairyLeftPanelCollectionsEnsemblesSet
          ensembles={this.props.children}
          handleDrop={this.props.handleDrop}
        />
        <LibrairyLeftPanelCollectionsSet
          collections={this.props.collection_set}
          handleDrop={this.props.handleDrop}
        />
      </li>
    )
  }
 
}
