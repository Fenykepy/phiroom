import React, { Component, PropTypes } from 'react'

import FormFieldErrors from './FormFieldErrors'
import FormRequiredFields from './FormRequiredFields'

export default class AddPicturesToForm extends Component {

        
  render() {
    // console.log('AddPicturesToForm', this.props)

    return (
      <form
        id="add-pictures-to-form"
      >
        <div className="field_wrapper">
          <label htmlFor="container_type">Add to a:</label>
          <select id="id_container_type"
            name="container_type"
            value={this.props.containerType}
            onChange={this.props.handleContainerTypeChange}
            >
            {this.props.containersTypes.map(item =>
              <option
                key={item}
                value={item}>{item}</option>
            )}
          </select>
        </div>
        <div className="field_wrapper">
          <label htmlFor="container_id">{this.props.containerType}:</label>
          <select id="id_container_id"
            name="container_id"
            value={this.props.containerID}
            onChange={this.props.handleContainerIDChange}
          >
          {this.props.containerIDs.map(item =>
            <option
              key={item.id}
              value={item.id}>{item.title}</option>
          )}
        </select>
        </div>
      </form>
    )
  }
}
