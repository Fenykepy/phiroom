import React, { Component, Proptypes } from 'react'


export default class LibrairyUploaded extends Component {

  render() {
    let success = this.props.count - this.props.fails.length
    let plural = success > 1 ? 'pictures' : 'picture'
    let message = `Successfully uploaded ${this.props.count} ${plural}.`
    if (this.props.fails) {
      // we got some errors…
    }
    return (
      <div id="librairy-uploader">
        <article className="files-preview">
          <p className="helper">{message}</p>
          <ul>
            {this.props.fails.map(item =>
              <li>Failed to upload picture {item}.</li>
            )}
          </ul>
        </article>
        <footer id="modal-footer">
          <button
              className="primary"
              onClick={this.props.modal_close}
            >Ok</button>
        </footer>
      </div>
    )
  }
}
