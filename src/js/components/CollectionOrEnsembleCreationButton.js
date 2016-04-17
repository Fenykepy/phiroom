import React, { Component, PropTypes } from 'react'

import Modal from './Modal'
import CollectionOrEnsembleCreation from './CollectionOrEnsembleCreation'
import {
  closeModal,
  setModal,
} from '../actions/modal'

export default class CollectionOrEnsembleCreationButton extends Component {

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
        modal_title={"Create a new"}
        modal_child={CollectionOrEnsembleCreation}
        modal_close={this.closeModal.bind(this)}
        dispatch={this.props.dispatch}
      />
    )
    this.props.dispatch(setModal(modal))
  }

  render() {
    console.log('collection edition selector', this.props)
    let title = "Create new collection or new ensemble"
    return (
      <button
        title={title}
        className={this.props.className}
        onClick={this.handleClick.bind(this)}
      >{title}</button>
    )
  }
}
