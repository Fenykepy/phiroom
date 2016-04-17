import React, { Component, PropTypes } from 'react'

import FormFieldErrors from './FormFieldErrors'
import FormRequiredFields from './FormRequiredFields'

export default class EnsembleEditionForm extends Component {

  getDeleteButton() {
    // we update existing collection
    if (this.props.edited.pk) {
      return (
        <div className="admin-links">
          <button
            type="button"
            onClick={this.props.confirmDeleteEnsemble}
          >Delete collections' ensemble</button>
        </div>
      )
    }
    return null
  }


  render() {
    //console.log('ensemble edition form', this.props)
    return (
      <form
        id="ensemble-form"
      >
        {this.getDeleteButton()}
        <FormRequiredFields />
        <FormFieldErrors
          errors_list={this.props.edited.errors}
          field={'non_field_errors'}
        />
        <div className="field_wrapper">
          <label htmlFor="id_name">Name:<span className="red"> *</span></label>
          <FormFieldErrors
            errors_list={this.props.edited.errors}
            field={'name'}
          />
          <input id="id_name"
                 name="name"
                 type="text"
                 value={this.props.edited.name}
                 placeholder="Collection's ensemble name"
                 maxLength="254"
                 required
                 onChange={this.props.handleNameChange}
          />
          <div className="help-text">Name of the collection's ensemble.</div>
        </div>
        <div className="field_wrapper">
          <label htmlFor="id_parent">Ensemble:<span className="red"> *</span></label>
          <FormFieldErrors
            errors_list={this.props.edited.errors}
            field={'ensemble'}
          />
          <select id="id_parent"
                  name="parent"
                  value={this.props.edited.ensemble || 1}
                  onChange={this.props.handleParentChange}
          >
            {this.props.ensembles.map(item =>
              <option
                key={item.pk}
                value={item.pk}
              >{Array(item.depth).join('\u2014') + ' ' + item.name}</option>
            )}
          </select>
          <div className="help-text">Parent of the collection's ensemble.</div>
        </div>
      </form>
    )
  }
}
