import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

import HitsCounter from './HitsCounter'

export default class SubMainMenuItem extends Component {

  getHits() {
    if (this.props.staff) {
      return (
        <HitsCounter
          hits={this.props.hits}
        />
      )
    }
  }
  
  render () {
    return (
      <li><Link to={this.props.url + this.props.slug + '/'}
          activeClassName="selected">{this.props.title}</Link>{this.getHits()}</li>
    )
  }
}
