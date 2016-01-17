import React, { Component, Proptypes } from 'react'

import Modal from './Modal'
import LibrairyUploader from './LibrairyUploader'

import {
  closeModal,
  setModal,
} from '../actions/modal'

export default class LibrairyImportButton extends Component {

  closeModal() {
    /*
     * Close modal window
     */
    this.props.dispatch(closeModal())
  }

  handleClick() {
    let modal = (
        <Modal
          modal_closable={true}
          modal_max={true}
          modal_close={this.closeModal.bind(this)}
          modal_title={'Upload pictures'}
          modal_child={LibrairyUploader}
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
