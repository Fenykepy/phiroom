import React, { Component, Proptypes } from 'react'

import Modal from './Modal'
import PortfolioEdition from '../containers/PortfolioEdition'

import {
  closeModal,
  setModal,
} from '../actions/modal'

import {
  newPortfolio,
  editPortfolio,
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
    if (this.props.portfolio) {
      // feed form with portfolio to update
      this.props.dispatch(editPortfolio(this.props.portfolio))
    } else {
      // new portfolio is created
      this.props.dispatch(newPortfolio())
    }
    let modal = (
      <Modal
        modal_closable={true}
        modal_close={this.closeModal.bind(this)}
        modal_title={this.getTitle()}
        modal_child={PortfolioEdition}
        portfolio={this.props.portfolio}
        n_pictures={this.props.n_pictures}
        title={this.props.title}
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
