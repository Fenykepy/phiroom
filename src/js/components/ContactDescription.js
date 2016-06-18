import React, { Component, PropTypes } from 'react'

import DescriptionEditionButton from '../components/DescriptionEditionButton'
import HitsCounter from '../components/HitsCounter'

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

  getHits() {
    if (this.props.user.is_staff) {
      return (
        <HitsCounter
          hits={this.props.hits}
        />
      )
    }
  }

  render() {
    return (
      <article>
        {this.getEditionButton()}
        <div className="suptitle">{this.getHits()}</div>
        <h1>{this.props.description.title}</h1>
        <span dangerouslySetInnerHTML={{__html: this.props.description.content}} />
      </article>
    )
  }
}
