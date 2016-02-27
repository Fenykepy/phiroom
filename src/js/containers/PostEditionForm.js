import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { postEditionSelector } from '../selectors/postEditionSelector'

import Modal from '../components/Modal'
//import LibrairyDeletePost Confirm from '../components/LibrairyDeletePostConfirm'

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

class PostEditionForm extends Component {

  handleSubmit(e) {
    console.log('submit')
    e.preventDefault()
    let promise
    if (this.props.post) {
      // we update an existing post
      promise = this.props.dispatch(updatePost(this.props.post))
    } else {
      promise = this.props.dispatch(createPost())
    }
    promise.then(() => {
      console.log('close modal')
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

  confirmDeletePost() {
    console.log(this.props)
  }

  getDeleteButton() {
    // we update existing post
    if (this.props.edited.slug) {
      return (
        <button
          type="button"
          onClick={this.confirmDeletePost.bind(this)}
        >Delete post</button>)
    }
    return null
  }

  listTags() {
    // if we have tags we list them
    if (this.props.edited.tags) {
      return this.props.edited.tags.map(tag =>
        <div 
          className="tag"
          key={tag}
        >{tag}<span className="del">×</span></div>
      )
    }
    return null
  }

  getFieldErrors(field = 'non_field_errors') {
    if (this.props.edited.errors && this.props.edited.errors[field]) {
      let errors = this.props.edited.errors[field]
      return (
        <ul className="error-list">
          {errors.map(error =>
            <li
              key={error}
            >{error}</li>
          )}
        </ul>
      )
    }
    return null
  }

  render() {
    // injected by connect() call:
    const {
      dispatch,
      edited,
    } = this.props
    console.log('post edition form', this.props)
    console.log('render post edition form')

    return (
      <div>
        {this.getDeleteButton()}
        <form
          onSubmit={this.handleSubmit.bind(this)}
        >
          <article>
          <p><span className="red">*</span> : required fields.</p>
            {this.getFieldErrors()}
            <div className="field_wrapper">
              <label htmlFor="id_title">Title:<span className="red"> *</span></label>
              {this.getFieldErrors('title')}
              <input id="id_title"
                     name="title"
                     type="text"
                     value={this.props.edited.title}
                     placeholder="title"
                     maxLength="254"
                     required
                     onChange={this.handleTitleChange.bind(this)}
              />
              <div className="help-text">Title of the post, should be unique.</div>
            </div>
            <div className="field_wrapper">
              <label htmlFor="id_description">Description:</label>
              {this.getFieldErrors('description')}
              <input id="id_description"
                     name="description"
                     type="text"
                     value={this.props.edited.description}
                     placeholder="description"
                     maxLength="254"
                     required
                     onChange={this.handleDescriptionChange.bind(this)}
              />
              <div className="help-text">Description of the post, shown under title in detail view.</div>
            </div>
            <div className="field_wrapper">
              <label htmlFor="id_source">Source:<span className="red"> *</span></label>
              {this.getFieldErrors('source')}
              <textarea id="id_source"
                     name="source"
                     rows="15"
                     value={this.props.edited.source}
                     placeholder="source"
                     required
                     onChange={this.handleSourceChange.bind(this)}
              />
              <div className="help-text">Source of the post, markdown syntax.</div>
            </div>

            <div className="field_wrapper">
              {this.getFieldErrors('draft')}
              <div className="checkbox">
                <label htmlFor="id_draft"><input id="id_draft"
                       name="draft"
                       type="checkbox"
                       value={this.props.edited.draft}
                       onChange={this.handleDraftChange.bind(this)}
                       defaultChecked={false}
                />Draft (won't be published yet.)
    </label>
              </div>
            </div>
            <div className="field_wrapper">
              <label htmlFor="id_pubdate">Publication date:</label>
              {this.getFieldErrors('pub_date')}
              <input id="id_pubdate"
                     name="pub_date"
                     type="datetime"
                     value={this.props.edited.pub_date}
                     onChange={this.handlePubdateChange.bind(this)}
              />
            </div>
            <div className="field_wrapper">
              <label htmlFor="id_tags">Keywords:</label>
              {this.getFieldErrors('tags_flat_list')}
              <div className="tags_container">
                <input id="id_tags"
                  name="tags_flat_list"
                  type="text"
                  placeholder="add tags..."
                  onKeyDown={this.handleAddTag.bind(this)}
                  onKeyPress={this.handleAddTag.bind(this)}
                />
                {this.listTags()}
              </div>
            </div>
        </article>
        <footer>
          <button
              type="button"
              onClick={this.props.modal_close}
            >Cancel</button>
          <input
            type="submit"
            value="Save"
          />
        </footer>
        </form>
      </div>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(postEditionSelector)(PostEditionForm)
