import React, { Component, Proptypes } from 'react'

import { connect } from 'react-redux'

import { portfolioEditionSelector } from '../selectors/portfolioEditionSelector'

import {
  portfolioSetTitle,
  portfolioSetDraft,
  portfolioSetPubdate,
  portfolioSetOrder,
} from '../actions/portfolios'


class PortfolioEditionForm extends Component {

  handleSubmit() {
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

  render() {
    // injected by connect() call:
    const {
      dispatch,
      edited, 
    } = this.props

    return (
      <div>
        <article>
          <form
            onSubmit={this.handleSubmit.bind(this)}
          >
          <p><span className="red">*</span> : required fields.</p>
            <div className="field_wrapper">
              <label htmlFor="id_title">Title:<span className="red"> *</span></label>
              <input id="id_title"
                     name="title"
                     type="text"
                     value={this.props.edited.title}
                     maxLength="254"
                     onChange={this.handleTitleChange.bind(this)}
                     required
              />
            </div>
            <div className="field_wrapper">
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
              <input id="id_pubdate"
                     name="title"
                     type="datetime-local"
                     value={this.props.edited.pubdate}
                     onChange={this.handlePubdateChange.bind(this)}
              />
            </div>
            <div className="field_wrapper">
              <label htmlFor="id_order">Order:</label>
              <input id="id_order"
                     name="order"
                     type="number"
                     value={this.props.edited.order}
                     onChange={this.handleOrderChange.bind(this)}
                     min="0"
              />
            </div>
          </form>
        </article>
        <footer>
          <button
              onClick={this.props.modal_close}
            >Cancel</button>
            <button
              className="primary"
            >Save</button>
        </footer>
      </div>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(portfolioEditionSelector)(PortfolioEditionForm)
