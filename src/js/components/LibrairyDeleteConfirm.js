import React, { Component, PropTypes } from 'react'

export default class LibrairyDeleteConfirm extends Component {

  render() {
    let picts = this.props.n_pictures ? this.props.n_pictures : 'no'
    console.log('librairy delete confirm', this.props)
    return (
      <div>
        <article id="modal-content">
            <h6>Are you sure you want to delete {this.props.type} "{this.props.title}" ?</h6>
            <p>It contains {picts} pictures.</p>
            <p><em>(this operation is irreversible)</em></p>
        </article>
        <footer id="modal-footer">
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
