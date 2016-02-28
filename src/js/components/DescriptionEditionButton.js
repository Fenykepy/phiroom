import React, { Component, PropTypes } from 'react'

import Modal from './Modal'
import DescriptionEdition from '../containers/DescriptionEdition'

import {
  closeModal,
  setModal,
} from '../actions/modal'

import { editDescription } from '../actions/contact'

export default class DescriptionEditionButton extends Component {

  closeModal() {
    /*
     * Close modal window
     */
    this.props.dispatch(closeModal())
  }

  handleClick() {
    // prefill form with current description
    this.props.dispatch(editDescription())
    let modal = (
      <Modal
        modal_closable={true}
        modal_close={this.closeModal.bind(this)}
        modal_title={'Edit contact page\'s description'}
        modal_child={DescriptionEdition}
      />
    )
    this.props.dispatch(setModal(modal))
  }

  render() {
    return (
      <button
        type="button"
        className={this.props.className}
        onClick={this.handleClick.bind(this)}
      >Edit</button>
    )
  }
}
