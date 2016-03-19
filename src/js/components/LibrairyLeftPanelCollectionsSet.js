import  React, { Component, PropTypes } from 'react'


import LibrairyLeftPanelCollectionItem from './LibrairyLeftPanelCollectionItem'

export default class LibrairyLeftPanelCollectionsSet extends Component {
  render() {
    if (this.props.collections) {
      return (
        <ul>
          {this.props.collections.map(collection =>
            <LibrairyLeftPanelCollectionItem
              key={collection.pk}
              {...collection}
            />
          )}
        </ul>
      )
    }
    return null
  }
}
