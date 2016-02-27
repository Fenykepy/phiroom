import React, { Component, PropTypes } from 'react'

export default class LibrairyDeleteConfirm extends Component {

  render() {
    let picts = this.props.n_pictures ? this.props.n_pictures : 'no'
    console.log('librairy delete confirm', this.props)
    return (
      <div>
        <article>
            <h6>Are you sure you want to delete this {this.props.type}:</h6>
            <p>{this.props.title}</p>
            <p><em>It contains {picts} pictures.</em></p>
            <p><strong><em>(this operation is irreversible)</em></strong></p>
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
