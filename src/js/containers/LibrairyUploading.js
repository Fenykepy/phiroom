import React, { Component, Proptypes } from 'react'

import { connect } from 'react-redux'

import { librairyUploadingSelector } from '../selectors/librairyUploadingSelector'

import Spinner from '../components/Spinner'
import LibrairyUploaded from '../components/LibrairyUploaded'

class LibrairyUploading extends Component {
  
  render() {
    // injected by connect() call:
    const {
      dispatch,
      count,
      uploaded,
      uploading,
      fails,
    } = this.props
    
    if (! uploading) {
      return (
        <LibrairyUploaded
          modal_close={this.props.modal_close}
          count={this.props.count}
          fails={this.props.fails}
        />
      )
    }
    let message = `Uploading picture ${this.props.uploaded} of ${this.props.count}...`
    return (
      <div id="librairy-uploader">
        <article className="files-preview">
          <Spinner message={message} />
          <ul>
            {this.props.fails.map(item =>
              <li>Failed to upload picture {item}.</li>
            )}
          </ul>
        </article>
        <footer id="modal-footer">
          <button
              onClick={this.props.modal_close}
            >Cancel</button>
        </footer>
      </div>
    )
  }
}


// Wrap the component to inject dispatch and state into it
export default connect(librairyUploadingSelector)(LibrairyUploading)

