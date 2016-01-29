import React, { Component, Proptypes } from 'react'

import { connect } from 'react-redux'

import { portfolioEditionSelector } from '../selectors/portfolioEditionSelector'

import {
  portfolioSetTitle,
  portfolioSetDraft,
  portfolioSetPubdate,
  portfolioSetOrder,
  createPortfolio,
  updatePortfolio,
} from '../actions/portfolios'


class PortfolioEditionForm extends Component {

  handleSubmit(e) {
    e.preventDefault()
    // we update an existing portfolio
    let promise
    if (this.props.edited.slug) {
      promise = this.props.dispatch(updatePortfolio())
    } else {
      // we create a new portfolio
      promise = this.props.dispatch(createPortfolio())
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

    return (
      <div>
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
                     maxLength="254"
                     required
                     onChange={this.handleTitleChange.bind(this)}
              />
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
              {this.getFieldErrors('pubdate')}
              <input id="id_pubdate"
                     name="title"
                     type="datetime-local"
                     value={this.props.edited.pubdate}
                     onChange={this.handlePubdateChange.bind(this)}
              />
            </div>
            <div className="field_wrapper">
              <label htmlFor="id_order">Order:</label>
              {this.getFieldErrors('order')}
              <input id="id_order"
                     name="order"
                     type="number"
                     value={this.props.edited.order}
                     onChange={this.handleOrderChange.bind(this)}
                     min="0"
              />
            </div>
        </article>
        <footer>
          <button
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
export default connect(portfolioEditionSelector)(PortfolioEditionForm)
