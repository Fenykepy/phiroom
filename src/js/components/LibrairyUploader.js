import React, { Component, Proptypes } from 'react'

import { listsHaveCommon } from '../helpers/utils'

import LibrairyUploaderItem from './LibrairyUploaderItem'


export default class LibrairyUploader extends Component {

  constructor(props) {
    super(props)
    
    this.accepted_drop = ["Files"]

    this.state = {
      dragover: false,
      files: [],
    }
  }

  dropValid(types) {
    /*
     * Returns true if drag object is valid for basket
     */
    return listsHaveCommon(types, this.accepted_drop)
  }

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
  

  handleAddFiles(files) {
    /*
     * Add given files to list
     */
    let new_files = this.state.files.slice()
    let imageType = /image.*/
    for (let i=0, l=files.length; i < l; i++) {
      let file = files[i]
      if (!file.type.match(imageType)) {
        continue
      }
      // add added property
      file.addedAt = Date.now()
      new_files.push(file)
    }
    this.setState({files: new_files})
  }

  handleRemoveFile(index) {
    /*
     * Remove given file from list
     */
    let new_state = this.state.files.slice()
    new_state.splice(index, 1)
    this.setState({files: new_state})
  }

  handleDrop(e) {
    if (this.dropValid(e.dataTransfer.types)) {
      e.preventDefault()
      this.setState({dragover: false})
      this.handleAddFiles(
          e.dataTransfer.files)
    }
  }

  handleDragEnter(e) {
    if (this.dropValid(e.dataTransfer.types)) {
      e.preventDefault()
      this.setState({dragover: true})
    }
  }

  handleDragLeave(e) {
    e.preventDefault()
    this.setState({dragover: false})
  }

  handleDragOver(e) {
    if (this.dropValid(e.dataTransfer.types)) {
      e.preventDefault()
      e.dataTransfer.dropEffect = "copy"
    }
  }

  handleInputChange(e) {
    this.handleAddFiles(
        e.target.files
    )
  }


  getClasses() {
    let classes = ["files-preview"]
    if (this.state.dragover) {
      classes.push("dragover")
    }
    return classes.join(" ")
  }

  render() {
    console.log('state files', this.state.files)
    return (
      <div id="librairy-uploader">
        <article
          className={this.getClasses()}
          onDragEnter={this.handleDragEnter.bind(this)}
          onDragLeave={this.handleDragLeave.bind(this)}
          onDragOver={this.handleDragOver.bind(this)}
          onDrop={this.handleDrop.bind(this)}
          title="You can add picture's files here by drag and drop or clicking on 'Add pictures button', then deactivate the ones you don't want to upload and click 'upload' button."
        >
          {this.state.files.map((file, index) =>
              <LibrairyUploaderItem
                file={file}
                index={index}
                remove={this.handleRemoveFile.bind(this)}
                key={file.name + file.addedAt}
              />
          )}
          <p className="helper">Drag some pictures here or click "Add pictures" button.</p>
          <button className="primary"
            onClick={this.handleAddPictureClick}
          >Add pictures</button>
          <input
            id="uploader-input"
            type="file"
            multiple
            style={{display: "none"}}
            onChange={this.handleInputChange.bind(this)}
          />
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
