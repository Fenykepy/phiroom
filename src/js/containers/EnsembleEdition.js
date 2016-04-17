import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { ensembleEditionSelector } from '../selectors/ensembleEditionSelector'


import Modal from '../components/Modal'
import Spinner from '../components/Spinner'
import EnsembleEditionForm from '../components/EnsembleEditionForm'
import LibrairyDeleteConfirm from '../components/LibrairyDeleteConfirm'
import {
  ensembleSetName,
  ensembleSetParent,
  createEnsemble,
  updateEnsemble,
  deleteEnsemble,
} from '../actions/collections'

import {
  setModal,
  closeModal,
} from '../actions/modal'

class EnsembleEdition extends Component {

  handleSubmit(e) {
    e.preventDefault()
    let promise
    if (this.props.ensemble) {
      // we update existing ensemble
      promise = this.props.dispatch(updateEnsemble(this.props.ensemble))
    } else {
      // we create new ensemble
      promise = this.props.dispatch(createEnsemble(this.props.ensemble))
    }
    promise.then(() => {
      this.props.modal_close()
    })
    .catch(error =>
      console.log(error)
    )
  }

  handleNameChange(e) {
    this.props.dispatch(ensembleSetName(e.target.value))
  }

  handleParentChange(e) {
    this.props.dispatch(ensembleSetParent(e.target.value))
  }

  handleDeleteEnsemble() {
    this.props.dispatch(deleteEnsemble(this.props.ensemble))
    this.props.modal_close()
  }

  confirmDeleteEnsemble() {
    let modal = (
      <Modal
        modal_closable={true}
        modal_close={this.props.modal_close}
        modal_small={true}
        modal_title={'Delete a collection ensemble'}
        modal_child={LibrairyDeleteConfirm}
        title={this.props.name}
        type={'collection ensemble'}
        n_pictures={this.props.n_pictures}
        delete={this.handleDeleteEnsemble.bind(this)}
      />
    )
    this.props.dispatch(setModal(modal))
  }

  render() {
    // injected by connect call:
    const {
      dispatch,
      edited,
      ensembles,
    } = this.props

    //console.log('ensemble edition', this.props)
    
    if (this.props.edited.is_fetching) {
      return <Spinner message="Fetching..." />
    }
    if (this.props.edited.is_posting) {
      return <Spinner message="Sending..." />
    }

    return (
      <div>
        <article id="modal-content">
          <EnsembleEditionForm
            edited={this.props.edited}
            ensembles={this.props.ensembles}
            handleNameChange={this.handleNameChange.bind(this)}
            handleParentChange={this.handleParentChange.bind(this)}
            confirmDeleteEnsemble={this.confirmDeleteEnsemble.bind(this)}
          />
        </article>
        <footer id="modal-footer">
          <button
            type="button"
            onClick={this.props.modal_close}
          >Cancel</button>
          <input
            form="ensemble-form"
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
export default connect(ensembleEditionSelector)(EnsembleEdition)
