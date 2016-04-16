import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { collectionEditionSelector } from '../selectors/collectionEditionSelector'


import Modal from '../components/Modal'
import Spinner from '../components/Spinner'
import CollectionEditionForm from '../components/CollectionEditionForm'
import LibrairyDeleteConfirm from '../components/LibrairyDeleteConfirm'
import {
  collectionSetName,
  collectionSetEnsemble,
  createCollection,
  updateCollection,
  //deleteCollection,
} from '../actions/collections'

import {
  setModal,
  closeModal,
} from '../actions/modal'

class CollectionEdition extends Component {

  handleSubmit(e) {
    e.preventDefault()
    let promise
    if (this.props.collection) {
      // we update an existing collection
      promise = this.props.dispatch(updateCollection(this.props.collection))
    } else {
      // we create a new collection
      promise = this.props.dispatch(createCollection())
    }
    promise.then(() => {
      this.props.modal_close()
    })
    .catch(error =>
      console.log(error)
    )
  }

  handleNameChange(e) {
    this.props.dispatch(collectionSetName(e.target.value))
  }

  handleEnsembleChange(e) {
    this.props.dispatch(collectionSetEnsemble(e.target.value))
  }

  handleDeleteCollection() {
    //this.props.dispatch(deleteCollection(this.props.collection))
    this.props.modal_close()
  }

  confirmDeleteCollection() {
    let modal = (
      <Modal
        modal_closable={true}
        modal_close={this.props.modal_close}
        modal_small={true}
        modal_title={'Delete a collection'}
        modal_child={LibrairyDeleteConfirm}
        title={this.props.name}
        type={'collection'}
        delete={this.handleDeleteCollection.bind(this)}
      />
    )
    this.props.dispatch(setModal(modal))
  }

  render() {
    // injected by connect() call:
    const {
      dispatch,
      edited,
      ensembles,
    } = this.props
    //console.log('collection edition', this.props)

    if (this.props.edited.is_fetching) {
      return <Spinner message="Fetching..." />
    }
    if (this.props.edited.is_posting) {
      return <Spinner message="Sending..." />
    }

    return (
      <div>
        <article id="modal-content">
          <CollectionEditionForm
            edited={this.props.edited}
            ensembles={this.props.ensembles}
            handleNameChange={this.handleNameChange.bind(this)}
            handleEnsembleChange={this.handleEnsembleChange.bind(this)}
          />
        </article>
        <footer id="modal-footer">
          <button
            type="button"
            onClick={this.props.modal_close}
          >Cancel</button>
          <input
            form="collection-form"
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
export default connect(collectionEditionSelector)(CollectionEdition)
