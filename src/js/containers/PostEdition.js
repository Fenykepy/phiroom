import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { postEditionSelector } from '../selectors/postEditionSelector'

import Modal from '../components/Modal'
import Spinner from '../components/Spinner'
import PostEditionForm from '../components/PostEditionForm'
//import PostEditionPreview from '../components/PostEditionPreview'
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

  constructor(props) {
    super(props)

    this.state = {
      preview: false
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    // switch back to form if necessary, else promise fails
    if (this.state.preview) this.setState({preview: false}) 
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

  showForm() {
    if (this.state.preview) {
      this.setState({ preview: false })
    }
  }

  showPreview() {
    if ( ! this.state.preview) {
      this.setState({ preview: true })
    }
  }

  getTabs() {
    return(
      <div className="tabs-bar">
        <button
          type="button"
          className={ ! this.state.preview ? "active" : ""}
          onClick={this.showForm.bind(this)}
        >Edit</button>
        <button
          type="button"
          className={this.state.preview ? "active" : ""}
          onClick={this.showPreview.bind(this)}
        >Preview</button>
      </div>
    )
  }

  getContent() {
    if (this.state.preview) {
      return null
    }
    return (
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
    )
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

    return (
      <div>
        {this.getTabs()}
        <article id="modal-content">
          {this.getContent()}
        </article>
        <footer>
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
