import React, { Component, PropTypes } from 'react'

import Modal from './Modal'
import PostEdition from '../containers/PostEdition'

import {
  closeModal,
  setModal,
} from '../actions/modal'

import {
  newPost,
  editPost,
} from '../actions/weblog'

export default class PostEditionButton extends Component {

  closeModal() {
    /*
     * Close modal window
     */
    this.props.dispatch(closeModal())
  }

  getTitle() {
    if (this.props.post) {
      return 'Edit post'
    }
    return 'New post'
  }

  handleClick() {
    if (this.props.post) {
      // feed form with post to update
      this.props.dispatch(editPost(this.props.post))
    } else {
      // new post is created
      this.props.dispatch(newPost())
    }
    let modal = (
      <Modal
        modal_closable={true}
        modal_close={this.closeModal.bind(this)}
        modal_title={this.getTitle()}
        modal_child={PostEdition}
        post={this.props.post}
        n_pictures={this.props.n_pictures}
        title={this.props.title}
      />
    )
    this.props.dispatch(setModal(modal))
  }

  render() {
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
