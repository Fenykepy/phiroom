import React, { Component, PropTypes } from 'react'

export default class LibrairyDeletePortfolioConfirm extends Component {
  
  render() {
    console.log('delete portfolio confirm', this.props)
    return (
        <div>
          <article>
            <h6>Are you sure you want to delete this portfolio:</h6>
            <p>{this.props.title}</p>
            <p><em>It contains {this.props.n_pictures} pictures.</em></p>
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
