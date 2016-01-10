import React, { Component, PropTypes } from 'react'

export default class LibrairyPicturesListItemMenu extends Component {

  handleRemove(e) {
    // don't follow link
    e.preventDefault()
    // remove pict
    this.props.removePicture(this.props.pk)
    // close context menu
    this.props.close()
  }
  
  render() {
    return (
        <ul>
          <li><a
            target="_blank"
            href={'/media/images/previews/large/' + this.props.previews_path}
          >Open large version in new tab</a></li>
          <li><a
            target="_blank"
            href={'/media/' + this.props.source_file}
          >Open original in new tab</a></li>
          <li><a
            href=""
            onClick={this.handleRemove.bind(this)}
          >Remove from {this.props.container}</a></li>
          <hr />
          <li><a href="">Delete from Phiroom</a></li>
        </ul>
    )
  }
}
