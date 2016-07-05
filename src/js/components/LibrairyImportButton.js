import React, { Component, Proptypes } from 'react'

import Modal from './Modal'
import LibrairyUploader from './LibrairyUploader'
import LibrairyUploading from '../containers/LibrairyUploading'

import {
  closeModal,
  setModal,
} from '../actions/modal'

import { uploadPictures } from '../actions/pictures'


export default class LibrairyImportButton extends Component {

  closeModal() {
    /*
     * Close modal window
     */
    this.props.dispatch(closeModal())
  }

  uploadFiles(files) {
    this.props.dispatch(uploadPictures(files))
    //this.closeModal()
    let modal = (
      <Modal
        modal_closable={false}
        modal_max={true}
        modal_title={'Upload pictures'}
        modal_child={LibrairyUploading}
        modal_close={this.closeModal.bind(this)}
      />
    )
    this.props.dispatch(setModal(modal))
  }

  handleClick() {
    let modal = (
        <Modal
          modal_closable={true}
          modal_max={true}
          modal_close={this.closeModal.bind(this)}
          modal_title={'Upload pictures'}
          modal_child={LibrairyUploader}
          upload={this.uploadFiles.bind(this)}
        />
    )
    this.props.dispatch(setModal(modal))
  }

  render() {
    if (this.props.user.is_staff) {
      return (
          <button
            id="import-button"
            onClick={this.handleClick.bind(this)}
          >Import</button>
      )
    }
    return null
  }
}
