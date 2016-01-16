import React, { Component, PropTypes } from 'react'

export default class LibrairyDeletePictureConfirm extends Component {
  render() {

    let title
    if (this.props.pictures.length > 1) {
      title = 'Are you sure you want to delete those ' +
        this.props.pictures.length + ' pictures ?'
    } else {
      title = 'Are you sure you want to delete this picture "'
        + this.props.pictures[0].name + '" ?'
    }

    return (
        <div className="delete-picture-confirm">
          <article>
            <div className="thumb-wrapper">
            {this.props.pictures.map(picture =>
                <img src={'/media/images/previews/max-500/'
                + picture.previews_path} />
            )}
            </div>
            <h6>{title}</h6>
            <strong><em>(this operation is irreversible)</em></strong>
          </article>
          <footer>
            <button
              onClick={this.props.modal_close}
            >Cancel</button>
            <button
              className="primary"
              onClick={this.props.delete}
            >Delete</button>
          </footer>
        </div>
    )
    
  }
}
