import React, { Component, PropTypes } from 'react'

export default class LibrairyPicturesListItemMenu extends Component {
  
  render() {
    return (
        <ul>
          <li><a>Open large version in new tab</a></li>
          <li><a>Open original in new tab</a></li>
          <li><a>Remove from {this.props.container}</a></li>
          <hr />
          <li><a>Delete from Phiroom</a></li>
        </ul>
    )
  }
}
