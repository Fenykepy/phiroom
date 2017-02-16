import React, { Component, PropTypes } from 'react'

export default class LibrairyPicturesListItemMenu extends Component {

  handleRemove(e) {
    // don't follow link
    e.preventDefault()
    // remove pict from portfolio || post || collection
    this.props.removePicture(this.props.sha1)
    this.props.close()
  }

  handleDelete(e) {
    // don't follow link
    e.preventDefault()
    // delete picture from phiroom
    this.props.deletePicture(this.props.sha1)
    // close context menu
    this.props.close()
  }

  handleAddTo(e) {
    // don't follow link
    e.preventDefault()
    // open form
    this.props.addTo(this.props.sha1)
    // close context menu
    this.props.close()
  }

  handleLink(e) {
    // close context menu
    this.props.close()
  }

  getRemoveLink() {
    /* 
     * if picture is removable
     * (portfolios, posts, collections)
     * show remove link
     * else (all pictures, last importation) not
     */
    if (this.props.removePicture) {
      return (
          <li><a
            href=""
            onClick={this.handleRemove.bind(this)}
          >Remove from {this.props.container}</a></li>
        )
    }
    return null
  }
  
  render() {
    return (
      <div>
        <div id="overlay" className="transparent"
          onClick={this.props.close}
        />
        <ul className="menu">
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
          {this.getRemoveLink()}
          <li><a
            href=""
            onClick={this.handleAddTo.bind(this)}
          >Add to...</a></li>
          <hr />
          <li><a
            href=""
            onClick={this.handleDelete.bind(this)}
          >Delete from Phiroom</a></li>
        </ul>
      </div>
    )
  }
}

LibrairyPicturesListItemMenu.propTypes = {
  source_file: PropTypes.string.isRequired,
  sha1: PropTypes.string.isRequired,
  previews_path: PropTypes.string.isRequired,
  container: PropTypes.string.isRequired,
  removePicture: PropTypes.func, // optional: not available in all pictures list
  deletePicture: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  addTo: PropTypes.func.isRequired,
}
