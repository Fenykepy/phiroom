import React, { Component, Proptypes } from 'react'

import { connect } from 'react-redux'

import { portfolioEditionSelector } from '../selectors/portfolioEditionSelector'


import Modal from '../components/Modal'
import Spinner from '../components/Spinner'
import TabsBar from '../components/TabsBar'
import PortfolioEditionForm from '../components/PortfolioEditionForm'
import LibrairyDeleteConfirm from '../components/LibrairyDeleteConfirm'


import {
  portfolioSetTitle,
  portfolioSetDraft,
  portfolioSetPubdate,
  portfolioSetOrder,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from '../actions/portfolios'

import {
  setModal,
  closeModal,
} from '../actions/modal'

class PortfolioEdition extends Component {

  handleSubmit(e) {
    e.preventDefault()
    // we update an existing portfolio
    let promise
    if (this.props.portfolio) {
      promise = this.props.dispatch(updatePortfolio(this.props.portfolio))
    } else {
      // we create a new portfolio
      promise = this.props.dispatch(createPortfolio())
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
    this.props.dispatch(portfolioSetTitle(e.target.value))
  }

  handleDraftChange(e) {
    this.props.dispatch(portfolioSetDraft(! this.props.edited.draft))
  }

  handlePubdateChange(e) {
    this.props.dispatch(portfolioSetPubdate(e.target.value))
  }

  handleOrderChange(e) {
    this.props.dispatch(portfolioSetOrder(e.target.value))
  }

  handleDeletePortfolio() {
    this.props.dispatch(deletePortfolio(this.props.edited.slug))
    this.props.modal_close()
  }

  confirmDeletePortfolio() {
    let modal = (
        <Modal
          modal_closable={true}
          modal_close={this.props.modal_close}
          modal_small={true}
          modal_title={'Delete a portfolio'}
          modal_child={LibrairyDeleteConfirm}
          title={this.props.title}
          type={'portfolio'}
          n_pictures={this.props.n_pictures}
          delete={this.handleDeletePortfolio.bind(this)}
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
    //console.log('portfolio edition', this.props)
    
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
              <PortfolioEditionForm
                edited={this.props.edited}
                handleTitleChange={this.handleTitleChange.bind(this)}
                handleDraftChange={this.handleDraftChange.bind(this)}
                handlePubdateChange={this.handlePubdateChange.bind(this)}
                handleOrderChange={this.handleOrderChange.bind(this)}
                confirmDeletePortfolio={this.confirmDeletePortfolio.bind(this)}
              />
          </article>)
      },
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
            form="portfolio-form"
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
export default connect(portfolioEditionSelector)(PortfolioEdition)
