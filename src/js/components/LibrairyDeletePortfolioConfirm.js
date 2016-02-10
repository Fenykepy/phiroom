import React, { Component, PropTypes } from 'react'

export default class LibrairyDeletePortfolioConfirm extends Component {
  
  render() {
    return (
        <div>
          <article>
            <h6>Are you sure you want to delete this portfolio: {this.props.portfolio.title}</h6>
            <em>It contains {this.props.portfolio.n_pictures} pictures.</em>
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
