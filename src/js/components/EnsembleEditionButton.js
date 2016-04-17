import React, { Component, PropTypes } from 'react'

import Modal from './Modal'
import EnsembleEdition from '../containers/EnsembleEdition'

import {
  closeModal,
  setModal,
} from '../actions/modal'

import {
  newEnsemble,
  editEnsemble,
} from '../actions/collections'

export default class EnsembleEditionButton extends Component {
  closeModal() {
    /*
     * Close modal window
     */
    this.props.dispatch(closeModal())
  }

  getTitle() {
    if (this.props.title) {
      return this.props.title
    }
    if (this.props.ensemble) {
      return 'Edit collection\'s ensemble'
    }
    return 'New collection\'s ensemble'
  }

  handleClick() {
    if (this.props.ensemble) {
      // feed form with ensemble to update
      this.props.dispatch(editEnsemble(this.props.ensemble))
    } else {
      // new ensemble is created
      this.props.dispatch(newEnsemble())
    }
    let modal = (
      <Modal
        modal_closable={true}
        modal_close={this.closeModal.bind(this)}
        modal_title={this.getTitle()}
        modal_child={EnsembleEdition}
        ensemble={this.props.ensemble}
        n_pictures={this.props.n_pictures}
        name={this.props.name}
      />
    )
    this.props.dispatch(setModal(modal))
  }

  render() {
    //console.log('ensemble edition button', this.props)
    let title = this.getTitle()
    return (
      <button
        title={title}
        className={this.props.className}
        onClick={this.handleClick.bind(this)}
      >{title}</button>
    )
  }
}
