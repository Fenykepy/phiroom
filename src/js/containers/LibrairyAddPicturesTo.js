import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { addPicturesToSelector } from '../selectors/addPicturesToSelector'

import {
  addPict2Collection,
  addPict2Post,
  addPict2Portfolio,
} from '../actions/librairy'

import LibrairyAddPicturesToForm from '../components/LibrairyAddPicturesToForm'

let CONTAINER_TYPES = [
  'Collection',
  'Post',
  'Portfolio',
]

class LibrairyAddPicturesTo extends Component {

  constructor(props) {
    super(props)

    this.state = {
      container_type: CONTAINER_TYPES[0],
      container_id: ' ',
    }
  }

  getContainerIDs() {
    switch(this.state.container_type) {
      case CONTAINER_TYPES[0]:
        return this.props.collectionsIDs
      case CONTAINER_TYPES[1]:
        return this.props.postsIDs
      case CONTAINER_TYPES[2]:
        return this.props.portfoliosIDs
    }
  }

  handleSubmit(e) {
    e.preventDefault()

    let action 
    switch(this.state.container_type) {
      case CONTAINER_TYPES[0]:
        action = addPict2Collection
      case CONTAINER_TYPES[1]:
        action = addPict2Post
      case CONTAINER_TYPES[2]:
        action = addPict2Portfolio
    }

    this.props.pictures.map(picture => {
      this.props.dispatch(action(
        this.state.container_id,
        picture))
    })

  }
  
  handleContainerTypeChange(e) {
    this.setState({
      container_type: e.target.value,
      container_id: ' ',
    })
  }

  handleContainerIDChange(e) {
    this.setState({container_id: e.target.value})
  }

  render() {
    // injected by connect() call:
    const {
      dispatch,
      collectionsIDs,
      postsIDs,
      portfoliosIDS,
    } = this.props

    console.log('AddPicturesTo', this.props)

    return (
      <div>
        <article id="modal-content">
          <LibrairyAddPicturesToForm
            containersTypes={CONTAINER_TYPES}
            containerIDs={this.getContainerIDs()}
            containerType={this.state.container_type}
            containerID={this.state.container_id}
            handleContainerTypeChange={this.handleContainerTypeChange.bind(this)}
            handleContainerIDChange={this.handleContainerIDChange.bind(this)}
          />
        </article>
        <footer id="modal-footer">
          <button
            type="button"
            onClick={this.props.modal_close}
          >Cancel</button>
          <input
            form="add-picture-to-form"
            type="submit"
            value="Add"
            onClick={this.handleSubmit.bind(this)}
          />
        </footer>
      </div>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(addPicturesToSelector)(LibrairyAddPicturesTo)

