import React, { Component, Proptypes } from 'react'

import Modal from './Modal'
import PortfolioEditionForm from '../containers/PortfolioEditionForm'

import {
  closeModal,
  setModal,
} from '../actions/modal'

import {
  newPortfolio,
  updatePortfolio,
} from '../actions/portfolios'

export default class PortfolioEditionButton extends Component {

  closeModal() {
    /*
     * Close modal window
     */
    this.props.dispatch(closeModal())
  }

  getTitle() {
    if (this.props.portfolio) {
      return 'Edit portfolio'
    }
    return 'New portfolio'
  }

  handleClick() {
    console.log('handleclick', this.props.portfolio)
    if (this.props.portfolio) {
      // feed form with portfolio to update
      this.props.dispatch(updatePortfolio(this.props.portfolio))
    } else {
      // new portfolio is created
      this.props.dispatch(newPortfolio())
    }
    let modal = (
      <Modal
        modal_closable={true}
        modal_close={this.closeModal.bind(this)}
        modal_title={this.getTitle()}
        modal_child={PortfolioEditionForm}
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
