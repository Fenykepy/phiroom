import React, { Component, PropTypes } from 'react'

export default class LibrairyPictureDetail extends Component {
  render() {
    return (
      <section id="librairy-detail">
        <header id="toolbar">
          <div className="title">
            <strong>{this.props.title}</strong>
          </div>
        </header>
        <article>
          <img
            src={'/media/images/previews/large/' + this.props.previews_path}
          />
        </article>
      </section>
    )
  }
}
