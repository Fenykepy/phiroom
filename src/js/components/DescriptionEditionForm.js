import React, { Component, PropTypes } from 'react'

import FormFieldErrors from './FormFieldErrors'

export default class DescriptionEditionForm extends Component {

  render() {
    return (
      <form
        id="description-form"
      >
        <p><span className="red">*</span> : required fields.</p>
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
          <div className="help-text">Title of the contact page.</div>
        </div>
        <div className="field_wrapper">
          <label htmlFor="id_source">Source:<span className="red"> *</span></label>
          <FormFieldErrors
            errors_list={this.props.edited.errors}
            field={'source'}
          />
          <textarea id="id_source"
                 name="source"
                 rows="15"
                 value={this.props.edited.source}
                 placeholder="source"
                 required
                 onChange={this.props.handleSourceChange}
          />
          <div className="help-text">Source of the contact page's description, markdown syntax.</div>
        </div>
      </form>
    )
  }
}
