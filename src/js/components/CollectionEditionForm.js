import React, { Component, Proptypes } from 'react'

import FormFieldErrors from './FormFieldErrors'
import FormRequiredFields from './FormRequiredFields'

export default class CollectionEditionForm extends Component {

  getDeleteButton() {
    // we update existing collection
    if (this.props.edited.pk) {
      return (
        <div className="admin-links">
          <button
            type="button"
          >Delete collection</button>
        </div>
      )
    }
    return null
  }

  render() {
    console.log('collection edition form', this.props)
    return (
      <form
        id="collection-form"
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
                 placeholder="Collection name"
                 maxLength="254"
                 required
                 onChange={this.props.handleNameChange}
          />
          <div className="help-text">Name of the collection.</div>
        </div>
        <div className="field_wrapper">
          <label htmlFor="id_name">Ensemble:<span className="red"> *</span></label>
          <FormFieldErrors
            errors_list={this.props.edited.errors}
            field={'ensemble'}
          />
          <select id="id_ensemble"
                  name="ensemble"
                  value={this.props.edited.ensemble || 1}
                  onChange={this.props.handleEnsembleChange}
          >
            {this.props.ensembles.map(item =>
              <option
                key={item.pk}
                value={item.pk}
              >{Array(item.depth).join('\u2014') + ' ' + item.name}</option>
            )}
          </select>
        </div>
      </form>
    )
  }
}


