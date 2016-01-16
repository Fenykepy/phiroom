import React, { Component, PropTypes } from 'react'

export default class LibrairyDeletePictureConfirm extends Component {
  render() {

    return (
        <div className="delete-picture-confirm">
          <article>
            <img src={'/media/images/previews/max-500/'
                + this.props.picture.previews_path} />
            <h6>Are you sure you want to delete this picture "{this.props.picture.name}" ?</h6>
            <strong><em>(this operation is irreversible)</em></strong>
          </article>
          <footer>
            <button>Cancel</button>
            <button className="primary">Delete</button>
          </footer>
        </div>
    )
    
  }
}
