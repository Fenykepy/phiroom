import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { descriptionEditionSelector } from '../selectors/descriptionEditionSelector'

import Modal from '../components/Modal'
import Spinner from '../components/Spinner'

import {
  descriptionSetTitle,
  descriptionSetSource,
  updateDescription,
} from '../actions/contact'

import {
  setModal,
  closeModal,
} from '../actions/modal'

class DescriptionEditionForm extends Component {

  handleSubmit(e) {
    e.preventDefault()
    this.props.dispatch(updateDescription())
      .then(() =>
        this.props.modal_close()
      )
      .catch(error =>
        console.log(error)
      )
  }

  handleTitleChange(e) {
    this.props.dispatch(descriptionSetTitle(e.target.value))
  }

  handleSourceChange(e) {
    this.props.dispatch(descriptionSetSource(e.target.value))
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
    //console.log('description edition form', this.props)
    
    if (this.props.edited.is_fetching) {
      return <Spinner message="Fetching..." />
    }
    if (this.props.edited.is_posting) {
      return <Spinner message="Sending..." />
    }

    return (
      <div>
        <div className="tabs-bar">
          <button
            type="button"
            className="active"
            onClick={this.showForm}
          >Edit</button>
          <button
            type="button"
            onClick={this.showPreview}
          >Preview</button>

        </div>
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
              <div className="help-text">Title of the contact page.</div>
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
              <div className="help-text">Source of the contact page's description, markdown syntax.</div>
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
export default connect(descriptionEditionSelector)(DescriptionEditionForm)
