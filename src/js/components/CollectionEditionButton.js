import React, { Component, PropTypes } from 'react'

import Modal from './Modal'
import CollectionEdition from '../containers/CollectionEdition'

import {
  closeModal,
  setModal,
} from '../actions/modal'

import {
  newCollection,
  editCollection,
} from '../actions/collections'

export default class CollectionEditionButton extends Component {
  closeModal() {
    /*
     * Close modal window
     */
    this.props.dispatch(closeModal())
  }

  getTitle() {
    if (this.props.collection) {
      return 'Edit collection'
    }
    return 'New collection'
  }

  handleClick() {
    if (this.props.collection) {
      // feed form with collection to update
      this.props.dispatch(editCollection(this.props.collection))
    } else {
      // new collection is created
      this.props.dispatch(newCollection())
    }
    let modal = (
      <Modal
        modal_closable={true}
        modal_close={this.closeModal.bind(this)}
        modal_title={this.getTitle()}
        modal_child={CollectionEdition}
        collection={this.props.collection}
        n_pictures={this.props.n_pictures}
        name={this.props.name}
      />
    )
    this.props.dispatch(setModal(modal))
  }

  render() {
    //console.log('collection edition button', this.props)
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
