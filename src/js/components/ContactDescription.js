import React, { Component, Proptypes } from 'react'

import DescriptionEditionButton from '../components/DescriptionEditionButton'

export default class ContactDescription extends Component {

  getEditionButton() {
    if (this.props.user.is_staff) {
      return (
        <div className="admin-links">
          <DescriptionEditionButton
            dispatch={this.props.dispatch}
          />
        </div>
      )
    }
    return null
  }

  render() {
    return (
      <article>
        {this.getEditionButton()}
        <h1>{this.props.description.title}</h1>
        <span dangerouslySetInnerHTML={{__html: this.props.description.content}} />
      </article>
    )
  }
}
