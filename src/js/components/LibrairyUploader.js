import React, { Component, Proptypes } from 'react'

export default class LibrairyUploader extends Component {

  handleAddPictureClick(e) {
    /*
     * Emulate click on file input when button
     * is clicked to hide ugly input and open browser
     * file selection window
     */
    e.preventDefault()
    let input = document.getElementById('uploader-input')
    input.click()
  }

  render() {
    return (
      <div id="librairy-uploader">
        <article
          className="files-preview"
          title="You can add picture's files here by drag and drop or clicking on 'Add pictures button', then deactivate the ones you don't want to upload and click 'upload' button."
        >
          <p className="helper">Drag some pictures here or click "Add pictures" button.</p>
          <button className="primary"
            onClick={this.handleAddPictureClick}
          >Add pictures</button>
          <input id="uploader-input" type="file" multiple style={{display: "none"}} />
        </article>
        <footer>
          <button
              onClick={this.props.modal_close}
            >Cancel</button>
            <button
              className="primary"
            >Upload</button>
        </footer>
      </div>
    )
  }
}
