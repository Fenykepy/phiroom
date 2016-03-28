import React, { Component, Proptypes } from 'react'

import FormFieldErrors from './FormFieldErrors'
import FormRequiredFields from './FormRequiredFields'


export default class PortfolioEditionForm extends Component {

  getDeleteButton() {
    // we update existing portfolio
    if (this.props.edited.slug) {
      return (
        <div className="admin-links">
          <button
            type="button"
            onClick={this.props.confirmDeletePortfolio}
          >Delete portfolio</button>
        </div>)
    }
    return null
  }

  render() {
    //console.log('portfolio edition form', this.props)
    return (
      <form
        id="portfolio-form"
      >
        {this.getDeleteButton()}
        <FormRequiredFields />
        <FormFieldErrors
          errors_list={this.props.edited.errors}
          field={'non_field_errors'}
        />
        <div className="field_wrapper">
          <label htmlFor="id_title">Title:<span className="red"> *</span></label>
          <FormFieldErrors
            errors_list={this.props.edited.errors}
            field={'title'}
          />
          <input id="id_title"
                 name="title"
                 type="text"
                 value={this.props.edited.title}
                 placeholder="title"
                 maxLength="254"
                 required
                 onChange={this.props.handleTitleChange}
          />
          <div className="help-text">Title of the portfolio, should be unique.</div>
        </div>
        <div className="field_wrapper">
          <FormFieldErrors
            errors_list={this.props.edited.errors}
            field={'draft'}
          />
          <div className="checkbox">
            <label htmlFor="id_draft"><input id="id_draft"
                   name="draft"
                   type="checkbox"
                   value={this.props.edited.draft}
                   onChange={this.props.handleDraftChange}
                   defaultChecked={false}
                 />Draft (won't be published yet.)
            </label>
          </div>
        </div>
        <div className="field_wrapper">
          <label htmlFor="id_pubdate">Publication date:</label>
          <FormFieldErrors
            errors_list={this.props.edited.errors}
            field={'pub_date'}
          />
          <input id="id_pubdate"
                 name="pub_date"
                 type="datetime"
                 value={this.props.edited.pub_date}
                 onChange={this.props.handlePubdateChange}
          />
          <div className="help-text">Leave blank to publish on save.</div>
        </div>
        <div className="field_wrapper">
          <label htmlFor="id_order">Order:</label>
          <FormFieldErrors
            errors_list={this.props.edited.errors}
            field={'order'}
          />
          <input id="id_order"
                 name="order"
                 type="number"
                 value={this.props.edited.order}
                 onChange={this.props.handleOrderChange}
                 min="0"
          />
        </div>
      </form>
    )
  }
}
