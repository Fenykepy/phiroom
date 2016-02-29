import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { postEditionSelector } from '../selectors/postEditionSelector'

import Modal from '../components/Modal'
import Spinner from '../components/Spinner'
import TabsBar from '../components/TabsBar'
import PostEditionForm from '../components/PostEditionForm'
import PostEditionPreview from '../components/PostEditionPreview'
import LibrairyDeleteConfirm from '../components/LibrairyDeleteConfirm'

import {
  postSetTitle,
  postSetDescription,
  postSetDraft,
  postSetSource,
  postSetPubdate,
  postAddTag,
  postDeleteTag,
  createPost,
  updatePost,
  deletePost,
} from '../actions/weblog'

import {
  setModal,
  closeModal,
} from '../actions/modal'

class PostEdition extends Component {

  handleSubmit(e) {
    e.preventDefault()
    let promise
    if (this.props.post) {
      // we update an existing post
      promise = this.props.dispatch(updatePost(this.props.post))
    } else {
      promise = this.props.dispatch(createPost())
    }
    promise.then(() => {
      //console.log('close modal')
      this.props.modal_close()
    })
    .catch(error =>
      console.log(error)
    )
  }

  handleTitleChange(e) {
    this.props.dispatch(postSetTitle(e.target.value))
  }

  handleDescriptionChange(e) {
    this.props.dispatch(postSetDescription(e.target.value))
  }

  handleDraftChange(e) {
    this.props.dispatch(postSetDraft(! this.props.edited.draft))
  }

  handleSourceChange(e) {
    this.props.dispatch(postSetSource(e.target.value))
  }

  handlePubdateChange(e) {
    this.props.dispatch(postSetPubdate(e.target.value))
  }

  handleAddTag(e) {
    // if we have nothing in input, return
    if (! e.target.value) return
    // react on tab and enter key to add a tag
    let TAB_KEY = 9
    let ENTER_KEY = 13
    if (e.which === TAB_KEY || e.which === ENTER_KEY) {
      // prevent for submit or loose focus
      e.preventDefault()
      // add tag to list
      this.props.dispatch(postAddTag(e.target.value))
      // reset input
      e.target.value = ""
    }
  }

  handleDeleteTag(tag) {
    this.props.dispatch(postDeleteTag(tag))
  }

  handleDeletePost() {
    this.props.dispatch(deletePost(this.props.edited.slug))
    this.props.modal_close()
  }

  confirmDeletePost() {
    //console.log(this.props)
    let modal = (
      <Modal
        modal_closable={true}
        modal_close={this.props.modal_close}
        modal_small={true}
        modal_title={'Delete a post'}
        modal_child={LibrairyDeleteConfirm}
        title={this.props.title}
        type={'post'}
        n_pictures={this.props.n_pictures}
        delete={this.handleDeletePost.bind(this)}
      />
    )
    this.props.dispatch(setModal(modal))
  }

  render() {
    // injected by connect() call:
    const {
      dispatch,
      edited,
    } = this.props
    //console.log('post edition form', this.props)
    
    if (this.props.edited.is_fetching) {
      return <Spinner message="Fetching..." />
    }
    if (this.props.edited.is_posting) {
      return <Spinner message="Sending..." />
    }

    let tabs = [
      {
        title: 'Edit',
        component:
          (<article id="modal-content">
            <PostEditionForm
              edited={this.props.edited}
              handleTitleChange={this.handleTitleChange.bind(this)}
              handleDescriptionChange={this.handleDescriptionChange.bind(this)}
              handleDraftChange={this.handleDraftChange.bind(this)}
              handleSourceChange={this.handleSourceChange.bind(this)}
              handlePubdateChange={this.handlePubdateChange.bind(this)}
              handleAddTag={this.handleAddTag.bind(this)}
              handleDeleteTag={this.handleDeleteTag.bind(this)}
              confirmDeletePost={this.confirmDeletePost.bind(this)}
            />
          </article>)
      },
      {
        title: 'Preview',
        component: 
          (<article id="modal-content">
            <PostEditionPreview
              pub_date={this.props.edited.pub_date}
              title={this.props.edited.title}
              source={this.props.edited.source}
            />
          </article>)
      }
    ]


    return (
      <div>
        <TabsBar
          tabs={tabs}
        />
        <footer id="modal-footer">
          <button
              type="button"
              onClick={this.props.modal_close}
            >Cancel</button>
          <input
            form="post-form"
            type="submit"
            value="Save"
            onClick={this.handleSubmit.bind(this)}
          />
        </footer>
      </div>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(postEditionSelector)(PostEdition)
