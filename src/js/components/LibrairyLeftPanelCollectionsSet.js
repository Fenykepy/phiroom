import  React, { Component, PropTypes } from 'react'

import LibrairyLeftPanelCollectionItem from './LibrairyLeftPanelCollectionItem'

export default class LibrairyLeftPanelCollectionsSet extends Component {

  render() {
    //console.log('librairyLeftPanelCollectionsSet', this.props)
    if (this.props.collections) {
      return (
        <ul>
          {this.props.collections.map(collection =>
            <LibrairyLeftPanelCollectionItem
              key={collection.pk}
              handleDrop={this.props.handleDrop}
              {...collection}
            />
          )}
        </ul>
      )
    }
    return null
  }
}
