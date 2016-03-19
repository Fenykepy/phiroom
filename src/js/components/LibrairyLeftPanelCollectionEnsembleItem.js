import  React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

import LibrairyLeftPanelCollectionsSet from './LibrairyLeftPanelCollectionsSet'
import LibrairyLeftPanelCollectionsEnsemblesSet from './LibrairyLeftPanelCollectionsEnsemblesSet'

export default class LibrairyLeftPanelCollectionEnsembleItem extends Component {

  
  render() {
    //console.log('collectionEnsembleItem', this.props)
    return (
      <li>
        <Link to={`/librairy/collections-ensemble/${this.props.pk}/`}
          activeClassName="Selected"
        >{this.props.name}</Link>
        <LibrairyLeftPanelCollectionsEnsemblesSet
          ensembles={this.props.children}
        />
        <LibrairyLeftPanelCollectionsSet
          collections={this.props.collection_set}
        />
      </li>
    )
  }
 
}
