import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class SubMainMenuItem extends Component {
  
  render () {
    return (
      <li><Link to={this.props.url + this.props.slug + '/'}
          activeClassName="selected">{this.props.title}</Link></li>
    )
  }
}
