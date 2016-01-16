import React, { Component, PropTypes } from 'react'

export default class LibrairyPicturesListItemMenu extends Component {

  handleRemove(e) {
    // don't follow link
    e.preventDefault()
    // remove pict from portfolio || post || collection
    this.props.removePicture(this.props.pk)
    // close context menu
    this.props.close()
  }

  handleDelete(e) {
    // don't follow link
    e.preventDefault()
    // delete picture from phiroom
    this.props.deletePicture(this.props.pk)
    // close context menu
    this.props.close()
  }

  handleLink(e) {
    // close context menu
    this.props.close()
  }
  
  render() {
    return (
        <ul>
          <li><a
            target="_blank"
            href={'/media/images/previews/large/' + this.props.previews_path}
            onClick={this.handleLink.bind(this)}
          >Open large version in new tab</a></li>
          <li><a
            target="_blank"
            href={'/media/' + this.props.source_file}
            onClick={this.handleLink.bind(this)}
          >Open original in new tab</a></li>
          <li><a
            href=""
            onClick={this.handleRemove.bind(this)}
          >Remove from {this.props.container}</a></li>
          <hr />
          <li><a
            href=""
            onClick={this.handleDelete.bind(this)}
          >Delete from Phiroom</a></li>
        </ul>
    )
  }
}
