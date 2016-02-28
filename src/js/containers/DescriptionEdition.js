import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { descriptionEditionSelector } from '../selectors/descriptionEditionSelector'

import Modal from '../components/Modal'
import Spinner from '../components/Spinner'
import DescriptionEditionForm from '../components/DescriptionEditionForm'
//import DescriptionEditionPreview from '../components/DescriptionEditionPreview'



import {
  descriptionSetTitle,
  descriptionSetSource,
  updateDescription,
} from '../actions/contact'

import {
  setModal,
  closeModal,
} from '../actions/modal'


class DescriptionEdition extends Component {

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
        <article>
          <DescriptionEditionForm
            edited={this.props.edited}
            handleTitleChange={this.handleTitleChange.bind(this)}
            handleSourceChange={this.handleSourceChange.bind(this)}
          />
        </article>
        <footer>
          <button
              type="button"
              onClick={this.props.modal_close}
            >Cancel</button>
          <input
            form="description-form"
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
export default connect(descriptionEditionSelector)(DescriptionEdition)
